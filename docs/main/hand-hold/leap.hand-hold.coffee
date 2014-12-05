handHold = ->
  extraHandData = {}
  {
    hand: {
      # like jQuery: accepts a hash to set, or a key and value to set, or a key to read.
      data: (hashOrKey, value)->
        extraHandData[@id] ||= []

        if value
          extraHandData[@id][hashOrKey] = value
        else if(toString.call(hashOrKey) == '[object String]')
          return extraHandData[@id][hashOrKey]
        else
          for key, value of hashOrKey
            if value == undefined
              delete extraHandData[@id][key]
            else
              extraHandData[@id][key] = value

      # Give the hand an object to hold, which will be returned by .holding()
      # if no object is passed, the hand will try and hold whatever it is hovering over.
      hold: (object)->
        if object
          @data(holding: object)
        else
          @hold @hovering()

      holding: ->
        @data('holding')

      release: ->
        release = @data('holding')
        @data(holding: undefined)
        release

      # Saves a method which will be used to calculate what a hand is hovering over.
      hoverFn: (getHover)->
        @data(getHover: getHover)

      # Returns what the hand is currently hovering over
      # This does not persist between frames
      hovering: ->
        if getHover = @data('getHover')
          @_hovering ||= getHover.call(this)

    }
  }

if (typeof Leap != 'undefined') && Leap.Controller
  Leap.Controller.plugin 'handHold', handHold
else if (typeof module != 'undefined')
  module.exports.handHold = handHold
else
  throw 'leap.js not included'