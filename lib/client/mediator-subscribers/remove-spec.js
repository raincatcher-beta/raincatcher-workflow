var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var CONSTANTS = require('../../constants');
var expect = chai.expect;

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

describe("Workflow Remove Mediator Topic", function() {

  var mockWorkflow = {
    id: "workflowid",
    name: "This is a mock Work Order"
  };

  var removeTopic = "wfm:workflows:remove";
  var doneRemoveTopic = "done:wfm:workflows:remove:workflowid";
  var errorRemoveTopic = "error:wfm:workflows:remove";

  var syncRemoveTopic = "wfm:sync:workflows:remove";
  var doneSyncRemoveTopic = "done:wfm:sync:workflows:remove:workflowid";
  var errorSyncRemoveTopic = "error:wfm:sync:workflows:remove:workflowid";

  var workflowSubscribers = new MediatorTopicUtility(mediator);
  workflowSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKFLOW_ENTITY_NAME);

  beforeEach(function() {
    this.subscribers = {};
    workflowSubscribers.on(CONSTANTS.TOPICS.REMOVE, require('./remove')(workflowSubscribers));
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    workflowSubscribers.unsubscribeAll();
  });

  it('should use the sync topics to remove a workflow', function() {
    this.subscribers[syncRemoveTopic] = mediator.subscribe(syncRemoveTopic, function(parameters) {
      expect(parameters.id).to.be.a('string');
      expect(parameters.topicUid).to.equal(mockWorkflow.id);

      mediator.publish(doneSyncRemoveTopic, mockWorkflow);
    });

    var donePromise = mediator.promise(doneRemoveTopic);

    mediator.publish(removeTopic, {id: mockWorkflow.id, topicUid: mockWorkflow.id});

    return donePromise;
  });

  it('should publish an error if there is no ID to remove', function() {
    var errorPromise = mediator.promise(errorRemoveTopic);

    mediator.publish(removeTopic);

    return errorPromise.then(function(error) {
      expect(error.message).to.have.string("Expected An ID");
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");
    this.subscribers[syncRemoveTopic] = mediator.subscribe(syncRemoveTopic, function(parameters) {
      expect(parameters.id).to.be.a('string');
      expect(parameters.topicUid).to.equal(mockWorkflow.id);

      mediator.publish(errorSyncRemoveTopic, expectedError);
    });

    var errorPromise = mediator.promise(errorRemoveTopic + ":" + mockWorkflow.id);

    mediator.publish(removeTopic, {id: mockWorkflow.id, topicUid: mockWorkflow.id});

    return errorPromise.then(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});