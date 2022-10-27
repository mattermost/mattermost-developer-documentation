---
title: Key-value store
description: Use the per-App key-value data store
weight: 20
---
The Apps framework provides access to a simple key-value store for App-specific data.
Keys are simple strings and values are any type that can be marshalled to JSON.

{{<note "Note:">}}
It is recommended to use a [driver]({{<ref "/integrate/apps/drivers">}}) when using the key-value store.
{{</note>}}

There are 3 operations that can be performed against the key-value store:

1. Get the value of a key (`KVGet`)
2. Set the value of a key (`KVSet`)
3. Delete a key (`KVDelete`)

For example, using the [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) to store a string value would look like the following:

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

Complex and nested data can also be stored:

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
myData := NestedData{
    UserId: "7q7kaakokfdsdycy3pr9ctkc5r",
    IsEmployee: true,
    Team: TeamData{
        Name: "My Team",
        Id: "hoan6o9ws7rp5xj7wu9rmysrte",
    },
}
valueChanged, err := client.KVSet("my-app", "my-key", myData)
if err != nil {
    // handle the error
}
```

The stored data can then be retrieved as desired:

```go
// Create an empty struct to hold the data
myData := NestedData{
    Team: TeamData{},
}
// Retrieve the value of the key into `myData`
err := client.KVGet("my-app", "my-key", &myData)
if err != nil {
    // handle the error
}
```
