var CONSTANTS = require('../../constants');
var workflowClient = require('../workflow-client');

/**
 * Initialsing a subscriber for reading workflows.
 *
 * @param {object} workflowEntityTopics
 *
 */
module.exports = function readWorkflowSubscriber(workflowEntityTopics) {


  /**
   *
   * Handling the reading of a single workflow
   *
   * @param {object} parameters
   * @param {string} parameters.id - The ID of the workflow to read.
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  return function handleReadWorkflowsTopic(parameters) {
    var self = this;
    parameters = parameters || {};

    var workflowReadErrorTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.ERROR_PREFIX, parameters.topicUid);

    var workflowReadDoneTopic = workflowEntityTopics.getTopic(CONSTANTS.TOPICS.READ, CONSTANTS.DONE_PREFIX, parameters.topicUid);

    //If there is no ID, then we can't read the workflow.
    if (!parameters.id) {
      return self.mediator.publish(workflowReadErrorTopic, new Error("Expected An ID When Reading A Workflow"));
    }

    workflowClient(self.mediator).manager.read(parameters.id)
    .then(function(workflow) {
      self.mediator.publish(workflowReadDoneTopic, workflow);
    }).catch(function(error) {
      self.mediator.publish(workflowReadErrorTopic, error);
    });
  };

};