var ngModule;
try {
  ngModule = angular.module('wfm.workflow.directives');
} catch (e) {
  ngModule = angular.module('wfm.workflow.directives', []);
}

ngModule.run(['$templateCache', function ($templateCache) {
  $templateCache.put('wfm-template/workflow-step-form.tpl.html',
    '<form name="workflowStepForm" ng-submit="ctrl.done(workflowStepForm.$valid)" novalidate layout-padding layout-margin>\n' +
    '\n' +
    '<div>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Code</label>\n' +
    '    <input type="text" id="code" name="code" ng-model="ctrl.model.step.code" required>\n' +
    '    <div ng-messages="workflow.model.step.$error" ng-if="ctrl.submitted || workflowForm.title.$dirty">\n' +
    '      <div ng-message="required">A code is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>Name</label>\n' +
    '    <input type="text" id="name" name="name" ng-model="ctrl.model.step.name" required>\n' +
    '    <div ng-messages="workflow.name.$error" ng-if="ctrl.submitted || workflowForm.name.$dirty">\n' +
    '      <div ng-message="required">A name is required.</div>\n' +
    '    </div>\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>FormID</label>\n' +
    '    <input type="text" id="formId" name="formId" ng-model="ctrl.model.step.formId">\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>form template</label>\n' +
    '    <input type="text" id="form" name="form" ng-model="ctrl.model.step.templates.form">\n' +
    '  </md-input-container>\n' +
    '  <md-input-container class="md-block">\n' +
    '    <label>view template</label>\n' +
    '    <input type="text" id="view" name="view" ng-model="ctrl.model.step.templates.view">\n' +
    '  </md-input-container>\n' +
    '\n' +
    '</div>\n' +
    '\n' +
    '  <md-button type="submit" class="md-raised md-primary">{{ctrl.model.isNew ? \'Add\' : \'Update\'}} step</md-button>\n' +
    '</form>\n' +
    '');
}]);
