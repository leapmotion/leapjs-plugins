//CoffeeScript generated from main/hand-splay/leap.hand-splay.coffee
(function() {
  Leap.Controller.plugin('handSplay', function(scope) {
    if (scope == null) {
      scope = {};
    }
    scope.splayThreshold || (scope.splayThreshold = 0.65);
    scope.requiredFingers || (scope.requiredFingers = 4);
    this.use('handHold');
    return {
      hand: function(hand) {
        var avgPalmDot, finger, palmDot, straightenedFingerCount, _i, _len, _ref;
        palmDot = null;
        avgPalmDot = 0;
        straightenedFingerCount = 0;
        _ref = hand.fingers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          finger = _ref[_i];
          palmDot = Leap.vec3.dot(hand.direction, finger.direction);
          avgPalmDot += palmDot;
          if (palmDot > scope.splayThreshold) {
            straightenedFingerCount++;
          }
        }
        avgPalmDot += 0.5 * (5 - hand.fingers.length);
        avgPalmDot /= 5;
        hand.data('handSplay.splay', avgPalmDot);
        hand.data('handSplay.splayedFingers', straightenedFingerCount);
        if (avgPalmDot > scope.splayThreshold || straightenedFingerCount >= scope.requiredFingers) {
          if (!hand.data('handSplay.splayed')) {
            hand.data({
              'handSplay.splayed': true
            });
            return this.emit('handSplay', hand);
          }
        } else {
          if (hand.data('handSplay.splayed')) {
            this.emit('handUnsplay', hand);
            return hand.data({
              'handSplay.splayed': false
            });
          }
        }
      }
    };
  });

}).call(this);
