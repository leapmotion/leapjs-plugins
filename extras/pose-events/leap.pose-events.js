//CoffeeScript generated from extras/pose-events/leap.pose-events.coffee
(function() {
  Leap.Controller.plugin('poseEvents', function(options) {
    var pose, recognizedPoses, test, _ref;
    if (options == null) {
      options = {};
    }
    recognizedPoses = {
      'fist': function(hand) {
        return hand.sphereRadius < 50 || hand.grabStrength > 0.8;
      },
      'open': function(hand) {
        return hand.sphereRadius > 100;
      },
      'pinch': function(hand) {
        return hand.pinchStrength > 60;
      },
      'point': function(hand) {
        var finger;
        return hand.data('active' && ((function() {
          var _i, _len, _ref, _results;
          if (finger.active()) {
            _ref = hand.fingers;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              finger = _ref[_i];
              _results.push(finger);
            }
            return _results;
          }
        })()).length === 1);
      }
    };
    _ref = options.poses;
    for (pose in _ref) {
      test = _ref[pose];
      recognizedPoses[pose] = test;
    }
    return {
      hand: function(hand) {
        var _ref1;
        _ref1 = options.recognizedPoses;
        for (pose in _ref1) {
          test = _ref1[pose];
          if (test(hand)) {
            if (!hand.data(pose)) {
              this.emit(pose + '.start', hand);
            }
            hand.data(pose, true);
          } else {
            if (hand.data(pose)) {
              this.emit(pose + '.end', hand);
              hand.data(pose, void 0);
            }
          }
        }
        if (hand.data(pose)) {
          return this.emit(pose + '.move', hand);
        }
      }
    };
  });

}).call(this);
