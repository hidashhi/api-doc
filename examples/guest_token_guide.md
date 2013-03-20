# Guest token guide

Navigation: [Overview](../overview.md) | [REST API](../rest.md) | [JS API](../js.md) | [Examples & Tutorials](../samples_and_how_tos.md) | [FAQ](../faq.md)

## Introduction
This guide shows how guest tokens are managed and used. This guide assumes that the developer has an application with the id "app_id_1234567890", and the api key "random_secret_api_key".

## Guest token creation

Assuming that a user with the e-mail address alice@hidashhi.com wants to use the application, a guest token can be created by sending a `POST` request:

`POST http://rest.hidashhi.com/guestToken?apiKey=random_secret_api_key&email=alice@hidashhi.com`

The response will be a JSON:

    {
        result: "success",
        "token" : "599505a5f1a219b989ba233c221a4a7de141ac8c",
        "profileId" : "50aa05797adb21de12000006",
        "email" : "alice@hidashhi.com"
    }

## Guest token list retrieval

Whenever the developer needs to refresh your list of tokens, they may call `GET` to the `/guestTokens` collection. The following example assumes that they have 2 guest tokens, for alice@hidashhi.com and bob@hidashhi.com.

`GET http://rest.hidashhi.com/guestTokens?apiKey=random_secret_api_key`

The response will be a JSON:

    {
        total: 2,
        skip: 0,
        limit: 20,
        tokens: [{
            "token" : "599505a5f1a219b989ba233c221a4a7de141ac8c",
            "profileId" : "50aa05797adb21de12000006",
            "email" : "alice@hidashhi.com"
        }, {
            "token" : "599505a5f1a219b989ba233c221a4a7de141ac8d",
            "profileId" : "50aa05797adb21de12000007",
            "email" : "bob@hidashhi.com"
        }]
    }

The `skip` and `limit` parameters may be sent through the request url. They are useful when an application has more than 20 tokens. The `skip` parameter sets how many items to skip before displaying the results (defaults to 0), while the `limit` parameter sets how many items to return (defaults to 20). The following example uses these two parameters:

`GET http://rest.hidashhi.com/guestTokens?apiKey=random_secret_api_key&skip=1&limit=1`

The response will be a JSON:

    {
        total: 2,
        skip: 1,
        limit: 1,
        tokens: [{
            "token" : "599505a5f1a219b989ba233c221a4a7de141ac8d",
            "profileId" : "50aa05797adb21de12000007",
            "email" : "bob@hidashhi.com"
        }]
    }

## Guest token information

A token's information may be requested through the following call, assuming that the token is "token_code_for_alice":

`GET http://rest.hidashhi.com/guestToken/token_code_for_alice?apiKey=random_secret_api_key`

The response will be a JSON:

    {
        result: "success",
        "token" : "token_code_for_alice",
        "profileId" : "50aa05797adb21de12000006",
        "email" : "alice@hidashhi.com"
    }

## Guest token removal

This is not recommended for normal usage, since history and other information will be lost. A token will expire on its own anyway. If a particular token must no longer be used or a security issue occurs, the token may be removed by calling `DELETE` on its information endpoint:

`DELETE http://rest.hidashhi.com/guestTokens/token_code_for_alice?apiKey=random_secret_api_key`

The response will be a JSON:

    {
        result: "success",
        message: "Removed guest token"
    }
