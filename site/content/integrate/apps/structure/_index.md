---
title: "Structure"
heading: "Apps structure"
description: "An overview of the structure of an App"
weight: 30
aliases:
  - /integrate/apps/api/
---

Apps consist of three kinds of assets:

1. A [manifest]({{< ref "manifest" >}}) file, which contains App details such as name, version, requested permissions, and deployment methods

2. [Call]({{< ref "call" >}}) handlers, which are functions that handle incoming requests from the Mattermost server

3. [Static assets]({{<ref "static-assets">}}) (e.g. images)

To interact with users an App must [bind]({{< ref "bindings" >}}) a call handler to a location in the Mattermost user interface. These locations may be slash commands, toolbar and menu items, or embedded in posts.

A [Binding]({{< ref "bindings" >}}) may display a [Form]({{< ref "interactivity" >}}), or it may invoke a call that will return a form. Forms allow the user to input information with limited dynamic behavior, such as dynamically-populated pick lists, or form refreshes on field changes.

## Functionality

In addition to the {{<newtabref title="Mattermost REST APIs" href="https://api.mattermost.com">}}, the Apps framework provides additional functionality:

- [KV Store]({{< ref "/integrate/apps/functionality/kv-store" >}}) - a simple key-value store for App-specific data.

- [OAuth2 Store]({{< ref "mattermost-api#apps-api" >}}) - store, expand, and retrieve user and App OAuth2 configuration data.

- [Calling other Apps]({{< ref "mattermost-api#apps-api" >}}) - use the Call API to invoke other Apps (experimental).

- [Subscriptions]({{< ref "subscriptions" >}}) covers how to subscribe to notifications about Mattermost events. Examples of a subscription include having your App notified whenever a message is posted in a channel that mentions your @bot account.

- [External webhooks]({{< ref "/integrate/apps/functionality/external-webhooks" >}}) covers subscribing to webhooks from third-party systems.

See [Authenticating with Mattermost]({{< ref "/integrate/apps/authentication/app-to-mattermost" >}}) for how to authenticate to all these services.
