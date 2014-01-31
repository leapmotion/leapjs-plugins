# Hand Entry
-----------

## Usage

```js
  controller.use('handEntry')
```

Fires controller events when a hand enters or leaves the frame.

## Events

### handFound(hand)

Triggered from the controller.  This passes in the Hand object.

```js
  controller.on('handFound',
    function(hand){console.log( 'hand found', hand }
  )
```

### handLost(hand)

Triggered from the controller.  This passes in the Hand *as it was seen in the last frame*.

This event is also triggered for every hand present when the device is disconnected.

```js
  controller.on('handLost',
    function(hand){console.log( 'hand lost', hand }
  )
```
