var CONSTANTS = require('../../constants');
var workflowClient = require('../workflow-client');

/**
 * Initialsing a subscriber for removing workflows.
 *
 * @param {object} workflowEntityTopics
 *
 */
module.exports = function removeWorkflowSubscriber(workflowEntityTopics) {


  /**
   *
   * Handling the removal of a single workflow
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the workflow to remove.
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleRemoveWorkflow(parameters) {
    var self = this;
    parameters = parameters || {};
    var workflowRemoveErrorTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.REMOVE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workflowRemoveDoneTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.REMOVE, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    //If there is no ID, then we can't read the workflow.
    if (!parameters.id) {
      return self.mediator.publish(workflowRemoveErrorTopic, new Error("Expected An ID When Removing A Workflow"));
    }

    workflowClient(self.mediator).manager.delete({
      id: parameters.id
    })
    .then(function() {
      self.mediator.publish(workflowRemoveDoneTopic);
    }).catch(function(error) {
      self.mediator.publish(workflowRemoveErrorTopic, error);
    });
  };
};