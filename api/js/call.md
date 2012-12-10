
# JavaScript API Call Management #


## Introduction


The JavaScript API allows developers to integrate video conferencing within their applications.

**NOTE:** The following sections assume that you successfully configured your application to work with the JavaScript API (**link here**) and the user was successfully connected (**link here**).


## Getting Started


Initiating a call requires calling the `JSAPI.openCall` method:

	JSAPI.openCall = function(options) { /* ... */ }

This method sends a `call.init` message to the messaging server and returns a `JSAPI.Call` object that represents the call locally. This object will be updated automatically by the JavaScript API to reflect the global state of that call.

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

When the JavaScript API receives a call (that is, when it receives a `call.init` message), it first tries to determine the role of the connected participant. It then creates a `JSAPI.Call` object for that call, if the call was not initiated from that connection.

After that, it notifies the application that is consuming the API about the received call, according to the role of that participant. If the user is an active initiator or a passive initiator, then the JavaScript API will fire no event. However, if the participant is a passive initiator, then the JavaScript API will switch that connection to a pending state and notify the messaging server about it by sending a `call.pending` message.

If the connected user is a receiver, the JavaScript API will emit a `call:received` event through the `JSAPI` object, after sending a `call.ringing` to the messaging server to notify all participants that it's ringing on this connection. The client has to respond to the `call.init` message with a `call.ringing` message within a limited period of time imposed by the init timeout, in order for the messaging server to take the connection into account for that call as a potential active receiver connection. If the messaging server does not receive a `call.ringing` message within that time, it will remove that connection from the active connections list for that participant. If that connection was the last active connection of that receiver, the messaging server will send a `call.init_timeout` message to all participants, to inform them that the respective receiver could not be reached.

The `call:received` event will include the corresponding `JSAPI.Call` as argument. This event allows client applications to react when a call is received, so that they can notify the user about the received call and start playing the ringing tone.

You can register an observer for this event using:

	JSAPI.on('call:received', function(call) {
		// Handle incoming call...
	});

At this phase, the user can accept, decline or ignore the call within a timeframe imposed by the ringing timeout, which is managed by the messaging server. If the messaging server does not receive a response for the `call.init` message within that time, it will send a `call.ringing_timeout` message to all participants. When the JavaScript API receives a `call.ringing_timeout` message for the connected user, it emits a `call:end` event through the `JSAPI` object, to notify the client application that the call has ended for that user. Note that this event is also emitted by the JavaScript API after a `call.hangup` message sent by the connected user from the same connection or another connection.

A call can be accepted using the `JSAPI.Call.accept` method. This method will update local state accordingly and will send a `call.accept` message to all participants. At this moment, the JavaScript API also sets up audio and/or video streamers locally, as specified in the `options` argument passed to the `JSAPI.openCall` method and it waits for streams from the other peers. When the other peers receive a `call.accept` message, the JavaScript API starts their audio and/or video streamers and creates players for each active peer. The javaScript API will notify the client application by firing a `call:accepted` event through the `JSAPI` object. You can register an observer for this event using:

	JSAPI.on('call:accepted', function(call, acceptedBy,  fromConnection) {
		// Handle event...
	});

The registered callback function will receive the following arguments:

- `call` - a `JSAPI.Call` object representing the accepted call
- `acceptedBy` - the profile id of the accepting participant
- `fromConnection` - the id of the connection from where the participant accepted the call

You can decline a call using `JSAPI.Call.reject`.
