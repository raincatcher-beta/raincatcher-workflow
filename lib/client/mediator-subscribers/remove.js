var topicGenerators = require('../../topic-generators');
var CONSTANTS = require('../../constants');
var workflowClient = require('../workflow-client');

/**
 * Initialsing a subscriber for removing workflows.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function removeWorkflowSubscriber(mediator) {

  var removeWorkflowTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.REMOVE
  });


  /**
   *
   * Handling the removal of a single workflow
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the workflow to remove.
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleRemoveWorkflow(parameters) {
    parameters = parameters || {};
    var workflowRemoveErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.REMOVE,
      topicUid: parameters.topicUid
    });

    var workflowRemoveDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.REMOVE,
      topicUid: parameters.topicUid
    });

    //If there is no ID, then we can't read the workflow.
    if (!parameters.id) {
      return mediator.publish(workflowRemoveErrorTopic, new Error("Expected An ID When Removing A Workflow"));
    }

    workflowClient(mediator).manager.delete({
      id: parameters.id
    })
    .then(function() {
      mediator.publish(workflowRemoveDoneTopic);
    }).catch(function(error) {
      mediator.publish(workflowRemoveErrorTopic, error);
    });
  }

  return mediator.subscribe(removeWorkflowTopic, handleRemoveWorkflow);
};