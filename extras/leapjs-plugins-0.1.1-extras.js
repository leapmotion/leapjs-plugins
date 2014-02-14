
//Filename: 'extras/leapjs-plugins-0.1.0-extras.min.js'
/*    
 * LeapJS-Plugins Extra - v0.1.0 - 2014-02-13    
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
(function(){Leap.Controller.plugin("proximityAlert",function(a){var b,c,d,e,f,g,h,i,j,k;return null==a&&(a={}),a.beepFrq||(a.beepFrq=1318.51),a.continuousFrq||(a.continuousFrq=1396.91),a.waveType||(a.waveType=0),a.beepDuration||(a.beepDuration=function(a){return Math.pow(.7-a,3)}),a.minBeepDuration||(a.minBeepDuration=.02),c=new webkitAudioContext,f=c.createPanner(),f.connect(c.destination),e=function(b,d){var e;return e=c.createOscillator(),e.type=a.waveType,e.connect(f),e.frequency.value=b,e.start(0),d&&e.stop(c.currentTime+d),e},i=void 0,b=void 0,g=function(a,d){var f;if(f=d/2,1/0===i)b.stop(0),b=null;else if(c.currentTime<i)return;return b=e(a,d),i=c.currentTime+d+f},h=function(a){return c.currentTime<i?void 0:(b=e(a),b.continuous=!0,i=1/0)},k=function(){return b&&b.continuous?(b.stop(0),b=void 0,i=void 0):void 0},d=function(a,b){return a>b[1]?a-b[1]:a<b[0]?b[0]-a:!1},j=function(a){return f.setPosition(a.stabilizedPalmPosition[0]/100,a.stabilizedPalmPosition[1]/100,a.stabilizedPalmPosition[2]/100)},this.on("handLost",function(){return k()}),{hand:function(b){var c,e,f,i,l,m,n;if(f=b.frame.interactionBox){for(i=f.normalizePoint(b.palmPosition),m=0,n=i.length;n>m;m++)if(l=i[m],c=d(l,[0,1]))return b.proximity=!0,j(b),e=a.beepDuration(c),void(e<a.minBeepDuration?h(a.continuousFrq):g(a.beepFrq,e));return k()}}}})}).call(this);

//Filename: 'extras/proximity-alert/leap.proximity-alert.js'
(function() {
  Leap.Controller.plugin('proximityAlert', function(options) {
    var activeOscillator, context, distanceFromSegment, oscillate, panner, playBeep, playContinuous, playingUntil, setPannerPosition, silence;
    if (options == null) {
      options = {};
    }
    options.beepFrq || (options.beepFrq = 1318.51);
    options.continuousFrq || (options.continuousFrq = 1396.91);
    options.waveType || (options.waveType = 0);
    options.beepDuration || (options.beepDuration = function(distance) {
      return Math.pow(0.7 - distance, 3);
    });
    options.minBeepDuration || (options.minBeepDuration = 0.02);
    context = new webkitAudioContext();
    panner = context.createPanner();
    panner.connect(context.destination);
    oscillate = function(freq, duration) {
      var oscillator;
      oscillator = context.createOscillator();
      oscillator.type = options.waveType;
      oscillator.connect(panner);
      oscillator.frequency.value = freq;
      oscillator.start(0);
      if (duration) {
        oscillator.stop(context.currentTime + duration);
      }
      return oscillator;
    };
    playingUntil = void 0;
    activeOscillator = void 0;
    playBeep = function(freq, duration) {
      var spacing;
      spacing = duration / 2;
      if (playingUntil === Infinity) {
        activeOscillator.stop(0);
        activeOscillator = null;
      } else if (context.currentTime < playingUntil) {
        return;
      }
      activeOscillator = oscillate(freq, duration);
      return playingUntil = context.currentTime + duration + spacing;
    };
    playContinuous = function(freq) {
      if (context.currentTime < playingUntil) {
        return;
      }
      activeOscillator = oscillate(freq);
      activeOscillator.continuous = true;
      return playingUntil = Infinity;
    };
    silence = function() {
      if (activeOscillator && activeOscillator.continuous) {
        activeOscillator.stop(0);
        activeOscillator = void 0;
        return playingUntil = void 0;
      }
    };
    distanceFromSegment = function(number, range) {
      if (number > range[1]) {
        return number - range[1];
      }
      if (number < range[0]) {
        return range[0] - number;
      }
      return false;
    };
    setPannerPosition = function(hand) {
      return panner.setPosition(hand.stabilizedPalmPosition[0] / 100, hand.stabilizedPalmPosition[1] / 100, hand.stabilizedPalmPosition[2] / 100);
    };
    this.on('handLost', function() {
      return silence();
    });
    return {
      hand: function(hand) {
        var distance, duration, iBox, proximities, proximity, _i, _len;
        if (!(iBox = hand.frame.interactionBox)) {
          return;
        }
        proximities = iBox.normalizePoint(hand.palmPosition);
        for (_i = 0, _len = proximities.length; _i < _len; _i++) {
          proximity = proximities[_i];
          if ((distance = distanceFromSegment(proximity, [0, 1]))) {
            hand.proximity = true;
            setPannerPosition(hand);
            duration = options.beepDuration(distance);
            if (duration < options.minBeepDuration) {
              playContinuous(options.continuousFrq);
            } else {
              playBeep(options.beepFrq, duration);
            }
            return;
          }
        }
        return silence();
      }
    };
  });

}).call(this);
