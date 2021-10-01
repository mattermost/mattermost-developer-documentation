---
title: "Subscriptions"
heading: "Subscribtions - receiving and acting on Mattermost events"
description: "TODO."
weight: 600
---

Subscribe and Unsubscribe APIs are invocable with Bot, User, or Admin tokens, however they may fail if the token lacks access to the resource. For instance, the app's Bot account needs to be invited to the channel before the app can subscribe to the events in the channel as the Bot. [`mmclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client) exposes a [`Subscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client.Subscribe) and [`Unsubscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient#Client.Unsubscribe) method. To learn more about about the `Subscription` data structure please see the [godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) page.

