'use strict';

var _ = require('lodash')
  , sync = require('fh-wfm-sync/lib/server')
  , config = require('./config')


module.exports = function(mediator, app, mbaasApi) {
  sync.init(mediator, mbaasApi, config.datasetId, config.syncOptions);
};
