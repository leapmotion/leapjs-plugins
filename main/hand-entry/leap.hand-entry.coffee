###
Emits controller events when a hand enters of leaves the frame
"handLost" and "handFound"
Each event also includes the hand object, which will be invalid for the handLost event.
###

handEntry = ->
  activeHandIds = []

  #http://stackoverflow.com/questions/3954438/remove-item-from-array-by-value
  `activeHandIds.remove = function() {
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
    for id in activeHandIds
      @emit('handLost', @lastConnectionFrame.hand(id))

  {
    frame: (frame)->
      newValidHandIds = frame.hands.map (hand)-> hand.id

      `for (var i = 0, len = activeHandIds.length; i < len; i++){
        id = activeHandIds[i];
        if(  newValidHandIds.indexOf(id) == -1){
          activeHandIds.remove(id)
          // this gets executed before the current frame is added to the history.
          this.emit('handLost', this.frame(1).hand(id))
          i--;
          len--;
        }
      }`

      for id in newValidHandIds
        if activeHandIds.indexOf(id) == -1
          activeHandIds.push id
          @emit('handFound', frame.hand(id))
  }



if (typeof Leap != 'undefined') && Leap.Controller
 Leap.Controller.plugin 'handEntry', handEntry
else
  module.exports.handEntry = handEntry
