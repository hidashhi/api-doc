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

//General call options
var callOptions = {
  video: true,
  audio: true,
  quality: 'high'
  /* 
    Bandwidth (up & down) suggestions for quality presets.
    Note: WebRTC is adaptive on bandwidth - 'high' works fine in most bandwidth scenarios.

    'low' 0.3 - 2 Mbit (below 0.3 Mbit Audio only is recommended)
    'medium' 2 - 4 Mbit
    'high' 4 Mbit+
   */
};

var toggleBtnUI = function(btn) {
  btn.toggleClass('btn-active', !btn.hasClass('btn-active'));
}

// Join a call-room by call-code and accesstoken (done after input).
function initCall(accessToken, callCode) {
  // Connect to HidashHi
  $hi.connect({token: accessToken});

  // On connected
  $hi.on('connected', function() {
    // Get user permissions to use local camera and render it for self-view
    // 'video-self-view' is container element to render in.
    $hi.renderMe('video-self-view', function() {
      $('#video-self-view').css('border-color', $hi.colorManager.getMyColor());

      // Join the call-room by call-code.
      // The room object provided by callback contains all kind of methods and events.
      $hi.joinRoom({ name: 'call-code-'+callCode }, function (room) {

        // Open a p2p call with all participants in room.
        room.openCall({
          immediate: true,
          autoAcceptCalls: true,
          settings: callOptions
        });

        // Accepted call for the connected call-room.
        room.on('call:accepted', function(call) {
          // We have an established call.
          // Hide the waiting for partner.
          $('#video-waiting').hide();
          // Render the remote video of the participant(s).
          call.participants.forEach(function(index, participant) {
            if (participant.isMe) {
              // Create a whiteboard on the self-view
              $hi.whiteboards.create('video-self-view', participant);
              return;
            }


            var videoDivId = 'video-remote-view' + participant.id;
            var template = $("#video-remote-view-template").html()
              .replace(/%1/g, videoDivId)
              .replace(/%2/g, participant.id);
            $('#video-remote-views').append(template);

            participant.render({
              containerId: videoDivId,
              height: 'auto',
              width: '100%'
            });

            // Create a whiteboard on the participant's view
            $hi.whiteboards.create(videoDivId, participant);

            // First call to $hi.colorManager.getColor will assign a new color to this participant
            $('#' + videoDivId).css('border-color', $hi.colorManager.getColor(participant.id));

            // Low FPS warning handler
            participant.on("video:lowfps:start", function(){
              $('.slow-performance-alert').show();
            });

            $('#btn-mute-' + participant.id).click(function() {
              toggleBtnUI($('#btn-mute-' + participant.id));
              participant.toggleAudio();
            });

            $('#btn-pause-' + participant.id).click(function() {
              toggleBtnUI($('#btn-pause-' + participant.id));
              participant.toggleVideo();
            });

          }.bind(this));
        });

        room.on('participants:enter', function(data) { /* console.log("Participant entered room.", data); */ });
        room.on('participants:leave', function(data) {
          // Removing the remote video rendering div from DOM
          var participant_id = data.sender;
          $('#video-remote-view' + participant_id).remove();
          console.log("Participant " + participant_id + "left room.");

          // Remove participant's whiteboard
          $hi.whiteboards.remove(participant_id);
        });
        
        // Init text-chat
        initTextChat(room);
      });

    }, function(error) {
      console.log("Camera / microphone was not allowed.", error);
      alert('Camera / microphone permissions denied.');
    }, callOptions);
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
      container.append($('<div class="row chat-message"><span class="label label-success top-left-block" style="background-color: '+
        $hi.colorManager.getMyColor() +'">'+msg.content.text+'</span></div>'));
    } else {
      container.append($('<div class="row text-right chat-message"><span class="label label-info top-right-block" style="background-color: ' +
        $hi.colorManager.getColor(msg.sender) +';">' + msg.content.text + '</span></div>'));
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
      // Indicate with color which participant is typing
      $('#chat-message-is-typing > span').css('background-color', $hi.colorManager.getColor(msg.sender));
      lastTypingEventReceived = Date.now();
      setTimeout(function() {
        if (Date.now()-lastTypingEventInterval > lastTypingEventReceived) {
          // Not typing anymore, remove.
          $('#chat-message-is-typing', container).remove();
        }
      }, lastTypingEventInterval+1000);
    }
  });

  $hi.on('auth:multiconnection', function(msg) {
    $('.multiple-connections-alert').show();
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
    // Hide progressbar
    $('#checkingCapabilities').hide();

    if (!capabilities || !capabilities.webrtc) {
      // Show unsupported browser warning
      $('#unsupportedBrowser').show();
    }

    if (capabilities && !capabilities.webrtc && capabilities.plugin_offer) {
      // Show install plugin prompt
      $('#plugin-offer-link').attr('href', capabilities.plugin_offer.download);
      $('#plugin-offer-img').attr('src', capabilities.plugin_offer.logo);
      $('#plugin-offer-name').html(capabilities.plugin_offer.name);
      $('#plugin-offer').show();
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

  $('#slowPerformanceBtn').click(function() {
    $('.slow-performance-alert').hide();
  });

  // Disable my video button handler
  $('#self-pause').click(function() {
    toggleBtnUI($('#self-pause'));
    $hi.toggleVideo();
  });

  // Disable my audio button handler
  $('#self-mute').click(function() {
    toggleBtnUI($('#self-mute'));
    $hi.toggleAudio();
  });

});
