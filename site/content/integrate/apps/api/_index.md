---
title: "API"
heading: "Mattermost Apps API Reference"
description: "This reference describes the Mattermost Apps API"
weight: 200
---

## App Structure

Apps consist of just 3 things:
- [manifest.json]({{< ref "manifest" >}}) file
- [Call]({{< ref "call" >}}) responders, starting with `/bindings` (see [Interactivity]({{< ref "interactivity" >}})) and `/on_install` (see [Manifest]({{< ref "manifest" >}}))
- Static assets, currently just icon files

## Mattermost Authentication
An app declares in its `Manifest` the `Locations` that it will be binding to, and `Permissions` it will require to operate. These are consented to by the system administrator when installing Mattermost apps interactively, in Mattermost.

Each app when installed into Mattermost gets an OAuth2 cientID/secret (not yet used), and a Bot User Account with a personal access token. Each call may receive a combination of `bot_access_token`, `acting_user_access_token`, and `admin_access_token` as applicable. See [Authentication]({{< ref "authentication" >}}) for more.

Apps can use OAuth2 to connect to 3rd party APIs. See [3rd party OAuth2]({{< ref
"3rdparty-oauth2" >}}) for more.




Each call request an app receives contains a `bot_access_token` in the `context`. 

Additionaly, if the app was granted `act_as_user` permission, and the call's
`expand` contained `acting_user_access_token=all`, the call receives
`acting_user_access_token` in the request `context`.

Similarly, if the app was granted `act_as_admin` permission, the acting user is
a system administrator, and the call's `expand` contained
`admin_access_token=all`, the call receives `admin_access_token` in the
`context`.


## Interactivty: Bindings and Forms

- To interact with users an App must bind a call to a location in the Mattermost
  user interface. These locations may be `/`-commands, toolbar and menu items,
  and embedded in posts.
- A binding may display a `[Form]({{< ref "interactivity" >}})`, or it may
  invoke a `Call` that will return a `Form`. Forms allow to gather fields with
  limited dynamic behavior (dynamically-populated selects, form refresh on field
  changes). A Form invokes a `Call` when it is submitted. A `/`=command is just
  another way of filling out a `Form`.


## Using Mattermost APIs
- REST
- App
- Subscriptions
- Remote 
- Lifecycle

## App Lifecycle 

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
