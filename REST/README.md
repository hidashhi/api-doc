# HidashHi REST API Documentation #

## Introduction ##

The REST methodology uses JSON as the output format for the API. We may extend our support to other formats, but we recommend to use JSON at all times. All requests have to be made via HTTP.

## Authentication ##

The HidashHi REST API supports cookie session and OAuth2 authentication.

### Session auth ####

> `POST /login`

**Parameters (body)**

`email` - user's email address

`password` - user's password

`redirect_uri` - redirect url to an authorized location

**Response**

*cookie is set and the user is redirected to the* `redirect_uri` *in the parameters*

----------

> `POST /signout`

**Parameters (url)**

`redirect_uri` - redirect url to an authorized location

**Response**

*cookie is removed and the user is redirected to the* `redirect_uri` *in the parameters*

----------

#### OAuth2 ####

// TODO

## Guest Tokens ##
The guest tokens allow users to interact with the HidashHi resources without requiring an account, via an application where they are already registered. There are no limitations to guest users, as they may behave like any other registered user.

// TODO