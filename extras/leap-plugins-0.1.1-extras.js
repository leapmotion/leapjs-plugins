//CoffeeScript generated from extras/leapjs-plugins-0.1.1-extras.coffee
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({},{},[])
//CoffeeScript generated from extras/leapjs-plugins-0.1.1-extras.min.coffee
/*    
 * LeapJS-Plugins Extra - v0.1.1 - 2014-02-11    
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
!function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({},{},[]);
//CoffeeScript generated from extras/proximity-alert/leap.proximity-alert.coffee
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
