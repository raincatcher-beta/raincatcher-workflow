module.exports = {
  mockWorkorder: function() {
    return {
      id: "mockworkorderid",
      workflowId: "mockworkflowid",
      assignee: "mockuserid"
    };
  },
  mockUser: function() {
    return {
      id: "mockuserid"
    };
  },
  mockResult: function() {
    return {
      id: "mockresultid",
      workorderId: "mockworkorderid",
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
  },
  mockWorkflow: function() {
    return {
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
          view: "<mockviewtemplate></mockviewtemplate>"
        }
      }]
    };
  }
};