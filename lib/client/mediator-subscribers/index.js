var _ = require('lodash');
var topicHandlers = {
  create: require('./create'),
  update: require('./update'),
  remove: require('./remove'),
  list: require('./list'),
  read: require('./read'),
  previous: require('./previous'),
  begin: require('./begin'),
  complete: require('./complete'),
  summary: require('./summary')
};
var CONSTANTS = require('../../constants');

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

var workflowSubscribers, workflowStepSubscribers;

module.exports = {
  /**
   * Initialisation of all the topics that this module is interested in.
   * @param {Mediator}                   mediator
   * @param {WorkflowMediatorService}    workflowClient
   * @returns {Topics|exports|module.exports|*}
   */
  init: function(mediator, workflowClient) {

    //If there is already a set of subscribers set up, then don't subscribe again.
    if (workflowSubscribers) {
      return workflowSubscribers;
    }

    workflowSubscribers = new MediatorTopicUtility(mediator);
    workflowSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKFLOW_ENTITY_NAME);

    //Setting up subscribers to the workflow topics.
    _.each(CONSTANTS.TOPICS, function(topicName) {
      if (topicHandlers[topicName]) {
        workflowSubscribers.on(topicName, topicHandlers[topicName](workflowSubscribers, workflowClient));
      }
    });

    //Setting up subscribers to the workflow step topics
    workflowStepSubscribers = new MediatorTopicUtility(mediator);
    workflowStepSubscribers.prefix(CONSTANTS.WORKFLOW_PREFIX).entity(CONSTANTS.STEPS_ENTITY_NAME);

    _.each(CONSTANTS.STEP_TOPICS, function(stepTopic) {
      if (topicHandlers[stepTopic]) {
        workflowStepSubscribers.on(stepTopic, topicHandlers[stepTopic](workflowStepSubscribers, workflowClient));
      }
    });

    return workflowSubscribers;
  },
  tearDown: function() {
    if (workflowSubscribers) {
      workflowSubscribers.unsubscribeAll();
      workflowSubscribers = null;
    }

    if (workflowStepSubscribers) {
      workflowStepSubscribers.unsubscribeAll();
    }
  }
};