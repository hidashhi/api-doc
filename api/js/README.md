# HidashHi JS API Documentation

Navigation:
[Overview](../../overview.md) |
[REST API](../rest/README.md) |
[Examples & Tutorials](../../samples_and_how_tos.md) |
[FAQ](../../faq.md)

## Introduction

The Javascript API is intrinsic to the HidashHi real time communication and needs to be integrated into an application website to make use of the HidashHi resources.
The applications may send and receive text messages, may place and receive calls, and should mitigate the user’s interaction with the online environment.
The Javascript API is served as a Javascript file from the HidashHi CDN. It should be available from http://cdn.hidashhi.com/js/api/1/hi.js .

An in-detail view of the API objects, methods and events can be found documented in the appropriate files.

## Authentication ##

// TODO

## Available objects ##

`$hi` - the global API object itself;

`$hi.Client` - handles the connection to the servers and the eventing on the socket;

`$hi.Call` - encapsulates information and functionality for a call which was placed or received by the API instance;

`$hi.TextMessage` - encapsulates information and functionality for a text message that was sent or received by the API instance.

## Further information on objects  

- [$hi.Call](call.md)
- [$hi.TextMessage](text_message.md)

## Available methods ##

`connect` - establishes a bidirectional socket connection to the HidashHi servers;

`disconnect` - disconnects the client from the server;

`sendTextMessage` - sends a text message to all the user profiles in `receiverProfileIds`;

`openCall` - starts a call with the list of participants;

`createStreamer` - creates a container for the user's webcam feed and stream;

`createPlayer` - creates a container for the other participants' webcam streams.

