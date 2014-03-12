/*    
 * LeapJS-Plugins  - v0.1.3 - 2014-03-12    
 * http://github.com/leapmotion/leapjs-plugins/    
 *    
 * Copyright 2014 LeapMotion, Inc    
 *    
 * Licensed under the Apache License, Version 2.0 (the "License");    
 * you may not use this file except in compliance with the License.    
 * You may obtain a copy of the License at    
 *    
 *     http://www.apache.org/licenses/LICENSE-2.0    
 *    
 * Unless required by applicable law or agreed to in writing, software    
 * distributed under the License is distributed on an "AS IS" BASIS,    
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.    
 * See the License for the specific language governing permissions and    
 * limitations under the License.    
 *    
 */    

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

//CoffeeScript generated from main/hand-hold/leap.hand-hold.coffee
(function() {
  var handHold;

  handHold = function() {
    var extraHandData;
    extraHandData = {};
    return {
      hand: {
        data: function(hashOrKey, value) {
          var key, _name, _results;
          extraHandData[_name = this.id] || (extraHandData[_name] = []);
          if (value) {
            return extraHandData[this.id][hashOrKey] = value;
          } else if (toString.call(hashOrKey) === '[object String]') {
            return extraHandData[this.id][hashOrKey];
          } else {
            _results = [];
            for (key in hashOrKey) {
              value = hashOrKey[key];
              if (value === void 0) {
                _results.push(delete extraHandData[this.id][key]);
              } else {
                _results.push(extraHandData[this.id][key] = value);
              }
            }
            return _results;
          }
        },
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
  } else {
    module.exports.handHold = handHold;
  }

}).call(this);

//CoffeeScript generated from main/leap-plugins-0.1.2.coffee
/*    
 * LeapJS-Plugins  - v0.1.2 - 2014-03-12    
 * http://github.com/leapmotion/leapjs-plugins/    
 *    
 * Copyright 2014 LeapMotion, Inc    
 *    
 * Licensed under the Apache License, Version 2.0 (the "License");    
 * you may not use this file except in compliance with the License.    
 * You may obtain a copy of the License at    
 *    
 *     http://www.apache.org/licenses/LICENSE-2.0    
 *    
 * Unless required by applicable law or agreed to in writing, software    
 * distributed under the License is distributed on an "AS IS" BASIS,    
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.    
 * See the License for the specific language governing permissions and    
 * limitations under the License.    
 *    
 */    

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

//CoffeeScript generated from main/hand-hold/leap.hand-hold.coffee
(function() {
  var handHold;

  handHold = function() {
    var extraHandData;
    extraHandData = {};
    return {
      hand: {
        data: function(hashOrKey, value) {
          var key, _name, _results;
          extraHandData[_name = this.id] || (extraHandData[_name] = []);
          if (value) {
            return extraHandData[this.id][hashOrKey] = value;
          } else if (toString.call(hashOrKey) === '[object String]') {
            return extraHandData[this.id][hashOrKey];
          } else {
            _results = [];
            for (key in hashOrKey) {
              value = hashOrKey[key];
              if (value === void 0) {
                _results.push(delete extraHandData[this.id][key]);
              } else {
                _results.push(extraHandData[this.id][key] = value);
              }
            }
            return _results;
          }
        },
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
  } else {
    module.exports.handHold = handHold;
  }

}).call(this);

//CoffeeScript generated from main/screen-position/leap.screen-position.coffee
/*
Adds the "screenPosition" method by default to hands and pointables.  This returns a vec3 (an array of length 3)
with [x,y,z] screen coordinates indicating where the hand is, originating from the bottom left.
This method can accept an optional vec3, allowing it to convert any arbitrary vec3 of coordinates.

Custom positioning methods can be passed in, allowing different scaling techniques,
e.g., http://msdn.microsoft.com/en-us/library/windows/hardware/gg463319.aspx (Pointer Ballistics)
Here we scale based upon the interaction box and screen size:

options:
  scale, scaleX, and scaleY.  They all default to 1.
  verticalOffset: in pixels.  This number is added to the returned Y value.  Defaults to 0.



controller.use 'screenPosition', {
  method: (positionVec3)->
    Arguments for Leap.vec3 are (out, a, b)
    [
      Leap.vec3.subtract(positionVec3, positionVec3, @frame.interactionBox.center)
      Leap.vec3.divide(positionVec3, positionVec3, @frame.interactionBox.size)
      Leap.vec3.multiply(positionVec3, positionVec3, [document.body.offsetWidth, document.body.offsetHeight, 0])
    ]
}
More info on vec3 can be found, here: http://glmatrix.net/docs/2.2.0/symbols/vec3.html
*/


(function() {
  var screenPosition;

  screenPosition = function(options) {
    var baseScale, baseVerticalOffset, position, positioningMethods;
    if (options == null) {
      options = {};
    }
    options.positioning || (options.positioning = 'absolute');
    options.scale || (options.scale = 1);
    options.scaleX || (options.scaleX = 1);
    options.scaleY || (options.scaleY = 1);
    options.scaleZ || (options.scaleZ = 1);
    options.verticalOffset || (options.verticalOffset = 0);
    baseScale = 6;
    baseVerticalOffset = -100;
    positioningMethods = {
      absolute: function(positionVec3) {
        return [(window.innerWidth / 2) + (positionVec3[0] * baseScale * options.scale * options.scaleX), window.innerHeight + baseVerticalOffset + options.verticalOffset - (positionVec3[1] * baseScale * options.scale * options.scaleY), positionVec3[2] * baseScale * options.scale * options.scaleZ];
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
  };

  if ((typeof Leap !== 'undefined') && Leap.Controller) {
    Leap.Controller.plugin('screenPosition', screenPosition);
  } else {
    module.exports.screenPosition = screenPosition;
  }

}).call(this);

//CoffeeScript generated from main/leap-plugins-0.1.2.min.coffee
/*    
 * LeapJS-Plugins  - v0.1.2 - 2014-03-12    
 * http://github.com/leapmotion/leapjs-plugins/    
 *    
 * Copyright 2014 LeapMotion, Inc    
 *    
 * Licensed under the Apache License, Version 2.0 (the "License");    
 * you may not use this file except in compliance with the License.    
 * You may obtain a copy of the License at    
 *    
 *     http://www.apache.org/licenses/LICENSE-2.0    
 *    
 * Unless required by applicable law or agreed to in writing, software    
 * distributed under the License is distributed on an "AS IS" BASIS,    
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.    
 * See the License for the specific language governing permissions and    
 * limitations under the License.    
 *    
 */    
(function(){var a;a=function(){var a;return a=[],a.remove=function(){for(var a,b,c=arguments,d=c.length;d&&this.length;)for(a=c[--d];-1!==(b=this.indexOf(a));)this.splice(b,1);return this},this.on("deviceDisconnected",function(){var b,c,d,e;for(e=[],c=0,d=a.length;d>c;c++)b=a[c],e.push(this.emit("handLost",this.lastConnectionFrame.hand(b)));return e}),{frame:function(b){var c,d,e,f,g;d=b.hands.map(function(a){return a.id});for(var h=0,i=a.length;i>h;h++)c=a[h],-1==d.indexOf(c)&&(a.remove(c),this.emit("handLost",this.frame(1).hand(c)),h--,i--);for(g=[],e=0,f=d.length;f>e;e++)c=d[e],-1===a.indexOf(c)?(a.push(c),g.push(this.emit("handFound",b.hand(c)))):g.push(void 0);return g}}},"undefined"!=typeof Leap&&Leap.Controller?Leap.Controller.plugin("handEntry",a):module.exports.handEntry=a}).call(this),function(){var a;a=function(){var a;return a={},{hand:{data:function(b,c){var d,e,f;if(a[e=this.id]||(a[e]=[]),c)return a[this.id][b]=c;if("[object String]"===toString.call(b))return a[this.id][b];f=[];for(d in b)c=b[d],f.push(void 0===c?delete a[this.id][d]:a[this.id][d]=c);return f},hold:function(a){return a?this.data({holding:a}):this.hold(this.hovering())},holding:function(){return this.data("holding")},release:function(){var a;return a=this.data("holding"),this.data({holding:void 0}),a},hoverFn:function(a){return this.data({getHover:a})},hovering:function(){var a;return(a=this.data("getHover"))?this._hovering||(this._hovering=a.call(this)):void 0}}}},"undefined"!=typeof Leap&&Leap.Controller?Leap.Controller.plugin("handHold",a):module.exports.handHold=a}.call(this),function(){var a;a=function(a){var b,c,d,e;return null==a&&(a={}),a.positioning||(a.positioning="absolute"),a.scale||(a.scale=1),a.scaleX||(a.scaleX=1),a.scaleY||(a.scaleY=1),a.scaleZ||(a.scaleZ=1),a.verticalOffset||(a.verticalOffset=0),b=6,c=-100,e={absolute:function(d){return[window.innerWidth/2+d[0]*b*a.scale*a.scaleX,window.innerHeight+c+a.verticalOffset-d[1]*b*a.scale*a.scaleY,d[2]*b*a.scale*a.scaleZ]}},d=function(b,c){var d;return null==c&&(c=!1),d="function"==typeof a.positioning?a.positioning.call(this,b):e[a.positioning].call(this,b),c&&(this.screenPositionVec3=d),d},{hand:{screenPosition:function(a){return d.call(this,a||this.stabilizedPalmPosition,!a)}},pointable:{screenPosition:function(a){return d.call(this,a||this.stabilizedTipPosition,!a)}}}},"undefined"!=typeof Leap&&Leap.Controller?Leap.Controller.plugin("screenPosition",a):module.exports.screenPosition=a}.call(this);
//CoffeeScript generated from main/screen-position/leap.screen-position.coffee
/*
Adds the "screenPosition" method by default to hands and pointables.  This returns a vec3 (an array of length 3)
with [x,y,z] screen coordinates indicating where the hand is, originating from the bottom left.
This method can accept an optional vec3, allowing it to convert any arbitrary vec3 of coordinates.

Custom positioning methods can be passed in, allowing different scaling techniques,
e.g., http://msdn.microsoft.com/en-us/library/windows/hardware/gg463319.aspx (Pointer Ballistics)
Here we scale based upon the interaction box and screen size:

options:
  scale, scaleX, and scaleY.  They all default to 1.
  verticalOffset: in pixels.  This number is added to the returned Y value.  Defaults to 0.



controller.use 'screenPosition', {
  method: (positionVec3)->
    Arguments for Leap.vec3 are (out, a, b)
    [
      Leap.vec3.subtract(positionVec3, positionVec3, @frame.interactionBox.center)
      Leap.vec3.divide(positionVec3, positionVec3, @frame.interactionBox.size)
      Leap.vec3.multiply(positionVec3, positionVec3, [document.body.offsetWidth, document.body.offsetHeight, 0])
    ]
}
More info on vec3 can be found, here: http://glmatrix.net/docs/2.2.0/symbols/vec3.html
*/


(function() {
  var screenPosition;

  screenPosition = function(options) {
    var baseScale, baseVerticalOffset, position, positioningMethods;
    if (options == null) {
      options = {};
    }
    options.positioning || (options.positioning = 'absolute');
    options.scale || (options.scale = 1);
    options.scaleX || (options.scaleX = 1);
    options.scaleY || (options.scaleY = 1);
    options.scaleZ || (options.scaleZ = 1);
    options.verticalOffset || (options.verticalOffset = 0);
    baseScale = 6;
    baseVerticalOffset = -100;
    positioningMethods = {
      absolute: function(positionVec3) {
        return [(window.innerWidth / 2) + (positionVec3[0] * baseScale * options.scale * options.scaleX), window.innerHeight + baseVerticalOffset + options.verticalOffset - (positionVec3[1] * baseScale * options.scale * options.scaleY), positionVec3[2] * baseScale * options.scale * options.scaleZ];
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
  };

  if ((typeof Leap !== 'undefined') && Leap.Controller) {
    Leap.Controller.plugin('screenPosition', screenPosition);
  } else {
    module.exports.screenPosition = screenPosition;
  }

}).call(this);
