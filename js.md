# HidashHi JS SDK Documentation

Navigation: [Overview](README.md) | [REST API](rest.md) | [Examples](https://github.com/hidashhi/api-doc/tree/master/examples)

<a name="toc"></a>
## Table of Contents

* [Introduction](#introduction)
* [Authentication](#authentication)
* [Events](#events)
* [$hi](#hi)
    * [$hi.connect(options)](#hiconnect)
    * [Event: connected](#hiEventConnected)
    * [$hi.renderMe(containerId, cb, errCb, settings)](#hiRenderMe)
    * [$hi.openCall(options)](#hiOpenCall)
    * [$hi.joinRoom(options)](#hiJoinRoom)
    * [$hi.enableVideo()](#hiEnableVideo)
    * [$hi.disableVideo()](#hiDisableVideo)
    * [$hi.toggleVideo()](#hiToggleVideo)
    * [$hi.enableAudio()](#hiEnableAudio)
    * [$hi.disableAudio()](#hiDisableAudio)
    * [$hi.toggleAudio()](#hiToggleAudio)
    * [$hi.sendTextMessage(options)](#hisendTextMessage)
    * [$hi.sendCustomMessage(options)](#hisendCustomMessage)
* [$hi.Room(options)](#hiRoom)
    * [Events](#hiRoomEvents)
    * [room.openCall(options)](#hiRoomOpenCall)   
    * [room.sendTextMessage(options)](#hiRoomSendTextMessage)  
* [$hi.Call(options)](#hiCall)
    * [call.init()](#hiCallInit)  
    * [call.accept()](#hiCallAccept)   
    * [call.reject()](#hiCallReject)
    * [call.ignore()](#hiCallIgnore)
    * [call.hold()](#hiCallHold)
    * [call.resume()](#hiCallResume)
    * [call.hangup()](#hiCallHangup)
* [$hi.Participant(call, options)](#hiParticipant)
    * [Events](#hiParticipantEvents)
    * [Low FPS Events](#hiParticipantLowFpsEvents)
    * [participant.render()](#hiParticipantRender) 
    * [participant.remove()](#hiParticipantRemove)
    * [participant.sendDataChannelMessage()](#hiParticipantSendDataChannelMessage)
    * [participant.enableVideo()](#hiParticipantEnableVideo)
    * [participant.disableVideo()](#hiParticipantDisableVideo)
    * [participant.toggleVideo()](#hiParticipantToggleVideo)
    * [participant.enableAudio()](#hiParticipantEnableAudio)
    * [participant.disableAudio()](#hiParticipantDisableAudio)
    * [participant.toggleAudio()](#hiParticipantToggleAudio)
* [$hi.getCapabilities](#hiGetCapabilities)
    * [$hi.getCapabilities()](#hiGetCapabilities)

<a name="introduction"></a>
## Introduction

The Javascript SDK is intrinsic to the HidashHi real time communication and can be integrated into an application/website to make use of the HidashHi resources.
Applications may send and receive text messages, place and receive calls, and use other features on the Hidashhi platform.
The Javascript SDK is served as a Javascript file from the HidashHi CDN. It is available in a minified version at [provided-HidashHi CDN]/js/api/1/hi.js.

For usage examples, please have a look at [our API examples on Github](https://github.com/hidashhi/api-examples).

The Javascript SDK uses the [Socket.io](http://www.socket.io) Client as a transport layer, currently still at Socket.io 0.9.16 since this older version has proven to be the most stable.

[back to top](#toc)
<br />
<br />

<a name="authentication"></a>
## Authentication  
To use the API on behalf of the user, you need an access token.
Read more about how to bind your authentication back-end to HidashHi at [Guesttoken guide](https://github.com/hidashhi/api-doc/blob/master/examples/guest_token_guide.md)

**An example** of how to obtain an access token can be found in the [Getting started example](https://github.com/hidashhi/api-doc/tree/master/examples/getting-started-example).

[back to top](#toc)
<br />
<br />


<a name="events"></a>
## Events
$hi makes use of io.EventEmitter.

Listening to an event is as easy as:  
<pre>
call.on('state', function(state){
  // …
});
</pre>

[back to top](#toc)
<br />
<br />


<a name="hi"></a>
## $hi
Globally accessable API object.

<a name="hiconnect"></a>
### $hi.connect(options)
Initiates a bidirectional connection to the Javascript API server.

Options:  

* `token` - To authenticate the user  
* `callback` - If the connection is established, the given function is called. As alternative for the callback $hi.on('connected') event can be used.


**Example: connecting to the API with the token** 
<pre>$hi.connect({
  token: YOUR_TOKEN,
  callback: function(connectionId, userId, profiles, credentials){
    // your are now connected
  }
});
</pre>

<a name="hiEventConnected"></a>
### Event: connected
`function(connectionId, userId, profiles, credentials){}`  

Emitted when the API client successfully connected to the server and is ready to send and receive messages and calls.


<a name="hiRenderMe"></a>
### $hi.renderMe(containerId, cb, errCb, settings)
This method requests the permissions to use the local camera and/or microphone and renders the self-view in the provided containerId.


The `containerId` is the id of the container in which the self-view should be rendered.

The `cb` callback is called when user allowed the permissions.

The `errCb` callback is called when user didn't allow the permissions.

The `settings` argument is an object which allows you to specify various settings:

- `audio`: (Boolean) activate audio.
- `video`: (Boolean) activate video.
- `quality`: (String, optional) ['low', 'medium', 'high'] Optionally set a quality preset. By default 'high' is used and should be fine in most scenarios since WebRTC is adaptive on bandwidth.
- `width`: (String, optional) Optionally set a CSS property to control the width of the video element (e.g. 'auto', '100px' or '100%).
- `height`: (String, optional) Optionally set a CSS property to control the height of the video element (e.g. 'auto', '100px' or '100%).



<a name="hiOpenCall"></a>
### $hi.openCall(options)
This method returns a [`$hi.Call`](#hiCall) object that represents the call locally.
This object will be updated by the JavaScript API to reflect the state of that call.

A call requires the ids of the user profiles that participate in that call.
The `options` argument requires the following attributes:

- `from`
- `to`
- `immediate`
- `settings`

The `from` argument represents the profile id of the call initiator.
The `to` argument is an array of profile ids representing the receivers of that call.
If there is only one receiver, then you can specify it directly instead of wrapping it in an array. 

The `immediate` attribute specifies whether the call should be initiated immediately.
If _false_, the call has to be initiated manually after creation by using [call.init()](#hiCallInit).

The `settings` argument allows you to specify various call settings:

- `audio`: (Boolean) activate audio for this call
- `video`: (Boolean) activate video for this call. The video argument will indicate to the receiver(s) that you want to initiate a video call.
- `quality`: (String, optional) ['low', 'medium', 'high'] Optionally set a quality preset. By default 'high' is used and should be fine in most scenarios since WebRTC is adaptive on bandwidth.

A call [Participant](#hiParticipant) is a user profile that is either the initiator or a receiver of that call.
A user can be connected from more than one device, however he can actively participate in a call only from one of them.


<a name="hiJoinRoom"></a>
### $hi.joinRoom(options, callback, errorCallback)
This method returns a [`$hi.Room`](#hiRoom) object that represents the room locally.
This object will be updated by the JavaScript API to reflect the state of the room and its participants.

A room requires a name to identify the room. The `options` argument requires the following attributes:
- `name`
- `autoAcceptCalls` (default true)
 
The errorCallback will be called (by providing 1 object argument) when trying to join a restricted room (see Room REST API). The response is in format of errorCallback({ code: error-code, name: room-name, message: friendly-error-message}).
Possible error codes:
- `no_access` - Private room and the user isn't part of the allowedProfileIds.
- `full` - The room is full.


<a name="hiEnableVideo"></a>
### $hi.enableVideo()
Enable all outgoing video (for earlier disabled outgoing video).
Returns the new state of outgoing video.


<a name="hiDisableVideo"></a>
### $hi.disableVideo()
Disable all outgoing video.
Returns the new state of outgoing video.


<a name="hiToggleVideo"></a>
### $hi.toggleVideo()
Toggle the state of all outgoing video.
Returns the new state of outgoing video.


<a name="hiEnableAudio"></a>
### $hi.enableAudio()
Enable all outgoing audio (for earlier disabled outgoing audio).
Returns the new state of outgoing audio.


<a name="hiDisableAudio"></a>
### $hi.disableAudio()
Disable all outgoing audio.
Returns the new state of outgoing audio.


<a name="hiToggleAudio"></a>
### $hi.toggleAudio()
Toggle the state of all outgoing audio.
Returns the new state of outgoing audio.


<a name="hisendTextMessage"></a>
### $hi.sendTextMessage(options)
Using sendTextMessage you can send messages to a profileId, or to multiple profileId's (array)
<pre>
$hi.sendTextMessage(options)
</pre>

The `options` argument requires the following attributes:

- `from`: YOUR_PROFILE_ID
- `to`: TO_PROFILE_ID or [TO_PROFILE_ID, …]
- `text`: STRING with content of your text message

<a name="hisendCustomMessage"></a>
### $hi.sendCustomMessage(options) 

CustomMessages allow you to send anything.
Where sendTextMessages always converts the message to text, with sendCustomMessage you can send objects, data ... anything really.
This can be used in games, for example, to broadcast the position of a player without having to run your own socket server. 

The length of the content of a custom message is currently limited to 255 bytes.

Any application that wants to exchange, send or receive data can use these customMessages.  

[back to top](#toc)
<br />
<br />


<a name="hiRoom"></a>
## $hi.Room(options)
**Note:** Instead of constructing a room directly, consider using [$hi.joinRoom](#hiJoinRoom).  

<a name="hiRoomEvents"></a>
### Events
Possible room events:  

* participants:enter  
* participants:leave  
* text:received  
* call:received  
* call:accepted  

<a name="hiRoomOpenCall"></a>
### room.openCall(options)  
Similar to [$hi.openCall](#hiopenCall), except it will call all participants in the room instead of just one participant.

<a name="hiRoomSendTextMessage"></a>
### room.sendTextMessage(options)  
Similar to [$hi.sendTextMessage](#hisendTextMessage), except it will send a text message to the whole room instead of just to one participant.

[back to top](#toc)
<br />
<br />



<a name="hiCall"></a>
## $hi.Call(options)
**Note:** Instead of constructing a call directly, consider using [$hi.openCall](#hiOpenCall).  

<a name="hiCallInit"></a>
### call.init()

Initiates the call. Only needs to be called if `immediate` was set to `false`, otherwise the call has already been initiated.

<a name="hiCallAccept"></a>
### call.accept()  
Accepts an incoming call. The call:accepted event is emitted for all parties.
The call can now be processed like this:

<pre>
$hi.on('call:accepted', function(call, acceptedParticipant) {

  // The participants array holds all participants, including yourself
  call.participants.forEach(function(index, participant) {
  
    // Filter yourself out
    if (!participant.isMe) { 

      // The id of the element holding the Streaming Player
      var containerId = "callwindow_" + call.id + '_player_' + participant.id;

      // Render the Streaming Player
      participant.render({
        containerId: containerId
      });
    }
  });
});
</pre>

<a name="hiCallReject"></a>
### call.reject()  
Rejects an incoming call.
This means that the receiving party actively rejected the call.
Both caller and receiver will get the call:rejected event.

<pre>
callIncoming.on('call:rejected', function(call, participant) {
  // call        : callObject, the call that was rejected
  // participant : profile of the participant that rejected the call   
});
</pre>

<a name="hiCallIgnore"></a>
### call.ignore()  
Ignoring an incoming call.
In this scenario the receiver does not want to take the call, and does not want the caller to know that he actively rejected it.

End-users may have a running desktop application, and a mobile application.
Ignoring the call will make sure the call stops ringing on all devices without notifying the caller.

<pre>
callIncoming.on('call:ignored', function(call) {

  // call : callObject, the call that was ignored
  // NOTE: not dispatched 
});
</pre>

<a name="hiCallHold"></a>
### call.hold()  
Put a current call on hold.
The receiver decides to hold the call, the call:hold event is dispatched to all parties.

<pre>
// Holding the current, active call
callCurrent.hold();

// Listen for hold events on the current call
callCurrent.on('call:hold', function(call, participant) {

  if (participant.isMe) {
    // store the callObject that has been put on hold
    callHoldingLine = call;
  
    // empty the current call
    callCurrent = null;  
    
  } else { 
    // "participant" has put the call on hold  
  }
});
</pre>

<a name="hiCallResume"></a>
### call.resume()
Resume a call that has previously been put on hold.

<pre>
// Resume the call 
callHoldingLine.resume();

// Listen for hold events on the current call
callCurrent.on('call:hold', function(call, participant) {
  if (participant.isMe) {
    // store the callObject that has been put on hold
    callHoldingLine = call;
  
    // empty the current call
    callCurrent = null;  

  } else { 
    // "participant" has put the call on hold  
  }
})
</pre>

<a name="hiCallHangup"></a>
### call.hangup()
Hangup a current call. Or, as initiator, you can hangup a call that has not been picked up yet by the recipient

<br><br>
[back to top](#toc)

<a name="hiParticipant"></a>
## $hi.Participant()
**Note:** Instead of constructing a Participant object directly, use participants provided by other means like room.on("participant:enter").
Participant object is the object which represents the other person remotely. This object will will provide features for sending messages, rendering, managing calls and other participant related actions.

<a name="hiParticipantEvents"></a>
### Events
Possible participant events:
* ringing - incoming call for participant.
* ringing_timeout - ringer timeout, incoming call cancelled.
* accepted - participant accepted a call.
* rejected - participant rejected a call.
* hangup - participant hung up the call.
* rendered - participant is rendered. This event contains more information about the devices and resolutions used (for remote webcam). See [participant.render()](#hiParticipantRender) for more information.
* data:message - peer-to-peer data message for participant received, see [participant.sendDataChannelMessage()](#hiParticipantSendDataChannelMessage)
* video:lowfps:start - Low FPS occuring (start/stop). See [Low FPS Events](#hiParticipantLowFpsEvents) for more information.
* video:lowfps:stop - FPS back to normal. See [Low FPS Events](#hiParticipantLowFpsEvents) for more information.
* video:lowfps - Low FPS occuring (ticks). See [Low FPS Events](#hiParticipantLowFpsEvents) for more information.


<a name="hiParticipantLowFpsEvents"></a>
### Low FPS events
These events are triggered on the participant object once we're detecting bad video performance on the video stream. Eventhough the Video streams are adapted to the available bandwidth it could occur that the bandwidth is way too less for video to work at all. Also hardware/performance issues on the client device could be a reason for bad video. These events are triggered to give the possibility to inform end-users ("Please close some applications/tabs") or programatically disable video (e.g. by using the toggleVideo functions).

There are 2 options for implementation. Either by start/stop or tick events when the FPS disruption is occurring.
<pre>
// Start / stop
participant.on("video:lowfps:start", function(data) {
    console.log("Low fps started. FPS: " + data.fps);
});
</pre>

<pre>
participant.on("video:lowfps:stop", function(data) {
    console.log("FPS back to normal.");
});
</pre>

<pre>
// Using ticks
participant.on("video:lowfps", function(data) {
    console.log("Low fps detected. FPS: " + data.fps);
});
</pre>

Dev tip: The FPS can be disrupted by using Chrome tabs (only visible tabs are rendered by Chrome, hidden ones will have zero fps).

<a name="hiParticipantRender"></a>
### participant.render(settings)
Depending on the state of the connection it could be that the rendering is delayed till the connection is established.
The event "rendered" will be triggered once the rendering is finished. This event will contain information about the call, render container and remote device information (when available).
Structure of the data in the "rendered" event:
<pre>
{ 
   settings: {
      audio: audio-state,
      video: video-state,
      quality: video-quality
   },
   device {
      audio: {
         id: id-of-audio-device,
         label: label-of-audio-device
      },
      video: {
         id: id-of-video-device,
         label: label-of-video-device,
         width: resolution-of-video,
         height: resolution-of-video
      }
   },
   container: html-dom-element
}
</pre>

Render the participant's video (or audio element) to the DOM.
<pre>
participant.render({
  containerId: containerId,
  width: "100%",
  height: "auto"
});
</pre>

<a name="hiParticipantRemove"></a>
### participant.remove()
Remove a participant from the DOM and other entities.

<a name="hiParticipantSendDataChannelMessage"></a>
### participant.sendDataChannelMessage(message)
Send any data message (formatted as string) to the participant using the peer-to-peer data channels. This message will be in-sync with ongoing audio or video streams.
You can also send over JSON or other structures, just be sure to JSON.stringify and JSON.parse the message.
To receive messages create an eventhandler for "data:message" events on the participant.
<pre>
participant.on('data:message', function(message) {
  // var message = { label: "label-of-channel", data: "data received" }
  console.log("Peer 2 peer message from client: ", message.data);
});
</pre>


<a name="hiParticipantEnableVideo"></a>
### participant.enableVideo()
Enable incoming video for participant (for earlier disabled incoming video).
Returns the new state of incoming video.

<a name="hiParticipantDisableVideo"></a>
### participant.disableVideo()
Disable incoming video for participant.
Returns the new state of incoming video.

<a name="hiParticipantToggleVideo"></a>
### participant.toggleVideo()
Toggle the state of incoming video for participant.
Returns the new state of incoming video.

<a name="hiParticipantEnableAudio"></a>
### participant.enableAudio()
Enable incoming audio for participant (for earlier disabled incoming audio).
Returns the new state of incoming audio.

<a name="hiParticipantDisableAudio"></a>
### participant.disableAudio()
Disable incoming audio for participant.
Returns the new state of incoming audio.

<a name="hiParticipantToggleAudio"></a>
### participant.toggleAudio()
Toggle the state of incoming audio for participant.
Returns the new state of incoming audio.

[back to top](#toc)
<br />
<br />

<a name="hiGetCapabilities"></a>
### $hi.getCapabilities(callback) 
To detect wether a participant has an up-to-date browser supporting all the required components, $hi.getCapabilities() can be called on $hi.js to check the capabilities. 
This function also hints on other possibilities to continue with the current webbrowser (e.g. by offering to install a small plugin for Internet Explorer or Safari).
When the browser plugin is already installed the HidashHi platform will work as any other WebRTC-enabled browser.
To install/offer a plugin to a user for browsers which are supported check the content of the HidashHi capabilities.

<pre>

// Check HidashHi browser capabilities
$hi.getCapabilities(function(error, capabilities) {
    if (capabilities.webrtc) {
        // we have webrtc so it's all fine - proceed.
    } else if (capabilities.plugin_offer) {
        // we don't have webrtc but we can offer the user to install a plugin
        // The download-link, name and logo can be found in plugin_offer
        // capabilities.plugin_offer structure: { name: -plugin name-, logo: -plugin logo (256x256 png)-, download: -download link to plugin- }
    } else {
        // unsupported browser.
    }
});
</pre>
[back to top](#toc)
<br />
<br />
