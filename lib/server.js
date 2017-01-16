'use strict';

var sync = require('fh-wfm-sync/lib/server'),
  config = require('./config'),
  shortid = require('shortid');


module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);

  mediator.subscribe(config.topicPrefix + config.datasetId + ':create', function(workflowToCreate, mediatorTopicIdentifier) {
    // Add an id field required by the new simple store module to the workflow object that will be created
    workflowToCreate.id = shortid.generate();

    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':create', workflowToCreate, {uid: workflowToCreate.id})
      .then(function(createdworkflow) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':create:' + mediatorTopicIdentifier, createdworkflow);
      });
  });

  mediator.subscribe(config.topicPrefix + config.datasetId + ':list', function() {
    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':list')
      .then(function(listOfworkflow) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':list', listOfworkflow);
      });
  });

  mediator.subscribe(config.topicPrefix + config.datasetId + ':update', function(workflowToUpdate) {
    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':update', workflowToUpdate, {uid: workflowToUpdate.id})
      .then(function(updatedworkflow) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':update:' + updatedworkflow.id, updatedworkflow);
      });
  });

  mediator.subscribe(config.topicPrefix + config.datasetId + ':read', function(uid) {
    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':read', uid)
      .then(function(workflow) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':read:' + uid, workflow);
      });
  });

  mediator.subscribe(config.topicPrefix + config.datasetId + ':delete', function(uid) {
    mediator.request(config.topicPrefix + 'data:' + config.datasetId + ':delete', uid)
      .then(function(workflow) {
        mediator.publish('done:' + config.topicPrefix + config.datasetId + ':delete:' + uid, workflow);
      });
  });
};
