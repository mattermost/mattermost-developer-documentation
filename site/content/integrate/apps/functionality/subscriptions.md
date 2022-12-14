---
title: "Subscriptions"
description: "Interact with Mattermost events"
weight: 10
aliases:
  - /integrate/apps/api/subscriptions/
---

Subscriptions provide a way for an App to be notified about events sent by the Mattermost Server. The Mattermost Server notifies an App of an event by invoking a [call]({{<ref "/integrate/apps/structure/call">}}).

{{<note "Note:">}}
It is recommended to use a [driver]({{<ref "/integrate/apps/drivers">}}) when implementing subscriptions.
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
    ChannelID: "9a44ckeqytd3bftn3c3y53968o",
    TeamID: "hoan6o9ws7rp5xj7wu9rmysrte",
    Call: apps.Call{
        Path: "/user-joined-channel",
        Expand: &apps.Expand{
            // optionally expand call metadata fields
        },
    },
}
err := client.Subscribe(subscription)
if err != nil {   
    // handle the error
}
```

#### Event notification calls

The request data for an event notification call looks like the following:

```http request
POST /event-handler HTTP/1.1
Host: my-app:4000
Accept-Encoding: gzip
Content-Length: 396
Content-Type: application/json
User-Agent: Mattermost-Bot/1.1

{
    "path":"/event",
    "context":{
        "user_id":"7q7kaakokfdsdycy3pr9ctkc5r",
        "subject":"user_joined_channel",
        "channel_id":"9a44ckeqytd3bftn3c3y53968o",
        "app_id":"my-app",
        "mattermost_site_url":"http://localhost:8066",
        "developer_mode":true,
        "app_path":"/plugins/com.mattermost.apps/apps/my-app",
        "bot_user_id":"mgbd1czngjbbdx6eqruqabdeie",
        "bot_access_token":"ix8gsdqudfgupyf3qsh8y9j81w",
        "oauth2":{}
    }
}
```

### Unsubscribe from an event

The `Unsubscribe` method is used to unsubscribe from an event. The method accepts the same subscription parameter as the `Subscribe` method above.

An example of an App unsubscribing from an event with the [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) would look like the following:

```go
subscription := &apps.Subscription{
    Subject: "user_joined_channel",
    ChannelID: "9a44ckeqytd3bftn3c3y53968o",
    TeamID: "hoan6o9ws7rp5xj7wu9rmysrte",
}
err := client.Unsubscribe(subscription)
if err != nil {
    // handle the error
}
```

