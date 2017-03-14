var mediatorSubscribers = require('./mediator-subscribers');
var WorkflowClient = require('./workflow-client');

/**
 * Initialisation of the workflow module.
 * @param {Mediator} mediator
 * @param {object}  config
 */
module.exports = function(mediator, config) {

  //Initialising the subscribers to topics that the module is interested in.
  var workflowClient = WorkflowClient(mediator, config);
  return mediatorSubscribers.init(mediator, workflowClient);
};