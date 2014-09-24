
// this allows RequireJS without necessitating it.
// see http://bob.yexley.net/umd-javascript-that-runs-anywhere/
(function (root, factory) {

  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root.LeapDataPlotter = factory();
  }

}(this, function () {

  var LeapDataPlotter, TimeSeries;

  var colors = ['#900', '#090', '#009', '#990', '#909', '#099'];
  var colorIndex = 0;

  LeapDataPlotter = function (options) {
    this.options = options || (options = {});
    this.seriesHash = {};
    this.series = [];
    this.init(options.el);
  }

  LeapDataPlotter.prototype.init = function(el) {

    if (el){
      var canvas = el;
    }else {
      var canvas = document.createElement('canvas');
      canvas.className = "leap-data-plotter";
      document.body.appendChild(canvas);
    }


    this.canvas = canvas;
    this.context = canvas.getContext('2d');

    this.rescale();
  }

  // this method must be called any time the canvas changes size.
  LeapDataPlotter.prototype.rescale = function(){
    var styles = getComputedStyle(this.canvas);
    var windowWidth = parseInt(styles.width, 10);
    var windowHeight = parseInt(styles.height, 10);
    this.width = windowWidth;
    this.height = windowHeight;

    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = this.context.webkitBackingStorePixelRatio ||
                            this.context.mozBackingStorePixelRatio ||
                            this.context.msBackingStorePixelRatio ||
                            this.context.oBackingStorePixelRatio ||
                            this.context.backingStorePixelRatio || 1;

    var ratio = devicePixelRatio / backingStoreRatio;
    if (devicePixelRatio !== backingStoreRatio) {

      var oldWidth = this.canvas.width;
      var oldHeight = this.canvas.height;

      this.canvas.width = oldWidth * ratio;
      this.canvas.height = oldHeight * ratio;

      this.canvas.style.width = oldWidth + 'px';
      this.canvas.style.height = oldHeight + 'px';

      this.context.scale(ratio, ratio);
    }

    this.clear();
    this.draw();
  }

  // pushes a data point on to the plot
  // data can either be a number
  // or an array [x,y,z], which will be plotted in three graphs.
  // options:
  // - y: the graph index on which to plot this datapoint
  // - color: hex code
  // - name: name of the plot
  // - precision: how many decimals to show (for max, min, current value)
  LeapDataPlotter.prototype.plot = function (id, data, opts) {
    if (data.length) {

      for (var i = 0, c = 120; i < data.length; i++, c=++c>122?97:c) {
        this.getTimeSeries( id + '.' + String.fromCharCode(c), opts ).push( data[i] );
      }

    } else {

      this.getTimeSeries(id, opts).push(data);

    }
  }

  LeapDataPlotter.prototype.getTimeSeries = function (id, opts) {
    var ts = this.seriesHash[id];

    if (!ts) {

      var defaultOpts = this.getOptions(id);
      for (key in opts){
        defaultOpts[key] = opts[key];
      }

      ts = new TimeSeries(defaultOpts);
      this.series.push(ts);
      this.seriesHash[id] = ts;

    }

    return ts;
  }

  LeapDataPlotter.prototype.getOptions = function (name) {
    var c = colorIndex;
    colorIndex = (colorIndex + 1) % colors.length;
    var len = this.series.length;
    var y = len ? this.series[len - 1].y + 50 : 0;
    return {
      y: y,
      width: this.width,
      color: colors[c],
      name: name
    }
  }

  LeapDataPlotter.prototype.clear = function() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  LeapDataPlotter.prototype.draw = function() {
    var context = this.context;
    this.series.forEach(function (s) {
      s.draw(context);
    });
  }

  LeapDataPlotter.prototype.update = function(){
    this.clear();
    this.draw();
  }

  TimeSeries = function (opts) {
    opts = opts || {};
    this.x = opts.x || 0;
    this.y = opts.y || 0;
    this.precision = opts.precision || 5;
    this.units = opts.units || '';
    console.log('widht received', opts.width);
    this.width = opts.width || 1000;
    this.height = opts.height || 50;
    this.length = opts.length || 600;
    this.color = opts.color || '#000';
    this.name = opts.name || "";
    this.frameHandler = opts.frameHandler;

    this.max = -Infinity;
    this.min = Infinity;
    this.data = [];
  }

  TimeSeries.prototype.push = function (value) {
    this.data.push(value);

    if (this.data.length >= this.length) {
      this.data.shift();
    }
  }

  TimeSeries.prototype.draw = function (context) {
    var self = this;
    var xScale =  (this.width - 10) / (this.length - 1);
    var yScale = -(this.height - 10) / (this.max - this.min);

    var padding = 5;
    var top = (this.max - this.min) * yScale + 10;

    context.save();
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.translate(this.x, this.y + this.height - padding);
    context.strokeStyle = this.color;

    context.beginPath();

    var max = -Infinity;
    var min = Infinity;
    this.data.forEach(function (d, i) {
      if (d > max) max = d;
      if (d < min) min = d;

      if (isNaN(d)) {
        context.stroke();
        context.beginPath();
      } else {
        context.lineTo(i * xScale, (d - self.min) * yScale);
      }
    });
    context.stroke();

    // draw labels
    context.fillText( this.name, padding,  top);
    context.fillText( this.data[this.data.length - 1].toPrecision(this.precision) + this.units, padding, 0 );

    context.textAlign="end";
    context.fillText( this.min.toPrecision(this.precision) + this.units, this.width - padding, 0 );
    context.fillText( this.max.toPrecision(this.precision) + this.units, this.width - padding, top );
    context.textAlign="left";
    // end draw labels

    context.restore();
    this.min = min;
    this.max = max;
  }

  return LeapDataPlotter;

}));

//CoffeeScript generated from extras/proximity-alert/leap.proximity-alert.coffee
(function() {
  Leap.Controller.plugin('proximityAlert', function(scope) {
    var activeOscillator, context, distanceFromSegment, masterGain, oscillate, panner, playBeep, playContinuous, playingUntil, setPannerPosition, silence;
    if (scope == null) {
      scope = {};
    }
    scope.beepFrq || (scope.beepFrq = 1318.51);
    scope.continuousFrq || (scope.continuousFrq = 1396.91);
    scope.waveType || (scope.waveType = 0);
    scope.beepDuration || (scope.beepDuration = function(distance) {
      return Math.pow(0.7 - distance, 3);
    });
    scope.minBeepDuration || (scope.minBeepDuration = 0.02);
    context = new webkitAudioContext();
    panner = context.createPanner();
    masterGain = context.createGain();
    masterGain.connect(context.destination);
    panner.connect(masterGain);
    scope.setVolume = function(value) {
      return masterGain.gain.value = value;
    };
    oscillate = function(freq, duration) {
      var oscillator;
      oscillator = context.createOscillator();
      oscillator.type = scope.waveType;
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
            duration = scope.beepDuration(distance);
            if (duration < scope.minBeepDuration) {
              playContinuous(scope.continuousFrq);
            } else {
              playBeep(scope.beepFrq, duration);
            }
            return;
          }
        }
        return silence();
      }
    };
  });

}).call(this);
