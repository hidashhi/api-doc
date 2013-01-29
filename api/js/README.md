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
* [Additional Info](#additionalInfo)
* [$hi](#$hi)
	* $hi.connect(options)
	* $hi.openCall(options)
	* $hi.sendTextMessage(options)
	* $hi.sendCustomMessage(options)
	* Events
	* $hi.Call(options)
		* call.init()  
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
		* [Events](#hiParticipantEvents)
	* $hi.TextMessage(msg)
		* textMsg.edit(newContent)  
		* textMsg.remove()  
		* Events 

<a id="introduction"></a>
## Introduction

The Javascript API is intrinsic to the HidashHi real time communication and needs to be integrated into an application website to make use of the HidashHi resources.
The applications may send and receive text messages, may place and receive calls, and should mitigate the user’s interaction with the online environment.
The Javascript API is served as a Javascript file from the HidashHi CDN. It should be available from http://cdn.hidashhi.com/js/api/1/hi.js .

An in-detail view of the API objects, methods and events can be found documented in the appropriate files.

<a id="authentication"></a>
## Authentication ##

// TODO

<a id="additionalInfo"></a>
## Further information on objects  

- [$hi.Call](call.md)
- [$hi.TextMessage](text_message.md)


## $hi
//...

### $hi.connect(options)
//...

### $hi.openCall(options)
//...

### $hi.sendTextMessage(options)
//...

### $hi.sendCustomMessage(options)
//...

### Events
//...

### $hi.Call(options)
//... 

#### call.init()  
//...

#### call.accept()  
//...

#### call.reject()  
//...

#### call.ignore()  
//...

#### call.hold()  
//...

#### call.resume()
//...

#### call.hangup()
//...

#### Events
//...

<a id="hiParticipant"></a>
### $hi.Participant(call, options)
//...

#### participant.render()  
//...

#### participant.remove()
//...

<a id="hiParticipantEvents"></a>
#### Events
//...

### $hi.TextMessage(msg)
//...

#### textMsg.edit(newContent)  
//...

#### textMsg.remove()  
//...

#### Events 
//...
