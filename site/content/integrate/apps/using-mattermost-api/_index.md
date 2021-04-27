---
title: "Apps APIs"
heading: "Using Mattermost APIs with Apps"
description: "An app can use the Mattermost server REST API, as well as new App Services APIs offered specifically to Mattermost Apps."
weight: 80
---

**Note: OAuth2 is not yet implemented, for now session tokens are passed in as ActingUserAccessToken**

An app authenticates its requests to Mattermost by providing access tokens, usually Bot Access token, or user's OAuth2 access token. Each call request sent to the app includes Mattermost site URL, and optionally one or more access tokens the app can use.

What tokens the app gets, and what access the app may have with them depends on the combination of App granted permissions, the tokens requested in `call.Expand`, and their respective access rights.

See [here]({{< ref "manifest#permissions">}}) to learn more about the available permissions

## Apps subscriptions API

Subscribe and Unsubscribe APIs are invocable with Bot, User, or Admin tokens, however they may fail if the token lacks access to the resource. For instance, the app's Bot account needs to be invited to the channel before the app can subscribe to the events in the channel as the Bot. [`mmclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client) exposes a [`Subscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client.Subscribe) and [`Unsubscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client.Unsubscribe) method. To learn more about about the `Subscription` data structure please see the [godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) page.

## Apps KV Store API

The go driver [`mmclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client) support method for KV Get/Set/Delete.

The KV APIs require the use of the Bot Account Token, and will fail if a user token is provided.

## Mattermost REST API

[`mmclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client) does includes the [`model.Client4`](https://pkg.go.dev/github.com/mattermost/mattermost-server/v5/model#Client4) Mattermost REST API client, pre-initialized with the auth token.
