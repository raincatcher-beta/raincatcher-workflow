var ngModule;
try {
  ngModule = angular.module('wfm.workflow');
} catch (e) {
  ngModule = angular.module('wfm.workflow', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-progress.tpl.html',
    '<div class="workflow-progress">\n' +
    '  <h5 class="md-caption">{{ctrl.title}}</h5>\n' +
    '  <h3 class="md-headline">{{ctrl.name}}</h3>\n' +
    '  <ul>\n' +
    '    <li class="md-caption" ng-repeat="step in ctrl.steps" ng-class="{active: $index == ctrl.stepIndex, complete: $index < ctrl.stepIndex}">{{$index + 1}}</li>\n' +
    '  </ul>\n' +
    '</div><!-- workflow-steps -->\n' +
    '');
}]);
