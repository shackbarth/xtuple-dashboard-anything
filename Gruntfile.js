"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      react: {
        files: ['views/**/*.js', 'util/**/*.js', 'Gruntfile.js'],
        tasks: ['browserify']
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          debug: true, // sourcemaps
          extensions: ['.jsx', '.js'] // consider jsx files as modules
        },
        transform: [ require("6to5ify") ]
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
