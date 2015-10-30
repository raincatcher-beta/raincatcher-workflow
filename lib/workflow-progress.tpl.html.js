var ngModule;
try {
  ngModule = angular.module('wfm.workflow');
} catch (e) {
  ngModule = angular.module('wfm.workflow', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-progress.tpl.html',
    '<div class="workflow-progress close">\n' +
    '\n' +
    '<md-button class="md-icon-button md-warm expand-collapse">\n' +
    '  <md-icon md-font-set="material-icons">keyboard_arrow_down</md-icon>\n' +
    '</md-button>\n' +
    '      \n' +
    '<ol>\n' +
    '\n' +
    '  <li>\n' +
    '    <span class="md-caption">1</span>Name of the step\n' +
    '  </li>\n' +
    '\n' +
    '  <li class="active">\n' +
    '    <span class="md-caption">2</span>Name of the step\n' +
    '  </li>\n' +
    '\n' +
    '  <li>\n' +
    '    <span class="md-caption">3</span>Name of the step\n' +
    '  </li>\n' +
    '\n' +
    '  <li>\n' +
    '    <span class="md-caption">4</span>Name of the step\n' +
    '  </li>\n' +
    '\n' +
    '  <li>\n' +
    '    <span class="md-caption">5</span>Name of the step\n' +
    '  </li>\n' +
    '  \n' +
    '</ol>\n' +
    '\n' +
    '<!--\n' +
    '  <h5 class="md-caption">{{ctrl.title}}</h5>\n' +
    '  <h3 class="md-headline">{{ctrl.name}}</h3>\n' +
    '  <ul>\n' +
    '    <li class="md-caption" ng-repeat="step in ctrl.steps" ng-class="{active: $index == ctrl.stepIndex, complete: $index < ctrl.stepIndex}">{{$index + 1}}</li>\n' +
    '  </ul>\n' +
    '-->\n' +
    '\n' +
    '</div><!-- workflow-steps -->\n' +
    '');
}]);
