/**
 * Hidashhi - Basic integration example.
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
            participant.render({
              containerId: 'video-remote-view',
              height: 'auto',
              width: '100%'
            });
          }.bind(this));
        });

        room.on('participants:enter', function(data) { /* console.log("Participant entered room.", data); */ });
        room.on('participants:leave', function(data) { /* console.log("Participant left room.", data); */ });
        
        // Init text-chat
        initTextChat(room);
      });

    }, function(error) {
      console.log("Camera was not allowed.", error);
      alert('Camera permissions denied.');
    });
  });
}
// End Join a call-room by call-code

// Init receiving and sending text messages.
function initTextChat(room) {
  var container = $('#chat-message-container');

  var lastTypingEventFired = 0;
  var lastTypingEventInterval = 5000; /* 5 sec interval seems ok */
  var lastTypingEventReceived = 0;

  room.on('text:received', function(msg) {
    // Incoming text message for room.
     
    if (msg.sender == $hi.profiles.getAt(0)._id) {
      container.append($('<div class="row chat-message"><span class="label label-success top-left-block">'+msg.content.text+'</span></div>'));
    } else {
      container.append($('<div class="row text-right chat-message"><span class="label label-info top-right-block">'+msg.content.text+'</span></div>'));
    }

    // Scroll to current message/bottom
    container.scrollTop(container[0].scrollHeight);

    //Remove is-typing element
    $('#chat-message-is-typing', container).remove();
    lastTypingEventReceived = 0;
  });

  // Send text to call-room on submit of form.
  $('#chat-send-message').submit(function(e) {
    var input = $('#chat-message-input').val();
    if (input && input != "") {
      room.sendTextMessage({text: input});
      $('#chat-message-input').val('');
    }

    lastTypingEventFired = 0;

    e.preventDefault();
    return false;
  });

  $('#chat-message-input').prop('disabled', false);

  // Use custom messages for 'Is typing..' functionality.
  $('#chat-message-input').keypress(function() {
    if (Date.now()-lastTypingEventInterval > lastTypingEventFired) {
      lastTypingEventFired = Date.now();
      var message = {
        to: room.profileIds,
        from: $hi.profiles.getAt(0)._id,
        content: 'is-typing-event'
      }
      $hi.sendCustomMessage(message);
    }
  });

  // Listen for is-typing-event
  $hi.on('custom:received', function(msg) {
    if (msg.sender != $hi.profiles.getAt(0)._id && msg.content == 'is-typing-event') {
      if (Date.now()-lastTypingEventInterval > lastTypingEventReceived) {
        // new typing event
        $('#chat-message-is-typing', container).remove();
        container.append($('<div id="chat-message-is-typing" class="row text-right chat-message-is-typing"><span class="label label-info top-right-block">...</span></div>'));
        // Scroll to current message/bottom
        container.scrollTop(container[0].scrollHeight);

      }
      lastTypingEventReceived = Date.now();
      setTimeout(function() {
        if (Date.now()-lastTypingEventInterval > lastTypingEventReceived) {
          // Not typing anymore, remove.
          $('#chat-message-is-typing', container).remove();
        }
      }, lastTypingEventInterval+1000);
    }
  });
   
  
}
// End Init receiving and sending text messages.

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
