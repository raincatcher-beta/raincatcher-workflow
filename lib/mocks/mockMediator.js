var sinon = require('sinon');
require('sinon-as-promised');

var mockCreatedWorkflow = {id: 'testId'},
  mockListWorkflow = [],
  mockUpdatedWorkflow = {id: 'testId'},
  mockReadWorkflow = {id: 'testId', value: 'test-workflow-read'},
  mockDeletedWorkflow = {id:'testId', value: 'test-workflow-delete'},
  mockTopicId = "testId",
  mockUID = "testId";

/**
 * Function which mocks the subscribe functionality of mediator.
 * @returns {stub}
 */
function subscribe() {
  var subscribeStub = sinon.stub();

  subscribeStub.withArgs("wfm:cloud:workflows:create", sinon.match.func)
    .callsArgWith(1, mockCreatedWorkflow, mockTopicId);

  subscribeStub.withArgs("wfm:cloud:workflows:list", sinon.match.func)
    .callsArg(1);

  subscribeStub.withArgs("wfm:cloud:workflows:update", sinon.match.func)
    .callsArgWith(1, mockCreatedWorkflow);

  subscribeStub.withArgs("wfm:cloud:workflows:read", sinon.match.func)
    .callsArgWith(1, mockUID);

  subscribeStub.withArgs("wfm:cloud:workflows:delete", sinon.match.func)
    .callsArgWith(1, mockUID);


  subscribeStub.throws("Invalid Argument");

  return subscribeStub;
}

/**
 * Function which mocks the request functionality of mediator.
 * @returns {stub}
 */
function request() {
  var requestStub = sinon.stub();

  requestStub.withArgs("wfm:cloud:data:workflows:create", sinon.match.object, sinon.match.object)
    .resolves(mockCreatedWorkflow);

  requestStub.withArgs("wfm:cloud:data:workflows:list")
    .resolves(mockListWorkflow);

  requestStub.withArgs("wfm:cloud:data:workflows:update", sinon.match.object, sinon.match.object)
    .resolves(mockUpdatedWorkflow);

  requestStub.withArgs("wfm:cloud:data:workflows:read", sinon.match.string)
    .resolves(mockReadWorkflow);

  requestStub.withArgs("wfm:cloud:data:workflows:delete", sinon.match.string)
    .resolves(mockDeletedWorkflow);

  requestStub.throws("Invalid Argument");
  return requestStub;
}

/**
 * Function which mocks the publish functionality of mediator.
 * @returns {stub}
 */
function publish() {
  var publishStub = sinon.stub();
  var doneTopic = "done:wfm:cloud:workflows:";

  publishStub.withArgs(doneTopic + "create:" + mockTopicId, sinon.match.object);
  publishStub.withArgs(doneTopic + "list", sinon.match.object);
  publishStub.withArgs(doneTopic + "update:" + mockTopicId, sinon.match.object);
  publishStub.withArgs(doneTopic + "read:" + mockTopicId, sinon.match.object);
  publishStub.withArgs(doneTopic + "delete:" + mockTopicId, sinon.match.object);

  publishStub.throws("Invalid Argument");
  return publishStub;
}

module.exports = {
  subscribe: subscribe(),
  request: request(),
  publish: publish()
};