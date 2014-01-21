Leap.Controller.plugin('sumPitch', function() {
  var pitchDeltas, timeWindow;
  timeWindow = 1;
  pitchDeltas = [];
  return {
    hand: function(hand) {
      var currentPitch, delta, lastPitch, mostDistantTime, now, _i, _len, _results;
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
      now = new Date();
      pitchDeltas.push({
        delta: currentPitch - lastPitch,
        time: now
      });
      mostDistantTime = now.setSeconds(now.getSeconds() - timeWindow);
      while (pitchDeltas[0].time < mostDistantTime) {
        pitchDeltas.shift();
      }
      _results = [];
      for (_i = 0, _len = pitchDeltas.length; _i < _len; _i++) {
        delta = pitchDeltas[_i];
        _results.push(hand.sumPitch += Math.abs(delta.delta));
      }
      return _results;
    }
  };
});

window.demo = $('#demo');

Leap.loop(function(frame) {
  if (frame.hands[0]) {
    return demo.html('frame id: ' + frame.id + ' <br/>hand sumPitch: ' + frame.hands[0].sumPitch.toPrecision(3));
  }else{
    return demo.html('frame id: ' + frame.id + ' <br/>no hand present.');
  }
});