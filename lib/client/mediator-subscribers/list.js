var topicGenerators = require('../../topic-generators');
var CONSTANTS = require('../../constants');
var workflowClient = require('../workflow-client');

/**
 * Initialsing a subscriber for Listing workflows.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function listWorkflowSubscriber(mediator) {

  var listWorkflowsTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.LIST
  });


  /**
   *
   * Handling the listing of workflows
   *
   * @param {object} parameters
   * @param {string/number} parameters.topicUid  - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleListWorkflowsTopic(parameters) {
    parameters = parameters || {};
    var workflowListErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.LIST,
      topicUid: parameters.topicUid
    });

    var workflowListDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.LIST,
      topicUid: parameters.topicUid
    });

    workflowClient(mediator).manager.list()
    .then(function(arrayOfWorkflows) {
      mediator.publish(workflowListDoneTopic, arrayOfWorkflows);
    }).catch(function(error) {
      mediator.publish(workflowListErrorTopic, error);
    });
  }

  return mediator.subscribe(listWorkflowsTopic, handleListWorkflowsTopic);
};