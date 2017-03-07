'use strict';

var config = require('../config')
  , _ = require('lodash')
  ;

var workflowClient = require('../client/workflow-client');
var workflowMediatorSubscribers = require('../client/mediator-subscribers');

module.exports = 'wfm.workflow.sync';

function wrapManager($q, $timeout, manager) {
  var wrappedManager = _.create(manager);
  wrappedManager.new = function() {
    var deferred = $q.defer();
    $timeout(function() {
      var workflow = {
        title: ''
      };
      deferred.resolve(workflow);
    }, 0);
    return deferred.promise;
  };

  return wrappedManager;
}

angular.module('wfm.workflow.sync', [])
.factory('workflowSync', function($q, $timeout, mediator) {
  var workflowSync = {};
  workflowSync.createManager = function(queryParams) {
    if (workflowSync.manager) {
      return $q.when(workflowSync.manager);
    } else {
      workflowSync.manager = wrapManager($q, $timeout, workflowClient(mediator));

      //Initialising subscribers for this module.
      workflowMediatorSubscribers.init(mediator);
      console.log('Sync is managing dataset:', config.datasetId, 'with filter: ', queryParams);
      return workflowSync.manager;
    }
  };
  workflowSync.removeManager = function() {
    if (workflowSync.manager) {
      return workflowSync.manager.safeStop()
      .then(function() {
        //Removing any workflow subscribers
        workflowMediatorSubscribers.tearDown();
        delete workflowSync.manager;
      });
    }
  };
  return workflowSync;
})
;
