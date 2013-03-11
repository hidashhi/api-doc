# HidashHi JS API Documentation

Navigation: [Overview](overview.md) | [REST API](rest.md) | [Examples & Tutorials](samples_and_how_tos.md) | [FAQ](faq.md)

<a id="toc"></a>
## Table of Contents

* [Introduction](#introduction)
* [Authentication](#authentication)
* [Events](#events)
* [$hi](#hi)
	* [$hi.connect(options)](#hiconnect)
	* [$hi.openCall(options)](#hiOpenCall)
	* [$hi.sendTextMessage(options)](#hisendTextMessage)
	* [$hi.sendCustomMessage(options)](#hisendCustomMessage)
	* [Event: connected](#hiEventConnected)
* [$hi.Call(options)](#hiCall)
	* [call.init()](#hiCallInit)  
	* [call.accept()](#hiCallAccept)   
	* [call.reject()](#hiCallReject)
	* [call.ignore()](#hiCallIgnore)
	* [call.hold()](#hiCallHold)
	* [call.resume()](#hiCallResume)
	* [call.hangup()](#hiCallHangup)
	* [Events](#hiCallEvents)
* [$hi.Participant(call, options)](#hiParticipant)
	* [participant.render()](#hiParticipantRender) 
	* [participant.remove()](#hiParticipantRemove) 
	* [Event: state](#hiParticipantEventState)
* [$hi.TextMessage(msg)](#hiTextMessage)
	* [textMsg.edit(newContent)](#hiTextMessage)
	* [textMsg.remove()](#hiTextMessageRemove)
	* [Events](#hiTextMessageEvents)
* [$hi.Audio (Extension)](#hiAudio)
	* [$hi.Audio.init(settings)](#hiAudioInit)


<a id="introduction"></a>
## Introduction

The Javascript API is intrinsic to the HidashHi real time communication and can be integrated into an application/website to make use of the HidashHi resources.
Applications may send and receive text messages, place and receive calls, and use other features on the Hidashhi platform.
The Javascript API is served as a Javascript file from the HidashHi CDN. It should be available from http://cdn.hidashhi.com/js/api/1/hi.js (or http://cdn.beta.hidashhi.com/js/api/1/hi.js).

For usage examples, please have a look at [our API examples on Github](https://github.com/hidashhi/api-examples).

The Javascript API uses the [Socket.io](http://www.socket.io) Client as a transport layer

[back to top](#toc)
<br />
<br />

<a id="authentication"></a>
## Authentication  
To use the API in the name of the user, you need an access token. To get an access token, a user has to be actually logged in to his Hidashhi account, to allow your application access.
This process is described in the [OpenAuth2 protocol](http://oauth.net/2/).

### Request a token
This is the flow for a token request:

1. **Your App** generates a local random string (state) to identify the request.
2. **Your App** redirects the user to the Hidashhi oAuth2 dialog at `http://auth.hidashhi.com/oauth/dialog/?appId=YOUR_APP_ID&redirect_uri=YOUR_APP_URL&state=YOUR_GENERATED_STATE`
3. **The User allows** access to his account/profile by your application.
4. **The API** redirects the user to `YOUR_APP_URL?code=ACCESS_CODE&state=YOUR_GENERATED_STATE`
5. **Your App** checks if the given state is the one it generated earlier for the request.
6. **Your App** exchanges the delivered ACCESS_CODE for an access token via the REST API request to `http://rest.hidashhi.com/getTokenForCode/?appId=YOUR_APP_ID&code=ACCESS_CODE`

**An example** of how to request an access token can be found in the [API examples at github](https://github.com/hidashhi/api-examples).

[back to top](#toc)
<br />
<br />


<a id="events"></a>
## Events
$hi makes use of the io.EventEmitter.

Listening to an event is as easy as:  
<pre>
call.on('state', function(state){
  // …
}
</pre>

[back to top](#toc)
<br />
<br />


<a id="hi"></a>
## $hi
Globally accessable API object.

<a id="hiconnect"></a>
### $hi.connect(options)
Initiates a connection to the Javascript API server, providing a bidirectional connection.

Options:  

* `token` - To authenticate the user  
* `callback` - If the connection is established, the given function is called.  


**Example: connecting to the API with the token** 
<pre>$hi.connect({
  token: YOUR_TOKEN,
  callback: function(connectionId, userId, profiles, credentials){
    // your are now connected
  }
});</pre>

[back to top](#toc)
<br />
<br />


<a id="hiOpenCall"></a>
### $hi.openCall(options)
This method returns a [`$hi.Call`](#hiCall) object that represents the call locally. This object will be updated by the JavaScript API to reflect the state of that call.

A call requires the ids of the user profiles that participate in that call. The `options` argument requires the following attributes:

- `from`
- `to`
- `immediate`
- `settings`

The `from` argument represents the profile id of the call initiator. The `to` argument is an array of profile ids representing the receivers of that call. If there is only one receiver, then you can specify it directly instead of wrapping it in an array. 

The `immediate` attribute specifies whether the call should be initiated directly after creation. If _false_, the call has to be initiated manually after creation by using [call.init()](#hiCallInit).

The `settings` argument allows you to specify various call settings:

- `audio`: (Boolean) activate audio for this call
- `video`: (Boolean) activate video for this call. The video argument will indicate to the receiver(s) that you want to initiate a video call.

A call [Participant](#hiParticipant) is a user profile that is either the initiator of that call or a receiver. If a user is connected from more than one device, every connection will be notified about any calls that user is involved in, but the user can participate actively in a call only from one of its connections.  


[back to top](#toc)
<br />
<br />

<a id="hisendTextMessage"></a>
### $hi.sendTextMessage(options)
Using sendTextMessage you can send messages to a profileId, or multiple profileId's (array)
<pre>
$hi.sendTextMessage(options)
</pre>

**Options:**
- `from`: YOUR_PROFILE_ID
- `to`: TO_PROFILE_ID or [TO_PROFILE_ID, …]
- `text`: STRING with content of your text message

<br />

[back to top](#toc)
<br />
<br />

<a id="hisendCustomMessage"></a>
### $hi.sendCustomMessage(options) 

CustomMessages allow you to send anything. Where sendTextMessages always converts the message to text, with sendCustomMessage you can send objects, data, anything really. This can be used, for example, in games to broadcast the position of a player without having to run your own socket server(s). 

The content length for a custom message is currently limited to 255 bytes.

Any application that wants to exchange, send or receive data can use these customMessages.  

**This feature is only available for premium API users.**

[back to top](#toc)
<br />
<br />

<a id="hiEventConnected"></a>
### Event: connected
`function(connectionId, userId, profiles, credentials){}`  

Emitted when the API client successfully connected to the server and is ready to send and receive messages/calls.

[back to top](#toc)
<br />
<br />

<a id="hiCall"></a>
## $hi.Call(options)
**Note:** Instead of constructing a call directly, consider using [$hi.openCall](#hiOpenCall).  

<a id="hiCallInit"></a>
### call.init()  
If `immediate` is set to `false` this has to be called separately. If `immediate` is set to `true` then the call is placed directly when the call request is fired. By using `false` calls could be cached, to actually start that call you need use `call.init()`.

<a id="hiCallAccept"></a>
### call.accept()  
Accepting an incoming call

<a id="hiCallReject"></a>
### call.reject()  
Rejecting an incoming call

<a id="hiCallIgnore"></a>
### call.ignore()  
Ignoring an incoming call

<a id="hiCallHold"></a>
### call.hold()  
Put a current call on hold

<a id="hiCallResume"></a>
### call.resume()
Resume a call that has been put on hold before

<a id="hiCallHangup"></a>
### call.hangup()
Hangup a current call. Or, as initiator, you can hangup a call that has not been picked up yet by the recipient

<br><br>
[back to top](#toc)

<a id="hiParticipant"></a>
## $hi.Participant(call, options)
When a call is accepted you can render the participant streams to the screen using the following code:
<pre>call.participants.forEach(function (index, participant) {
  if (participant.isMe) {
    var containerId = "CAMERAHOLDER"
    call.me.render({containerId: containerId})
  } else {
    var containerId = "hi_call_current_" + call.id + '_player_' + participant.id
    participant.render({containerId: containerId})    
    participant.on('state', function (state) {
      if (state == 'connecting') {
      }
      if (state == 'playing') {
      }
    });
  }
});
</pre>

[back to top](#toc)
<br />
<br />

<a id="hiParticipantRender"></a>
### participant.render()
<pre>
// Render the participant Streaming Player to the DOM.
participant.render({
  containerId: containerId,
  width: 320,
  height: 240
})
</pre>

[back to top](#toc)
<br />
<br />

<a id="hiParticipantRemove"></a>
### participant.remove()
Remove a participants Streaming Player from the DOM.
<pre>
participants.remove(call.participants)
</pre>

[back to top](#toc)
<br />
<br />

<a id="hiParticipantEvents"></a>
### Event: state
Possible participant states:  

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

<a id="hiTextMessage"></a>
## $hi.TextMessage(msg)
Using the JavaScript API you can send and receive text messages
between users, edit existing text messages or delete them from a conversation with ease. The platform provides a secure and very flexible set of primitives that allows developers to create various kinds of applications like instant messaging or chat rooms, with applicability in any field you can think of.

[back to top](#toc)
<br />
<br />

<a id="hiTextMessageEdit"></a>
### textMsg.edit(newContent)  
//...

<a id="hiTextMessageRemove"></a>
### textMsg.remove()  
//...

<a id="hiTextEvents"></a>
### Events 
//...

<a id="hiAudio"></a>
## $hi.Audio (Extension)
The `Audio` extension provides a configurable sound theme, which automatically hooks up to $hi events. It plays sounds for an incoming call, dialing, hangup or incoming messages for example.

The Audio singleton is provided when including the full production API `hi.js`. If not needed, one can include the base API `hi.base.js` only. It can be separately loaded, in manual addition to the base API from `hi.audio.js`.

[back to top](#toc)
<br />
<br />

<a id="hiAudioInit"></a>
### $hi.Audio.init(settings)  
In the settings object you can manipulate the sound theme. It will be merged with the default settings on `$hi.Audio.settings`, which can be manipulated directly as well. The `settings.theme` member holds configuration objects for the different sounds in the theme.

Sounds in default theme:  

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
  trigger: function(fnPlay, fnStop){
    // …  
  },
  loop: false,
  active: true
},
</pre>

The `url` is by default prepended with the domain for the HidashHi CDN. If you want to use sound files from your own source, just set `$hi.Audio.external = true` and it will not be prepended anymore.

The `trigger` function just hooks up to events on `$hi` and uses the given `fnPlay` and `fnStop` functions to determine when the sound should start playing and when it should be stopped again (in the case of a looped sound). The default `trigger` for the `welcome` sound looks like this:  
<pre>
function(fnPlay, fnStop){
  // Play sound when we get connected to the API server
  $hi.on('connected', function(){
    // Start playing the sound
    fnPlay();
  });
}
</pre>

The theme can be adjusted by manipulating `$hi.Audio.settings` _before_ calling `init`, or be extended/merged by specifying a theme in the `settings` given to `$hi.Audio.init(settings)`.

[back to top](#toc)
<br />
<br />


