var topicGenerators = require('./index');
var expect = require('chai').expect;

describe("Topic Generators", function() {

  describe("Workflows Topics", function() {

    describe("createTopic", function() {

      it("No Item ID", function() {
        var generatedTopic = topicGenerators.createTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("wfm:workflows:testtopicname");
      });

      it("Item ID", function() {
        var generatedTopic = topicGenerators.createTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("wfm:workflows:testtopicname:testdatasetitemid");
      });

    });

    describe("errorTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.errorTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("error:wfm:workflows:testtopicname");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.errorTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("error:wfm:workflows:testtopicname:testdatasetitemid");
      });

    });

    describe("doneTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.doneTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("done:wfm:workflows:testtopicname");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.doneTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("done:wfm:workflows:testtopicname:testdatasetitemid");
      });

    });

  });

  describe("Sync Topics", function() {

    describe("createTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("wfm:sync:testtopicname:workflows");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("wfm:sync:testtopicname:workflows:testdatasetitemid");
      });

    });

    describe("errorTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncErrorTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("error:wfm:sync:testtopicname:workflows");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncErrorTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("error:wfm:sync:testtopicname:workflows:testdatasetitemid");
      });

    });

    describe("doneTopic", function() {

      it("No Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncDoneTopic({
          topicName: "testtopicname"
        });

        expect(generatedTopic).to.equal("done:wfm:sync:testtopicname:workflows");
      });

      it("Unique Topic ID", function() {
        var generatedTopic = topicGenerators.syncDoneTopic({
          topicName: "testtopicname",
          topicUid: "testdatasetitemid"
        });

        expect(generatedTopic).to.equal("done:wfm:sync:testtopicname:workflows:testdatasetitemid");
      });

    });

  });
});



