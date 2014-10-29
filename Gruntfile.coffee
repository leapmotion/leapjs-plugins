module.exports = (grunt) ->

  fs = require('fs');


  filename = "leap-plugins-<%= pkg.version %>"
  banner = (project)->
     '/*
    \n * LeapJS-Plugins ' + project + ' - v<%= pkg.version %> - <%= grunt.template.today(\"yyyy-mm-dd\") %>
    \n * http://github.com/leapmotion/leapjs-plugins/
    \n *
    \n * Copyright <%= grunt.template.today(\"yyyy\") %> LeapMotion, Inc
    \n *
    \n * Licensed under the Apache License, Version 2.0 (the "License");
    \n * you may not use this file except in compliance with the License.
    \n * You may obtain a copy of the License at
    \n *
    \n *     http://www.apache.org/licenses/LICENSE-2.0
    \n *
    \n * Unless required by applicable law or agreed to in writing, software
    \n * distributed under the License is distributed on an "AS IS" BASIS,
    \n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    \n * See the License for the specific language governing permissions and
    \n * limitations under the License.
    \n *
    \n */
    \n'

# https://github.com/gruntjs/grunt/issues/315

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    
    'string-replace':
      main:
        files: {
          'main/': 'main/**/*.html'
          './':    'bower.json'
        }
        options: {
          replacements: [
            # bower.json
            {
              pattern: /"version": ".*"/,
              replacement: '"version": "<%= pkg.version %>"'
            },
            # examples
            {
              pattern: /leap-plugins.*\.js/,
              replacement: filename + '.js'
            }
          ]
        }

    coffee:
      main:
        files: [{
          expand: true
          cwd: 'main/'
          src: '**/*.coffee'
          dest: 'main/'
          rename: (task, path, options)->
            task + path.replace('.coffee', '.js')
        }]
      utils:
        files: [{
          expand: true
          cwd: 'util/'
          src: '**/*.coffee'
          dest: 'utils/'
          rename: (task, path, options)->
            task + path.replace('.coffee', '.js')
        }]

    usebanner:
      coffeeMessagesMain:
        options:
          banner: (file) ->
            coffeePath = file.replace('.js', '.coffee')
            if fs.existsSync(coffeePath)
              "//CoffeeScript generated from #{coffeePath}"
            else
              null
        src: "main/**/*.js"
      coffeeMessagesUtils:
        options:
          banner: (file) ->
            coffeePath = file.replace('.js', '.coffee')
            if fs.existsSync(coffeePath)
              "//CoffeeScript generated from #{coffeePath}"
            else
              null
        src: "utils/**/*.js"

      licenseMain:
        options:
          banner: banner('')
        src: "main/#{filename}.js"
      licenseUtils:
        options:
          banner: banner('Extra')
        src: "exras/#{filename}.js"

    clean:
      main:
        src: ["main/leap-plugins-*.js"]
      utils:
        src: ["utils/leap-plugins-*.js"]

    concat:
      main:
        src: 'main/*/*.js'
        dest: "main/#{filename}.js"
      utils:
        src: 'utils/**/*.js'
        dest: "utils/#{filename}-utils.js"

    uglify:
      main:
        options:
           banner: banner('')
        src: "main/#{filename}.js"
        dest: "main/#{filename}.min.js"
      utils:
        options:
          banner: banner('Extra')
        src: "utils/#{filename}-utils.js"
        dest: "utils/#{filename}-utils.min.js"

    bump:
      options:
        pushTo: 'master'


    watch:
      files: ['main/**/*.coffee', 'utils/**/*.coffee'],
      options:
        atBegin: true
      tasks: [
        "string-replace",
        "coffee",
        "usebanner:coffeeMessagesMain",
        "usebanner:coffeeMessagesUtils",
        "clean",
        "concat",
        "usebanner:licenseMain",
        "usebanner:licenseUtils",
        "uglify"
      ]


  require('load-grunt-tasks')(grunt);

  grunt.registerTask "default", [
    "string-replace",
    "coffee",
    "usebanner:coffeeMessagesMain",
    "usebanner:coffeeMessagesUtils",
    "clean",
    "concat",
    "usebanner:licenseMain",
    "usebanner:licenseUtils",
    "uglify"
  ]