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
        src: 'lib/**/*.js',
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
};
