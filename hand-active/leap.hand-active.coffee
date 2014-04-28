# measures how spread out and flat a hand is
# fires 'handSplay' and 'handUnsplay' events from the controller

Leap.Controller.plugin 'handSplay', (scope = {})->
  scope.splayThreshold ||= 0.75
  
  @use('handHold')

  {
    hand: (hand)->
      return if hand.timeVisible == 0

      palmDot = null
      avgPalmDot = 0
      straightenedFingerCount = 0

      # set base data, find minimum
      for finger in hand.fingers
        palmDot = Leap.vec3.dot( hand.direction, finger.direction )
        avgPalmDot += finger.palmDot
        
        if @palmDot > scope.splayThreshold
          straightenedFingerCount++ 

      # v1 tracking backwards compatibility
      # missing fingers treated as mid-curl
      avgPalmDot += 0.5 * (5 - hand.fingers.length)

      avgPalmDot /= 5

      # todo: in skeletal, we get back finger type of thumb, and can set fingerActiveCount back to 2
      if avgPalmDot > scope.splayThreshold || straightenedFingerCount > 2
        unless hand.data('splayed')
          hand.data(splayed: true)
          @emit('handSplay', hand)
            
      else
        if hand.data('splayed')
          @emit('handUnsplay', hand)
          hand.data(splayed: false)
  }