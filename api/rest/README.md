# HidashHi REST API Documentation #

## Introduction ##

The REST methodology uses JSON as the output format for the API. We may extend our support to other formats, but we recommend to use JSON at all times. All requests have to be made via HTTP.

## Authentication ##

The HidashHi REST API supports cookie session and OAuth2 authentication.

#### OAuth2 ####

// TODO

## User account handling ##

A user's account consists of general, private user information, such as credentials, profiles, subscriptions and e-mail addresses. Note that when using the Hi-Hi resources to interact with others, a user's profile is used, not the account.

#### Generic account information ####

> `GET /user/account`

**Response (JSON)**

    {
        result: "success",
        account: {
            _id: String,
            defaultProfile: String representing the ID of the profile marked as default,
            developerProfile: String representing the ID of the profile marked as developer,
            profiles: [ String ],
            emails: [ {
                address: String representing the e-mail address
                validated: Boolean
            } ],
            registerApp: String,
            subscription: String,
            newsletter: Boolean,
            credentials: [ String ],
            active: Boolean,
            lastLogin: Date,
            updatedAt: Date,
            createdAt: Date
        }
    }

#### Updating account information ####

> `PUT /user/account`

**Parameters (body)**

`subscription` - // TODO

`newsletter` - true/false whether the user agrees to receive the newsletter or not

`oldPassword` - user's login password

`newPassword` - user's new login password

**Response (JSON)**

Same as `GET /user/account`, with the new information updated.

#### Adding an e-mail address ####

> `POST /user/account/emails`

**Parameters (body)**

`email` - new email address

**Response (JSON)**

    {
        result: "success",
        message: "Added e-mail address"
    }

> `DELETE /user/account/emails/email_address`

**Response (JSON)**

    {
        result: "success",
        message: "Deleted e-mail address"
    }

## User profiles handling ##

Each user's profile is like a personna representing the user within various environments. A user may choose to use the Hi-Hi services to interact with family and business environments, but keep them separated via different profiles. The criteria depend solely on the user's preferences.

#### Retrieving the list of profiles ####

> `GET /user/profiles`

// TODO

#### Adding a new profile ####

> `POST /user/profiles`

// TODO

#### Updating a profile ####

> `PUT /user/profile/profileId`

// TODO

#### Deleting a profile ####

> `DELETE /user/profile/profileId`

// TODO

#### Default profile ####

A user's default profile is a normal profile used for the main interactions with the website, for comments and other features.

> `GET /user/defaultProfile`

**Response (JSON)**

    {
        result: "success",
        profile: {
            _id: id of profile,
            userId: id_of_user,
            nickname: profile_nickname,
            default: true/false,
            developer: true/false,
            public: true/false,
            active: true/false,
            email: email_address,
            emailPrivacy: private/contact/public,
            firstname: first_name,
            firstnamePrivacy: private/contact/public,
            lastname: last_name,
            lastnamePrivacy: private/contact/public,
            address: address,
            addressPrivacy: private/contact/public,
            company: company_name,
            companyPrivacy private/contact/public,
            mobile: mobile_phone_no,
            mobilePrivacy private/contact/public,
            hasAvatar: true/false,
            updatedAt: Date,
            createdAt: Date,
        }
    }

> `PUT /user/defaultProfile/profileId`

**Response (JSON)**

    {
        result: "success",
        message: "Changed default profile to profileId"
    }

#### Developer profile ####

A user's developer profile is a normal profile used for application development, deployment and management. Once set, it cannot be changed with another profile. Profile information, however, may be changed just like before.

> `GET /user/developerProfile`

**Response (JSON)**

    {
        result: "success",
        profile: {
            _id: id of profile,
            userId: id_of_user,
            nickname: profile_nickname,
            default: true/false,
            developer: true/false,
            public: true/false,
            active: true/false,
            email: email_address,
            emailPrivacy: private/contact/public,
            firstname: first_name,
            firstnamePrivacy: private/contact/public,
            lastname: last_name,
            lastnamePrivacy: private/contact/public,
            address: address,
            addressPrivacy: private/contact/public,
            company: company_name,
            companyPrivacy private/contact/public,
            mobile: mobile_phone_no,
            mobilePrivacy private/contact/public,
            hasAvatar: true/false,
            updatedAt: Date,
            createdAt: Date,
        }
    }

> `PUT /user/developerProfile/profileId`

**Response (JSON)**

    {
        result: "success",
        message: "Changed developer profile to profileId"
    }

## Guest Tokens ##
The guest tokens allow users to interact with the HidashHi resources without requiring an account, via an application where they are already registered. There are no limitations to guest users, as they may behave like any other registered user.

> `POST /guestTokens` **OBSOLETE, use** `GET /guestTokens`

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

`email` - *optional*, if not set, all the guest tokens will be returned

**Response (JSON) without** `email` **set**

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

**Response (JSON) with** `email` **set**

    {
        result: "success",
        token: "token_string",
        profileId: "profile_id_for_guest",
        email: "email_from_query"
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
        result: "success",
        message: "Removed guest token"
    }

## Profile ##
A profile is a users personal representation.

> `POST /profile/image`

**Parameters (url/body)**

`profileId` - The profile for which to update the image

**Response (JSON)**

    {
        result: "success"
    }
