var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var expect = chai.expect;

describe("Workflow Read Mediator Topic", function() {

  var mockWorkflow = {
    id: "workflowid",
    name: "This is a mock Work Order"
  };

  var readTopic = "wfm:workflows:read";
  var doneReadTopic = "done:wfm:workflows:read:workflowid";
  var errorReadTopic = "error:wfm:workflows:read";

  var syncReadTopic = "wfm:sync:read:workflows";
  var doneSyncReadTopic = "done:wfm:sync:read:workflows:workflowid";
  var errorSyncReadTopic = "error:wfm:sync:read:workflows:workflowid";

  beforeEach(function() {
    this.subscribers = {};
    this.subscribers[readTopic] = require('./read')(mediator);
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });
  });

  it('should use the sync topics to read workflow', function() {
    this.subscribers[syncReadTopic] = mediator.subscribe(syncReadTopic, function(parameters) {
      expect(parameters.id).to.be.a('string');
      expect(parameters.topicUid).to.equal(mockWorkflow.id);

      mediator.publish(doneSyncReadTopic, mockWorkflow);
    });

    var donePromise = mediator.promise(doneReadTopic);

    mediator.publish(readTopic, {id: mockWorkflow.id, topicUid: mockWorkflow.id});

    return donePromise.then(function(readWorkflow) {
      expect(readWorkflow).to.deep.equal(mockWorkflow);
    });
  });

  it('should publish an error if there is no ID to read', function() {
    var errorPromise = mediator.promise(errorReadTopic);

    mediator.publish(readTopic);

    return errorPromise.then(function(error) {
      expect(error.message).to.have.string("Expected An ID");
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");
    this.subscribers[syncReadTopic] = mediator.subscribe(syncReadTopic, function(parameters) {
      expect(parameters.id).to.be.a('string');
      expect(parameters.topicUid).to.equal(mockWorkflow.id);

      mediator.publish(errorSyncReadTopic, expectedError);
    });

    var errorPromise = mediator.promise(errorReadTopic + ":" + mockWorkflow.id);

    mediator.publish(readTopic, {id: mockWorkflow.id, topicUid: mockWorkflow.id});

    return errorPromise.then(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});