handHold = ->
  # holds keys of <handId> or <handId>-<pointableId>
  frameObjectData = {}

  dataMethod = (hashOrKey, value)->
    # fingerIDs and handIDs don't overlap
    objectData = frameObjectData[@id] ||= []

    if value && (value.default == undefined)

      objectData[hashOrKey] = value

    # .call here allows robustness for objects without toString.
    else if(toString.call(hashOrKey) == '[object String]')

      if !objectData[hashOrKey] && (value && value.default)
        return objectData[hashOrKey] = value.default
      else
        return objectData[hashOrKey]

    else # object passed in to be set

      for key, value of hashOrKey
        if value == undefined
          delete objectData[key]
        else
          objectData[key] = value

      return hashOrKey

  {
    pointable: {
      data: dataMethod
    }

    hand: {
      # like jQuery: accepts a hash to set, or a key and value to set, or a key to read.
      #
      # set:
      # hand.data('color', 'blue')
      # -> 'blue'
      #
      # get:
      # hand.data('color')
      # -> 'blue'
      #
      # use defaults:
      # otherHand.data('color', {default: 'green'})
      # -> 'green'
      #
      # value will be stored after first call with default:
      # otherHand.data('color')
      # -> 'green'
      data: dataMethod

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