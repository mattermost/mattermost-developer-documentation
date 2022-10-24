---
title: "Subscriptions"
description: "Interact with Mattermost events"
weight: 10
aliases:
  - /integrate/apps/api/subscriptions/
---

`Subscribe` and `Unsubscribe` APIs are invokable with bot or user tokens, however they may fail if the token lacks access to the resource. For instance, the app's bot account needs to be invited to the channel before the app can subscribe to the events in the channel as the bot. {{< newtabref href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client" title="`appclient.Client`" >}} exposes a {{< newtabref href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client.Subscribe" title="`Subscribe`" >}} and {{< newtabref href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client.Unsubscribe" title="`Unsubscribe`" >}} method. To learn more about about the `Subscription` data structure please see the {{< newtabref href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription" title="godoc" >}} page.
