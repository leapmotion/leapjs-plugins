Leap.plugin('clickEvents', function(scope){
  scope || (scope = {});

  scope.proximalDownThreshold || (scope.proximalDownThreshold =  0.5);
  scope.proximalUpThreshold   || (scope.proximalUpThreshold   = -0.2);
  scope.medialDownThreshold   || (scope.medialDownThreshold   =  0.5);

  this.use('handHold');

  var controller = this;



  return {
    // todo - special case for thumb?
    finger: function(finger){

      finger.proximalCurl = Math.acos(
        Leap.vec3.dot(
          finger.hand().direction,
          finger.proximal.direction()
        )
      ) / (Math.PI / 2);

      if ( finger.data('proximalDown') ) {

        if (finger.proximalCurl < scope.proximalDownThreshold){
          controller.emit('proximalNeutral', finger);
          finger.data('proximalDown', false);
        }

      } else {

        if (finger.proximalCurl > scope.proximalDownThreshold){
          controller.emit('proximalDown', finger);
          finger.data('proximalDown', true);
        }

      }

//      if (finger.proximalCurl > scope.proximalUpThreshold){
//        controller.emit('proximalDown', finger)
//      }


      finger.medialCurl = Math.acos(
        Leap.vec3.dot(
          finger.proximal.direction(),
          finger.medial.direction()
        )
      ) / (Math.PI / 2);

      if ( finger.data('medialDown') ) {

        if (finger.medialCurl < scope.medialDownThreshold){
          controller.emit('medialNeutral', finger);
          finger.data('medialDown', false);
        }

      } else {

        if (finger.medialCurl > scope.medialDownThreshold){
          controller.emit('medialDown', finger);
          finger.data('medialDown', true);
        }

      }

    }
  }

});