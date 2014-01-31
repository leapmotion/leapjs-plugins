###
Emits controller events when a hand enters of leaves the frame
"handLost" and "handFound"
Each event also includes the hand object, which will be invalid for the handLost event.
###
Leap.Controller.plugin 'handEntry', ->
  previousHandIds = []

  #http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
  `previousHandIds.remove = function() {
      var what, a = arguments, L = a.length, ax;
      while (L && this.length) {
          what = a[--L];
          while ((ax = this.indexOf(what)) !== -1) {
              this.splice(ax, 1);
          }
      }
      return this;
  }`

  @on "deviceDisconnected",  ->
    for id in previousHandIds
      @emit('handLost', @lastConnectionFrame.hand(id))

  {
    frame: (frame)->
      newValidHandIds = frame.hands.map (hand)-> hand.id

      for id in previousHandIds
        if newValidHandIds.indexOf(id) == -1
          previousHandIds.remove id
          @emit('handLost', frame.hand(id))

      for id in newValidHandIds
        if previousHandIds.indexOf(id) == -1
          previousHandIds.push id
          @emit('handFound', frame.hand(id))
  }

