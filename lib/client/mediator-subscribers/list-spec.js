var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var CONSTANTS = require('../../constants');
var expect = chai.expect;

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');
var WorkflowClient = require('../workflow-client');

describe("Workflow List Mediator Topic", function() {

  var mockWorkflow = {
    id: "workflowid",
    name: "This is a mock Work Order"
  };

  var workflows = [_.clone(mockWorkflow), _.clone(mockWorkflow)];

  var listTopic = "wfm:workflows:list";
  var doneListTopic = "done:wfm:workflows:list";
  var errorListTopic = "error:wfm:workflows:list";

  var syncListTopic = "wfm:sync:workflows:list";
  var doneSyncListTopic = "done:wfm:sync:workflows:list";
  var errorSyncListTopic = "error:wfm:sync:workflows:list";

  var workflowSubscribers = new MediatorTopicUtility(mediator);
  workflowSubscribers.prefix(CONSTANTS.TOPIC_PREFIX).entity(CONSTANTS.WORKFLOW_ENTITY_NAME);

  var workflowClient = WorkflowClient(mediator);

  beforeEach(function() {
    this.subscribers = {};
    workflowSubscribers.on(CONSTANTS.TOPICS.LIST, require('./list')(workflowSubscribers, workflowClient));
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    workflowSubscribers.unsubscribeAll();
  });

  it('should use the sync topics to list workflows', function() {
    this.subscribers[syncListTopic] = mediator.subscribe(syncListTopic, function() {
      mediator.publish(doneSyncListTopic, workflows);
    });

    var donePromise = mediator.promise(doneListTopic);

    mediator.publish(listTopic);

    return donePromise.then(function(arrayOfWorkflows) {
      expect(arrayOfWorkflows).to.deep.equal(workflows);
    });
  });

  it('should handle an error from the sync create topic', function() {
    var expectedError = new Error("Error performing sync operation");
    this.subscribers[syncListTopic] = mediator.subscribe(syncListTopic, function() {
      mediator.publish(errorSyncListTopic, expectedError);
    });

    var errorPromise = mediator.promise(errorListTopic);

    mediator.publish(listTopic);

    return errorPromise.then(function(error) {
      expect(error).to.deep.equal(expectedError);
    });
  });
});