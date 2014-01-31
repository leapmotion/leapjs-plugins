# Hand Hold
-----------

## Usage

```js
  controller.use('handHolding')
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

### hold(value)

This will either hold the value passed in, or hold on to whatever the hand is currently hovering over (see below).

```js
  hand.hold(someDiv); // store the div
  hand.hold();        // store the current hover target
```

### holding()

This will return the object currently being held.

```js
  hand.holding();  // returns someDiv
```

### hoverFn(callback)

Sets a function which the hand will use to determine what it is hovering over.

```js
  hand.hoverFn(
    function(hand){ return hand.closestDiv(); }
  )
```

### hovering()

Returns what the hand is currently hovering over, based upon the hoverFn.  If no callback is set, will return undefined.

```js
  hand.hovering() // returns the results of hand.closestDiv();
```


