###
Adds the "screenPosition" method by default to hands and pointables.  This returns a vec3 (an array of length 3)
with [x,y,z] screen coordinates indicating where the hand is.  This method can accept an optional vec3, allowing
it to convert any arbitrary vec3 of coordinates.

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
###

Leap.plugin 'screenPosition', (options = {})->
  # instance of extension should be tied to instance of hand
  # positioning can be one of a series of predefined position identifiers, or a custom method.
  options.positioning ||= 'absolute'
  options.scale ||= 8
  options.verticalOffset ||= -100

  positioningMethods = {
    absolute: (positionVec3)->
      [
        (document.body.offsetWidth / 2) + (positionVec3[0] * options.scale),
        (document.body.offsetHeight / 2) + ((positionVec3[1] + options.verticalOffset) * options.scale),
        0
      ]
  }

  position = (vec3, memoize = false)->
    # Note that "@" (a hand/finger/etc) is remade for every frame.
    screenPositionVec3 = if typeof options.positioning == 'function'
                            options.positioning.call(@, vec3)
                          else
                            positioningMethods[options.positioning].call(@, vec3)

    if memoize
       @screenPositionVec3 = screenPositionVec3

    screenPositionVec3


  {
    hand: {
      # screenPosition will use the stabilized position by default, or allow any array of [x,y,z] to be passed in.       
      screenPosition: (vec3)->
        position.call(@, vec3 || @stabilizedPalmPosition, !vec3)
    }
    pointable: {
      screenPosition: (vec3)->
        position.call(@, vec3 || @stabilizedTipPosition, !vec3)
    }
  }

