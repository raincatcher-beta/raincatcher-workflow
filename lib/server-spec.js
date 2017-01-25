var sinon = require('sinon');
var proxyquire = require('proxyquire');
var express = require('express');
var app = express();
var mockMbaasApi = {};
var mockSync = {
  init: sinon.spy()
};

var mockMediator = require('./mocks/mockMediator');

describe('Message Sync', function() {
  var server = proxyquire('./server.js', {
    'fh-wfm-sync/lib/server': mockSync
  });

  it('should initialize sync and subscribes to sync topics', function(done) {
    server(mockMediator, app, mockMbaasApi);

    sinon.assert.callCount(mockMediator.subscribe, 5);
    sinon.assert.callCount(mockMediator.request, 5);
    setTimeout(function() {
      sinon.assert.callCount(mockMediator.publish, 5);
      done();
    }, 100);
  });
});