# to run this: coffee node.coffee -n

leap = require('leapjs')
plugins = require('../main/leapjs-plugins-0.1.1.js')

controller = new leap.Controller(inNode: true)

controller.use(plugins.handHold)

console.log controller._pluginPipelineSteps
console.log controller._pluginExtendedMethods