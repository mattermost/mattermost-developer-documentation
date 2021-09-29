---
title: "API"
heading: "Mattermost Apps API Reference"
description: "This reference describes the Mattermost Apps API"
weight: 300
---

## App Structure

Apps consist of 3 kinds of assets:
- [manifest.json]({{< ref "manifest" >}}) file
- [Call]({{< ref "call" >}}) handlers, starting with `/bindings` (see
  [Interactivity]({{< ref "interactivity" >}})) and `/on_install` (see
  [Manifest]({{< ref "manifest" >}})). Call handlers are typically source files
  in a programming language like JavaScript, Python, or Go.
- Static assets, currently solely icon files

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

- on_install, etc.

## Apps subscriptions API

Subscribe and Unsubscribe APIs are invocable with Bot, User, or Admin tokens, however they may fail if the token lacks access to the resource. For instance, the app's Bot account needs to be invited to the channel before the app can subscribe to the events in the channel as the Bot. [`mmclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client) exposes a [`Subscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client.Subscribe) and [`Unsubscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client.Unsubscribe) method. To learn more about about the `Subscription` data structure please see the [godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) page.

## Apps KV Store API

The go driver [`mmclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client) support method for KV Get/Set/Delete.

The KV APIs require the use of the Bot Account Token, and will fail if a user token is provided.

## Mattermost REST API

[`mmclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client) does includes the [`model.Client4`](https://pkg.go.dev/github.com/mattermost/mattermost-server/v5/model#Client4) Mattermost REST API client, pre-initialized with the auth token.
