/**
 * Hidashhi - Data channels example.
 *
 * For documentation and more examples see: http://github.com/hidashhi
 *
 *
 * (c) 2014 Hidashhi
 * THIS WORK ‘AS-IS’ WE PROVIDE. 
 * NO WARRANTY EXPRESS OR IMPLIED.
 * WE’VE DONE OUR BEST, TO DEBUG AND TEST.
 * LIABILITY FOR DAMAGES DENIED.
 * 
 * PERMISSION IS GRANTED HEREBY, TO COPY, SHARE, AND MODIFY.
 * USE AS IS FIT, FREE OR FOR PROFIT.
 * THESE RIGHTS, ON THIS NOTICE, RELY.
 */

// Join a call-room by call-code and accesstoken (done after input).
function initCall(accessToken, callCode) {
  // Connect to HidashHi
  $hi.connect({token: accessToken});

  // On connected
  $hi.on('connected', function() {
    // Optionally a nickname for this user can be set.
    // This can also be done using the backend (PUT request on /user/profile/<profile-id> )
    // Example code:
    /*
    if ($hi.profiles.getAt(0).nickname != new_nickname) {
      $hi.put('/user/profile/'+$hi.profiles.getAt(0)._id, {nickname: new_nickname}, function(response, status) {  
        if (status != 200) {
          console.log('Error occured updating nickname: ', response);
        } else {
          $hi.profiles.getAt(0).nickname = new_nickname;
        }
      });
    }
    */
    // End nickname example code
     
    // Get user permissions to use local camera and render it for self-view
    // 'video-self-view' is container element to render in.
    $hi.renderMe('video-self-view', function() {

      // Join the call-room by call-code.
      // The room object provided by callback contains all kind of methods and events.
      $hi.joinRoom({ name: 'call-code-'+callCode }, function (room) {

        // Open a p2p call with all participants in room.
        room.openCall({
          immediate: true,
          autoAcceptCalls: false, /* When true any incoming call is auto-accepted. Accepting incoming calls can be done by using room.on('call:received') */
          settings: { video: true, audio: true}
        });
        
        // Incoming call for the connected call-room.
        room.on('call:received', function(call) {
          // Incoming call.
          var acceptThisCall = false;
          call.participants.forEach(function(index, participant) {
            if (participant.isMe) return;

            // Only allow calls from the first 2 persons in the room.
            // The limit of 2 participants per room will be enforced server-side.
            // When this is implemented this can be removed and autoAcceptCalls can be turned on.
            var allowedProfiles = room.profileIds.slice(0,2);
            if (allowedProfiles.indexOf(participant.id) > -1) {
              call.accept();
            }
          }.bind(this));
        }); /* When autoAcceptCalls is disabled use call.accept() here to accept an incoming call. */

        // Accepted call for the connected call-room.
        room.on('call:accepted', function(call) {
          // We have an established call.
          // Hide the waiting for partner.
          $('#video-waiting').hide();
          // Render the remote video of the participant(s).
          call.participants.forEach(function(index, participant) {
            if (participant.isMe) return;

            participant.render({
              containerId: 'video-remote-view',
              height: 'auto',
              width: '100%'
            });
            // Let the browser first init the video element.
            setTimeout(function() {
              initMouseDrawing(participant);
            }, 1000);
          }.bind(this));
        });
      });

    }, function(error) {
      console.log("Camera was not allowed.", error);
      alert('Camera permissions denied.');
    });
  });
}
// End Join a call-room by call-code

// Data channels mouse example
function initMouseDrawing(participant) {
  // Submit mouse pointer location
  var mouse = {x: 0, y: 0};
  document.addEventListener('mousemove', function(e){ 
    mouse.x = e.clientX || e.pageX; 
    mouse.y = e.clientY || e.pageY;
  }, false);
  var interval = setInterval(function() {
    try {
      // we're using the following structure. Though anything can be used.
      // <type>|<anything>
      // In this case <anything>: <mouse-x>x<mouse-y>
      participant.sendDataChannelMessage("0|"+mouse.x+"x"+mouse.y);
    } catch(e) {
      console.log('Error occured.', e);
      clearInterval(interval);
    }
  }, 10);

  // listen on remote mouse location
  participant.on('data:message', function(message) {
    var messageData = message.data.split('|', 2);
    if (messageData.length >= 2) {
      var type = messageData[0];
      var value = messageData[1];
      if (type == 0) {
        var mouseData = value.split('x', 2);
        if (mouseData.length == 2) {
          $('#mousePointer').css({
            left: mouseData[0]+"px",
            top: mouseData[1]+"px"
          });
        }
      }
    }
  });
}
// End Data channels mouse example


// Some helper utils for example purpose.
function generateCallCode() {
  var len = 8;
  //var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charSet = '0123456789';
  var randomString = '';
  for (var i = 0; i < len; i++) {
    var randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz,randomPoz+1);
  }
  return randomString;
}

//When the document is ready add some general event listeners.
$(document).ready(function() {

  // Check HidashHi browser capabilities
  $hi.getCapabilities(function(error, capabilities) {
    if (capabilities && capabilities.webrtc) {
      $('#unsupportedBrowser').hide();
    }
  });

  // Generate a call code and update input field.
  $('#generateCallCode').click(function() {
    $('#inputCallCode').val(generateCallCode());
  });
  
  //On submit for input section
  $('#input-form').submit(function(e) {
    var accessToken = $('#inputAccesstoken').val();
    var callCode = $('#inputCallCode').val();
    if (accessToken && callCode) {
      //hide input section and show call section
      $('#inputSection').hide();
      $('#share-call-code').text(callCode);
      $('#callSection').show();

      initCall(accessToken, callCode);

    } else {
      alert('Please enter accesstoken and call code.');
    }

    e.preventDefault();
    return false;
  });

  $('#exitCallBtn').click(function() {
    location.reload();
  });
});
