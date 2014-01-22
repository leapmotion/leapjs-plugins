# relies on hand-holding plugin
# returns a clutch parameter, which shows % figner extension.
# fires off a finger extended event on 100%.
# returns activity state of each finger
# if any figer is active, the hand is active

Leap.Controller.plugin 'handActive', (options)->
  options ||= {}
  options.activeThreshold = 0.75

  {
    finger: {
      active: ->
        return @_active if @_active

        @palmDot = Leap.vec3.dot(@hand().direction, @direction)
        @_active = @palmDot > options.activeThreshold
        return @_active

    }
    hand: (hand)->
      return if hand.timeVisible == 0

      avgPalmDot = 0

      fingerActiveCount = 0

      # set base data, find miniumum
      for finger in hand.fingers
        fingerActiveCount += 1 if finger.active()
        avgPalmDot += finger.palmDot

      # hack - we don't always have 5 fingers due to skeletal compatability mode,
      # so we treat them as orthogonal by default
      hand.avgPalmDot += 0.5 * (5 - hand.fingers.length)

      hand.avgPalmDot = hand.avgPalmDot / 5

      # todo: in skeletal, we get back finger type of thumb, and can set fingerActiveCount back to 2
      if hand.avgPalmDot > options.activeThreshold || fingerActiveCount > 2
        if hand.data('hasBeenSeenInactive')
          unless hand.data('active')
            hand.data(active: true)
            @emit('handActive', hand)
      else
        hand.data('hasBeenSeenInactive', true)
        if hand.data('active')
          @emit('handInactive', hand)
          hand.data(active: false)

      hand.active = hand.data('active')
  }