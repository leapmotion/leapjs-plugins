//CoffeeScript generated from main/hand-entry/leap.hand-entry.coffee
/*
Emits controller events when a hand enters of leaves the frame
"handLost" and "handFound"
Each event also includes the hand object, which will be invalid for the handLost event.
*/


(function() {
  var handEntry;

  handEntry = function() {
    var activeHandIds;
    activeHandIds = [];
    activeHandIds.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  };
    this.on("deviceDisconnected", function() {
      var id, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = activeHandIds.length; _i < _len; _i++) {
        id = activeHandIds[_i];
        _results.push(this.emit('handLost', this.lastConnectionFrame.hand(id)));
      }
      return _results;
    });
    return {
      frame: function(frame) {
        var id, newValidHandIds, _i, _len, _results;
        newValidHandIds = frame.hands.map(function(hand) {
          return hand.id;
        });
        for (var i = 0, len = activeHandIds.length; i < len; i++){
        id = activeHandIds[i];
        if(  newValidHandIds.indexOf(id) == -1){
          activeHandIds.remove(id)
          // this gets executed before the current frame is added to the history.
          this.emit('handLost', this.frame(1).hand(id))
          i--;
          len--;
        }
      };
        _results = [];
        for (_i = 0, _len = newValidHandIds.length; _i < _len; _i++) {
          id = newValidHandIds[_i];
          if (activeHandIds.indexOf(id) === -1) {
            activeHandIds.push(id);
            _results.push(this.emit('handFound', frame.hand(id)));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      }
    };
  };

  if ((typeof Leap !== 'undefined') && Leap.Controller) {
    Leap.Controller.plugin('handEntry', handEntry);
  } else {
    module.exports.handEntry = handEntry;
  }

}).call(this);
