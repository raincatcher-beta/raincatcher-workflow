var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var expect = chai.expect;

describe("Workflow Update Mediator Topic", function() {

  var mockWorkflowToUpdate = {
    id: "workflowidtoupdate",
    name: "This is a mock Work Order"
  };

  var expectedUpdatedWorkflow =  _.defaults({name: "Updated Workflow"}, mockWorkflowToUpdate);

  var topicUid = 'testtopicuid1';

  var updateTopic = "wfm:workflows:update";
  var doneUpdateTopic = "done:wfm:workflows:update:testtopicuid1";
  var errorUpdateTopic = "error:wfm:workflows:update:testtopicuid1";

  var syncUpdateTopic = "wfm:sync:update:workflows";
  var doneSyncUpdateTopic = "done:wfm:sync:update:workflows";
  var errorSyncUpdateTopic = "error:wfm:sync:update:workflows";

  beforeEach(function() {
    this.subscribers = {};
    this.subscribers[updateTopic] = require('./update')(mediator);
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });
  });

  it('should use the sync topics to update a workflow', function() {
    this.subscribers[syncUpdateTopic] = mediator.subscribe(syncUpdateTopic, function(parameters) {
      expect(parameters.itemToUpdate).to.deep.equal(mockWorkflowToUpdate);
      expect(parameters.topicUid).to.be.a('string');

      mediator.publish(doneSyncUpdateTopic + ":" + parameters.topicUid, expectedUpdatedWorkflow);
    });

    var donePromise = mediator.promise(doneUpdateTopic);

    mediator.publish(updateTopic, {
      workflowToUpdate: mockWorkflowToUpdate,
      topicUid: topicUid
    });

    return donePromise.then(function(updatedWorkflow) {
      expect(updatedWorkflow).to.deep.equal(expectedUpdatedWorkflow);
    });
  });

  it('should publish an error if there is no object to update', function() {
    var errorPromise = mediator.promise(errorUpdateTopic);

    mediator.publish(updateTopic, {
      topicUid: topicUid
    });

    return errorPromise.then(function(error) {
      expect(error.message).to.have.string("Invalid Data");
    });
  });

  it('should publish an error if there is no workflow id', function() {
    var errorPromise = mediator.promise(errorUpdateTopic);

    mediator.publish(updateTopic, {
      workflowToUpdate: {},
      topicUid: topicUid
    });

    return errorPromise.then(function(error) {
      expect(error.message).to.have.string("Invalid Data");
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");

    this.subscribers[syncUpdateTopic] = mediator.subscribe(syncUpdateTopic, function(parameters) {
      expect(parameters.itemToUpdate).to.deep.equal(mockWorkflowToUpdate);
      expect(parameters.topicUid).to.be.a('string');

      mediator.publish(errorSyncUpdateTopic + ":" + parameters.topicUid, expectedError);
    });

    var errorPromise = mediator.promise(errorUpdateTopic);

    mediator.publish(updateTopic, {
      workflowToUpdate: mockWorkflowToUpdate,
      topicUid: topicUid
    });

    return errorPromise.then(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});