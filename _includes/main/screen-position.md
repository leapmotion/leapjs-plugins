# Screen Position
-----------
<a class="view-source" href="https://github.com/leapmotion/leapjs-plugins/tree/master/main/screen-position" target="_blank">View Source</a>

Adds the "screenPosition" method by default to hands and pointables.  This returns a vec3 (an array of length 3) with [x,y,z] screen coordinates indicating where the hand is.  This method can accept an optional vec3, allowing it to convert any arbitrary vec3 of coordinates.

Custom positioning methods can be passed in, allowing different scaling techniques,
e.g., <a target="_blank" href="http://msdn.microsoft.com/en-us/library/windows/hardware/gg463319.aspx">Pointer Ballistics for Windows XP</a>
Here we scale based upon the interaction box and screen size:


## Usage

```js
  controller.use('screenPosition')
  // or
  controller.use('screenPosition', {positioning: 'absolute'}) // the default
  // or
  controller.use 'screenPosition', {
    method: (positionVec3)->
      // Arguments for Leap.vec3 are (out, a, b)
      [
        Leap.vec3.subtract(positionVec3, positionVec3, @frame.interactionBox.center)
        Leap.vec3.divide(positionVec3, positionVec3, @frame.interactionBox.size)
        Leap.vec3.multiply(positionVec3, positionVec3, [document.body.offsetWidth, document.body.offsetHeight, 0])
      ]
  }

  // later...
  hand.screenPosition() // returns [156,204,121]
```
More info on vec3 can be found, <a target="_blank" href="http://glmatrix.net/docs/2.2.0/symbols/vec3.html">In the gl-matrix docs</a>



## Methods

### .screenPosition([positionVec3])

Returns the location of the hand in screen-space, or the passed in vector in screen-space.
Applies to hands and pointables.
