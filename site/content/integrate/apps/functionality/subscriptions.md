---
title: "Subscriptions"
description: "Interact with Mattermost events"
weight: 10
aliases:
  - /integrate/apps/api/subscriptions/
---

Subscriptions provide a way for an App to be notified about events sent by the Mattermost Server. The Mattermost Server notifies an App of an event by invoking a [call]({{<ref "/integrate/apps/structure/call">}}).

{{<note "Note:">}}
App subscription functionality requires the use of a [driver]({{<ref "/integrate/apps/drivers">}}).
{{</note>}}

### Subscribe to an event

The `Subscribe` method is used to subscribe to an event. Each subscription ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription">}}) contains a `subject` which specifies the event name. For example, `user_created`.

An App can subscribe to one or more of the following event subjects:

| Subject               | Description                    | Plugin Event Name       |
|-----------------------|--------------------------------|-------------------------|
| `user_created`        | A user was created             | `UserHasBeenCreated`    |
| `user_joined_channel` | A user joined a channel        | `UserJoinedChannel`     |
| `user_left_channel`   | A user left a channel          | `UserLeftChannel`       |
| `bot_joined_channel`  | The App's bot joined a channel | `UserJoinedChannel`     |
| `bot_left_channel`    | The App's bot left a channel   | `UserLeftChannel`       |
| `user_joined_team`    | A user joined a team           | `UserJoinedTeam`        |
| `user_left_team`      | A user left a team             | `UserLeftTeam`          |
| `bot_joined_team`     | The App's bot joined a team    | `UserJoinedTeam`        |
| `bot_left_team`       | The App's bot left a team      | `UserLeftTeam`          |
| `channel_created`     | A channel was created          | `ChannelHasBeenCreated` |

An example of an App subscribing to an event with the [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) would look like the following:

```go
err := client.Subscribe(&apps.Subscription{
    Subject: "user_joined_channel",
    ChannelID: "hoan6o9ws7rp5xj7wu9rmysrte",
    Call: apps.Call{
        Path: "/user-joined-channel",
    },
})
if err != nil {
    // handle the error
}
```

### Unsubscribe from an event

_TBD_

##### Previous content

`Subscribe` and `Unsubscribe` APIs are invokable with bot or user tokens, however they may fail if the token lacks access to the resource. For instance, the app's bot account needs to be invited to the channel before the app can subscribe to the events in the channel as the bot. [`appclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client) exposes a [`Subscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client.Subscribe) and [`Unsubscribe`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client.Unsubscribe) method. To learn more about about the `Subscription` data structure please see the [godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) page.
