# This is a plugin to mimic mouse- or touch-style events for the Leap Motion
#
# A touch screen's idea of poses is simple—how many fingers are currently on the screen?
# Our conception of poses is necessarily more complex.  Poses are generally based on
# range tests for some or all of a hand's data.
#
# Just like a mouse or touchscreen, each pose is accompanied by a few events:
#   - 'pose.start' (when the hand makes that pose)
#   - 'pose.move' (when the hand moves around within that pose)
#   - 'pose.end' (when the hand leaves that pose)
#
# By default, we include 4 poses: fist, open, pinch and point (as defined below)
# Feel free to write and include your own!
#
# Requires handHold, handActive
#
# Plugin By: Paul Mandel <pmandel@leapmotion.com>


Leap.Controller.plugin 'poseEvents', (options = {})->

  # A dictionary of poseName: testFunction
  # Test functions should take a 'hand' object and return a boolean
  recognizedPoses =
    'fist': (hand) ->
      hand.sphereRadius < 50 or hand.grabStrength > 0.8
    'open': (hand) ->
      hand.sphereRadius > 100
    'pinch': (hand) ->
      hand.pinchStrength > 60
    'point': (hand) ->
      hand.data 'active' and (finger for finger in hand.fingers if finger.active()).length == 1

  for pose, test of options.poses
    recognizedPoses[pose] = test

  {
    hand: (hand)->
      for pose, test of options.recognizedPoses
        if test hand
          if not hand.data pose
            this.emit 'pose.'+pose+'.start', hand
          hand.data pose, true
        else
          if hand.data pose
            this.emit 'pose.'+pose+'.end', hand
            hand.data pose, undefined

      if hand.data pose
        this.emit 'pose.'+pose+'.move', hand
  }

