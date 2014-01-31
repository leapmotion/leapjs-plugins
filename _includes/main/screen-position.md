# Screen Position
-----------

## Usage

```js
  controller.use('screenPosition')
  // or
  controller.use('screenPosition', {positioning: 'absolute'}) // the default
  // or
  controller.use('screenPosition', {
    positioning: function(){ return [0,0,0] }
  }) // the default

```

The hand-holding plugin provides a simple way to store data about a hand object between frames.

## Methods

### .data(hashOrKey, value)

Similar to jQuery.data, this method allows a value to be get or set.  This is the main method, all else are convenience methods.

```js
  hand.data('player', 1)  //store data
  hand.data({player: 1})  //store data
  hand.data('player') // returns 1
```

