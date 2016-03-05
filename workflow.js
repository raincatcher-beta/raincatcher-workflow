/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var config = require('./config');
var _ = require('lodash');
require('ng-feedhenry');

var ngModule = angular.module('wfm.workflow', [
  'ngFeedHenry',
  require('./lib/angular/directives')
])
module.exports = 'wfm.workflow';

ngModule.factory('workflowManager', function(FHCloud) {
  var workflowManager = {};
  var promise = FHCloud.get(config.apiPath).then(function(response) {
    return response;
  }, function(err) {
    console.error(err);
  }); // TODO: introduce retry/error-handling logic

  workflowManager.list = function() {
    return promise;
  };

  workflowManager.read = function(id) {
    return promise.then(function(workflows) {
      var workflow = _.find(workflows, function(_workflow) {
        return _workflow.id == id;
      });
      return workflow;
    })
  };

  //fast-forward to the first incomplete step
  workflowManager.nextStepIndex = function(steps, result) {
    var stepIndex = -1;
    if (result.stepResults && result.stepResults.length !== 0) {
      for (var i=0; i < steps.length; i++) {
        var step = steps[i];
        var stepResult = result.stepResults[step.code];
        if (stepResult && stepResult.status === 'complete') {
          stepIndex = i;
        } else {
          break;
        };
      };
    }
    return stepIndex;
  }

  workflowManager.checkStatus = function(workorder, workflow, result) {
    var status;
    var stepIndex = this.nextStepIndex(workflow.steps, result);
    if (stepIndex >= workflow.steps.length - 1) {
      status = 'Complete';
    } else if (!workorder.assignee) {
      status = 'Unassigned';
    } else if (stepIndex < 0) {
      status = 'New';
    } else {
      status = 'In Progress';
    }
    return status;
  }

  return workflowManager;
});
