//CoffeeScript generated from extras/proximity-alert/leap.proximity-alert.coffee
(function() {
  Leap.Controller.plugin('proximityAlert', function(scope) {
    var activeOscillator, context, distanceFromSegment, masterGain, oscillate, panner, playBeep, playContinuous, playingUntil, setPannerPosition, silence;
    if (scope == null) {
      scope = {};
    }
    scope.beepFrq || (scope.beepFrq = 1318.51);
    scope.continuousFrq || (scope.continuousFrq = 1396.91);
    scope.waveType || (scope.waveType = 0);
    scope.beepDuration || (scope.beepDuration = function(distance) {
      return Math.pow(0.7 - distance, 3);
    });
    scope.minBeepDuration || (scope.minBeepDuration = 0.02);
    context = new webkitAudioContext();
    panner = context.createPanner();
    masterGain = context.createGain();
    masterGain.connect(context.destination);
    panner.connect(masterGain);
    scope.setVolume = function(value) {
      return masterGain.gain.value = value;
    };
    oscillate = function(freq, duration) {
      var oscillator;
      oscillator = context.createOscillator();
      oscillator.type = scope.waveType;
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
            duration = scope.beepDuration(distance);
            if (duration < scope.minBeepDuration) {
              playContinuous(scope.continuousFrq);
            } else {
              playBeep(scope.beepFrq, duration);
            }
            return;
          }
        }
        return silence();
      }
    };
  });

}).call(this);
