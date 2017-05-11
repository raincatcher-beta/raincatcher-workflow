var mediator = require("fh-wfm-mediator/lib/mediator");
var chai = require('chai');
var expect = chai.expect;
require('sinon-as-promised');
var _ = require('lodash');
var WorkflowClient = require('./../../../lib/client/workflow-client/workflowClient');

describe("Workflow Mediator Client", function() {

  var workflowClient = new WorkflowClient(mediator);

  var mockWorkflow = {
    id: "mockworkflowid",
    steps: [{
      code: "mockstep1code",
      name: "Mock Step 1",
      templates: {
        form: "<mockformtemplate></mockformtemplate>",
        view: "<mockviewtemplate></mockviewtemplate>"
      }
    }, {
      code: "mockstep2code",
      name: "Mock Step 2",
      templates: {
        form: "<mockform2template></mockform2template>",
        view: "<mockview2template></mockview2template>"
      }
    }, {
      code: "mockstep3code",
      name: "Mock Step 3",
      templates: {
        form: "<mockform3template></mockform3template>",
        view: "<mockview3template></mockview3template>"
      }
    }]
  };

  var mockResult = {
    id: "mockresultid",
    workorderId: "mockworkorderid"
  };


  describe("Step Review", function() {

    it("should return a 0 index if the result has no step results yet", function() {
      var stepResults = {
        stepResults: {}
      };

      _.extend(stepResults, mockResult);

      var stepReview = workflowClient.stepReview(mockWorkflow.steps, stepResults);

      expect(stepReview).to.deep.equal({
        nextStepIndex: 0,
        complete: false
      });
    });

    it("should return the index of the next incomplete step", function() {

      var stepResults = {
        stepResults: {
          mockstep1code: {
            status: "complete",
            submission: {
              somesubmissionkey: "somesubmission1value"
            }
          }
        }
      };

      _.extend(stepResults, mockResult);

      var stepReview = workflowClient.stepReview(mockWorkflow.steps, stepResults);

      expect(stepReview).to.deep.equal({
        nextStepIndex: 1,
        complete: false
      });
    });

    it("should return the index of the next incomplete step for pending", function() {

      var stepResults = {
        stepResults: {
          mockstep1code: {
            status: "pending",
            submission: {
              somesubmissionkey: "somesubmission1value"
            }
          }
        }
      };

      _.extend(stepResults, mockResult);

      var stepReview = workflowClient.stepReview(mockWorkflow.steps, stepResults);

      expect(stepReview).to.deep.equal({
        nextStepIndex: 0,
        complete: false
      });
    });

    it("should return complete if all steps are complete", function() {

      var stepResults = {
        stepResults: {
          mockstep1code: {
            status: "complete",
            submission: {
              somesubmissionkey: "somesubmission1value"
            }
          },
          mockstep2code: {
            status: "complete",
            submission: {
              somesubmissionkey: "somesubmission2value"
            }
          },
          mockstep3code: {
            status: "complete",
            submission: {
              somesubmissionkey: "somesubmission2value"
            }
          }
        }
      };

      _.extend(stepResults, mockResult);

      var stepReview = workflowClient.stepReview(mockWorkflow.steps, stepResults);

      expect(stepReview).to.deep.equal({
        nextStepIndex: 3,
        complete: true
      });
    });

  });

});