var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-form.tpl.html',
    '<!--\n' +
    ' CONFIDENTIAL\n' +
    ' Copyright 2016 Red Hat, Inc. and/or its affiliates.\n' +
    ' This is unpublished proprietary source code of Red Hat.\n' +
    '-->\n' +
    '<md-toolbar class="content-toolbar md-primary">\n' +
    '  <div class="md-toolbar-tools">\n' +
    '    <h3>New workflow</h3>\n' +
    '  </div>\n' +
    '</md-toolbar>\n' +
    '\n' +
    '<form name="workflowForm" ng-submit="ctrl.done(workflowForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Title</label>\n' +
    '    <input type="text" id="title" name="title" ng-model="ctrl.model.title" required>\n' +
    '    <div ng-messages="workflow.title.$error" ng-if="ctrl.submitted || workflowForm.title.$dirty">\n' +
    '      <div ng-message="required">A title is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.id ? \'Update\' : \'Create\'}} Workflow</md-button>\n' +
    '</form>\n' +
    '');
}]);
