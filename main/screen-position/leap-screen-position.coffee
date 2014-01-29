Leap.plugin 'screenPosition', (options)->
  # instance of extension should be tied to instance of hand
  # positioning can be one of a series of predefined position identifiers, or a custom method.
  positioning = (options.positioning || 'absolute')

  previousPosition = undefined

  position_methods = {
    absolute: (vec3)->
      scale = 8
      vertical_offset = -150
      previousPosition = {
          x: (document.body.offsetWidth / 2) + (vec3[0] * scale)
          y: (document.body.offsetHeight / 2) + ((vec3[1] + vertical_offset) * scale * -1)
      }
  }

  {
    hand: {
      screenPosition: ->
        if typeof positioning == 'function'
          positioning(@stabilizedTipPosition)
        else
          position_methods[positioning](@stabilizedTipPosition)
    }
    pointable: {
      screenPosition: ->
        if typeof positioning == 'function'
          positioning(@stabilizedTipPosition)
        else
          position_methods[positioning](@stabilizedTipPosition)
    }
  }

