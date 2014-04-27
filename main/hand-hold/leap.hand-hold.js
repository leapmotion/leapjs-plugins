//CoffeeScript generated from main/hand-hold/leap.hand-hold.coffee
(function() {
  var handHold;

  handHold = function() {
    var dataMethod, frameObjectData;
    frameObjectData = {};
    dataMethod = function(hashOrKey, value) {
      var key, objectData, _name;
      objectData = frameObjectData[_name = this.id] || (frameObjectData[_name] = []);
      if (value && (value["default"] === void 0)) {
        return objectData[hashOrKey] = value;
      } else if (toString.call(hashOrKey) === '[object String]') {
        if (!objectData[hashOrKey] && (value && value["default"])) {
          return objectData[hashOrKey] = value["default"];
        } else {
          return objectData[hashOrKey];
        }
      } else {
        for (key in hashOrKey) {
          value = hashOrKey[key];
          if (value === void 0) {
            delete objectData[key];
          } else {
            objectData[key] = value;
          }
        }
        return hashOrKey;
      }
    };
    return {
      pointable: {
        data: dataMethod
      },
      hand: {
        data: dataMethod,
        hold: function(object) {
          if (object) {
            return this.data({
              holding: object
            });
          } else {
            return this.hold(this.hovering());
          }
        },
        holding: function() {
          return this.data('holding');
        },
        release: function() {
          var release;
          release = this.data('holding');
          this.data({
            holding: void 0
          });
          return release;
        },
        hoverFn: function(getHover) {
          return this.data({
            getHover: getHover
          });
        },
        hovering: function() {
          var getHover;
          if (getHover = this.data('getHover')) {
            return this._hovering || (this._hovering = getHover.call(this));
          }
        }
      }
    };
  };

  if ((typeof Leap !== 'undefined') && Leap.Controller) {
    Leap.Controller.plugin('handHold', handHold);
  } else if (typeof module !== 'undefined') {
    module.exports.handHold = handHold;
  } else {
    throw 'leap.js not included';
  }

}).call(this);
