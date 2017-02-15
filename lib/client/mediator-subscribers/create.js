var _ = require('lodash');
var CONSTANTS = require('../../constants');
var workflowClient = require('../workflow-client');


/**
 * Initialising a subscriber for creating a workflow.
 *
 * @param {object} workflowEntityTopics
 *
 */
module.exports = function createWorkflowSubscriber(workflowEntityTopics) {

  /**
   *
   * Handling the creation of a workflow
   *
   * @param {object} parameters
   * @param {object} parameters.workflowToCreate   - The workflow item to create
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleCreateWorkflowTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var workflowCreateErrorTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workflowToCreate = parameters.workflowToCreate;

    //If no workflow is passed, can't create one
    if (!_.isPlainObject(workflowToCreate)) {
      return self.mediator.publish(workflowCreateErrorTopic, new Error("Invalid Data To Create A Workflow."));
    }

    workflowClient(self.mediator).manager.create(workflowToCreate)
    .then(function(createdWorkflow) {
      self.mediator.publish(workflowEntityTopics.getTopic(CONSTANTS.TOPICS.CREATE, CONSTANTS.DONE_PREFIX, parameters.topicUid), createdWorkflow);
    }).catch(function(error) {
      self.mediator.publish(workflowCreateErrorTopic, error);
    });
  };
};