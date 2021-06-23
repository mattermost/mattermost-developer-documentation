---
title: "Webhooks"
heading: "Hello, Webhooks!"
description: "In this example, the http app will demonstrate connect webhooks"
weight: 90
---

This is an example of an HTTP app ([source](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-webhooks)), written in Go and runnable on http://localhost:8080.

- It contains a `manifest.json`, declares itself an HTTP application, requests permissions, and binds itself to locations in the Mattermost user interface.
- In its `bindings` function it declares two commands: `info` and `send`.
- The `info` command will post an ephemeral message containing a valid `send` command.
- The `send` command sends a webhook message to the apps plugin which in turn sends the webhook request to the `Hello, webhooks!` app
- The hello app receives the webhook, via it's `/webhook` endpoint, and responds with an ephemeral message when the webhook is received.

To install "Hello, Webhooks" on a locally-running instance of Mattermost follow these steps (go 1.16 is required):

```sh
git clone https://github.com/mattermost/mattermost-plugin-apps.git
cd mattermost-plugin-apps/examples/go/hello-webhooks
go run . 
```

In the Mattermost Desktop client run:

```
/apps debug-add-manifest --url http://localhost:8080/manifest.json
/apps install hello-webhooks
```

### Manifest

Hello, Webhooks! is an HTTP app, it requests the *permissions* to act as a System Admin and Bot to access the Mattermost REST API. It also requests permissions to receive 3rd party webhook messages. It binds itself to `/` commands.

```json
{
    "app_id": "hello-webhooks",
    "version": "demo",
    "display_name": "Hello, Webhooks!",
    "app_type": "http",
    "root_url": "http://localhost:8080",
    "homepage_url": "https://github.com/mattermost/mattermost-plugin-apps/examples/go/hello-webhooks",
    "requested_permissions": [
        "act_as_admin",
        "act_as_bot",
        "remote_webhooks"
    ],
    "requested_locations": [
        "/command"
    ]
}
```

### Bindings and locations

The Hello Webhooks app creates two commands: `/hello-webhooks info | send`.

```json
{
    "type": "ok",
    "data": [
        {
            "location": "/command",
            "bindings": [
                {
                    "icon": "http://localhost:8080/static/icon.png",
                    "label": "hello-webhooks",
                    "description": "Hello Webhooks App",
                    "hint": "[ send ]",
                    "bindings": [
                        {
                            "location": "send",
                            "label": "send",
                            "call": {
                                "path": "/send"
                            }
                        },
                        {
                            "location": "info",
                            "label": "info",
                            "call": {
                                "path": "/info"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```

### Displaying the webhook command

`/hello-webhooks info` displays a valid `/hello-webhooks send` command constructed with your mattermost-site-url, the path to the hello app webhook endpoint, and a secret.

### Sending a webhook command

The `/hello-webhooks send` command from the `info` command response will send a webhook message to the apps plugin which verifies the secret and forwards the request to the hello app. The `Hello, Webhooks!` app receives the webhook and posts an ephemeral message in Mattermost.

### Webhooks call handler

To handle the incoming webhook

`<mattermost-site-url>/plugins/com.mattermost.apps/apps/hello-webhooks/webhook/hello?secret=<your-app-secret>`

`https://jasonf.ngrok.io/plugins/com.mattermost.apps/apps/hello-webhooks/webhook/hello?secret=wmmd5wztzty4dfqidu3zee9uuc`

```go
    // Webhook handler
    http.HandleFunc("/webhook/", webhookReceived)
```

```go
func webhookReceived(w http.ResponseWriter, req *http.Request) {
    creq := apps.CallRequest{}
    json.NewDecoder(req.Body).Decode(&creq)

    asBot := mmclient.AsBot(creq.Context)
    channelID := ""
    asBot.KVGet("channel_id", "", &channelID)

    asBot.CreatePost(&model.Post{
        ChannelId: channelID,
        Message:   fmt.Sprintf("received webhook, path `%s`, data: `%v`", creq.Values["path"], creq.Values["data"]),
    })

    json.NewEncoder(w).Encode(apps.CallResponse{Type: apps.CallResponseTypeOK})
}
```

```go
func send(w http.ResponseWriter, req *http.Request) {
    creq := apps.CallRequest{}
    json.NewDecoder(req.Body).Decode(&creq)
    url, _ := creq.Values["url"].(string)

    http.Post(
        url,
        "application/json",
        bytes.NewReader([]byte(`"Hello from a webhook!"`)))

    json.NewEncoder(w).Encode(apps.CallResponse{
        Markdown: "posted a Hello webhook message",
    })
}
```

### `info` Command

### `send` Command
