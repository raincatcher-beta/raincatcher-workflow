var _ = require('lodash');
var topicHandlers = {
  create: require('./create'),
  update: require('./update'),
  remove: require('./remove'),
  list: require('./list'),
  read: require('./read')
};
var CONSTANTS = require('../../constants');

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

var workflowSubscribers;

module.exports = {
  /**
   * Initialisation of all the topics that this module is interested in.
   * @param mediator
   * @returns {Topics|exports|module.exports|*}
   */
  init: function(mediator) {

    //If there is already a set of subscribers set up, then don't subscribe again.
    if (workflowSubscribers) {
      return workflowSubscribers;
    }

    workflowSubscribers = new MediatorTopicUtility(mediator);
    workflowSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKFLOW_ENTITY_NAME);

    //Setting up subscribers to the workflow topics.
    _.each(CONSTANTS.TOPICS, function(topicName) {
      if (topicHandlers[topicName]) {
        workflowSubscribers.on(topicName, topicHandlers[topicName](workflowSubscribers));
      }
    });

    return workflowSubscribers;
  },
  tearDown: function() {
    if (workflowSubscribers) {
      workflowSubscribers.unsubscribeAll();
    }
  }
};