---
title: "Subscriptions"
description: "Interacting with Mattermost events"
weight: 10
aliases:
  - /integrate/apps/api/subscriptions/
---

`Subscribe` and `Unsubscribe` APIs are invokable with bot or user tokens, however they may fail if the token lacks access to the resource. For instance, the app's bot account needs to be invited to the channel before the app can subscribe to the events in the channel as the bot. [`appclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client) exposes a [`Subscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client.Subscribe) and [`Unsubscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client.Unsubscribe) method. To learn more about about the `Subscription` data structure please see the [godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) page.
