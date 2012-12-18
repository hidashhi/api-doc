# HidashHi REST API Documentation

Navigation:
[Overview](../../README.md) |
[JS API](../js/README.md) |
[Examples & Tutorials](../../samples_and_how_tos.md) | 
[FAQ](../../faq.md)

## Introduction

The REST methodology uses JSON as the output format for the API. We may extend our support to other formats, but we recommend to use JSON at all times. All requests have to be made via HTTP.

## Authentication

The HidashHi REST API supports cookie session and [OAuth2](http://oauth.net/2/) token authentication.

#### OAuth2

// TODO

## User account handling

A user's account consists of general, private user information, such as credentials, profiles, subscriptions and e-mail addresses. Note that when using the Hi-Hi resources to interact with others, a user's profile is used, not the account. An account can have multiple profiles, however a user can decide to authorize an application to only have access to certain profiles and not the user account itself. This way the user should be able to control his identity, as he can have an anonymous profile to use with certain applications. It is in the users best interest and the applications responsibility to respect the users privacy. Therefor profiles should not be able to be connected to one certain user and the user itself should not be exposed to others, only for the user himself.

#### Get account information

> 'GET /user/account'

**Response (JSON)**

    {
        result: "success",
        account: {
            _id: String,
            defaultProfile: String,
            developerProfile: String,
            profiles: [ String ],
            emails: [ {
                address: String representing the e-mail address
                validated: Boolean
            } ],
            
        }
    }

#### Updating account information

> `PUT /user/account`

**Parameters (body)**

`oldPassword` - user's login password

`newPassword` - user's new login password

**Response (JSON)**

Same as `GET /user/account`, with the new information updated.

#### Managing an e-mail addresses

> `POST /user/account/emails`

**Parameters (body)**

`email` - new email address

**Response (JSON)**

    {
        result: "success",
        message: "Added e-mail address"
    }

> `DELETE /user/account/emails/[email_address]`

**Response (JSON)**

    {
        result: "success",
        message: "Deleted e-mail address"
    }

## User profiles handling

Each user's profile is like a persona representing the user within various environments. A user may choose to use the Hi-Hi services to interact with family and business environments, but keep them separated via different profiles. The criteria depend solely on the user's preferences.

#### Retrieving the list of profiles

> `GET /user/profiles`

**Parameters (query)**

`skip` - number of profiles to jump over before displaying. Defaults to 0

`limit` - number of profiles to return. Defaults to 20

**Response (JSON)**

    {
        total: total_number_of_profiles,
        skip: query_skip,
        limit: query_limit,
        objects: [ profile_objects ]
    }

#### Adding a new profile

> `POST /user/profiles`

**Parameters (query)**

`nickname`

`firstname`

`firstnamePrivacy` - can be `public`, `contact`, `private`. Defaults to `contact`

`lastname`

`lastnamePrivacy`

`email`

`emailPrivacy`

**Response (JSON)**

    {
        result: "success",
        profile: { user_profile }
    }

#### Updating a profile

> `PUT /user/profile/profileId`

**Parameters (query)**

`firstname`

`firstnamePrivacy` - can be `public`, `contact`, `private`

`lastname`

`lastnamePrivacy`

`email`

`emailPrivacy`

**Response (JSON)**

    {
        result: "success",
        message: "Updated profile"
    }

#### Deleting a profile ####

> `DELETE /user/profile/profileId`

**Response (JSON)**

    {
        result: "success",
        "message": "Deleted profile"
    }

#### Default profile

A user's default profile is a normal profile chosen by default for the main interactions with the website, for comments and other features.

> `GET /user/defaultProfile`

**Response (JSON)**

    {
        result: "success",
        profile: {
            _id: id of profile,
            (userId: id_of_user,)
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

#### Developer profile

A user's developer profile is a normal profile used for application development, deployment and management. Once set, it cannot be switched with another profile. Profile information, however, may be changed just like before.

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

## User contacts handling

A user's contact is a connection between the user's profile and another user's profile.

> `GET /user/contact`

**Parameters (query)**

`skip` - number of entries to jump over before returning the result

`limit` - number of entries to return

`userProfileId` - filter for the contacts of a user profile

`contactProfileId` - filter for the contacts to a user profile

**Response (JSON)**

    {
        _id: contact_id
        nickname: nickname_of_the_contact,
        contactProfileId: profileId_of_the_contact,
        userProfileId: profileId_of_the_user,
        userId: user_id,
        createdByAppId: id_of_application,
        emailShared: ,
        lastnameShared: ,
        firstnameShared: ,
        groups: [],
        updatedAt: Date,
        createdAt: Date
    }

> `PUT /user/contact/contactId`

**Parameters (body)**

`contactId`

`groups`

`firstname`

`lastname`

`email`

**Response (JSON)**

    { contact_object }

> `DELETE /user/contact/contactId`

**Response (JSON)**

    {
        result: "success"
    }

## Guest Tokens
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

## Profile
A profile is a users personal representation.

> `POST /profile/image`

**Parameters (url/body)**

`profileId` - The profile for which to update the image

**Response (JSON)**

    {
        result: "success"
    }
