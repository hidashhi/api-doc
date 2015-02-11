# HidashHi JS API Documentation

Navigation: [Overview](overview.md) | [REST API](rest.md) | [Examples & Tutorials](samples_and_how_tos.md) | [FAQ](faq.md)

<a name="toc"></a>
## Table of Contents

* [Introduction](#introduction)
* [Authentication](#authentication)
* [Events](#events)
* [$hi](#hi)
    * [$hi.connect(options)](#hiconnect)
    * [$hi.renderMe(containerId, cb, errCb, settings)](#hiRenderMe)
    * [$hi.openCall(options)](#hiOpenCall)
    * [$hi.joinRoom(options)](#hiJoinRoom)
    * [$hi.sendTextMessage(options)](#hisendTextMessage)
    * [$hi.sendCustomMessage(options)](#hisendCustomMessage)
    * [Event: connected](#hiEventConnected)
* [$hi.Room(options)](#hiRoom)
    * [room.openCall(options)](#hiRoomOpenCall)   
    * [room.sendTextMessage(options)](#hiRoomSendTextMessage)  
    * [Events](#hiRoomEvents)
* [$hi.Call(options)](#hiCall)
    * [call.init()](#hiCallInit)  
    * [call.accept()](#hiCallAccept)   
    * [call.reject()](#hiCallReject)
    * [call.ignore()](#hiCallIgnore)
    * [call.hold()](#hiCallHold)
    * [call.resume()](#hiCallResume)
    * [call.hangup()](#hiCallHangup)
* [$hi.Participant(call, options)](#hiParticipant)
    * [participant.render()](#hiParticipantRender) 
    * [participant.remove()](#hiParticipantRemove) 
    * [Events](#hiParticipantEvents)
* [$hi.TextMessage(msg)](#hiTextMessage)
    * [textMsg.edit(newContent)](#hiTextMessage)
    * [textMsg.remove()](#hiTextMessageRemove)
* [$hi.Audio (Extension)](#hiAudio)
    * [$hi.Audio.init(settings)](#hiAudioInit)
* [$hi.getCapabilities](#hiGetCapabilities)
    * [$hi.getCapabilities()](#hiGetCapabilities)

<a name="introduction"></a>
## Introduction

The Javascript API is intrinsic to the HidashHi real time communication and can be integrated into an application/website to make use of the HidashHi resources.
Applications may send and receive text messages, place and receive calls, and use other features on the Hidashhi platform.
The Javascript API is served as a Javascript file from the HidashHi CDN. It is available in a minified version at <provided-HidashHi CDN>/js/api/1/hi.js (or <provided-HidashHi CDN>/js/api/1/hi.dev.js while we are in beta).

For usage examples, please have a look at [our API examples on Github](https://github.com/hidashhi/api-examples).

The Javascript API uses the [Socket.io](http://www.socket.io) Client as a transport layer.

[back to top](#toc)
<br />
<br />

<a name="authentication"></a>
## Authentication  
To use the API on behalf of the user, you need an access token.
To obtain an access token, the user has to be actually logged in to his Hidashhi account and grant access to your application.
This process is described in the [OpenAuth2 protocol](http://oauth.net/2/).

### Request a token
This is the flow for requesting a token:

1. **Your App** generates a local random string (state) to identify the request.
2. **Your App** redirects the user to the Hidashhi oAuth2 dialog at `<provided-HidashHi Auth-server>/oauth/dialog/?appId=YOUR_APP_ID&redirect_uri=YOUR_APP_URL&state=YOUR_GENERATED_STATE`
3. **The User allows** access to his account/profile by your application.
4. **The API** redirects the user to `YOUR_APP_URL?code=ACCESS_CODE&state=YOUR_GENERATED_STATE`
5. **Your App** checks if the given state is the one it generated earlier for the request.
6. **Your App** exchanges the delivered ACCESS_CODE for an access token via a REST API request to `<provided-HidashHi REST-server>getTokenForCode/?appId=YOUR_APP_ID&code=ACCESS_CODE`

**An example** of how to request an access token can be found in the [API examples at github](https://github.com/hidashhi/api-examples).

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

[back to top](#toc)
<br />
<br />

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


[back to top](#toc)
<br />
<br />


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


[back to top](#toc)
<br />
<br />

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

[back to top](#toc)
<br />
<br />

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

[back to top](#toc)
<br />
<br />

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

<a name="hiEventConnected"></a>
### Event: connected
`function(connectionId, userId, profiles, credentials){}`  

Emitted when the API client successfully connected to the server and is ready to send and receive messages and calls.

[back to top](#toc)
<br />
<br />


<a name="hiRoom"></a>
## $hi.Room(options)
**Note:** Instead of constructing a room directly, consider using [$hi.joinRoom](#hiJoinRoom).  

<a name="hiRoomOpenCall"></a>
### room.openCall(options)  
Similar to [$hi.openCall](#hiopenCall), except it will call all participants in the room instead of just one participant.

<a name="hiRoomSendTextMessage"></a>
### room.sendTextMessage()  
Similar to [$hi.sendTextMessage](#hisendTextMessage), except it will send a text message to the whole room instead of just to one participant.

<a name="hiRoomEvents"></a>
### Events
Possible room events:  

* participants:enter  
* participants:leave  
* text:received  
* call:received  
* call:accepted  

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
## $hi.Participant(call, options)
When a call is accepted you can render the participant streams to the screen using the following code:
<pre>
call.participants.forEach(function(index, participant) {
  if (!participant.isMe) {
    var containerId = "hi_call_current_" + call.id + '_player_' + participant.id;

    participant.render({ containerId: containerId });
    participant.on('state', function(state) {
      if (state === 'connecting') {
        //
      } else if (state === 'playing') {
        //
      }
    });
  }
});
</pre>

[back to top](#toc)
<br />
<br />

<a name="hiParticipantRender"></a>
### participant.render()
<pre>
// Render the participant Streaming Player to the DOM.
participant.render({
  containerId: containerId,
  width: 320,
  height: 240
});
</pre>

[back to top](#toc)
<br />
<br />

<a name="hiParticipantRemove"></a>
### participant.remove()
Remove a participants Streaming Player from the DOM.
<pre>
participants.remove(call.participants)
</pre>

[back to top](#toc)
<br />
<br />

<a name="hiParticipantEvents"></a>
### Events
Possible participant events:  

* ready  
* ringing  
* accepted  
* connecting  
* connected  
* stream:start  
* stream:stop  
* hangup  

[back to top](#toc)
<br />
<br />

<a name="hiTextMessage"></a>
## $hi.TextMessage(msg)
Using the JavaScript API you can
send and receive text messages between users,
edit existing text messages
or delete them from a conversation with ease.
The platform provides a secure and very flexible set of primitives that allows developers to create various kinds of applications like instant messaging or chat rooms, with applicability in any field you can think of.

[back to top](#toc)
<br />
<br />

<a name="hiTextMessageEdit"></a>
### textMsg.edit(newContent)  
//...

<a name="hiTextMessageRemove"></a>
### textMsg.remove()  
//...

<a name="hiTextEvents"></a>
### Events 
//...

<a name="hiAudio"></a>
## $hi.Audio (Extension)
The `Audio` extension provides a configurable sound theme, which automatically hooks up to $hi events.
It plays sounds for an incoming call, dialing, hangup or incoming messages for example.

The Audio singleton is provided when including the full production API `hi.js`.
If not needed, one can include the base API `hi.base.js` only.
It can be loaded separately, on top of the base API, from `hi.audio.js`.

[back to top](#toc)
<br />
<br />

<a name="hiAudioInit"></a>
### $hi.Audio.init(settings)  
In the settings object you can manipulate the sound theme.
It will be merged with the default settings on `$hi.Audio.settings`, which can be manipulated directly as well.
The `settings.theme` field holds configuration objects for the different sounds in the theme.

Sounds in the default theme:  

* welcome
* ringing
* hangup
* connecting 
* rejected
* text_incoming
* text_outgoing  

A theme settings for a sound in `Audio.settings` basically looks like this:  
<pre>
welcome: {
  url: '/sounds/welcome.mp3',
  trigger: function(fnPlay, fnStop) {
    // …  
  },
  loop: false,
  active: true
},
</pre>

The `url` is by default prepended with the domain for the HidashHi CDN.
If you want to use sound files from your own source, just set `$hi.Audio.external = true` and it will not be prepended anymore.

The `trigger` function just hooks up to events on `$hi` and uses the given `fnPlay` and `fnStop` functions to determine when the sound should start playing and when it should be stopped again (in the case of a looped sound).
The default `trigger` for the `welcome` sound looks like this:  
<pre>
function(fnPlay, fnStop) {
  // Play sound when we get connected to the API server
  $hi.on('connected', fnPlay);
}
</pre>

A theme can be adjusted by manipulating `$hi.Audio.settings` _before_ calling `init`, or be extended/merged by specifying a theme in the argument given to `$hi.Audio.init(settings)`.

[back to top](#toc)
<br />
<br />


<a name="hiGetCapabilities"></a>
### $hi.getCapabilities() 
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
        // capabilities.plugin_offer structure: { name: <plugin name>, logo: <plugin logo (256x256 png)>, download: <download link to plugin> }
    } else {
        // unsupported browser.
    }
});
</pre>
[back to top](#toc)
<br />
<br />
