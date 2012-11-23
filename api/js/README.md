# HidashHi JS API Documentation #

## Introduction ##

The JSAPI is intrinsic to the HidashHi real time communication and needs to be integrated into an application website to make use of the HidashHi resources.
The applications may send and receive text messages, may place and receive calls, and should mitigate the user’s interaction with the online environment.
The JSAPI is served as a Javascript file from the HidashHi CDN. It should be available from http://cdn.hidashhi.com/js/api.js .

An in-detail view of the JSAPI objects, methods and events can be found documented in the appropriate files.

## Authentication ##

// TODO

## Available objects ##

`JSAPI` - the API object itself, globally available;

`JSAPI.Client` - handles the connection to the servers and the eventing on the socket;

`JSAPI.Call` - encapsulates information and functionality for a call which was placed or received by the API instance;

`JSAPI.TextMessage` - encapsulates information and functionality for a text message that was sent or received by the API instance.

## Available methods ##

`connect` - establishes a bidirectional socket connection to the HidashHi servers;

`disconnect` - disconnects the client from the server;

`sendTextMessage` - sends a text message to all the user profiles in `receiverProfileIds`;

`openCall` - starts a call with the list of participants;

`createStreamer` - creates a container for the user's webcam feed and stream;

`createPlayer` - creates a container for the other participants' webcam streams.

