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

{{<note "Note:">}}
Bots need to join a channel before subscribing to that channel's events. Similarly, bots need to join a team before subscribing to that team's events.
{{</note>}}

An example of an App subscribing to an event with the [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) would look like the following:

```go
subscription := &apps.Subscription{
    Subject: "user_joined_channel",
    ChannelID: "hoan6o9ws7rp5xj7wu9rmysrte",
    Call: apps.Call{
        Path: "/user-joined-channel",
    },
}
err := client.Subscribe(subscription)
if err != nil {
    // handle the error
}
```

#### Event notification calls

The request data for an event notification call looks like the following:

```json
{ }
```

### Unsubscribe from an event

The `Unsubscribe` method is used to unsubscribe from an event. The method accepts the same subscription parameter as the `Subscribe` method above.

An example of an App unsubscribing from an event with the [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) would look like the following:

```go
subscription := &apps.Subscription{
    Subject: "user_joined_channel",
    ChannelID: "hoan6o9ws7rp5xj7wu9rmysrte",
    Call: apps.Call{
        Path: "/user-joined-channel",
    },
}
err := client.Unsubscribe(subscription)
if err != nil {
    // handle the error
}
```
