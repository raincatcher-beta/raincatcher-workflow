'use strict';

var sync = require('fh-wfm-sync/lib/server')
  , config = require('./config');


module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);

  //Adds an id field required by the new simple store to the workflow that will be created.
  mediator.subscribe('wfm:cloud:workflows:create', function(workflowToCreate, ts) {
    workflowToCreate.id = ts;
    mediator.publish('wfm:cloud:data:workflows:create', workflowToCreate);
  });
};
