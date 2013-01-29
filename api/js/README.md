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
* [$hi](#$hi)
	* $hi.connect(options)
	* [$hi.openCall(options)](#hiOpenCall)
	* $hi.sendTextMessage(options)
	* $hi.sendCustomMessage(options)
	* Events
* [$hi.Call(options)](#hiCall)
	* [call.init()](#hiCallInit)  
	* call.accept()  
	* call.reject()  
	* call.ignore()  
	* call.hold()  
	* call.resume()
	* call.hangup()
	* Events
* [$hi.Participant(call, options)](#hiParticipant)
	* participant.render()  
	* participant.remove()  
	* [Event: state](#hiParticipantEventState)
* $hi.TextMessage(msg)
	* textMsg.edit(newContent)  
	* textMsg.remove()  
	* Events 

<a id="introduction"></a>
## Introduction

The Javascript API is intrinsic to the HidashHi real time communication and can be integrated into an application/website to make use of the HidashHi resources.
Applications may send and receive text messages, place and receive calls, and use other features on the Hidashhi platform.
The Javascript API is served as a Javascript file from the HidashHi CDN. It should be available from http://cdn.hidashhi.com/js/api/1/hi.js (or http://cdn.beta.hidashhi.com/js/api/1/hi.js).

For usage examples, please have a look at [our API examples on Github](https://github.com/hidashhi/api-examples).

<a id="authentication"></a>
## Authentication ##

// TODO

<a id="events"></a>
## Events
//...

**Example:** 
<pre> 
participant.on("state", function(state){
  // React...
});
</pre>


## $hi
//...

### $hi.connect(options)
//...

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


[Bring me back to the top](#toc)

### $hi.sendTextMessage(options)
//...

### $hi.sendCustomMessage(options)
//...

### Events
//...

<a id="hiCall"></a>
## $hi.Call(options)
//... 

**Note:** Instead of constructing a call directly, consider using [$hi.openCall](#hiOpenCall).  

<a id="hiCallInit"></a>
### call.init()  
//...

### call.accept()  
//...

### call.reject()  
//...

### call.ignore()  
//...

### call.hold()  
//...

### call.resume()
//...

### call.hangup()
//...

### Events
//...

<a id="hiParticipant"></a>
## $hi.Participant(call, options)
//...

### participant.render()  
//...

### participant.remove()
//...

<a id="hiParticipantEvents"></a>
### Event: state
//...

Possible participant states:  

* ready  
* ringing  
* accepted  
* connecting  
* connected  
* stream:start  
* stream:stop  
* hangup  

## $hi.TextMessage(msg)
Using the JavaScript API you can send and receive text messages
between users, edit existing text messages or delete them from a conversation with ease. The platform provides a secure and very flexible set of primitives that allows developers to create various kinds of applications like instant messaging or chat rooms, with applicability in any field you can think of.

### textMsg.edit(newContent)  
//...

### textMsg.remove()  
//...

### Events 
//...
