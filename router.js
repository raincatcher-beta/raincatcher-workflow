'use strict';

var express = require('express')
  , config = require('./config')
  ;

function initRouter(mediator) {
  var router = express.Router();
  router.route('/steps').get(function(req, res, next) {
    mediator.publish('workflow:steps:load');
    mediator.once('workflow:steps:loaded', function(steps) {
      res.json(steps);
    });
  });
  router.route('/').get(function(req, res, next) {
    mediator.publish('workflows:load');
    mediator.once('workflows:loaded', function(workflows) {
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
