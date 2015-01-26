"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      react: {
        files: ['actions/**/*.js', 'dispatcher/**/*.js',
          'views/**/*.js', 'stores/**/*.js', 'util/**/*.js', 'Gruntfile.js'],
        tasks: ['browserify']
      }
    },
    browserify: {
      options: {
        transform: [ require('grunt-react').browserify ]
      },
      client: {
        src: ['views/**/*.js', 'views/**/*.jsx', 'util/**/*.js'],
        dest: 'public/js/app.built.js'
      }
    },
    jshint: {
      all: ['views/**/*.js'],
      options: {
        newcap: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-jsxhint');
  grunt.registerTask('default', ['browserify']);

};
