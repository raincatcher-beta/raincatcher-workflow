var sinon = require('sinon');
var assert = require('assert');
var proxyquire = require('proxyquire');
var express = require('express');
var app = express();
var mockMbaasApi = {};
var mockSync = {
  init: sinon.spy()
};

var mediator = require('fh-wfm-mediator/lib/mediator.js');

/**
 * Set of unit tests for the sync topic subscribers
 */
describe('Workflow Sync', function() {
  var server = proxyquire('./server.js', {
    'fh-wfm-sync/lib/server': mockSync
  });

  //Create
  it('should publish to done create cloud topic when the request to create a workflow has been completed', function(done) {
    var data = {value: 'test-workflow-create'};
    var topicId = "testId";

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workflows:create", function(createdWorkflow) {
      //Publish to done create data topic to fake workflow creation by storage module
      mediator.publish("done:wfm:cloud:data:workflows:create:" + createdWorkflow.id, createdWorkflow);
    });

    mediator.request("wfm:cloud:workflows:create", [data, topicId], {uid: topicId}).then(function(createdWorkflow) {
      assert.equal(data.value, createdWorkflow.value, "Created Workflow should have the same value as initial data passed during request");
      assert(createdWorkflow.id, "Created workflow should have a generated id field");
      done();
    });

  });

  //List
  it('should publish to done list cloud topic when the request to list a workflow has been completed', function(done) {
    var listWorkflowArray = [{id: 'test-workflow-1', value:'test-workflow'},
      {id: 'test-workflow-2', value:'test-workflow'},
      {id: 'test-workflow-3', value:'test-workflow'}];

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workflows:list", function() {
      //Publish to done list data topic to fake getting the list of workflows by storage module
      mediator.publish("done:wfm:cloud:data:workflows:list", listWorkflowArray);
    });

    mediator.request("wfm:cloud:workflows:list").then(function(listWorkflow) {
      assert(listWorkflow, "Should return the list of workflows");
      assert.deepEqual(listWorkflow, listWorkflowArray, "List of workflows received should be the same as the list of workflows passed by the mock storage module");
      done();
    });

  });

  // Update
  it('should publish to done update cloud topic when the request to update a workflow has been completed', function(done) {
    var workflowToUpdate = {id:'testID', value: 'workflow-updated'};

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workflows:update", function(workflowToUpdate) {
      //Publish to done update data topic to fake getting the update of workflows by storage module
      mediator.publish("done:wfm:cloud:data:workflows:update:" + workflowToUpdate.id, workflowToUpdate);
    });

    mediator.request("wfm:cloud:workflows:update", workflowToUpdate, {uid: workflowToUpdate.id}).then(function(updatedWorkflow) {
      assert(updatedWorkflow, "Should return the updated workflow");
      assert.deepEqual(updatedWorkflow, workflowToUpdate, "The workflow updated should be the same as the workflow returned by the mock storage module");
      done();
    });
  });

  //Read
  it('should publish to done read cloud topic when the request to read a workflow has been completed', function(done) {
    var workflowRead = {id:'testID', value: 'workflow-read'};
    var uid = "testID";

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workflows:read", function(uid) {
      //Publish to done read data topic to fake the reading of workflows by storage module
      mediator.publish("done:wfm:cloud:data:workflows:read:" + uid, workflowRead);
    });

    mediator.request("wfm:cloud:workflows:read", uid).then(function(readWorkflow) {
      assert(readWorkflow, "Should return the workflow read");
      assert.equal(uid, readWorkflow.id, "Workflow Read should have the same id as the uid given in the request");
      done();
    });
  });

  //Delete
  it('should publish to done delete cloud topic when the request to delete a workflow has been completed', function(done) {
    var workflowToDelete = {id:'testID', value: 'workflow-deleted'};
    var uid = "testID";

    server(mediator, app, mockMbaasApi);

    //Mock of the data topic subscriber in the storage module
    mediator.subscribe("wfm:cloud:data:workflows:delete", function(uid) {
      //Publish to done delete data topic to fake the deleteing of workflows by storage module
      mediator.publish("done:wfm:cloud:data:workflows:delete:" + uid, workflowToDelete);
    });

    mediator.request("wfm:cloud:workflows:delete", uid).then(function(deletedWorkflow) {
      assert(deletedWorkflow, "Should return the deleted workflow");
      assert.equal(uid, deletedWorkflow.id, "Deleted workflow should have the same id as the uid given in the request");
      done();
    });
  });

});
