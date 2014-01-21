Leap.Controller.plugin 'panic', ->
  # delta of both hands are combined
  pitchDeltas = []
  {
    hand: (hand)->
      if hand.timeVisible < 1
        return

      # initial pass
      lastPitch = hand.data('panic.lastPitch')
      currentPitch = hand.pitch()
      hand.data('panic.lastPitch', currentPitch)

      return unless lastPitch


      # manage rolling sum
      now = new Date()
      pitchDeltas.push({
        delta: currentPitch - lastPitch,
        time: now
      })

      timeWindow = now.setSeconds(now.getSeconds() - 1)
      while pitchDeltas[0].time < timeWindow
        pitchDeltas.shift()

      #
      sum = 0
      for delta in pitchDeltas
        sum += Math.abs(delta.delta)

      if sum > 0.3
        pitchDeltas = []
        hand.panicing = true
#        console.log sum
#      else
#        console.log sum

  }
