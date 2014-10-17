//CoffeeScript generated from main/transform/leap.transform.coffee
(function() {
  var __slice = [].slice;

  Leap.plugin('transform', function(scope) {
    var noop, transformDirections, transformMat4Implicit0, transformPositions, _directionTransform, _positionTransform;
    if (scope == null) {
      scope = {};
    }
    noop = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    _positionTransform = new THREE.Matrix4;
    _directionTransform = new THREE.Matrix4;
    scope.getDirectionTransform = function(hand) {
      var matrix;
      if (scope.transform) {
        matrix = typeof scope.transform === 'function' ? scope.transform(hand) : scope.transform;
        if (window['THREE'] && matrix instanceof THREE.Matrix4) {
          return matrix.elements;
        } else {
          return matrix;
        }
      } else if (scope.position || scope.quaternion || scope.scale) {
        _directionTransform.set.apply(_directionTransform, noop);
        if (scope.quaternion) {
          _directionTransform.makeRotationFromQuaternion(typeof scope.quaternion === 'function' ? scope.quaternion(hand) : scope.quaternion);
        }
        if (scope.position) {
          _directionTransform.setPosition(typeof scope.position === 'function' ? scope.position(hand) : scope.position);
        }
        return _directionTransform.elements;
      } else {
        return noop;
      }
    };
    scope.getPositionTransform = function(hand) {
      var matrix;
      if (scope.transform) {
        matrix = typeof scope.transform === 'function' ? scope.transform(hand) : scope.transform;
        if (window['THREE'] && matrix instanceof THREE.Matrix4) {
          return matrix.elements;
        } else {
          return matrix;
        }
      } else if (scope.position || scope.quaternion || scope.scale) {
        _positionTransform.set.apply(_positionTransform, noop);
        if (scope.quaternion) {
          _positionTransform.makeRotationFromQuaternion(typeof scope.quaternion === 'function' ? scope.quaternion(hand) : scope.quaternion);
        }
        if (scope.scale) {
          if (!isNaN(scope.scale)) {
            scope.scale = new THREE.Vector3(scope.scale, scope.scale, scope.scale);
          }
          _positionTransform.scale(typeof scope.scale === 'function' ? scope.scale(hand) : scope.scale);
        }
        if (scope.position) {
          _positionTransform.setPosition(typeof scope.position === 'function' ? scope.position(hand) : scope.position);
        }
        return _positionTransform.elements;
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
        var directionTransform, finger, len, positionTransform, _i, _len, _ref, _results;
        positionTransform = scope.getPositionTransform(hand);
        directionTransform = scope.getDirectionTransform(hand);
        transformPositions(positionTransform, hand.palmPosition, hand.stabilizedPalmPosition, hand.sphereCenter);
        transformDirections(directionTransform, hand.direction, hand.palmNormal, hand.palmVelocity);
        _ref = hand.fingers;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          finger = _ref[_i];
          transformPositions(positionTransform, finger.carpPosition, finger.mcpPosition, finger.pipPosition, finger.dipPosition, finger.distal.nextJoint, finger.tipPosition);
          transformDirections(directionTransform, finger.direction, finger.metacarpal.basis[0], finger.metacarpal.basis[1], finger.metacarpal.basis[2], finger.proximal.basis[0], finger.proximal.basis[1], finger.proximal.basis[2], finger.medial.basis[0], finger.medial.basis[1], finger.medial.basis[2], finger.distal.basis[0], finger.distal.basis[1], finger.distal.basis[2]);
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
