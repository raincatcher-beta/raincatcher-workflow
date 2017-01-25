'use strict';

var sync = require('fh-wfm-sync/lib/server'),
  config = require('./config'),
  shortid = require('shortid');



/**
 * Function to generate topic used by the mediator to request, subscribe and publish to.
 *
 * @param {string} topicPrefix Defines the topic name.
 * @param {string} action Defines which CRUDL action is to be used.
 * @param {string} prefix Prefix used to add to the start of the topic to determine if request was done.
 * @param {string} uid Unique identifier to identify unique topics.
 * @returns {string} topic Generated topic to be used by the mediator
 */
function generateTopic(topicPrefix, action, prefix, uid) {
  var topic = "";

  if (prefix) {
    topic = topic + prefix + ':';
  }
  topic = topic + topicPrefix + config.datasetId + ':' + action;
  if (uid) {
    topic = topic + ':' + uid;
  }

  return topic;
}


/**
 * Subscribers to sync topics which sends a request to the simple store module for CRUDL operations.
 * Publishes the response received from the simple store module back to sync
 */
module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'create'), function(workflowToCreate, mediatorTopicIdentifier) {
    // Add an id field required by the new simple store module to the workflow object that will be created
    workflowToCreate.id = shortid.generate();

    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'create'), workflowToCreate, {uid: workflowToCreate.id})
      .then(function(createdWorkflow) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'create', 'done', mediatorTopicIdentifier), createdWorkflow);
      });
  });

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'list'), function() {
    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'list'))
      .then(function(listOfworkflow) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'list', 'done'), listOfworkflow);
      });
  });

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'update'), function(workflowToUpdate) {
    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'update'), workflowToUpdate, {uid: workflowToUpdate.id})
      .then(function(updatedWorkflow) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'update', 'done', updatedWorkflow.id), updatedWorkflow);
      });
  });

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'read'), function(uid) {
    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'read'), uid)
      .then(function(readWorkflow) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'read', 'done', uid), readWorkflow);
      });
  });

  mediator.subscribe(generateTopic(config.cloudTopicPrefix, 'delete'), function(uid) {
    mediator.request(generateTopic(config.cloudDataTopicPrefix, 'delete'), uid)
      .then(function(deletedWorkflow) {
        mediator.publish(generateTopic(config.cloudTopicPrefix, 'delete', 'done', uid), deletedWorkflow);
      });
  });
};
