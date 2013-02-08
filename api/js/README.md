# HidashHi JS API Documentation

Navigation:
[Overview](../../overview.md) |
[REST API](../rest/README.md) |
[Examples & Tutorials](../../samples_and_how_tos.md) |
[FAQ](../../faq.md)

<a id="toc"></a>
## ToC

* [Introduction](#introduction)
* [Authentication](#authentication)
* [Events](#events)
* [$hi](#hi)
	* [$hi.connect(options)](#hiConnect)
	* [$hi.openCall(options)](#hiOpenCall)
	* [$hi.sendTextMessage(options)](#hisendTextMessage)
	* [$hi.sendCustomMessage(options)](#hisendCustomMessage)
	* [Events](#hiEvents)
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

<a id="introduction"></a>
## Introduction

The Javascript API is intrinsic to the HidashHi real time communication and can be integrated into an application/website to make use of the HidashHi resources.
Applications may send and receive text messages, place and receive calls, and use other features on the Hidashhi platform.
The Javascript API is served as a Javascript file from the HidashHi CDN. It should be available from http://cdn.hidashhi.com/js/api/1/hi.js (or http://cdn.beta.hidashhi.com/js/api/1/hi.js).

For usage examples, please have a look at [our API examples on Github](https://github.com/hidashhi/api-examples).


<a id="authentication"></a>
## Authentication ##
The authentication is done via a token. When you'd like to authenticate a user you'll need to include the oAuth authorisation script. That script will load you config file in which your appId and apiKey is listed. The auth.php script will load the configuration and checks if the user is logged in. 

**Example; included auth part (PHP)** 
<pre>
require_once('auth.php');
</pre>

**Example; Get token value (Javascript)** 
<pre>
var $hi_token = "< php $_SESSION['token']; ?>";
</pre>
<a id="hi"></a>
<a id="hiConnect"></a>
### $hi.connect(options)
If the user is not logged-in he will be redirected to the Hidashhi login page, which wil in turn redirect back to the URL of your appiication. When the user is logged in a token will be requested which can be used to access the API. The token will be available in a PHP Session '$_SESSION['token']'. Put the value of this session into a Javascript to pass it onto the Javascript API.

**Example: connecting to the API with the token** 
<pre>
$hi.connect({
  token: YOUR_TOKEN,
  callback: function(connectionId, userId, profiles, credentials){    
    // your are now connected
  }  
})
</pre>


<a id="hiOpenCall"></a>
### $hi.openCall(options)
This method returns a [`$hi.Call`](#hiCall) object that represents the call locally. This object will be updated by the JavaScript API to reflect the state of that call.

A call requires the ids of the user profiles that participate in that call. The `options` argument requires the following attributes:

- `from`
- `to`
- `chainId`
- `immediate`
- `settings`

The `from` argument represents the profile id of the call initiator. The `to` argument is an array of profile ids representing the receivers of that call. If there is only one receiver, then you can specify it directly instead of wrapping it in an array. 

As a text message, a call will also be part of a chain. If a chain id is not provided when the call is initiated, then the id of the `call.init` message will be used as the chain id. It is also possible for a chain to contain more than a call, but only the last call can be active.

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
Using sendTextMessage you can send messages to a profileId, or muliple profileId's (array)
<pre>
$hi.sendTextMessage(YOUR_PROFILE_ID, TO_PROFILE_ID, false, "Your text message")
</pre>
<br />
<a id="hisendCustomMessage"></a>
### $hi.sendCustomMessage(options) !not implemented

CustomMessages allow you to send anything. Where sendTextMessages always converts the message to text, with sendCustomMessage you can send objects, data, anything really. This can be used, for example, in games to broadcast the position of a player without having to run your own socketserver(s). 

Any application that wants to exchange, send or receive data can use these customMessages.
This feature is not yet available in the API.

<br />

<a id="hiCall"></a>
## $hi.Call(options)
**Note:** Instead of constructing a call directly, consider using [$hi.openCall](#hiOpenCall).  

<a id="hiCallInit"></a>
### call.init()  
If 'immediate' is set to false this has to be called seperatly. If 'immediate' is set to true then the call is placed directlty when the call request is fired. By using "false" calls could be put in an object, to actually start that call you need use call.init()

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
Hangup a current call. Or, as iniator, you can hangup a call that has not been picked up yet by the recipient

<br><br>
[back to top](#toc)

<a id="hiParticipant"></a>
## $hi.Participant(call, options)
When a call is accepted you can render the participant streams to the screen using the following code:
<pre>call.participants.forEach(function (index, participant) {

  // Find out which of the participant is you
  if (participant.isMe) {

    // Your camera will be rendered in an element with this id
    var containerId = "YOUR_CAMERA_HOLDER"

    // Render the Camera
    call.me.render({containerId: containerId})

  } else {

    // The element in which the participnat is rendered
    // Typically you create this Id using both the call.id and participant.id
    // This process ensures the element is unique, and can be accessed if required
    var containerId = "hi_call_current_" + call.id + '_player_' + participant.id

    // Render the Streaming Player
    participant.render({containerId: containerId})

    // Listen for state changes
    $hi._flashContainers['' + call.id + '' + containerId + ''].on('state', function (state) {
    
      if (state == 'connecting') {
        // the participant is connecting
      }
      if (state == 'playing') {
        // the participant stream is playing
      }
    })
  }
})
</pre>
<br>

<a id="hiParticipantRender"></a>
### participant.render()
<pre>
// Render the participant Streaming Player
participant.render({
  containerId: containerId,
  width: 320,
  height: 240
})
</pre>

<a id="hiParticipantRemove"></a>
### participant.remove()
Remove a participant from a call (for multiparty calling, this is not yet available in the API)
<pre>
participants.remove(call.participants)
</pre>

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

<a id="hiTextMessage"></a>
## $hi.TextMessage(msg)
Using the JavaScript API you can send and receive text messages
between users, edit existing text messages or delete them from a conversation with ease. The platform provides a secure and very flexible set of primitives that allows developers to create various kinds of applications like instant messaging or chat rooms, with applicability in any field you can think of.

<a id="hiTextMessageEdit"></a>
### textMsg.edit(newContent)  
//...

<a id="hiTextMessageRemove"></a>
### textMsg.remove()  
//...

<a id="hiTextEvents"></a>
### Events 
//...
