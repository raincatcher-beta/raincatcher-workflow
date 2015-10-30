var ngModule;
try {
  ngModule = angular.module('wfm.workflow');
} catch (e) {
  ngModule = angular.module('wfm.workflow', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-progress.tpl.html',
    '<div class="workflow-progress" ng-class="{close: ctrl.closed}">\n' +
    '\n' +
    '<md-button class="md-icon-button md-warm expand-collapse">\n' +
    '  <md-icon ng-show="ctrl.closed" md-font-set="material-icons" ng-click="ctrl.closed = false">keyboard_arrow_down</md-icon>\n' +
    '  <md-icon ng-show="!ctrl.closed" md-font-set="material-icons" ng-click="ctrl.closed = true">keyboard_arrow_up</md-icon>\n' +
    '</md-button>\n' +
    '\n' +
    '<ol>\n' +
    '  <li ng-repeat="step in ctrl.steps" ng-class="{active: $index == ctrl.stepIndex, complete: $index < ctrl.stepIndex}">\n' +
    '    <span class="md-caption">{{$index + 1}}</span>{{ctrl.name}}\n' +
    '  </li>\n' +
    '</ol>\n' +
    '\n' +
    '</div><!-- workflow-steps -->\n' +
    '');
}]);
