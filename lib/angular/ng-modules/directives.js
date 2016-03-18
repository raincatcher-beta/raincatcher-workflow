/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var _ = require('lodash');

var ngModule = angular.module('wfm.workflow.directives', [
  'wfm.core.mediator'
]);
module.exports = 'wfm.workflow.directives';

require('../../../dist');

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
            element.html('<appform form-id="step.formId"></appform>');
            $compile(element.contents())(scope);
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

.directive('workflowResult', function($compile) {
  var render = function(scope, element, attrs) {
    if (scope.workflow.steps && scope.result) {
      element.children().remove();
      scope.workflow.steps.forEach(function(step, stepIndex) {
        if (scope.result.stepResults && scope.result.stepResults[step.code]) {
          element.append('<md-divider></md-divider>');
          var template = '';
          template = '<workorder-submission-result'
          template += ' result="result.stepResults[\''+step.code+'\']"'
          template += ' step="workflow.steps[\''+stepIndex+'\']"'
          template += '></workorder-submission-result>';
          console.log(template);
          element.append(template);
        }
      });
      $compile(element.contents())(scope);
    };
  }
  return {
    restrict: 'E'
  , scope: {
      workflow: '='
    , result: '='
    }
  , link: function (scope, element, attrs) {
      render(scope, element, attrs);
    }
  };
})
.directive('workflowForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workflow-form.tpl.html')
  , scope: {
    workflow : '=value'
    }
  , controller: function($scope) {
      var self = this;
      self.model = angular.copy($scope.workflow);
      self.submitted = false;
      self.done = function(isValid) {
        self.submitted = true;
        if (isValid) {
          if (!self.model.id && self.model.id !== 0) {
            self.model.steps = [];
            mediator.publish('workflow:created', self.model);
          }  else {
            mediator.publish('workflow:edited', self.model);
          }
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})
.directive('workflowStepForm', function($templateCache, mediator) {
  return {
    restrict: 'E'
  , template: $templateCache.get('wfm-template/workflow-step-form.tpl.html')
  , scope: {
    workflow : '=',
    step : '='
    }
  , controller: function($scope) {
      var self = this;
      self.submitted = false;
      if(!$scope.step){
        self.model = {
          step : {
            templates : {}
          },
          workflow : angular.copy($scope.workflow),
          isNew : true
        }
      }
      else {
        self.model = {
          workflow : angular.copy($scope.workflow),
          step : angular.copy($scope.step)
        }
      }
      self.done = function(isValid) {
        self.submitted = true;
        if (isValid) {
            //we check if the step already exist or not, if it exsit we remove the old element
            if($scope.workflow.steps.filter(function(item) {return item.code == self.model.step.code;}).length>0){
              $scope.workflow.steps = $scope.workflow.steps.filter(function(item) {return item.code != self.model.step.code;});
            }
            //we add the new or updated step
            $scope.workflow.steps.push(self.model.step);
            mediator.publish('workflow:edited', $scope.workflow);
        }
      }
    }
  , controllerAs: 'ctrl'
  };
})
;
