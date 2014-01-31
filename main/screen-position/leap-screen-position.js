(function() {
  Leap.plugin('screenPosition', function(options) {
    var position, position_methods, positioning;
    positioning = options.positioning || 'absolute';
    position = function(vec3) {
      if (typeof positioning === 'function') {
        return positioning.call(this, vec3);
      } else {
        return position_methods[positioning].call(this, vec3);
      }
    };
    position_methods = {
      absolute: function(vec3) {
        var scale, vertical_offset;
        scale = 8;
        vertical_offset = -150;
        return this._screenPosition || (this._screenPosition = {
          x: (document.body.offsetWidth / 2) + (vec3[0] * scale),
          y: (document.body.offsetHeight / 2) + ((vec3[1] + vertical_offset) * scale * -1)
        });
      }
    };
    return {
      hand: {
        screenPosition: function(vec3) {
          return position.call(this, vec3 || this.stabilizedPalmPosition);
        }
      },
      pointable: {
        screenPosition: function(vec3) {
          return position.call(this, vec3 || this.stabilizedTipPosition);
        }
      }
    };
  });

}).call(this);
