var CONSTANTS = require('../constants');
var formatString = require('string-template');
var config = require('../config');

/**
 *
 * Generating a topic
 *
 * @param topicOptions
 * @param topicOptions.template  - (Optional) The template to use to format the topic
 * @param topicOptions.prefix    - The topic prefix (error, done)
 * @param topicOptions.datasetId - The ID of the dataset to publish for
 * @param topicOptions.topicName - The name of the dataset
 * @param topicOptions.topicUid  - The unique ID of the topic being publisheds
 * @returns {string}
 */
function createTopic(topicOptions) {

  var topic = formatString(topicOptions.template || CONSTANTS.WORKFLOW_TOPIC_TEMPLATE, topicOptions);

  if (topicOptions.topicUid) {
    topic += CONSTANTS.TOPIC_SEPARATOR + topicOptions.topicUid;
  }

  return topic;
}

module.exports.createTopic = createTopic;

/**
 *
 * Generating an error topic
 *
 * @param topicOptions
 * @param topicOptions.datasetId - The ID of the dataset to publish for
 * @param topicOptions.topicName - The name of the dataset
 * @param topicOptions.topicUid  - The unique ID of the topic being published
 * @returns {string}
 */
module.exports.errorTopic = function generateErrorMediatorTopic(topicOptions) {
  topicOptions.template = CONSTANTS.WORKFLOW_ERROR_TOPIC_TEMPLATE;
  return createTopic(topicOptions);
};

/**
 *
 * Generating a completion topic
 *
 * @param topicOptions
 * @param topicOptions.datasetId - The ID of the dataset to publish for
 * @param topicOptions.topicName - The name of the dataset
 * @param topicOptions.topicUid  - The unique ID of the topic being published
 * @returns {string}
 */
module.exports.doneTopic = function generateDoneMediatorTopic(topicOptions) {
  topicOptions.template = CONSTANTS.WORKFLOW_DONE_TOPIC_TEMPLATE;
  return createTopic(topicOptions);
};

/**
 *
 * Generating a sync topic
 *
 * @param topicOptions
 * @param topicOptions.datasetId - The ID of the dataset to publish for
 * @param topicOptions.topicName - The name of the dataset
 * @param topicOptions.topicUid  - The unique ID of the topic being published
 * @returns {string}
 */
module.exports.syncTopic = function generateSyncMediatorTopic(topicOptions) {
  topicOptions.template = CONSTANTS.SYNC_TOPIC_TEMPLATE;
  topicOptions.datasetId = config.datasetId;
  return createTopic(topicOptions);
};

/**
 *
 * Generating a sync error topic
 *
 * @param topicOptions
 * @param topicOptions.datasetId - The ID of the dataset to publish for
 * @param topicOptions.topicName - The name of the dataset
 * @param topicOptions.topicUid  - The unique ID of the topic being published
 * @returns {string}
 */
module.exports.syncErrorTopic = function generateSyncErrorMediatorTopic(topicOptions) {
  topicOptions.template = CONSTANTS.SYNC_ERROR_TOPIC_TEMPLATE;
  topicOptions.datasetId = config.datasetId;
  return createTopic(topicOptions);
};

/**
 *
 * Generating a sync completion topic
 *
 * @param topicOptions
 * @param topicOptions.datasetId - The ID of the dataset to publish for
 * @param topicOptions.topicName - The name of the dataset
 * @param topicOptions.topicUid  - The unique ID of the topic being published
 * @returns {string}
 */
module.exports.syncDoneTopic = function generateSyncDoneMediatorTopic(topicOptions) {
  topicOptions.template = CONSTANTS.SYNC_DONE_TOPIC_TEMPLATE;
  topicOptions.datasetId = config.datasetId;
  return createTopic(topicOptions);
};
