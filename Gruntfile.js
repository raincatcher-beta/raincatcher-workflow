module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    eslint: {
      src: ["lib/**/*.js"]
    },
    mochaTest: {
      test: {
        src: ['test/**/*-spec.js'],
        options: {
          reporter: 'spec',
          logErrors: true,
          timeout: 1000,
          run: true
        }
      }
    }
  });
  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('default', ['test']);
};
