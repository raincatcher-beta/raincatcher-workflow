module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);
  grunt.initConfig({
    eslint: {
      src: ["lib/**/*.js"]
    },
    mocha_istanbul: {
      coveralls: {
        src: ['test/**/*.js'],
        options: {
          coverage: true,
          root: './lib',
          reportFormats: ['lcovonly']
        }
      }
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
  grunt.event.on('coverage',function(lcov,done){
    require('coveralls').handleInput(lcov,function(err){
      if (err){
        return done(err);
      }
      done();
    });
  });
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.registerTask('coveralls',['mocha_istanbul:coveralls']);
  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('default', ['test','coveralls']);
};
