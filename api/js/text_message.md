
# JavaScript API Text Messages #


## Introduction


Using the JavaScript API you can send and receive text messages
between users, edit existing text messages or delete them from a conversation with ease. The platform provides a secure and very flexible set of primitives that allows developers to create various kinds of applications like instant messaging or chat rooms, with applicability in any field you can think of.

**NOTE:** The following sections assume that you successfully configured your application to work with the JavaScript API (**link here**) and the user was successfully connected (**link here**).


## Getting Started


To send a text message to another user, you can use `JSAPI.sendTextMessage`:

	JSAPI.sendTextMessage = function(
		senderProfileId,
		receiversProfilesIds,
		chainId,
		textMessage
		) { /* ... */ };

The `sendTextMessage` method returns a `JSAPI.TextMessage` object and it requires several arguments:

- `senderProfileId` - the profile id of the connected user to be used as sender
- `receiversProfilesIds` - an array of profiles ids representing the recipients of this text message
- `chainId` - an optional chain id (see below)
- `textMessage` - a string containing the text message to send

The `senderProfileId` must be the id of a profile owned by the connected user. The `receiversProfilesIds`
is an array containing the profile ids of the intended recipients for the text message. These recipients are not required to be online in order to send a message to them. If there is only a receiver, you can specify it directly instead of including it in an array.

The `chainId` is used to group text messages logically in a chain. In this context, a chain is the equivalent of a conversation from an instant messaging application. However, this mechanism does not impose any restrictions for the applications, so you can choose to treat a chain as a chat room or a forum thread instead of an instant messaging conversation. The chain id is the id of the first message in a chain. If you don't specify a chain id when calling `sendTextMessage`, then the id assigned by the platform to the current text message will be used as the chain id.

The `textMessage` is a string containing the text message to send.

All text messages are represented in the JavaScript API using a `JSAPI.TextMessage` object. Through this object, you can edit or remove a text message from a chain. Text messages can be edited or deleted only by the user that owns them.

To edit a message, you can use the `edit` method:

	textMessage.edit(newTextValue);

And to delete a text message, you can use the `remove` method:

	textMessage.remove();

The `TextMessage` class has the following attributes:

- `id` - the id of this text message; only available after the message is acknowledged by the messaging server
- `localId` - the local id assigned to this text message by the JavaScript API, before sending it to the messaging server
- `chainId` - the chain id of this message; if the messaging server receives a message without a chain id, it uses the id that it assigned to that message for the chain id
- `sender` - the profile id of the sender
- `receivers` - an array of profile ids representing the receivers of this text message
- `receiver` - the id of one of the profiles owned by the connected user
- `connectionId` - the id of the connection from where this message was sent
- `content` - an object that encapsulates the content of this message; the `text` attribute of this object contains the actual text message

When a text message is received, the JavaScript API notifies the client application through the `JSAPI` object by emitting a `text:received` event. You can register an observer for this event using:

	JSAPI.on('text:received', callback);

The `callback` function will receive a `JSAPI.TextMessage` object as the only argument, representing the received text message.

When a text message is edited, all users that received that message, including its sender, will be notified about the fact that it was modified by emitting a `text:edited` event through the `JSAPI` object. You can register an observer for this event using:

	JSAPI.on('text:edited', callback);

As for the `text:received` event, the `callback` will receive a `JSAPI.TextMessage` object as the only argument, representing the edited text message.

The same goes for removing a text message. After a text message is removed, all users that received that message, including its sender, will be notified about the fact that it was removed by its owner by emitting a `text:removed` event through the `JSAPI` object. You can register an observer for this event using:

	JSAPI.on('text:removed', callback);

But, unlike the callbacks for the previous events, this callback will receive only the id of the message being deleted.

#### Example

You can use the following code snippet as a starting point to use text messages in your application.

	JSAPI.connect(...);

	JSAPI.on('text:add_message', function(textMessage) {
		console.log('Received a text message from ' + textMessage.sender + ': "' + textMessage.content.text + '"');
		addMessage(textMessage);
	});

	JSAPI.on('text:edit_message', function(textMessage) {
		console.log('A text message was edited by ' + textMessage.sender + ': "' + textMessage.content.text + '"');
		editMessage(textMessage);
	});

	JSAPI.on('text:remove_message', function(textMessageId) {
		console.log('The text message with id ' + textMessageId + ' was removed by its owner');
		removeMessage(textMessageId);
	});

	var alice = getAliceProfileId();
	var bob = getBobProfileId();
	var john = getJohnProfileId();

	// Alice sends a message to Bob and John:
	JSAPI.sendTextMessage(alice, [ bob, john ], 'Hi!');

	// Bob replies from another connection, after receiving the message:
	var chainId = textMessage.chainId;
	JSAPI.sendTextMessage(bob, [ alice, john ], chainId, 'Hi!');

	// Say Alice wants to edit her message:
	textMessage.edit('Hello!');

	// Bob decided to remove his message:
	textMessage.remove();


## Advanced Options


The `JSAPI.sendTextMessage` method uses the `JSAPI.Client.sendMessage` to send a `text.add_message` message to the messaging server. It also creates a `JSAPI.TextMessage` object and caches it locally before sending it. The cached message is updated when the messaging server acknowledges it.

Similarly, the `JSAPI.TextMessage.edit` method sends a `text.edit_message` and the `JSAPI.TextMessage.remove` method sends a `text.remove_message` to the messaging server.

To add a new participant to a chain requires the inclusion of its profile in the receivers list.
Also, removing a participant from a chain requires its omission from the list of receivers for further messages.
