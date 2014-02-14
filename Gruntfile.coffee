module.exports = (grunt) ->

  filename = "<%= pkg.name %>-<%= pkg.version %>"
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
      extras:
        files: [{
          expand: true
          cwd: 'extras/'
          src: '**/*.coffee'
          dest: 'extras/'
          rename: (task, path, options)->
            task + path.replace('.coffee', '.js')
        }]

    usebanner:
      main:
        options:
          banner: (file) -> "//CoffeeScript generated from #{file.replace('.js', '.coffee')}"
        src: "main/**/*.js"

    clean:
      main:
        src: ['main/leapjs-plugins-0.1.0.js', 'main/leapjs-plugins-0.1.0.min.js']
      extras:
        src: ['extras/leapjs-plugins-0.1.0-extras.js', 'extras/leapjs-plugins-0.1.0-extras.min.js']

    concat:
      main:
        options:
          banner: banner('')
        src: 'main/**/*.js'
        dest: "main/#{filename}.js"
      extras:
        options:
          banner: banner('Extra')
        src: 'extras/**/*.js'
        dest: "extras/#{filename}-extras.js"

    uglify:
      main:
        options:
           banner: banner('')
        src: "main/#{filename}.js"
        dest: "main/#{filename}.min.js"
      extras:
        options:
          banner: banner('Extra')
        src: "extras/#{filename}-extras.js"
        dest: "extras/#{filename}-extras.min.js"


  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks 'grunt-banner'

  grunt.registerTask "default", ["coffee",  "usebanner", "clean", "concat", "uglify"]
