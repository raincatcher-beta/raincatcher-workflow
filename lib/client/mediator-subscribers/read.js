var topicGenerators = require('../../topic-generators');
var CONSTANTS = require('../../constants');
var workflowClient = require('../workflow-client');

/**
 * Initialsing a subscriber for reading workflows.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function readWorkflowSubscriber(mediator) {

  var readWorkflowTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.READ
  });


  /**
   *
   * Handling the reading of a single workflow
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the workflow to read.
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleReadWorkflowsTopic(parameters) {
    parameters = parameters || {};

    var workflowReadErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.READ,
      topicUid: parameters.topicUid
    });

    var workflowReadDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.READ,
      topicUid: parameters.topicUid
    });

    //If there is no ID, then we can't read the workflow.
    if (!parameters.id) {
      return mediator.publish(workflowReadErrorTopic, new Error("Expected An ID When Reading A Workflow"));
    }

    workflowClient(mediator).manager.read(parameters.id)
    .then(function(workflow) {
      mediator.publish(workflowReadDoneTopic, workflow);
    }).catch(function(error) {
      mediator.publish(workflowReadErrorTopic, error);
    });
  }

  return mediator.subscribe(readWorkflowTopic, handleReadWorkflowsTopic);
};