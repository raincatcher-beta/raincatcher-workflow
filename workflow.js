'use strict';

var config = require('./config');
var _ = require('lodash');
var ngModule = angular.module('wfm.workflow', ['wfm.core.mediator', 'ngFeedHenry'])
require('ng-feedhenry');

require('./lib');

ngModule.run(function($q, $timeout, mediator, FHCloud) {
  var promise = FHCloud.get(config.apiPath).then(function(response) {
    return response;
  }, function(err) {
    console.error(err);
  }); // TODO: introduce retry/error-handling logic

  mediator.subscribe('workflows:load', function() {
    promise.then(function(workflows) {
      mediator.publish('done:workflows:load', workflows);
    });
  });

  mediator.subscribe('workflow:load', function(id) {
    promise.then(function(workflows) {
      var workflow = _.find(workflows, function(_workflow) {
        return _workflow.id == id;
      });
      mediator.publish('done:workflow:load:' + id, workflow);
    });
  });
})

ngModule.directive('workflowProgress', function($templateCache, $timeout) {
  function parseStepIndex(ctrl, stepIndex) {
    ctrl.stepIndex = stepIndex;
    ctrl.step = ctrl.steps[ctrl.stepIndex];
  }
  function scrollToActive(element) {
    element = element[0];
    var active = element.querySelector('li.active');
    if (!active) {
      active = element.querySelector('li');
    };
    var scroller = element.querySelector('.scroll-box');
    var offset = active.offsetTop;
    scroller.scrollTop = offset;
  }
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workflow-progress.tpl.html')
  , scope: {
      stepIndex: '=',
      workflow: '='
    }
  , link: function (scope, element, attrs) {
      $timeout(function() {
        scrollToActive(element);
      }, 0);
    }
  , controller: function($scope, $element) {
      var self = this;
      self.workflow = $scope.workflow;
      self.steps = $scope.workflow.steps;
      self.open = function() {
        self.closed = false;
      }
      self.close = function() {
        scrollToActive($element);
        self.closed = true;
      }
      parseStepIndex(self, $scope.stepIndex ? parseInt($scope.stepIndex) : 0)

      $scope.$watch('stepIndex', function() {
        console.log('stepIndex changed')
        parseStepIndex(self, $scope.stepIndex ? parseInt($scope.stepIndex) : 0);
        self.closed = true;
        $timeout(function() {
          scrollToActive($element);
        }, 0);
      });
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workflowStep', function($templateRequest, $compile, mediator) {
  return {
    restrict: 'E'
  , scope: {
      step: '=' // { ..., template: "an html template to use", templatePath: "a template path to load"}
    , workorder: '='
    }
  , link: function (scope, element, attrs) {
      scope.$watch('step', function(step) {
        if (scope.step) {
          if (scope.step.formId) {
            mediator.request('appform:form:load', scope.step.formId).then(function(form) {
              scope.form = form;
              element.html('<appform form="form"></appform>');
              $compile(element.contents())(scope);
            }, function(error) {
              console.error(error);
            });
          } else if (scope.step.templatePath) {
            $templateRequest(scope.step.templatePath).then(function(template) {
              element.html(template);
              $compile(element.contents())(scope);
            });
          } else {
            element.html(scope.step.templates.form);
            $compile(element.contents())(scope);
          };
        };
      });
    }
  , controller: function() {
      var self = this;
      self.mediator = mediator;
    }
  , controllerAs: 'ctrl'
  };
})

.directive('workflowResults', function($compile) {
  var render = function(scope, element, attrs) {
    if (scope.workflow.steps && scope.workorder) {
      element.children().remove();
      scope.workflow.steps.forEach(function(step, i) {
        element.append('<md-divider></md-divider>');
        if (scope.workorder.steps && scope.workorder.steps[step.code] && scope.workorder.steps[step.code].status === 'complete' ) {
          var template = '';
          if (step.formId) {
            var submission = scope.workorder.steps[step.code].submission;
            if (submission.submissionId || submission._submissionLocalId) {
              template = '<appform-submission submission-id="workorder.steps[\''+step.code+'\'].submission.submissionId" submission-local-id="workorder.steps[\''+step.code+'\'].submission._submissionLocalId"></appform-submission>';
            }
          } else {
            template = step.templates.view;
          };
          element.append(template);
        }
      });
      $compile(element.contents())(scope);
    };
  }
  return {
    restrict: 'E'
  , scope: {
      workorder: '=workorder'
    , workflow: '=workflow'
    }
  , link: function (scope, element, attrs) {
      render(scope, element, attrs);
    }
  };
})
;

module.exports = 'wfm.workflow';
