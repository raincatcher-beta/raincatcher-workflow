var topicGenerators = require('../../topic-generators');
var _ = require('lodash');
var CONSTANTS = require('../../constants');
var workflowClient = require('../workflow-client');

/**
 * Initialsing a subscriber for creating a workflow.
 *
 * @param {Mediator} mediator
 *
 */
module.exports = function createWorkflowSubscriber(mediator) {

  var createWorkflowTopic = topicGenerators.createTopic({
    topicName: CONSTANTS.TOPICS.CREATE
  });


  /**
   *
   * Handling the creation of a workflow
   *
   * @param {object} parameters
   * @param {object} parameters.workflowToCreate   - The workflow item to create
   * @param {string/number} parameters.topicUid     - (Optional)  A unique ID to be used to publish completion / error topics.
   * @returns {*}
   */
  function handleCreateWorkflowTopic(parameters) {
    parameters = parameters || {};
    var workflowCreateErrorTopic = topicGenerators.errorTopic({
      topicName: CONSTANTS.TOPICS.CREATE,
      topicUid: parameters.topicUid
    });

    var workflowCreateDoneTopic = topicGenerators.doneTopic({
      topicName: CONSTANTS.TOPICS.CREATE,
      topicUid: parameters.topicUid
    });

    var workflowToCreate = parameters.workflowToCreate;

    //If no workflow is passed, can't create one
    if (!_.isPlainObject(workflowToCreate)) {
      return mediator.publish(workflowCreateErrorTopic, new Error("Invalid Data To Create A Workflow."));
    }

    workflowClient(mediator).manager.create(workflowToCreate)
    .then(function(createdWorkflow) {
      mediator.publish(workflowCreateDoneTopic, createdWorkflow);
    }).catch(function(error) {
      mediator.publish(workflowCreateErrorTopic, error);
    });
  }

  return mediator.subscribe(createWorkflowTopic, handleCreateWorkflowTopic);
};