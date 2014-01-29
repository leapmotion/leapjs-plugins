(function() {
  Leap.plugin('screenPosition', function(options) {
    var position_methods, positioning, previousPosition;
    positioning = options.positioning || 'absolute';
    previousPosition = void 0;
    position_methods = {
      absolute: function(vec3) {
        var scale, vertical_offset;
        scale = 8;
        vertical_offset = -150;
        return previousPosition = {
          x: (document.body.offsetWidth / 2) + (vec3[0] * scale),
          y: (document.body.offsetHeight / 2) + ((vec3[1] + vertical_offset) * scale * -1)
        };
      }
    };
    return {
      hand: {
        screenPosition: function() {
          if (typeof positioning === 'function') {
            return positioning(this.stabilizedTipPosition);
          } else {
            return position_methods[positioning](this.stabilizedTipPosition);
          }
        }
      },
      pointable: {
        screenPosition: function() {
          if (typeof positioning === 'function') {
            return positioning(this.stabilizedTipPosition);
          } else {
            return position_methods[positioning](this.stabilizedTipPosition);
          }
        }
      }
    };
  });

}).call(this);
