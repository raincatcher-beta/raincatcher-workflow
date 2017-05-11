var sonarqubeScanner = require('sonarqube-scanner');

module.exports = function(grunt) {
  'use strict';
  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    eslint: {
      src: ["lib/**/*.js"]
    },
    mochaTest: {
      test: {
        src: ['lib/**/*-spec.js'],
        options: {
          reporter: 'Spec',
          logErrors: true,
          timeout: 1000,
          run: true
        }
      }
    },
    mocha_istanbul:{
      coverage: {
        src: 'test',
        options:{
          mask: '*-spec.js'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('default', ['test']);
  grunt.registerTask('coverage', ['mocha_istanbul']);
  grunt.registerTask('sonar',function(cb){
    sonarqubeScanner({
      serverUrl : "https://metrics.skunkhenry.com",
      token : "cm9iZXJ0OnNjb3R0aXNo",
      options : {
        "sonar.projectKey": "raincatcher",
        "sonar.projectName": "fh-wfm",
        "sonar.projectVersion": "0.2.3",
        "sonar.sources":"./lib",
        "sonar.language":"js",
        "sonar.exclusions": "**/node_modules/**/*.js",
        "sonar.login": "robert",
        "sonar.password": "scottish",
        "sonar.analysis.mode":"preview"
 }
    }, cb);
  });
};
