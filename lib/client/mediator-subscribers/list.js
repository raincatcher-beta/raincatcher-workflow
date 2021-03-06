var CONSTANTS = require('../../constants');

/**
 * Initialsing a subscriber for Listing workflows.
 *
 * @param {object} workflowEntityTopics
 * @param {WorkflowMediatorService}    workflowClient
 */
module.exports = function listWorkflowSubscriber(workflowEntityTopics, workflowClient) {

  /**
   *
   * Handling the listing of workflows
   *
   * @param {object} parameters
   * @param {string/number} parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleListWorkflowsTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var workflowListErrorTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workflowListDoneTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.LIST, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    workflowClient.list()
    .then(function(arrayOfWorkflows) {
      self.mediator.publish(workflowListDoneTopic, arrayOfWorkflows);
    }).catch(function(error) {
      self.mediator.publish(workflowListErrorTopic, error);
    });
  };
};