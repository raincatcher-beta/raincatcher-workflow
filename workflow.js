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

  workflowManager.stepReview = function(steps, result) {
    var stepIndex = -1;
    var complete;
    if (result && result.stepResults && result.stepResults.length !== 0) {
      complete = true;
      for (var i=0; i < steps.length; i++) {
        var step = steps[i];
        var stepResult = result.stepResults[step.code];
        if (stepResult && (stepResult.status === 'complete' || stepResult.status === 'pending')) {
          stepIndex = i;
          if (stepResult.status === 'pending') {
            complete = false;
          }
        } else {
          break;
        };
      };
    }
    return {
      nextStepIndex: stepIndex,
      complete: complete // false is any steps are "pending"
    };
  }

  workflowManager.nextStepIndex = function(steps, result) {
    return this.stepReview(steps, result).nextStepIndex;
  }

  workflowManager.checkStatus = function(workorder, workflow, result) {
    var status;
    var stepReview = this.stepReview(workflow.steps, result);
    if (stepReview.nextStepIndex >= workflow.steps.length - 1 && stepReview.complete) {
      status = 'Complete';
    } else if (!workorder.assignee) {
      status = 'Unassigned';
    } else if (stepReview.nextStepIndex < 0) {
      status = 'New';
    } else {
      status = 'In Progress';
    }
    return status;
  }

  return workflowManager;
});
