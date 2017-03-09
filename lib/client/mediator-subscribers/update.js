var CONSTANTS = require('../../constants');
var _ = require("lodash");

/**
 * Initialsing a subscriber for updating a workflow.
 *
 * @param {object} workflowEntityTopics
 * @param {WorkflowMediatorService}    workflowClient
 */
module.exports = function updateWorkflowSubscriber(workflowEntityTopics, workflowClient) {

  /**
   *
   * Handling the update of a workflow
   *
   * @param {object} parameters
   * @param {object} parameters.workflowToUpdate   - The workflow item to update
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleUpdateTopic(parameters) {
    var self = this;
    parameters = parameters || {};
    var workflowUpdateErrorTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.UPDATE, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workflowUpdateDoneTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.UPDATE, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    var workflowToUpdate = parameters.workflowToUpdate;

    //If no workorder is passed, can't update one. Also require the ID of the workfo to update it.
    if (!_.isPlainObject(workflowToUpdate)) {
      return self.mediator.publish(workflowUpdateErrorTopic, new Error("Invalid Data To Update A Workflow."));
    }

    workflowClient.update(workflowToUpdate)
    .then(function(updatedWorkflow) {
      self.mediator.publish(workflowUpdateDoneTopic, updatedWorkflow);
    }).catch(function(error) {
      self.mediator.publish(workflowUpdateErrorTopic, error);
    });
  };
};