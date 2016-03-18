/**
* CONFIDENTIAL
* Copyright 2016 Red Hat, Inc. and/or its affiliates.
* This is unpublished proprietary source code of Red Hat.
**/
'use strict';

var express = require('express')
  , config = require('./config')
  ;

function initRouter(mediator) {
  var router = express.Router();
  router.route('/').get(function(req, res, next) {
    mediator.publish('workflow:list:load');
    mediator.once('done:workflow:list:load', function(workflows) {
      res.json(workflows);
    });
  });
  router.route('/:id').put(function(req, res, next) {
    var workflowId = req.params.id;
    var workflow = req.body;
    // console.log('req.body', req.body);
    mediator.once('workflow:saved:' + workflowId, function(savedWorkflow) {
      res.json(savedWorkflow);
    });
    mediator.publish('workflow:save', workflow);
  });

  return router;
};

module.exports = function(mediator, app) {
  var router = initRouter(mediator);
  app.use(config.apiPath, router);
};
