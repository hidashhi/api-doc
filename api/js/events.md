# JS API Events #

## Introduction

// TODO

## $hi Events

// TODO

## Client Events

// TODO

## Call Events

The following events are emitted by the `Call` object. Place the event listeners for each call accordingly.

// TODO: document call-logic events (init, answer, timeout etc)

`container:streamer` - emitted when the $hi needs to create a stream container to hold the user's camera feed. The `$hi.Call` object representing the call is sent as parameter to the EventListener; // TODO: document how to call createStreamer

`container:player` - emitted when the $hi needs to create a player container to show another user's video stream. The `$hi.Call` object representing the call and the `ProfileId` of the participant are sent as parameters to the EventListener; // TODO: document how to call createPlayer

`streamer:start` - emitted when the streamer is being played by a call participant. The `profileId` of the participant who started playing the stream is sent as parameter;

`player:start` - emitted when the player starts showing video from a call participant. The `profileId` of the participant who is sending the stream is sent as parameter.

## TextMessage Events

// TODO
