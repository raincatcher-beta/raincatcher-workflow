module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    eslint: {
      src: ["lib/**/*.js"]
    },
    mochaTest: {
      test: {
        options: {
          run: true
        },
        src: ['lib/*spec.js']
      }
    }
  });
  grunt.loadNpmTasks("grunt-eslint");
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('unit',['eslint', 'mocha']);
  grunt.registerTask('default', ['unit']);
};