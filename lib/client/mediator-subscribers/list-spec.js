var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var _ = require('lodash');
var expect = chai.expect;

describe("Workflow List Mediator Topic", function() {

  var mockWorkflow = {
    id: "workflowid",
    name: "This is a mock Work Order"
  };

  var workflows = [_.clone(mockWorkflow), _.clone(mockWorkflow)];

  var listTopic = "wfm:workflows:list";
  var doneListTopic = "done:wfm:workflows:list";
  var errorListTopic = "error:wfm:workflows:list";

  var syncListTopic = "wfm:sync:list:workflows";
  var doneSyncListTopic = "done:wfm:sync:list:workflows";
  var errorSyncListTopic = "error:wfm:sync:list:workflows";

  beforeEach(function() {
    this.subscribers = {};
    this.subscribers[listTopic] = require('./list')(mediator);
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });
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