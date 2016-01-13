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

  return workflowManager;
});
