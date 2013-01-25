
# JavaScript API Call Management

Navigation:
[Overview](../../overview.md) |
[REST API](../rest/README.md) |
[JS API](../js/README.md) |
[Examples & Tutorials](../../samples_and_how_tos.md) |
[FAQ](../../faq.md)

## Introduction


The JavaScript API allows developers to integrate video conferencing within their applications.

**NOTE:** The following sections assume that you successfully configured your application to work with the JavaScript API and the user was successfully connected.


## Getting Started


#### Initiating Calls

You can initiate a call by calling the `$hi.openCall` method:

	$hi.openCall = function(options) { /* ... */ }

This method sends a `call.init` message to the messaging server and returns a `$hi.Call` object that represents the call locally. This object will be updated automatically by the JavaScript API to reflect the global state of that call.

As for text messages, a call require the ids of the user profiles that participate in that call. The `options` argument requires the following attributes:

- `from`
- `to`
- `chainId`
- `immediate`
- `settings`

The `from` argument represents the profile id of the call initiator. The `to` argument is an array of profile ids representing the receivers of that call. If there is only one receiver, then you can specify it directly instead of wrapping it in an array. 

As a text message, a call will also be part of a chain. If a chain id is not provided when the call is initiated, then the id of the `call.init` message will be used as the chain id. It is also possible for a chain to contain more than a call, but only the last call can be active.

The `immediate` attribute specifies wheter the call is initiated from the current connection or not.

The `settings` argument allows you to specify various call settings:

- `audio`: (Boolean) activate audio streaming for this call
- `video`: (Boolean) activate video streaming for this call

A call participant is a profile represented by its id that is either the initiator of that call or a receiver. If an user is connected from more than one device, every connection will be notified about any calls that user is involved in, but the user can participate actively in a call only from one of its connections. So, a participant to a call can have one of the following roles:

- `active initiator`
- `passive initiator`
- `active receiver`
- `passive receiver`

For example, consider two users, `A` and `B`, each of them having two active connections. So, user `A` is connected from its laptop (`c1`) and its mobile phone (`c2`). User `B` is also connected from its laptop (`c3`) and its mobile phone (`c4`).

Now, let's say user `A` calls user `B` from `c1` and user `B` takes the call from `c3`. Within this setup, user `A` will be an `active initiator` on `c1` and a `passive initiator` on `c2`. Similarly, user `B` will be an `active receiver` on connection `c3` and a `passive receiver` on `c4`.

Before accepting or declining a call, a receiver is neither active nor passive.


#### Handling Incoming Calls

When the JavaScript API receives a call (that is, when it receives a `call.init` message), it first tries to determine the role of the connected participant. It then creates a `$hi.Call` object for that call, if the call was not initiated from that connection.

After that, it notifies the application that is consuming the API about the received call, according to the role of that participant. If the user is an active initiator or a passive initiator, then the JavaScript API will fire no event. However, if the participant is a passive initiator, then the JavaScript API will switch that connection to a pending state and notify the messaging server about it by sending a `call.pending` message.

If the connected user is a receiver, the JavaScript API will emit a `call:received` event through the `$hi` object, after sending a `call.ringing` to the messaging server to notify all participants that it's ringing on this connection. The client has to respond to the `call.init` message with a `call.ringing` message within a limited period of time imposed by the init timeout, in order for the messaging server to take the connection into account for that call as a potential active receiver connection. If the messaging server does not receive a `call.ringing` message within that time, it will remove that connection from the active connections list for that participant. If that connection was the last active connection of that receiver, the messaging server will send a `call.init_timeout` message to all participants, to inform them that the respective receiver could not be reached.

The `call:received` event will include the corresponding `$hi.Call` as argument. This event allows client applications to react when a call is received, so that they can notify the user about the received call and start playing the ringing tone.

You can register an observer for this event using:

	$hi.on('call:received', function(call) {
		// Handle incoming call...
	});


#### Accepting Calls

At this phase, the user can accept, decline or ignore the call within a timeframe imposed by the ringing timeout, which is managed by the messaging server. If the messaging server does not receive a response for the `call.init` message within that time, it will send a `call.ringing_timeout` message to all participants. When the JavaScript API receives a `call.ringing_timeout` message for the connected user, it emits a `call:end` event through the `$hi` object, to notify the client application that the call has ended for that user. Note that this event is also emitted by the JavaScript API after a `call.hangup` message sent by the connected user from the same connection or from another connection.

A call can be accepted using the `$hi.Call.accept` method. This method will update local state accordingly and will send a `call.accept` message to all participants. At this moment, the JavaScript API also sets up audio and/or video streamers locally, as specified in the `options` argument passed to the `$hi.openCall` method and it waits for streams from the other peers. When the other peers receive a `call.accept` message, the JavaScript API starts their audio and/or video streamers and creates players for each active peer. The javaScript API will notify the client application by firing a `call:accepted` event through the `$hi` object. You can register an observer for this event using:

	$hi.on('call:accepted', function(call, acceptedBy,  fromConnection) {
		// Handle event...
	});

The registered callback function will receive the following arguments:

- `call` - a `$hi.Call` object representing the accepted call
- `acceptedBy` - the profile id of the accepting participant
- `fromConnection` - the id of the connection from where the participant accepted the call


#### Declining Calls

You can decline a call using `$hi.Call.reject` in the callback registered for the `call.received` event described above. As `$hi.Call.accept`, this method will first update local state and will send a `call.reject` message to the messaging server.

When the JavaScript API receives a `call.reject` message, it emits a `call:rejected` event through the `$hi` object. Then, if the connected user is the same as the participant that declined the call, it will also emit a `call:end` event through the same `$hi` object.

You can register an observer for the `call:rejected` event using:

	$hi.on('call:rejected', function(call, rejectedBy) {
		// Handle event...
	});

This callback function will receive the following arguments:

- `call` - a `$hi.Call` object representing the call
- `rejectedBy` - the profile id of the rejecting participant


#### Ignoring Calls

You can ignore a call by calling the `$hi.Call.ignore` method in the callback registered for the `call.received` event. When a participant ignores an incoming call, the JavaScript API first updates the local state and then emits a `call:end` event. Then, it notifies the messaging server by sending a `call.ignore` message. The messaging server will then notify only the connections belonging to the user that ignored the call about the event.

The rest of the participants will be notified only after the ringing timeout, with a `call.ringing_timeout` message, which will cause JavaScript API to emit a corresponding `call:ringing_timeout` event, as described previously.


#### Holding And Resuming Calls

Holding and resuming a call can be done using the `hold` and the `resume` methods exposed by the `$hi.Call` class.

When holding a call, the JavaScript API will send a `call.hold` message to notify the messaging server, wich will forward the message to all participants, including the sender of that message, because it might have more than one active connection and each connection must be notified.

When the JavaScript API receives a `call.hold` message, it will emit a `call:hoid` event through the `$hi` object, after updating local state. You can register an observer for this event like in the following example:

	$hi.on('call:hold', function(call, participant) {
		// Handle event...
	});

An user can resume a call only if he previously put the same call on hold. This can be done using the `$hi.Call.resume` method. This method will send a `call.resume` message to the messaging server, after updating local state. The messaging server will then forward the message to all participants. The JavaScript API, when it receives the `call.resume` message, it emits a `call:resumed` event, which will have the call and the profile id of the participant that resumed the call as arguments. You can register an observer for this event using:

	$hi.on('call:resumed', function(call, participant) {
		// Handle event...
	});


#### Ending Calls

Hanging up a call can be done using the `$hi.Call.hangup` method. This method sends a `call.hangup` message to the messaging server, which forwards it to all participants, including the participant that hung up.

As for the messages previously described, the JavaScript API will emit a `call:hangup` event. A callback for this event will receive a reference to the call and the profile id of the participant that hung up as arguments. You can register a callback for this event using:

	$hi.on('call:hangup', function(call, participant) {
		// Handle event...
	});

When there is only one active participant left, the messaging server sends a `call.end` message, and the JavaScript API will react to this message by firing a `call:end` event. The callback registered for this event will receive a reference to the call being ended.
