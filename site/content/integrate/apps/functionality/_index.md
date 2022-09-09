---
title: Functionality
description: Apps API functionality
weight: 60
---
In addition to the {{<newtabref title="Mattermost REST APIs" href="https://api.mattermost.com">}}, the Apps framework provides additional functionality:

- [KV Store]({{< ref "kv-store" >}}) - a simple key-value store for App-specific data.

- [OAuth2 Store]({{< ref "mattermost-api#apps-api" >}}) - store, expand, and retrieve user and App OAuth2 configuration data.

- [Calling other Apps]({{< ref "mattermost-api#apps-api" >}}) - use the Call API to invoke other Apps (experimental).

- [Subscriptions]({{< ref "subscriptions" >}}) covers how to subscribe to notifications about Mattermost events. Examples of a subscription include having your App notified whenever a message is posted in a channel that mentions your @bot account.

- [External webhooks]({{< ref "external-webhooks" >}}) covers subscribing to webhooks from third-party systems.

See [Authenticating with Mattermost]({{< ref "/integrate/apps/authentication/app-to-mattermost" >}}) for how to authenticate to all these services.
