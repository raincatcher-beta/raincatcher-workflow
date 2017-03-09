var WorkflowTopicClient = require('./workflowClient');
var manager;



/**
 *
 * Initialising the workflow-client with a mediator.
 *
 * @param _mediator
 * @param config
 * @returns {WorkflowMediatorService}
 */
module.exports = function(_mediator, config) {

  //If there is already a manager, use this
  if (!manager) {
    manager = new WorkflowTopicClient(_mediator, config);
  }

  return manager;
};