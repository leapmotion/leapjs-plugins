//CoffeeScript generated from main/transform/leap.transform.coffee
(function() {
  var __slice = [].slice;

  Leap.plugin('transform', function(scope) {
    var noop, transformDirections, transformMat4Implicit0, transformPositions, _matrix;
    if (scope == null) {
      scope = {};
    }
    noop = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    _matrix = new THREE.Matrix4;
    scope.getMatrix = function(hand) {
      var matrix;
      if (scope.transform) {
        matrix = typeof scope.transform === 'function' ? scope.transform(hand) : scope.transform;
        if (window['THREE'] && matrix instanceof THREE.Matrix4) {
          return matrix.elements;
        } else {
          return matrix;
        }
      } else if (scope.position || scope.quaternion || scope.scale) {
        _matrix.set.apply(_matrix, noop);
        if (scope.quaternion) {
          _matrix.makeRotationFromQuaternion(typeof scope.quaternion === 'function' ? scope.quaternion(hand) : scope.quaternion);
        }
        if (scope.scale) {
          _matrix.scale(typeof scope.scale === 'function' ? scope.scale(hand) : scope.scale);
        }
        if (scope.position) {
          _matrix.setPosition(typeof scope.position === 'function' ? scope.position(hand) : scope.position);
        }
        return _matrix.elements;
      } else {
        return noop;
      }
    };
    transformPositions = function() {
      var matrix, vec3, vec3s, _i, _len, _results;
      matrix = arguments[0], vec3s = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _results = [];
      for (_i = 0, _len = vec3s.length; _i < _len; _i++) {
        vec3 = vec3s[_i];
        if (vec3) {
          _results.push(Leap.vec3.transformMat4(vec3, vec3, matrix));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    transformMat4Implicit0 = function(out, a, m) {
      var x, y, z;
      x = a[0];
      y = a[1];
      z = a[2];
      out[0] = m[0] * x + m[4] * y + m[8] * z;
      out[1] = m[1] * x + m[5] * y + m[9] * z;
      out[2] = m[2] * x + m[6] * y + m[10] * z;
      return out;
    };
    transformDirections = function() {
      var matrix, vec3, vec3s, _i, _len, _results;
      matrix = arguments[0], vec3s = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _results = [];
      for (_i = 0, _len = vec3s.length; _i < _len; _i++) {
        vec3 = vec3s[_i];
        if (vec3) {
          _results.push(transformMat4Implicit0(vec3, vec3, matrix));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    return {
      hand: function(hand) {
        var finger, len, matrix, _i, _len, _ref, _results;
        matrix = scope.getMatrix(hand);
        transformPositions(matrix, hand.palmPosition, hand.stabilizedPalmPosition, hand.sphereCenter);
        transformDirections(matrix, hand.direction, hand.palmNormal, hand.palmVelocity);
        _ref = hand.fingers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          finger = _ref[_i];
          transformPositions(matrix, finger.carpPosition, finger.mcpPosition, finger.pipPosition, finger.dipPosition, finger.distal.nextJoint, finger.tipPosition);
          transformDirections(matrix, finger.direction);
          len = Leap.vec3.create();
          Leap.vec3.sub(len, finger.mcpPosition, finger.carpPosition);
          finger.metacarpal.length = Leap.vec3.length(len);
          Leap.vec3.sub(len, finger.pipPosition, finger.mcpPosition);
          finger.proximal.length = Leap.vec3.length(len);
          Leap.vec3.sub(len, finger.dipPosition, finger.pipPosition);
          finger.medial.length = Leap.vec3.length(len);
          Leap.vec3.sub(len, finger.tipPosition, finger.dipPosition);
          _results.push(finger.distal.length = Leap.vec3.length(len));
        }
        return _results;
      }
    };
  });

}).call(this);
