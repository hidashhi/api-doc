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

> `POST /guestTokens`

**Parameters (url)**

`appId` - application id

`apiKey` - private key assigned to the application

`email` - user's email address

**Response (JSON)**

    {
        result: "success",
        token: "token_string",
        profileId: "profile_id_for_guest",
        email: "email_from_params"
    }

----------

> `GET /guestTokens`

**Parameters (url)**

`appId` - application id

`apiKey` - private key assigned to the application

`skip` - jump `skip` results. Default: 0

`limit` - number of results. Default: 20

**Response (JSON)**

    {
        total: "no_of_items_found",
        skip: "skip_from_params",
        limit: "limit_from_params",
        tokens: [{
            token: "token_string,
            profileId: "profile_id_for_guest",
            email: "email_for_guest"
        }]
    }

----------

> `GET /guestTokens/token_string`

**Parameters (url)**

`appId` - application id

`apiKey` - private key assigned to the application

**Response (JSON)**

    {
        result: "success",
        token: "token_string",
        profileId: "profile_id_for_guest",
        email: "email_for_guest"
    }

----------

> `DELETE /guestTokens/token_string`

**Parameters (url)**

`appId` - application id

`apiKey` - private key assigned to the application

**Response (JSON)**

    {
        result: "success"
    }

