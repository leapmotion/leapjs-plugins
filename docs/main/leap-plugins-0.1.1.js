/*    
 * LeapJS-Plugins  - v0.1.1 - 2014-02-26    
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
    var previousHandIds;
    previousHandIds = [];
    previousHandIds.remove = function() {
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
      for (_i = 0, _len = previousHandIds.length; _i < _len; _i++) {
        id = previousHandIds[_i];
        _results.push(this.emit('handLost', this.lastConnectionFrame.hand(id)));
      }
      return _results;
    });
    return {
      frame: function(frame) {
        var id, newValidHandIds, _i, _j, _len, _len1, _results;
        newValidHandIds = frame.hands.map(function(hand) {
          return hand.id;
        });
        for (_i = 0, _len = previousHandIds.length; _i < _len; _i++) {
          id = previousHandIds[_i];
          if (newValidHandIds.indexOf(id) === -1) {
            previousHandIds.remove(id);
            this.emit('handLost', this.lastConnectionFrame.hand(id));
          }
        }
        _results = [];
        for (_j = 0, _len1 = newValidHandIds.length; _j < _len1; _j++) {
          id = newValidHandIds[_j];
          if (previousHandIds.indexOf(id) === -1) {
            previousHandIds.push(id);
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

//CoffeeScript generated from main/leapjs-plugins-0.1.1.coffee
/*    
 * LeapJS-Plugins  - v0.1.1 - 2014-02-11    
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

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

//Filename: 'main/hand-entry/leap.hand-entry.js'
/*
Emits controller events when a hand enters of leaves the frame
"handLost" and "handFound"
Each event also includes the hand object, which will be invalid for the handLost event.
*/


(function() {
  var handEntry;

  handEntry = function() {
    var previousHandIds;
    previousHandIds = [];
    previousHandIds.remove = function() {
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
      for (_i = 0, _len = previousHandIds.length; _i < _len; _i++) {
        id = previousHandIds[_i];
        _results.push(this.emit('handLost', this.lastConnectionFrame.hand(id)));
      }
      return _results;
    });
    return {
      frame: function(frame) {
        var id, newValidHandIds, _i, _j, _len, _len1, _results;
        newValidHandIds = frame.hands.map(function(hand) {
          return hand.id;
        });
        for (_i = 0, _len = previousHandIds.length; _i < _len; _i++) {
          id = previousHandIds[_i];
          if (newValidHandIds.indexOf(id) === -1) {
            previousHandIds.remove(id);
            this.emit('handLost', this.lastConnectionFrame.hand(id));
          }
        }
        _results = [];
        for (_j = 0, _len1 = newValidHandIds.length; _j < _len1; _j++) {
          id = newValidHandIds[_j];
          if (previousHandIds.indexOf(id) === -1) {
            previousHandIds.push(id);
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


//Filename: 'main/hand-hold/leap.hand-hold.js'
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


//Filename: 'main/screen-position/leap.screen-position.js'
/*
Adds the "screenPosition" method by default to hands and pointables.  This returns a vec3 (an array of length 3)
with [x,y,z] screen coordinates indicating where the hand is, originating from the bottom left.
This method can accept an optional vec3, allowing it to convert any arbitrary vec3 of coordinates.

Custom positioning methods can be passed in, allowing different scaling techniques,
e.g., http://msdn.microsoft.com/en-us/library/windows/hardware/gg463319.aspx (Pointer Ballistics)
Here we scale based upon the interaction box and screen size:

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
    var position, positioningMethods;
    if (options == null) {
      options = {};
    }
    options.positioning || (options.positioning = 'absolute');
    options.scale || (options.scale = 8);
    options.verticalOffset || (options.verticalOffset = -100);
    positioningMethods = {
      absolute: function(positionVec3) {
        return [(window.innerWidth / 2) + (positionVec3[0] * options.scale), (window.innerHeight / 2) + ((positionVec3[1] + options.verticalOffset) * options.scale), 0];
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

},{}]},{},[1])
//CoffeeScript generated from main/leapjs-plugins-0.1.1.min.coffee
/*    
 * LeapJS-Plugins  - v0.1.1 - 2014-02-11    
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
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b){(function(){var a;a=function(){var a;return a=[],a.remove=function(){for(var a,b,c=arguments,d=c.length;d&&this.length;)for(a=c[--d];-1!==(b=this.indexOf(a));)this.splice(b,1);return this},this.on("deviceDisconnected",function(){var b,c,d,e;for(e=[],c=0,d=a.length;d>c;c++)b=a[c],e.push(this.emit("handLost",this.lastConnectionFrame.hand(b)));return e}),{frame:function(b){var c,d,e,f,g,h,i;for(d=b.hands.map(function(a){return a.id}),e=0,g=a.length;g>e;e++)c=a[e],-1===d.indexOf(c)&&(a.remove(c),this.emit("handLost",this.lastConnectionFrame.hand(c)));for(i=[],f=0,h=d.length;h>f;f++)c=d[f],-1===a.indexOf(c)?(a.push(c),i.push(this.emit("handFound",b.hand(c)))):i.push(void 0);return i}}},"undefined"!=typeof Leap&&Leap.Controller?Leap.Controller.plugin("handEntry",a):b.exports.handEntry=a}).call(this),function(){var a;a=function(){var a;return a={},{hand:{data:function(b,c){var d,e,f;if(a[e=this.id]||(a[e]=[]),c)return a[this.id][b]=c;if("[object String]"===toString.call(b))return a[this.id][b];f=[];for(d in b)c=b[d],f.push(void 0===c?delete a[this.id][d]:a[this.id][d]=c);return f},hold:function(a){return a?this.data({holding:a}):this.hold(this.hovering())},holding:function(){return this.data("holding")},release:function(){var a;return a=this.data("holding"),this.data({holding:void 0}),a},hoverFn:function(a){return this.data({getHover:a})},hovering:function(){var a;return(a=this.data("getHover"))?this._hovering||(this._hovering=a.call(this)):void 0}}}},"undefined"!=typeof Leap&&Leap.Controller?Leap.Controller.plugin("handHold",a):b.exports.handHold=a}.call(this),function(){var a;a=function(a){var b,c;return null==a&&(a={}),a.positioning||(a.positioning="absolute"),a.scale||(a.scale=8),a.verticalOffset||(a.verticalOffset=-100),c={absolute:function(b){return[window.innerWidth/2+b[0]*a.scale,window.innerHeight/2+(b[1]+a.verticalOffset)*a.scale,0]}},b=function(b,d){var e;return null==d&&(d=!1),e="function"==typeof a.positioning?a.positioning.call(this,b):c[a.positioning].call(this,b),d&&(this.screenPositionVec3=e),e},{hand:{screenPosition:function(a){return b.call(this,a||this.stabilizedPalmPosition,!a)}},pointable:{screenPosition:function(a){return b.call(this,a||this.stabilizedTipPosition,!a)}}}},"undefined"!=typeof Leap&&Leap.Controller?Leap.Controller.plugin("screenPosition",a):b.exports.screenPosition=a}.call(this)},{}]},{},[1]);
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
    options.verticalOffset || (options.verticalOffset = 0);
    baseScale = 6;
    baseVerticalOffset = -100;
    positioningMethods = {
      absolute: function(positionVec3) {
        return [(window.innerWidth / 2) + (positionVec3[0] * baseScale * options.scale * options.scaleX), window.innerHeight + baseVerticalOffset + options.verticalOffset - (positionVec3[1] * baseScale * options.scale * options.scaleY), 0];
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
