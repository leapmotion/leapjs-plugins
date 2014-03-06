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
      recognizedPoses[pose] = options.poses[pose];
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

//CoffeeScript generated from extras/proximity-alert/leap.proximity-alert.coffee
(function() {
  Leap.Controller.plugin('proximityAlert', function(options) {
    var activeOscillator, context, distanceFromSegment, oscillate, panner, playBeep, playContinuous, playingUntil, setPannerPosition, silence;
    if (options == null) {
      options = {};
    }
    options.beepFrq || (options.beepFrq = 1318.51);
    options.continuousFrq || (options.continuousFrq = 1396.91);
    options.waveType || (options.waveType = 0);
    options.beepDuration || (options.beepDuration = function(distance) {
      return Math.pow(0.7 - distance, 3);
    });
    options.minBeepDuration || (options.minBeepDuration = 0.02);
    context = new webkitAudioContext();
    panner = context.createPanner();
    panner.connect(context.destination);
    oscillate = function(freq, duration) {
      var oscillator;
      oscillator = context.createOscillator();
      oscillator.type = options.waveType;
      oscillator.connect(panner);
      oscillator.frequency.value = freq;
      oscillator.start(0);
      if (duration) {
        oscillator.stop(context.currentTime + duration);
      }
      return oscillator;
    };
    playingUntil = void 0;
    activeOscillator = void 0;
    playBeep = function(freq, duration) {
      var spacing;
      spacing = duration / 2;
      if (playingUntil === Infinity) {
        activeOscillator.stop(0);
        activeOscillator = null;
      } else if (context.currentTime < playingUntil) {
        return;
      }
      activeOscillator = oscillate(freq, duration);
      return playingUntil = context.currentTime + duration + spacing;
    };
    playContinuous = function(freq) {
      if (context.currentTime < playingUntil) {
        return;
      }
      activeOscillator = oscillate(freq);
      activeOscillator.continuous = true;
      return playingUntil = Infinity;
    };
    silence = function() {
      if (activeOscillator && activeOscillator.continuous) {
        activeOscillator.stop(0);
        activeOscillator = void 0;
        return playingUntil = void 0;
      }
    };
    distanceFromSegment = function(number, range) {
      if (number > range[1]) {
        return number - range[1];
      }
      if (number < range[0]) {
        return range[0] - number;
      }
      return false;
    };
    setPannerPosition = function(hand) {
      return panner.setPosition(hand.stabilizedPalmPosition[0] / 100, hand.stabilizedPalmPosition[1] / 100, hand.stabilizedPalmPosition[2] / 100);
    };
    this.on('handLost', function() {
      return silence();
    });
    return {
      hand: function(hand) {
        var distance, duration, iBox, proximities, proximity, _i, _len;
        if (!(iBox = hand.frame.interactionBox)) {
          return;
        }
        proximities = iBox.normalizePoint(hand.palmPosition);
        for (_i = 0, _len = proximities.length; _i < _len; _i++) {
          proximity = proximities[_i];
          if ((distance = distanceFromSegment(proximity, [0, 1]))) {
            hand.proximity = true;
            setPannerPosition(hand);
            duration = options.beepDuration(distance);
            if (duration < options.minBeepDuration) {
              playContinuous(options.continuousFrq);
            } else {
              playBeep(options.beepFrq, duration);
            }
            return;
          }
        }
        return silence();
      }
    };
  });

}).call(this);
