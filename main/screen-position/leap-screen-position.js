(function() {
  Leap.plugin('screenPosition', function(options) {
    var position, positioningMethods;
    if (options == null) {
      options = {};
    }
    options.positioning || (options.positioning = 'absolute');
    options.scale || (options.scale = 8);
    options.verticalOffset || (options.verticalOffset = -250);
    positioningMethods = {
      absolute: function(positionVec3) {
        return [(document.body.offsetWidth / 2) + (positionVec3[0] * options.scale), (document.body.offsetHeight / 2) + ((positionVec3[1] + options.verticalOffset) * options.scale * -1), 0];
      }
    };
    position = function(vec3, memoize) {
      var screenPositionVec3;
      if (memoize == null) {
        memoize = false;
      }
      screenPositionVec3 = typeof options.positioning === 'function' ? options.positioning.call(this, vec3) : positioningMethods[options.positioning].call(this, vec3);
      if (memoize) {
        this.screenPositionVec3 = screenPositionVec3;
      }
      return screenPositionVec3;
    };
    return {
      hand: {
        screenPosition: function(vec3) {
          return position.call(this, vec3 || this.stabilizedPalmPosition, !vec3);
        }
      },
      pointable: {
        screenPosition: function(vec3) {
          return position.call(this, vec3 || this.stabilizedTipPosition, !vec3);
        }
      }
    };
  });

}).call(this);
