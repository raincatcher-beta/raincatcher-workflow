var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
require('sinon-as-promised');
var _ = require('lodash');
var CONSTANTS = require('../../../lib/constants');
var WorkflowClient = require('../../../lib/client/workflow-client/index');
var fixtures = require('../../fixtures/index');

var expect = chai.expect;

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

var donePrefix = "done:";

var workflowSummaryTopic = "wfm:workflows:step:summary";
var workflowSummaryDoneTopic = donePrefix + workflowSummaryTopic;

var listResultsTopic = "wfm:results:list";
var listResultsDoneTopic = donePrefix + listResultsTopic;

var readWorkorderTopic = "wfm:workorders:read";
var readWorkorderDoneTopic = donePrefix + readWorkorderTopic;


var readWorkflowTopic = "wfm:sync:workflows:read";
var readWorkflowDoneTopic = donePrefix + readWorkflowTopic;

var createResultTopic = "wfm:results:create";
var createResultDoneTopic = donePrefix + createResultTopic;

var workflowStepSubscribers = new MediatorTopicUtility(mediator);
workflowStepSubscribers.prefix(CONSTANTS.WORKFLOW_PREFIX).entity(CONSTANTS.STEPS_ENTITY_NAME);


describe("Getting A Workflow Summary For A Single Workorder", function() {

  var mockWorkflow = fixtures.mockWorkflow();

  var mockWorkorder = fixtures.mockWorkorder();

  var mockResult = fixtures.mockResult();

  var newResult = {
    status: "New",
    nextStepIndex: 0,
    workorderId: mockWorkorder.id,
    stepResults: {}
  };

  function getMockResults(includeResult) {
    var results = [];

    if (includeResult) {
      results.push(mockResult);
    }

    return results;
  }

  var workflowClient = new WorkflowClient(mediator);

  function createSubscribers(includeResult) {
    //Subscribing to the list results topic
    this.subscribers[listResultsTopic] = mediator.subscribe(listResultsTopic, function() {

      mediator.publish(listResultsDoneTopic, getMockResults(includeResult));
    });

    //Subscribing to the readWorkorder Topic
    this.subscribers[readWorkorderTopic] = mediator.subscribe(readWorkorderTopic, function(parameters) {
      expect(parameters.id).to.equal(mockWorkorder.id);
      expect(parameters.topicUid).to.equal(mockWorkorder.id);

      mediator.publish(readWorkorderDoneTopic + ":" + mockWorkorder.id, mockWorkorder);
    });

    this.subscribers[createResultTopic] = mediator.subscribe(createResultTopic, function(parameters) {

      if (includeResult) {
        throw new Error("Expected the create result topic not to be called");
      }

      expect(parameters.resultToCreate).to.deep.equal(newResult);
      expect(parameters.topicUid).to.be.a('string');

      mediator.publish(createResultDoneTopic + ":" + parameters.topicUid, newResult);
    });

    this.subscribers[readWorkflowTopic] = mediator.subscribe(readWorkflowTopic, function(parameters) {
      expect(parameters.id).to.equal(mockWorkflow.id);
      expect(parameters.topicUid).to.equal(mockWorkflow.id);

      mediator.publish(readWorkflowDoneTopic + ":" + mockWorkflow.id, mockWorkflow);
    });
  }

  beforeEach(function() {
    this.subscribers = {};
    workflowStepSubscribers.on(CONSTANTS.STEP_TOPICS.SUMMARY, require('./../../../lib/client/mediator-subscribers/summary')(workflowStepSubscribers, workflowClient));
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    workflowStepSubscribers.unsubscribeAll();
  });

  it("should return a summary of the current workorder workflow", function() {

    _.bind(createSubscribers, this)(true);

    var summaryDonePromise = mediator.promise(workflowSummaryDoneTopic);

    mediator.publish(workflowSummaryTopic, {
      workorderId: mockWorkorder.id
    });

    return summaryDonePromise.then(function(stepSummary) {
      expect(stepSummary.workflow).to.deep.equal(mockWorkflow);
      expect(stepSummary.workorder).to.deep.equal(mockWorkorder);
      expect(stepSummary.nextStepIndex).to.equal(2);
      expect(stepSummary.step).to.deep.equal(undefined);
      expect(stepSummary.result).to.deep.equal(mockResult);
    });
  });

});
