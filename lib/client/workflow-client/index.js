var q = require('q');
var _ = require('lodash');
var shortid = require('shortid');
var CONSTANTS = require('../../constants');
var config = require('../../config');
var topicGenerators = require('../../topic-generators');
var mediator, manager;

/**
 *
 * Getting Promises for done and error topics.
 *
 * @param doneTopicPromise  - A promise for the done topic.
 * @param errorTopicPromise - A promise for the error topic.
 * @returns {*}
 */
function getTopicPromises(doneTopicPromise, errorTopicPromise) {
  var deferred = q.defer();

  doneTopicPromise.then(function(createdWorkflow) {
    deferred.resolve(createdWorkflow);
  });

  errorTopicPromise.then(function(error) {
    deferred.reject(error);
  });

  return deferred.promise;
}


/**
 *
 * Creating a new workflow.
 *
 * @param {object} workflowToCreate - The Workflow to create.
 */
function create(workflowToCreate) {

  //Creating a unique channel to get the response
  var topicUid = shortid.generate();

  var topicParams = {topicUid: topicUid, itemToCreate: workflowToCreate};

  var donePromise = mediator.promise(topicGenerators.syncDoneTopic({topicUid: topicUid, topicName: CONSTANTS.TOPICS.CREATE}));

  var errorPromise = mediator.promise(topicGenerators.syncErrorTopic({topicUid: topicUid, topicName: CONSTANTS.TOPICS.CREATE}));

  mediator.publish(topicGenerators.syncTopic({topicName: CONSTANTS.TOPICS.CREATE}), topicParams);

  return getTopicPromises(donePromise, errorPromise);
}

/**
 *
 * Updating an existing workflow.
 *
 * @param {object} workflowToUpdate - The workflow to update
 * @param {string} workflowToUpdate.id - The ID of the workflow to update
 */
function update(workflowToUpdate) {
  var topicParams = {topicUid: workflowToUpdate.id, itemToUpdate: workflowToUpdate};

  var donePromise = mediator.promise(topicGenerators.syncDoneTopic({topicUid: workflowToUpdate.id, topicName: CONSTANTS.TOPICS.UPDATE}));

  var errorPromise = mediator.promise(topicGenerators.syncErrorTopic({topicUid: workflowToUpdate.id, topicName: CONSTANTS.TOPICS.UPDATE}));

  mediator.publish(topicGenerators.syncTopic({topicName: CONSTANTS.TOPICS.UPDATE}), topicParams);

  return getTopicPromises(donePromise, errorPromise);
}

/***
 *
 * Reading a single workflow.
 *
 * @param {string} workflowId - The ID of the workflow to read
 */
function read(workflowId) {

  var topicGenerationParams = {topicName: CONSTANTS.TOPICS.READ};

  var donePromise = mediator.promise(topicGenerators.syncDoneTopic({topicName: CONSTANTS.TOPICS.READ, topicUid: workflowId}));
  var errorPromise = mediator.promise(topicGenerators.syncErrorTopic({topicName: CONSTANTS.TOPICS.READ, topicUid: workflowId}));

  mediator.publish(topicGenerators.syncTopic(topicGenerationParams), {id: workflowId, topicUid: workflowId});

  return getTopicPromises(donePromise, errorPromise);
}

/**
 * Listing All Workflows
 */
function list() {
  var topicParams = {topicName: CONSTANTS.TOPICS.LIST};

  var donePromise = mediator.promise(topicGenerators.syncDoneTopic(topicParams));
  var errorPromise = mediator.promise(topicGenerators.syncErrorTopic(topicParams));

  mediator.publish(topicGenerators.syncTopic(topicParams));

  return getTopicPromises(donePromise, errorPromise);
}

/**
 *
 * Removing a workororder using the sync topics
 *
 * @param {object} workflowToRemove
 * @param {string} workflowToRemove.id - The ID of the workoroder to remove
 */
function remove(workflowToRemove) {

  var donePromise = mediator.promise(topicGenerators.syncDoneTopic({topicName: CONSTANTS.TOPICS.REMOVE, topicUid: workflowToRemove.id}));
  var errorPromise = mediator.promise(topicGenerators.syncErrorTopic({topicName: CONSTANTS.TOPICS.REMOVE, topicUid: workflowToRemove.id}));

  mediator.publish(topicGenerators.syncTopic({topicName: CONSTANTS.TOPICS.REMOVE}), {id: workflowToRemove.id, topicUid: workflowToRemove.id});

  return getTopicPromises(donePromise, errorPromise);
}

/**
 * Starting the synchronisation process for workflows.
 */
function start() {

  var donePromise = mediator.promise(topicGenerators.syncDoneTopic({topicName: CONSTANTS.TOPICS.START}));
  var errorPromise = mediator.promise(topicGenerators.syncErrorTopic({topicName: CONSTANTS.TOPICS.START}));

  mediator.publish(topicGenerators.syncTopic({topicName: CONSTANTS.TOPICS.START}));

  return getTopicPromises(donePromise, errorPromise);
}

/**
 * Stopping the synchronisation process for workflows.
 */
function stop() {
  var donePromise = mediator.promise(topicGenerators.syncDoneTopic({topicName: CONSTANTS.TOPICS.STOP}));
  var errorPromise = mediator.promise(topicGenerators.syncErrorTopic({topicName: CONSTANTS.TOPICS.STOP}));

  mediator.publish(topicGenerators.syncTopic({topicName: CONSTANTS.TOPICS.STOP}));

  return getTopicPromises(donePromise, errorPromise);
}

/**
 * Forcing the workflows to sync to the remote store.
 */
function forceSync() {
  var donePromise = mediator.promise(topicGenerators.syncDoneTopic({topicName: CONSTANTS.TOPICS.FORCE_SYNC}));
  var errorPromise = mediator.promise(topicGenerators.syncErrorTopic({topicName: CONSTANTS.TOPICS.FORCE_SYNC}));

  mediator.publish(topicGenerators.syncTopic({topicName: CONSTANTS.TOPICS.FORCE_SYNC}));

  return getTopicPromises(donePromise, errorPromise);
}

/**
 * Safe stop forces a synchronisation to the remote server and then stops the synchronisation process.
 * @returns {Promise}
 */
function safeStop() {
  return forceSync().then(stop);
}


/**
 * Waiting for the synchronisation process to complete to the remote cluster.
 */
function waitForSync() {
  return mediator.promise(topicGenerators.syncTopic({topicName: "sync_complete"}));
}

function ManagerWrapper(_manager) {
  this.manager = _manager;
  var self = this;

  var methodNames = ['create', 'read', 'update', 'delete', 'list', 'start', 'stop', 'safeStop', 'forceSync', 'waitForSync'];
  methodNames.forEach(function(methodName) {
    self[methodName] = function() {
      return q.when(self.manager[methodName].apply(self.manager, arguments));
    };
  });

  self.checkStatus = function() {
    return self.manager.checkStatus.apply(self.manager, arguments);
  };

  self.stepReview = function() {
    return self.manager.stepReview.apply(self.manager, arguments);
  };

  self.nextStepIndex = function() {
    return self.manager.nextStepIndex.apply(self.manager, arguments);
  };
}

/**
 *
 * @param steps
 * @param result
 * @returns {{nextStepIndex: number, complete: *}}
 */
function stepReview(steps, result) {
  var stepIndex = -1;
  var complete;
  if (result && result.stepResults && result.stepResults.length !== 0) {
    complete = true;
    for (var i=0; i < steps.length; i++) {
      var step = steps[i];
      var stepResult = result.stepResults[step.code];
      if (stepResult && (stepResult.status === 'complete' || stepResult.status === 'pending')) {
        stepIndex = i;
        if (stepResult.status === 'pending') {
          complete = false;
        }
      } else {
        break;
      }
    }
  }
  return {
    nextStepIndex: stepIndex,
    complete: complete // false is any steps are "pending"
  };
}

function nextStepIndex(steps, result) {
  return this.stepReview(steps, result).nextStepIndex;
}

function checkStatus(workorder, workflow, result) {
  var status;
  var stepReview = this.stepReview(workflow.steps, result);
  if (stepReview.nextStepIndex >= workflow.steps.length - 1 && stepReview.complete) {
    status = 'Complete';
  } else if (!workflow.assignee) {
    status = 'Unassigned';
  } else if (stepReview.nextStepIndex < 0) {
    status = 'New';
  } else {
    status = 'In Progress';
  }
  return status;
}


/**
 *
 * Initialising the workflow-client with a mediator.
 *
 * @param _mediator
 * @returns {ManagerWrapper|*}
 */
module.exports = function(_mediator) {

  //If there is already a manager, use this
  if (manager) {
    return manager;
  }

  mediator = _mediator;

  manager = new ManagerWrapper({
    create: create,
    update: update,
    list: list,
    delete: remove,
    start: start,
    stop: stop,
    read: read,
    safeStop: safeStop,
    forceSync: forceSync,
    publishRecordDeltaReceived: _.noop,
    waitForSync: waitForSync,
    datasetId: config.datasetId,
    stepReview: stepReview,
    nextStepIndex: nextStepIndex,
    checkStatus: checkStatus
  });

  return manager;
};