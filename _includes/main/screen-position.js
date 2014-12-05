window.handHoldDemoCursor = $('#screen-position-demo .cursor');
window.handHoldDemoOutput = $('#screen-position-demo .output')

controller
  .use('screenPosition', {
    scale: 8
  })
  .on('frame', function(frame) {
    var hand;
    if (hand = frame.hands[0]) {

      handHoldDemoOutput.html("[<br/>&nbsp;&nbsp;" + (hand.screenPosition()[0]) +
        "        <br/>&nbsp;&nbsp;" + (hand.screenPosition()[1]) +
        "        <br/>&nbsp;&nbsp;" + (hand.screenPosition()[2]) + "<br/>]");

      return handHoldDemoCursor.css({
        left: hand.screenPosition()[0] + 'px',
        bottom: hand.screenPosition()[1] + 'px'
      });
    }
}).on('deviceConnected', function(){
  $('#screen-position-demo .noleap').remove()
});


