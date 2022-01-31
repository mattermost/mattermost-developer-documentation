---
title: "API"
heading: "Mattermost Apps API Reference"
description: "This reference describes the Mattermost Apps API"
weight: 200
---

## App Structure

Apps consist of three kinds of assets:

- [manifest.json]({{< ref "manifest" >}}) file

- [Call]({{< ref "call" >}}) handlers, starting with `/bindings` (see
  [Bindings]({{< ref "bindings" >}})) and `/on_install` (see
  [Manifest]({{< ref "manifest" >}})). Call handlers are typically source files
  in a programming language like JavaScript, Python, or Go.

- Static assets, currently solely icon files

## Interactivity: Bindings and Forms

- To interact with users an App must [bind]({{< ref "bindings" >}}) a call to a
  location in the Mattermost user interface. These locations may be
  `/`-commands, toolbar and menu items, and embedded in posts.

- A [binding]({{< ref "bindings" >}}) may display a [Form]({{< ref
  "interactivity" >}}), or it may invoke a `Call` that will return a `Form`.
  Forms allow to gather fields with limited dynamic behavior
  (dynamically-populated selects, form refresh on field changes). A Form invokes
  a `Call` when it is submitted. A `/`-command is just another way of filling
  out a `Form` and submitting it.

## Using Mattermost APIs

Apps can use all general [Mattermost REST API]({{< ref "mattermost-api" >}})s,
as well as special services that are provided to the apps.

See [Authenticating with Mattermost]({{< ref "app-to-mattermost" >}}) for how
to authenticate to all these services.

App services:

- [KV Store]({{< ref "mattermost-api#apps-api" >}}) - store and retrive app-specific data.

- [OAuth2 Store]({{< ref "mattermost-api#apps-api" >}}) - store, expand, and retrieve user and
  app OAuth2 configuration data.

- [Calling other Apps]({{< ref "mattermost-api#apps-api" >}}) - use the `Call` API to invoke
  other apps (experimental).

## Other

- [Subscriptions]({{< ref "subscriptions" >}}) covers how to subscribe to
  notifications abdout Mattermost events. Examples of a subscription include having your App notified whenever a message is posted in a channel that mentions your @bot account.

- [Third-party webhooks]({{< ref "third-party-webhooks" >}}) covers subscribing to
  webhooks from third-party systems.

- [Lifecycle]({{< ref "lifecycle" >}}) covers lifecycle callback API, i. e.
  `on_install`. This is useful for calling your app when it is first installed, or the user is attempting to uninstall it and gives you a chance to initialize or clean up data (such as from the KV store) before uninstalling your app.
  