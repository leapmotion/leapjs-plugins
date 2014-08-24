# Allows arbitrary transforms to be easily applied to hands in the Leap Frame
# This plugin doesn't require THREE.js, but will accept THREE.js Quaternions

# configuration:
# if transform is set, all other properties will be ignored
# transform: a THREE.Matrix4 directly.  This can be either an array of 16-length, or a THREE.matrix4
# quaternion:  a THREE.Quaternion
# position:  a THREE.Vector3
# scale:  a THREE.Vector3


Leap.plugin 'transform', (scope = {})->
  noop = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
  _matrix = new THREE.Matrix4


  scope.getMatrix = (hand)->
    if scope.transform
      matrix = if typeof scope.transform == 'function' then scope.transform(hand) else scope.transform

      if window['THREE'] && matrix instanceof THREE.Matrix4
        return matrix.elements
      else
        return matrix

    else if scope.position || scope.quaternion || scope.scale
      _matrix.set.apply(_matrix, noop)

      if scope.quaternion
        _matrix.makeRotationFromQuaternion(
          if typeof scope.quaternion == 'function' then scope.quaternion(hand) else scope.quaternion
        )

      if scope.scale
        _matrix.scale(
          if typeof scope.scale == 'function'      then scope.scale(hand)      else scope.scale
        )

      if scope.position
        _matrix.setPosition(
          if typeof scope.position == 'function'   then scope.position(hand)   else scope.position
        )

      return _matrix.elements

    else
      return noop



  # implicitly appends 1 to the vec3s, applying both translation and rotation
  transformPositions = (matrix, vec3s...)->
    for vec3 in vec3s
      if vec3 # some recordings may not have all fields
        Leap.vec3.transformMat4(vec3, vec3, matrix)

  transformMat4Implicit0 = (out, a, m) ->
    x = a[0]
    y = a[1]
    z = a[2]

    out[0] = m[0] * x + m[4] * y + m[8]  * z
    out[1] = m[1] * x + m[5] * y + m[9]  * z
    out[2] = m[2] * x + m[6] * y + m[10] * z
    return out

  # appends 0 to the vec3s, applying only rotation
  transformDirections = (matrix, vec3s...)->
    for vec3 in vec3s
      if vec3 # some recordings may not have all fields
        transformMat4Implicit0(vec3, vec3, matrix)


  {
    hand: (hand)->
      matrix = scope.getMatrix(hand)

      transformPositions(
        matrix,
        hand.palmPosition,
        hand.stabilizedPalmPosition,
        hand.sphereCenter,
      )

      transformDirections(
        matrix,
        hand.direction,
        hand.palmNormal,
        hand.palmVelocity,
      )

      # todo: add bone bases when they enter the API.
      for finger in hand.fingers
        transformPositions(
          matrix,
          finger.carpPosition,
          finger.mcpPosition,
          finger.pipPosition,
          finger.dipPosition,
          finger.tipPosition
        )
        transformDirections(
          matrix,
          finger.direction
        )

  }
