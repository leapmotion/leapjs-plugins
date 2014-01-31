// Calculates how much a hand has changed pitch in the last few seconds.
Leap.Controller.plugin('sumPitch', function(options) {
  options || (options = {})
  var pitchData = [],
      timeWindow = options.timeWindow || 1; // seconds

  return {
    hand: function(hand) {
      var currentPitch, data, lastPitch, mostDistantTime, now, _i, _len;

      hand.sumPitch = 0;
      if (hand.timeVisible < 1) {
        return;
      }

      lastPitch = hand.data('sumPitch.lastPitch');
      currentPitch = hand.pitch();
      hand.data('sumPitch.lastPitch', currentPitch);

      if (!lastPitch) {
        return;
      }

      // store values with timesstamps
      now = new Date();
      pitchData.push({
        delta: currentPitch - lastPitch,
        time: now
      });

      // manage rolling sum
      mostDistantTime = now.setSeconds(now.getSeconds() - timeWindow);
      while (pitchData[0].time < mostDistantTime) {
        pitchData.shift();
      }

      for (_i = 0, _len = pitchData.length; _i < _len; _i++) {
        data = pitchData[_i];
        hand.sumPitch += Math.abs(data.delta);
      }
    }
  };
});

window.handHoldDemo = $('#hand-hold-demo');

Leap.loop(function(frame) {
  if (frame.hands[0]) {
    return handHoldDemo.html('frame id: ' + frame.id + ' <br/>hand sumPitch: ' + frame.hands[0].sumPitch.toPrecision(3));
  }else{
    return handHoldDemo.html('frame id: ' + frame.id + ' <br/>no hand present.');
  }
});