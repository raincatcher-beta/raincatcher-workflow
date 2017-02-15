var topicGenerators = require('../../topic-generators');
var CONSTANTS = require('../../constants');
var _ = require('lodash');
var workflowClient = require('../workflow-client');

/**
 * Initialsing a subscriber for updating a workflow.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function updateWorkflowSubscriber(mediator) {

  var updateWorkflowTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.UPDATE
  });


  /**
   *
   * Handling the update of a workflow
   *
   * @param {object} parameters
   * @param {object} parameters.workflowToUpdate   - The workflow item to update
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleUpdateTopic(parameters) {
    parameters = parameters || {};
    var workflowUpdateErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.UPDATE,
      topicUid: parameters.topicUid
    });

    var workflowUpdateDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.UPDATE,
      topicUid: parameters.topicUid
    });

    var workflowToUpdate = parameters.workflowToUpdate;

    //If no workflow is passed, can't update one. Also require the ID of the workorde to update it.
    if (!_.isPlainObject(workflowToUpdate) || !workflowToUpdate.id) {
      return mediator.publish(workflowUpdateErrorTopic, new Error("Invalid Data To Update A Workflow."));
    }

    workflowClient(mediator).manager.update(workflowToUpdate)
    .then(function(updatedWorkflow) {
      mediator.publish(workflowUpdateDoneTopic, updatedWorkflow);
    }).catch(function(error) {
      mediator.publish(workflowUpdateErrorTopic, error);
    });
  }

  return mediator.subscribe(updateWorkflowTopic, handleUpdateTopic);
};