module.exports = (grunt) ->

  filename = "<%= pkg.name %>-<%= pkg.version %>"
  banner = (project)->
    "/*!
    \n * LeapJS-Plugins #{project}- v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>
    \n * http://github.com/leapmotion/leapjs-plugins/
    \n *
    \n * Copyright 2014 LeapMotion, Inc. and other contributors
    \n * Released under the BSD-2-Clause license
    \n * http://github.com/leapmotion/leapjs-plugins/blob/master/LICENSE
    \n */
    \n"

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    coffee:
      options:
        banner: 'test'
      dynamic_mappings:
        files: [{
          expand: true
          cwd: 'main/'
          src: '**/*.coffee'
          dest: 'main/'
          ext: '.js'
        }]

    clean:
      main:
        src: ['main/leapjs-plugins-0.1.0.js', 'main/leapjs-plugins-0.1.0.min.js']
      extras:
        src: ['extras/leapjs-plugins-0.1.0-extras.js', 'extras/leapjs-plugins-0.1.0-extras.min.js']

    concat:
      options:
        process: (src, filepath) ->
          "\n//Filename: '#{filepath}'\n#{src}"
      main:
        options:
          banner: banner(' ')
        src: 'main/**/*.js'
        dest: "main/#{filename}.js"
      extras:
        options:
          banner: banner('Extra ')
        src: 'extras/**/*.js'
        dest: "extras/#{filename}-extras.js"

    uglify:
      main:
        src: "main/#{filename}.js"
        dest: "main/#{filename}.min.js"
      extras:
        src: "extras/#{filename}-extras.js"
        dest: "extras/#{filename}-extras.min.js"


  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks "grunt-contrib-uglify"

  grunt.registerTask "default", ["coffee", "clean", "concat", "uglify"]