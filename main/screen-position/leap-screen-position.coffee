Leap.plugin 'screenPosition', (options)->
  # instance of extension should be tied to instance of hand
  # positioning can be one of a series of predefined position identifiers, or a custom method.
  positioning = (options.positioning || 'absolute')

  position = (vec3)->
    if typeof positioning == 'function'
      positioning.call(@, vec3)
    else
      position_methods[positioning].call(@, vec3)

  position_methods = {
    absolute: (vec3)->
      scale = 8
      vertical_offset = -150
      # Note that "@" (a hand/finger/etc) is different for every frame.
      @_screenPosition ||= {
        x: (document.body.offsetWidth / 2) + (vec3[0] * scale)
        y: (document.body.offsetHeight / 2) + ((vec3[1] + vertical_offset) * scale * -1)
      }
  }

  {
    hand: {
      # screenPosition will use the stabilized position by default, or allow any array of [x,y,z] to be passed in.
      screenPosition: (vec3)->
        position.call(@, vec3 || @stabilizedPalmPosition)
    }
    pointable: {
      screenPosition: (vec3)->
        position.call(@, vec3 || @stabilizedTipPosition)
    }
  }

