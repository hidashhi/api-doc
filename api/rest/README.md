# HidashHi REST API Documentation

Navigation:
[Overview](../../overview.md) |
[JS API](../js/README.md) |
[Examples & Tutorials](../../samples_and_how_tos.md) | 
[FAQ](../../faq.md)

<a id="toc"></a>
## ToC

* [Introduction](#introduction)
* [Authentication](#authentication)
	* [OpenAuth 2 / Token Authentication](#oauth2)
* [User Profile Handling](#desc_userProfile)
* [User Account Handling](#desc_userAccount)
* [Guest Tokens](#desc_guestToken)
* [Endpoints](#endpoints)
	* [POST /guestToken](#postGuestToken)  
	* [GET /guestToken](#getGuestToken)  
	* [DELETE /guestToken/:token_string](#deleteGuestToken)  

	* [GET /user/account](#getUserAccount)  
	* [PUT /user/account](#putUserAccount)  
	* [POST /user/account/emails](#postUserAccountEmails)  
	* [DELETE /user/account/emails/:email_address](#deleteUserAccountEmail)  

	* [GET /user/profiles](#getUserProfiles)  
	* [POST /user/profiles](#postUserProfiles)  
	* [PUT /user/profile/:profileId](#putUserProfile)  
	* [DELETE /user/profile/:profileId](#deleteUserProfile)  
	* [POST /profile/image](#postProfileImage)  
	* [GET /user/defaultProfile](#getUserDefaultProfile)  
	* [PUT /user/defaultProfile/:profileId](#putUserDefaultProfile)  

	* [GET /user/developerProfile](#getUserDeveloperProfile)  
	* [PUT /user/developerProfile/:profileId]  (#putUserDeveloperProfile)  

	* [GET /user/contact](#getUserContact)  
	* [PUT /user/contact/:contactId](#putUserContact)  
	* [DELETE /user/contact/:contactId](#deleteUserContact)  


<a id="introduction"></a>
## Introduction

The REST methodology uses JSON as the output format for the API. We may extend our support to other formats, but we recommend to use JSON at all times. All requests have to be made via HTTP.

<a id="authentication"></a>
## Authentication

The HidashHi REST API supports cookie session and [OAuth2](http://oauth.net/2/) token authentication.

<a id="oauth2"></a>
### OpenAuth 2 / Token Authentication

// TODO

<a id="desc_userProfile"></a>
## User profile handling

Each user's profile is like a persona representing the user within various environments. A user may choose to use the Hidashhi services to interact with family and business environments, but keep them separated via different profiles. The criteria depend solely on the user's preferences.

<a id="desc_userAccount"></a>
## User account handling

A user's account consists of general, private user information, such as credentials, profiles, subscriptions and e-mail addresses. Note that when using the Hidashhi resources to interact with others, a user's profile is used, not the account. An account can have multiple profiles, however a user can decide to authorize an application to only have access to certain profiles and not the user account itself. This way the user should be able to control his identity, as he can have an anonymous profile to use with certain applications. It is in the users best interest and the applications responsibility to respect the users privacy. Therefor profiles should not be able to be connected to one certain user and the user object (account information) itself should not be exposed to others, only to the user itself.

<a id="desc_guestToken"></a>
## Guest Tokens
The guest tokens allow application developers to create an Hidashhi account for an application user in the background to interact with the HidashHi resources. There are no limitations to guest users, as they may behave like any other registered user. To retrieve a guest token, an E-Mail address is needed.
The owner of that email address can at any time take over the guest token.

## Endpoints  


<a id="postGuestToken"></a>
### `POST /guestToken`  
Create a guest token. If a token for the given E-Mail address already exists for your application, the existing token is returned. To create a completely new token for an E-Mail address, delete the existing token first, then create a new one.

**Example**
<pre>
POST http://rest.beta.hidashhi.com/guestToken?apiKey=YOUR_API_KEY&email=user@email.com
</pre>

#### Parameters (url or post body)

- `apiKey`  
private key assigned to the application

- `email`  
user's email address

#### Response (JSON)

    {
        result: "success",
        token: "token_string",
        profiles: [pid1, pid2, ...],
        email: "email_from_params"
    }


[back to top](#toc)

----------

<a id="getGuestToken"></a>
### `GET /guestTokens`
Retrieve a list of tokens that were create through and for your application.

#### Parameters (url)

- `appId`  
application id

- `apiKey`  
private key assigned to the application

- `skip`  
jump `skip` results. Default: 0

- `limit`  
number of results. Default: 20

- `email`  
*optional*, if not set, all the guest tokens will be returned

#### Response (JSON)

    {
        total: "no_of_items_found",
        skip: "skip_from_params",
        limit: "limit_from_params",
        tokens: [{
            token: "token_string",
            profiles: [pid1, pid2, ...],
            email: "email_for_guest"
        }]
    }

#### Response (JSON) with `email` **set**

    {
        result: "success",
        token: "token_string",
        profiles: "profile_id_for_guest",
        email: "email_from_query"
    }


[back to top](#toc)

----------

<a id="deleteGuestToken"></a>
### `DELETE /guestToken/:token_string`
Delete a specific token.

#### Parameters (url)

- `appId`  
application id

- `apiKey`  
private key assigned to the application

#### Response (JSON)

    {
        result: "success",
        message: "Removed guest token"
    }


[back to top](#toc)

----------

<a id="getUserAccount"></a>
### `GET /user/account`
Get account information.

#### Response (JSON)

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


[back to top](#toc)

----------

<a id="putUserAccount"></a>
### `PUT /user/account`
Update account information.

#### Parameters (body)

- `oldPassword`  
user's login password

- `newPassword`  
user's new login password

#### Response (JSON)

Same as `GET /user/account`, with the new information updated.


[back to top](#toc)

----------

<a id="postUserAccountEmails"></a>
### `POST /user/account/emails`

#### Parameters (body)

`email` - new email address

#### Response (JSON)

    {
        result: "success",
        message: "Added e-mail address"
    }


[back to top](#toc)

----------

<a id="deleteUserAccountEmail"></a>
### `DELETE /user/account/emails/:email_address`

#### Response (JSON)

    {
        result: "success",
        message: "Deleted e-mail address"
    }


[back to top](#toc)

----------

<a id="getUserProfiles"></a>
### `GET /user/profiles`
Retrieving the list of profiles

#### Parameters (query)

- `skip`  
number of profiles to jump over before displaying. Defaults to 0

- `limit`  
number of profiles to return. Defaults to 20

#### Response (JSON)

    {
        total: total_number_of_profiles,
        skip: query_skip,
        limit: query_limit,
        objects: [ profile_objects ]
    }


[back to top](#toc)

----------

<a id="postUserProfiles"></a>
### `POST /user/profiles`
Adding a new profile

#### Parameters (query)

- `nickname`

- `firstname`

- `firstnamePrivacy`  
can be `public`, `contact`, `private`. Defaults to `contact`

- `lastname`

- `lastnamePrivacy`

- `email`

- `emailPrivacy`

#### Response (JSON)

    {
        result: "success",
        profile: { user_profile }
    }


[back to top](#toc)

----------

<a id="putUserProfile"></a>
### `PUT /user/profile/:profileId`
Updating a profile

#### Parameters (query)

- `firstname`

- `firstnamePrivacy`  
can be `public`, `contact`, `private`

- `lastname`

- `lastnamePrivacy`

- `email`

- `emailPrivacy`

#### Response (JSON)

    {
        result: "success",
        message: "Updated profile"
    }


[back to top](#toc)

----------

<a id="deleteUserProfile"></a>
### `DELETE /user/profile/:profileId`
Deleting a profile

#### Response (JSON)

    {
        result: "success",
        "message": "Deleted profile"
    }


[back to top](#toc)

----------

<a id="postProfileImage"></a>
### `POST /profile/image`
A profile is a users personal representation.

#### Parameters (url/body)

- `profileId`  
The profile for which to update the image
- `file`  
The image to upload

#### Response (JSON)

    {
        result: "success"
    }


[back to top](#toc)

----------

<a id="getUserDefaultProfile"></a>
### `GET /user/defaultProfile`
A user's default profile is a normal profile chosen by default for the main interactions with the website, for comments and other features.

#### Response (JSON)

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


[back to top](#toc)

----------

<a id="putUserDefaultProfile"></a>
### `PUT /user/defaultProfile/:profileId`

#### Response (JSON)

    {
        result: "success",
        message: "Changed default profile to profileId"
    }


[back to top](#toc)

----------

<a id="getUserDeveloperProfile"></a>
### `GET /user/developerProfile`
A user's developer profile is a normal profile used for application development, deployment and management. Once set, it cannot be switched with another profile. Profile information, however, may be changed just like before.

#### Response (JSON)

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


[back to top](#toc)

----------

<a id="putUserDeveloperProfile"></a>
### `PUT /user/developerProfile/:profileId`

#### Response (JSON)

    {
        result: "success",
        message: "Changed developer profile to profileId"
    }


[back to top](#toc)

----------

<a id="getUserContact"></a>
### `GET /user/contact`
A user's contact is a connection between the user's profile and another user's profile.

#### Parameters (query)

- `skip`  
number of entries to jump over before returning the result

- `limit`  
number of entries to return

- `userProfileId`  
filter for the contacts of a user profile

- `contactProfileId`  
filter for the contacts to a user profile

#### Response (JSON)

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


[back to top](#toc)

----------

<a id="putUserContact"></a>
### `PUT /user/contact/:contactId`

#### Parameters (body)

- `contactId`

- `groups`

- `firstname`

- `lastname`

- `email`

#### Response (JSON)

    { contact_object }


[back to top](#toc)

----------

<a id="deleteUserContact"></a>
### `DELETE /user/contact/:contactId`

#### Response (JSON)

    {
        result: "success"
    }



[back to top](#toc)
