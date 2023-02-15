---
title: "Subscriptions"
description: "Interact with Mattermost events"
weight: 10
aliases:
  - /integrate/apps/api/subscriptions/
---
Subscriptions provide a way for an App to be notified about events sent by the Mattermost Server. The Mattermost Server notifies an App of an event by invoking a [call]({{<ref "/integrate/apps/structure/call">}}).

There are three operations that can be performed when managing subscriptions:

1. Subscribe to an event
2. List event subscriptions
3. Unsubscribe from an event

Subscriptions can be managed in two ways:

- Using HTTP REST endpoints
- Using a [driver]({{<ref "/integrate/apps/drivers">}})

## Event subjects

Each event subscription ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription">}}) contains a `subject` which specifies the event name. For example, `user_created`.

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

## Subscription calls

The HTTP REST request sent by a subscription event looks like the following:

```http request
POST /event-handler HTTP/1.1
Content-Type: application/json

{
    "path": "/event",
    "context": {
        "user_id": "7q7kaakokfdsdycy3pr9ctkc5r",
        "subject": "user_joined_channel",
        "channel_id": "9a44ckeqytd3bftn3c3y53968o",
        "app_id": "my-app",
        "mattermost_site_url": "http://localhost:8066",
        "developer_mode": true,
        "app_path": "/plugins/com.mattermost.apps/apps/my-app",
        "bot_user_id": "mgbd1czngjbbdx6eqruqabdeie",
        "bot_access_token": "ix8gsdqudfgupyf3qsh8y9j81w",
        "oauth2": {}
    }
}
```

## Use HTTP REST endpoints

### Endpoint URL

Subscriptions are managed using a single HTTP REST endpoint:

`<mattermost_site_url>/plugins/com.mattermost.apps/api/v1/subscribe`

Replace `<mattermost_site_url>` with the base URL to the Mattermost server.
The `<mattermost_site_url>` value can be obtained from a [call request context]({{<ref "/integrate/apps/structure/call#context">}}).

#### Authorization

An authorization token is required when invoking HTTP REST endpoints to manage subscriptions. The token must be set in the `Authorization` header as a bearer token. The `bot_access_token` field of the call request context will contain the token.

### Subscribe to an event with HTTP REST

Example HTTP request to subscribe to the `bot_joined_team` subject for a particular team:

```http request
POST /plugins/com.mattermost.apps/api/v1/subscribe HTTP/1.1
Authorization: Bearer xxxxxxxxxxxxxx
Content-Type: application/json

{
    "subject": "bot_joined_team",
    "team_id": "hoan6o9ws7rp5xj7wu9rmysrte",
    "call": {
        "path": "/bot_joined_team",
        "expand": {
            "app": "all",
            "team": "all"
        }
    }
}
```

### List event subscriptions with HTTP REST

Example HTTP request to list the existing subscriptions:

```http request
GET /plugins/com.mattermost.apps/api/v1/subscribe HTTP/1.1
Authorization: Bearer xxxxxxxxxxxxxx
```

Example response body; the response is a JSON array:

```json
[
    {
        "subject": "bot_joined_team",
        "team_id": "hoan6o9ws7rp5xj7wu9rmysrte",
        "call": {
            "path": "/bot_joined_team",
            "expand": {
                "app": "all",
                "team": "all"
            }
        }
    }
]
```

### Unsubscribe from an event with HTTP REST

Example HTTP request to unsubscribe from the `bot_joined_team` subject:

```http request
POST /plugins/com.mattermost.apps/api/v1/unsubscribe HTTP/1.1
Authorization: Bearer xxxxxxxxxxxxxx
Content-Type: application/json

{
    "subject": "bot_joined_team",
    "team_id": "hoan6o9ws7rp5xj7wu9rmysrte",
    "call": {
        "path": "/bot_joined_team",
        "expand": {
            "app": "all",
            "team": "all"
        }
    }
}
```

## Use a driver

### Subscribe to an event with a driver

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to subscribe to the `user_joined_channel` (`apps.SubjectUserJoinedChannel`) subject for a particular team and channel:

```go
subscription := &apps.Subscription{
    Subject:   apps.SubjectUserJoinedChannel,
    ChannelID: "9a44ckeqytd3bftn3c3y53968o",
    TeamID:    "hoan6o9ws7rp5xj7wu9rmysrte",
    Call: apps.Call{
        Path:   "/user-joined-channel",
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

### List event subscriptions with a driver

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to list the existing subscriptions:

```go
// `subscriptions` is a slice of apps.Subscription structs
subscriptions, err := client.GetSubscriptions()
if err != nil {
    // handle the error
}
```

### Unsubscribe from an event with a driver

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to unsubscribe from the `user_joined_channel` (`apps.SubjectUserJoinedChannel`) subject:

```go
subscription := &apps.Subscription{
    Subject:   apps.SubjectUserJoinedChannel,
    ChannelID: "9a44ckeqytd3bftn3c3y53968o",
    TeamID:    "hoan6o9ws7rp5xj7wu9rmysrte",
    Call: apps.Call{
        Path:   "/user-joined-channel",
        Expand: &apps.Expand{
            // optionally expand call metadata fields
        },
    },
}
err := client.Unsubscribe(subscription)
if err != nil {
    // handle the error
}
```
