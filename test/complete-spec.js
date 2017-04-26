var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
require('sinon-as-promised');
var _ = require('lodash');
var CONSTANTS = require('../lib/constants');
var WorkflowClient = require('../lib/client/workflow-client/index');
var fixtures = require('../fixtures');

var expect = chai.expect;

var MediatorTopicUtility = require('fh-wfm-mediator/lib/topics');

var donePrefix = "done:";
var errorPrefix = "error:";

var readProfileTopic = "wfm:users:read_profile";
var readProfileDoneTopic = donePrefix + "wfm:users:read_profile";

var updateResultTopic = "wfm:results:update";
var updateResultDoneTopic = donePrefix + updateResultTopic;

var completeWorkflowStepTopic = "wfm:workflows:step:complete";
var completeWorkflowStepDoneTopic = donePrefix + completeWorkflowStepTopic;
var completeWorkflowStepErrorTopic = errorPrefix + completeWorkflowStepTopic;

var listResultsTopic = "wfm:results:list";
var listResultsDoneTopic = donePrefix + listResultsTopic;

var readWorkorderTopic = "wfm:workorders:read";
var readWorkorderDoneTopic = donePrefix + readWorkorderTopic;


var readWorkflowTopic = "wfm:sync:workflows:read";
var readWorkflowDoneTopic = donePrefix + readWorkflowTopic;

var workflowStepSubscribers = new MediatorTopicUtility(mediator);
workflowStepSubscribers.prefix(CONSTANTS.WORKFLOW_PREFIX).entity(CONSTANTS.STEPS_ENTITY_NAME);


describe("Completing A Workflow Step For A Single Workorder", function() {

  var mockWorkflow = fixtures.mockWorkflow();

  var mockWorkorder = fixtures.mockWorkorder();

  var mockResult = fixtures.mockResult();
  mockResult.stepResults = {};

  var mockUser = fixtures.mockUser();

  function getMockResults(includeResult) {
    var results = [];

    if (includeResult) {
      results.push(mockResult);
    }

    return results;
  }

  var mockSubmission = {
    subKey1: "subVal1",
    subKey2: "subVal2"
  };

  var workflowClient = new WorkflowClient(mediator);

  function createSubscribers(includeResult, expectedResult) {
    //Subscribing to the list results topic
    this.subscribers[listResultsTopic] = mediator.subscribe(listResultsTopic, function() {

      mediator.publish(listResultsDoneTopic, getMockResults(includeResult));
    });

    this.subscribers[readProfileTopic] = mediator.subscribe(readProfileTopic, function() {

      mediator.publish(readProfileDoneTopic, mockUser);
    });

    this.subscribers[updateResultTopic] = mediator.subscribe(updateResultTopic, function(parameters) {
      expect(parameters.resultToUpdate).to.be.an('object');
      expect(parameters.topicUid).to.be.a('string');

      mediator.publish(updateResultDoneTopic + ":" + parameters.topicUid, expectedResult);
    });

    //Subscribing to the readWorkorder Topic
    this.subscribers[readWorkorderTopic] = mediator.subscribe(readWorkorderTopic, function(parameters) {
      expect(parameters.id).to.equal(mockWorkorder.id);
      expect(parameters.topicUid).to.equal(mockWorkorder.id);

      mediator.publish(readWorkorderDoneTopic + ":" + mockWorkorder.id, mockWorkorder);
    });

    this.subscribers[readWorkflowTopic] = mediator.subscribe(readWorkflowTopic, function(parameters) {
      expect(parameters.id).to.equal(mockWorkflow.id);
      expect(parameters.topicUid).to.equal(mockWorkflow.id);

      mediator.publish(readWorkflowDoneTopic + ":" + mockWorkflow.id, mockWorkflow);
    });
  }

  beforeEach(function() {
    this.subscribers = {};
    workflowStepSubscribers.on(CONSTANTS.STEP_TOPICS.COMPLETE, require('./../lib/client/mediator-subscribers/complete')(workflowStepSubscribers, workflowClient));
  });

  afterEach(function() {
    _.each(this.subscribers, function(subscriber, topic) {
      mediator.remove(topic, subscriber.id);
    });

    workflowStepSubscribers.unsubscribeAll();
  });

  it('should publish an error if no result exists', function() {
    _.bind(createSubscribers, this)(false);

    var stepErrorPromise = mediator.promise(completeWorkflowStepErrorTopic);

    mediator.publish(completeWorkflowStepTopic, {
      workorderId: mockWorkorder.id,
      submission: mockSubmission,
      stepCode: mockWorkflow.steps[0].code
    });

    return stepErrorPromise.then(function(error) {
      expect(error.message).to.contain("No result exists");
      expect(error.message).to.contain(mockWorkorder.id);
    });
  });

  it("should add the step details to the result and increment the step", function() {

    var expectedResult = fixtures.mockResult();
    expectedResult.stepResults = {

    };
    expectedResult.stepResults[mockWorkflow.steps[0].code] = {
      step: mockWorkflow.steps[0],
      submission: mockSubmission,
      type: CONSTANTS.STEP_TYPES.STATIC,
      status: CONSTANTS.STATUS.COMPLETE,
      submitter: mockUser.id
    };

    expectedResult.status = CONSTANTS.STATUS.PENDING_DISPLAY;
    expectedResult.nextStepIndex = 1;

    _.bind(createSubscribers, this)(true, expectedResult);

    var stepCompletePromise = mediator.promise(completeWorkflowStepDoneTopic);

    mediator.publish(completeWorkflowStepTopic, {
      workorderId: mockWorkorder.id,
      submission: mockSubmission,
      stepCode: mockWorkflow.steps[0].code
    });

    return stepCompletePromise.then(function(stepSummary) {
      expect(stepSummary.workflow).to.deep.equal(mockWorkflow);
      expect(stepSummary.workorder).to.deep.equal(mockWorkorder);


      expect(stepSummary.nextStepIndex).to.equal(1);
      //It should move to the next step.
      expect(stepSummary.step).to.deep.equal(mockWorkflow.steps[1]);


      //Checking a timestamp was applied to the step.
      expect(stepSummary.result.stepResults[mockWorkflow.steps[0].code].timestamp).to.be.a('number');

      //Removing it for checking the expected result
      delete stepSummary.result.stepResults[mockWorkflow.steps[0].code].timestamp;
      expect(stepSummary.result).to.deep.equal(expectedResult);
    });
  });

});
