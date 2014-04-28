# measures how spread out and flat a hand is
# fires 'handSplay' and 'handUnsplay' events from the controller
#
# Two items are made accessible through hand.data
# hand.data('handSplay.splay') returns the fractional splay amount, 0 to 1
# hand.data('handSplay.splayed') returns a boolean: whether the hand is considered splayed or not

Leap.Controller.plugin 'handSplay', (scope = {})->
  scope.splayThreshold  ||= 0.65
  scope.requiredFingers ||= 4

  @use('handHold')

  {
    hand: (hand)->
      palmDot = null
      avgPalmDot = 0
      straightenedFingerCount = 0

      # set base data, find minimum
      for finger in hand.fingers
        palmDot = Leap.vec3.dot( hand.direction, finger.direction )
        avgPalmDot += palmDot
        
        if palmDot > scope.splayThreshold
          straightenedFingerCount++ 

      # v1 tracking backwards compatibility
      # missing fingers treated as mid-curl
      avgPalmDot += 0.5 * (5 - hand.fingers.length)

      avgPalmDot /= 5

      hand.data('handSplay.splay', avgPalmDot)
      hand.data('handSplay.splayedFingers', straightenedFingerCount)

      # todo: in skeletal, we get back finger type of thumb, and can set fingerActiveCount back to 2
      if avgPalmDot > scope.splayThreshold || straightenedFingerCount >= scope.requiredFingers
        unless hand.data('handSplay.splayed')
          hand.data('handSplay.splayed': true)
          @emit('handSplay', hand)

      else
        if hand.data('handSplay.splayed')
          @emit('handUnsplay', hand)
          hand.data('handSplay.splayed': false)

  }