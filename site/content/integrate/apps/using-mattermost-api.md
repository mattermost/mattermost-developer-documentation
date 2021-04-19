---
title: "Apps APIs"
heading: "Using Mattermost APIs with Apps"
description: "An app can use the Mattermost server REST API, as well as new App Services APIs offered specifically to Mattermost Apps."
section: "integrate"
---

Note: OAuth2 is not yet implemented, for now session tokens are passed in as ActingUserAccessToken

An app authenticates its requests to Mattermost by providing access tokens, usually Bot Access token, or user's OAuth2 access token. Each call request sent to the app includes Mattermost site URL, and optionally one or more access tokens the app can use.

What tokens the app gets, and what access the app may have with them depends on the combination of App granted permissions, the tokens requested in call.Expand, and their respective access rights.

- godoc: [Permission](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Permission) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Permission) -
  describes the available permissions.
- tickets:
  - [MM-??]()

## Apps Subscriptions API

- godoc: [Subscription](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) - describes the Subscription request.
- godoc: [Go Client](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client.Subscribe) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client.Subscribe) - The methods to post Subscribe/Unsubscribe requests.

Subscribe and Unsubscribe APIs are invocable with Bot, User, or Admin tokens, however they may fail if the token lacks access to the resource. For instance, the app's Bot account needs to be invited to the channel before the app can subscribe to the events in the channel as the Bot.

## Apps KV Store API
- godoc: [Go Client](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client.KVDelete) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client.KVDelete) - The methods for KV Get/Set/Delete requests.

The KV APIs require the use of the Bot Account Token, and will fail if a user token is provided.

## Mattermost REST API

- godoc: [Go Client](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client) - mmclient.Client includes the *model.Client4 Mattermost REST API client, pre-initialized with the auth token.
