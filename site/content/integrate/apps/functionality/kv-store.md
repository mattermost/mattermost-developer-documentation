---
title: Key-value store
description: Use the per-App key-value data store
weight: 20
---
The Apps framework provides access to a simple key-value store for App-specific data.
Keys are simple strings and values are any data that can be expressed in JSON.

There are three operations that can be performed against the key-value store:

1. Get the value of a key
2. Set the value of a key
3. Delete a key

The key-value store can be accessed in two ways:

- Using HTTP REST endpoints
- Using a [driver]({{<ref "/integrate/apps/drivers">}})

{{<note "Unique keys:">}}
Keys in the Key-value store are unique to the user or bot token used. One user's data will not overwrite another user's data. 
{{</note>}}

## Access the key-value store with HTTP REST calls

### Endpoint URL

The key-value store is accessed using a single HTTP REST endpoint:

`<mattermost_site_url>/plugins/com.mattermost.apps/api/v1/kv/<my-key>`

Replace `<mattermost_site_url>` with the base URL to the Mattermost server and `<my-key>` with the name of the key to add, modify, or delete.
The `<mattermost_site_url>` value can be obtained from a [call request context]({{<ref "/integrate/apps/structure/call#context">}}).

#### Authorization

An authorization token is required when invoking HTTP REST endpoints of the key-value store. The token must be set in the `Authorization` header as a bearer token.
The acting user token can be obtained from a call request context where the `acting_user_access_token` expand field is set to `all`.
The `acting_user_access_token` field of the call request context will contain the token.

### Get a value with HTTP REST

Example HTTP request to get the value of key `my-key`:

```http request
GET /plugins/com.mattermost.apps/api/v1/kv/my-key HTTP/1.1
Authorization: Bearer xxxxxxxxxxxxxx
```

The HTTP response body will contain only the value of the requested key.

### Set a value with HTTP REST

Example HTTP request to set the value of key `my-key` to a JSON object:

```http request
POST /plugins/com.mattermost.apps/api/v1/kv/my-key HTTP/1.1
Authorization: Bearer xxxxxxxxxxxxxx
Content-Type: application/json

{
    "object_with": "some_data"
}
```

### Delete a value with HTTP REST

Example HTTP request to delete the key `my-key`:

```http request
DELETE /plugins/com.mattermost.apps/api/v1/kv/my-key HTTP/1.1
Authorization: Bearer xxxxxxxxxxxxxx
```

## Access the key-value store with a driver

### Get a value with a driver

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to get the value of the key `my-key`:

```go
// Create an instance of the REST API client, acting as a bot (vs. a user)
client := appclient.AsBot(callRequest.Context)
// Create an empty struct to hold the data
var myData string
// Retrieve the value of the key `my-key` into `myData`
err := client.KVGet("my-app", "my-key", &myData)
if err != nil {
    // handle the error
}
```

### Set a value with a driver

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to set the value of the key `my-key`:

```go
// Create an instance of the REST API client, acting as a bot (vs. a user)
client := appclient.AsBot(callRequest.Context)
// Store the string `my-value` in the key `my-key`
// The `valueChanged` bool indicates if the value of the `my-key` key was changed
valueChanged, err := client.KVSet("my-app", "my-key", "my-value")
if err != nil {
    // handle the error
}
```

#### Store complex data

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to store complex and nested data:

```go
type TeamData struct {
    Name string `json:"name"`
    Id   string `json:"id"`
}
type NestedData struct {
    UserId     string   `json:"user_id"`
    IsEmployee bool     `json:"is_employee"`
    Team       TeamData `json:"team"`
}
// Construct the data to store
myData := NestedData{
    UserId: "7q7kaakokfdsdycy3pr9ctkc5r",
    IsEmployee: true,
    Team: TeamData{
        Name: "My Team",
        Id: "hoan6o9ws7rp5xj7wu9rmysrte",
    },
}
// Create an instance of the REST API client, acting as a bot (vs. a user)
client := appclient.AsBot(callRequest.Context)
// Store the `myData` struct in the key `my-key`
valueChanged, err := client.KVSet("my-app", "my-key", myData)
if err != nil {
    // handle the error
}
```

Retrieving nested data is the same as any other data:

```go
// Create an empty struct to hold the data
myData := NestedData{
    Team: TeamData{},
}
// Create an instance of the REST API client, acting as a bot (vs. a user)
client := appclient.AsBot(callRequest.Context)
// Retrieve the value of the key `my-key` into `myData`
err := client.KVGet("my-app", "my-key", &myData)
if err != nil {
    // handle the error
}
```

### Delete a key with a driver

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to delete the key `my-key`:

```go
// Create an instance of the REST API client, acting as a bot (vs. a user)
client := appclient.AsBot(callRequest.Context)
// Delete the key `my-key`
err := client.KVDelete("my-app", "my-key")
if err != nil {
    // handle the error
}
```
