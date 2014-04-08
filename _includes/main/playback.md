Playback
-----------
<a class="view-source" href="https://github.com/leapmotion/leapjs-plugins/tree/master/main/playback" target="_blank">View Source</a>

This plugin is used to send pre-recorded Leap frame data in to any Leap App.

## Options

- **`recording`** `[string {frames: [], metadata: {}}]` A blob of JSON data.  This should include two keys:
  <br/>`frames`, an array of raw frames as emitted
 from the Leap WebSocketServer, and<br/>`metadata`, additional info about the file.  Metadata may include:
  - `formatVersion` - the spec version of JSON blog. This should aways be 1
  - `generatedBy` - A string explaining what software made the recording
  - `frames` - The number of frames in blob
  - `frameRate` - The average frame rate of the recording.  This can be understood as the level of compression.
  - `protocolVersion` - A number indicating protocolVersion was used when recording the frame data
  - `serviceVersion` - A string indicating which version of the Leap Service was used when recording the frame data.

- **`autoPlay`** `[boolean true]` Begin playback immediately upon load.

- **`overlay`** `[boolean true or an element]` Show "Connect Device" and "Move hands over device" indicator images.  These images
will be automatically displayed at the top of the page based upon device state.  The overlay element can be accessed
and customized at any time through the plugin scope.  E.g., `myController.plugins.playback.player.overlay`

- **`pauseOnHand`** `[boolean false]` Have playback stop when a hand is inserted over the Leap device, and start again when the hand is removed.

- **`requiredProtocolVersion`** `[number]` When using pauseOnHand, set a minimum required protocol version for the user to take control

- **`loop`** `[boolean true]` Automatically repeat playback when the recording has finished.

- **`timeBetweenLoops`** `[number, ms]` When looping, how long to wait between plays.

## Usage

```javascript
  controller.use('playback', {
    recording: 'recordings/pinch.json.lz',
    requiredProtocolVersion: 6,
    pauseOnHand: true
  })
```

This plugin comes with an extensive API for usage in an application, including functions such as play, pause, record, stop, and export.  When `leapjs-playback` is released as a standalone repository, they will be documented there.  These can be access as follows:

```javascript
  controller.plugins.playback.player.play()
```