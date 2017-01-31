'use strict';

var sync = require('fh-wfm-sync/lib/server');
var config = require('./config');
var shortid = require('shortid');

var WorflowCloudDataTopics = require('fh-wfm-mediator/lib/topics');
var WorflowCloudTopics = require('fh-wfm-mediator/lib/topics');

module.exports = function(mediator, app, mbaasApi) {
  //Used for cloud data storage topics
  var workflowCloudDataTopics = new WorflowCloudDataTopics(mediator);
  workflowCloudDataTopics.prefix(config.cloudDataTopicPrefix).entity(config.datasetId);

  //Used for cloud topics
  var workflowCloudTopics = new WorflowCloudTopics(mediator);
  workflowCloudTopics.prefix(config.cloudTopicPrefix).entity(config.datasetId);

  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);

  /**
   * Subscribers to sync topics which publishes to a data storage topic, subscribed to by a storage module,
   * for CRUDL operations. Publishes the response received from the storage module back to sync
   */
  workflowCloudTopics.on('create', function(workflowToCreate, mediatorTopicIdentifier) {
    // Adds an id field required by the new simple store module to the workflow object that will be created
    workflowToCreate.id = shortid.generate();

    workflowCloudDataTopics.request('create', workflowToCreate, {uid: workflowToCreate.id})
      .then(function(createdWorkflow) {
        mediator.publish(workflowCloudTopics.getTopic('create', 'done') + ':' + mediatorTopicIdentifier, createdWorkflow);
      });
  });

  workflowCloudTopics.on('list', function() {
    return workflowCloudDataTopics.request('list');
  });

  workflowCloudTopics.on('update', function(workflowToUpdate) {
    return workflowCloudDataTopics.request('update', workflowToUpdate, {uid: workflowToUpdate.id});
  });

  workflowCloudTopics.on('read', function(uid) {
    return workflowCloudDataTopics.request('read', uid);
  });

  workflowCloudTopics.on('delete', function(uid) {
    return workflowCloudDataTopics.request('delete', uid);
  });
};