
# JavaScript API Call Management #


## Introduction


The JavaScript API allows developers to integrate video conferencing within their applications.

**NOTE:** The following sections assume that you successfully configured your application to work with the JavaScript API (**link here**) and the user was successfully connected (**link here**).


## Getting Started


Initiating a call requires calling the `JSAPI.openCall` method:

	JSAPI.openCall = function(
		fromProfileId,
		toProfileIds,
		chainId,
		options
		) { /* ... */ }

This method sends a `call.init` message to the messaging server and returns a `JSAPI.Call` object that represents the call locally. This object will be updated automatically by the JavaScript API to reflect the global state of that call.

As for text messages, a call require the ids of the user profiles that participate to that call. The `fromProfileId` argument represents the profile id of the call initiator. The `toProfileIds` argument is an array of profile ids representing the receivers of that call. If there is only one receiver, then you can specify it directly instead of wrapping it in an array. 

As a text message, a call will also be part of a chain. If a chain id is not provided when the call is initiated, then the id of the `call.init` message will be used as the chain id. It is also possible for a chain to contain more than a call, but only the last call can be active.

The `options` argument allows you to specify various call options:

- `audio`: (Boolean) activate audio streaming for this call
- `video`: (Boolean) activate video streaming for this call

A call participant is a profile represented by its id that is either the initiator of that call or a receiver. If an user is connected from more than one device, every connection will be notified about any calls that user is involved in, but the user can participate actively in a call only from one of its connections. So, a participant to a call can have one of the following roles:

- `active initiator`
- `passive initiator`
- `active receiver`
- `passive receiver`

For example, consider two users, `A` and `B`, each of them having two active connections. So, user `A` is connected from its laptop (`c1`) and its mobile phone (`c2`). User `B` is also connected from its laptop (`c3`) and its mobile phone (`c4`).

Now, let's say user `A` calls user `B` from `c1` and user `B` takes the call from `c3`. Within this setup, user `A` will be an `active initiator` on `c1` and a `passive initiator` on `c2`. Similarly, user `B` will be an `active receiver` on connection `c3` and a `passive receiver` on `c4`.

Before accepting or declining a call, a receiver is neither active nor passive. When the JavaScript API receives a call (that is, when it receives the `call.init` message), it first tries to determine the role of the connected participant. It then creates a `JSAPI.Call` object for that call, if the call was not initiated from that connection.

After that, it notifies the application that is consuming the API about the received call, according to the role of that participant. If the user is an active initiator or a passive initiator, then the JavaScript API will fire no event. However, if the participant is a passive initiator, then the JavaScript API will switch that connection to a pending state and notify the messaging server about it by sending a `call.pending` message.

If the connected user is a receiver, the JavaScript API will emit 
a `call:received` event through the `JSAPI` object, after sending a `call.ringing` to the messaging server to notify the rest of participants that it's ringing on this connection.
