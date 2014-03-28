//CoffeeScript generated from main/version-check/leap.version-check.coffee
(function() {
  var versionCheck;

  versionCheck = function(scope) {
    scope.alert || (scope.alert = false);
    scope.requiredProtocolVerion || (scope.requiredProtocolVerion = 6);
    scope.disconnect || (scope.disconnect = true);
    this.on('ready', function() {
      var current, required;
      required = scope.requiredProtocolVerion;
      current = this.connection.opts.requestProtocolVersion;
      if (current < required) {
        console.warn("Protocol Version too old. v" + required + " required, v" + current + " available.");
        this.emit('versionCheck.outdated', {
          required: required,
          current: current,
          disconnect: scope.disconnect
        });
        if (scope.disconnect) {
          clearInterval(this.connection.reconnectionTimer);
          this.disconnect();
        }
        if (scope.alert) {
          return alert("Your Leap Software version is out of date.  Visit http://www.leapmotion.com/setup to update");
        }
      }
    });
    return {};
  };

  if ((typeof Leap !== 'undefined') && Leap.Controller) {
    Leap.Controller.plugin('versionCheck', versionCheck);
  } else if (typeof module !== 'undefined') {
    module.exports.versionCheck = versionCheck;
  } else {
    throw 'leap.js not included';
  }

}).call(this);
