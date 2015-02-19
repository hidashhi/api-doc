# Getting started app

## Introduction

The purpose of this example is to get you started with the HidashHi platform without having to dive into documents and API specs.
This Demo is a small example application providing easy anonymous video meetings. It almost serves as a document itself since the aim was to create a self-explanatory app.

It includes the following aspects of the HidashHi platform:

 - Authentication using a back-end (e.g. connect HidashHi with your own user authentication system)
 - Usage of the HidashHi video-room system to have on-request easy to use video-rooms for calling.
 - Text message chat including use of custom messages for ‘is typing’ functionality.
 - Whiteboard functionality using real-time data channels.

You can try out the example at:
https://getting-started-app.hidashhi.com/


## Definitions

- **Application Id**: An identifier assigned by us for your application.
- **Application Key**: Key for your application. Keep this secret.
- **Backend** (code located in /backend/*) - Example implementation in PHP. Can be used anywhere (e.g. mobile application) as long as you make sure the required Application Key is kept secure. Please think of strategies where Application Key’s need to be exchanged in case of compromise.
- **Accesstoken**: A token which equals the session and the authenticated user in the HidashHi platform. Required to connect with the platform. Should be treated with care to ensure privacy of the user.
- **HidashHi REST API**: REST access to the HidashHi platform. Used for backend communication and other data retrieval. In this example used for accesstoken creation. For more info see https://github.com/hidashhi/api-doc/blob/master/rest.md
- **HidashHi JS API**: Javascript access to the HidashHi platform. Used for real-time communication for establishing video-calls and other activities. Recognized by ‘$hi’ is the javascript code. For more info see https://github.com/hidashhi/api-doc/blob/master/js.md
- **HidashHi Platform settings**: The HidashHi platform consists of multiple environments and subsystems. Please use provided platform settings for your environment. Multiple environment might be used (e.g. for development / staging / live). An Application Id/Key is only active on given HidashHi platform.


## Flow of the application

1. Retrieve accesstoken using the backend (see /backend/accesstoken.php and /backend/hidashhi_rest_api.php). This is done by doing a POST request to the “/guestToken” REST API. As argument an identifier is required (email formatting). The accesstoken should be communicated to the web-frontend which needs it to connect with the HidashHi platform. Note that you need a different accesstoken per user.
2. Define a call code. In the example a call code can be entered or generated. The users who want to video-call should of course provide the same call code. In the example a random number of 8 numbers is used. The longer the call code the better since the chance 2 pairs of users have the same call code lowers.
3. Connect with the HidashHi platform using the generated Accesstoken.
4. Ask for camera permissions and render self-view. Using $hi.renderMe(‘container-id’, callback); both are done directly. Only the camera is allowed it will render in the provided container.
5. Connect to the call room using the call code. A prefix is suggested to also allow different kind of rooms simultaneously.
6. Call the call room - and listen for incoming calls on the call room. In this example the latest new person in the call room will call the room. Any already waiting user in the room will accept the incoming call (last in calls all).
7. Listen for text messages and custom messages for text-chat and is-typing functionality. The is-typing triggers a custom message every 5 seconds. If the other party didn’t receive this event or a text message is received the is-typing is stopped.
