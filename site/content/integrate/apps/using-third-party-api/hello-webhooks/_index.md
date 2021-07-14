---
title: "Webhooks"
heading: "Hello, Webhooks!"
description: "In this example, the http app will demonstrate connect webhooks"
weight: 90
---

This is an example of an HTTP app ([source](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-webhooks)), written in Go and runnable on `http://localhost:8080`.

- It contains a `manifest.json`, declares itself an HTTP application, requests permissions, and binds itself to locations in the Mattermost user interface.
- In its `bindings` function it declares two commands: `info` and `send`.
- The `info` command will post an ephemeral message containing a valid `send` command.
- The `send` command sends a webhook message to the apps plugin which in turn sends the webhook request to the `Hello, webhooks!` app
- The hello app receives the webhook, via it's `/webhook` endpoint, and responds with an ephemeral message when the webhook is received.

### Install

To install "Hello, Webhooks" on a locally-running instance of Mattermost follow these steps (go 1.16 is required):

Make sure you have followed the Quick Start Guide [prerequisite steps]({{< ref quick-start-go >}}).

```sh
git clone https://github.com/mattermost/mattermost-plugin-apps.git
cd mattermost-plugin-apps/examples/go/hello-webhooks
go run . 
```

Run the following Mattermost slash command:

```
/apps install http http://localhost:8080/manifest.json
```

### Manifest

`Hello, Webhooks!` is an HTTP app. It requests the *permissions* to act as a System Admin and Bot to access the Mattermost REST API. It also requests permissions to receive 3rd party webhook messages. It binds itself to `/` commands.

```json
{
    "app_id": "hello-webhooks",
    "version": "demo",
    "display_name": "Hello, Webhooks!",
    "app_type": "http",
    "root_url": "http://localhost:8080",
    "homepage_url": "https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-webhooks",
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

The `Hello Webhooks!` app creates two commands: `/hello-webhooks info | send`.

```json
{
    "type": "ok",
    "data": [
        {
            "location": "/command",
            "bindings": [
                {
                    "icon": "icon.png",
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

```go
func info(w http.ResponseWriter, req *http.Request) {
    creq := apps.CallRequest{}
    json.NewDecoder(req.Body).Decode(&creq)

    json.NewEncoder(w).Encode(apps.CallResponse{
        Markdown: md.Markdownf("Try `/hello-webhooks send %s`",
            creq.Context.MattermostSiteURL+creq.Context.AppPath+apps.PathWebhook+
                "/hello"+
                "?secret="+creq.Context.App.WebhookSecret),
    })
}
```

### Sending a webhook command

The `/hello-webhooks send` command from the `info` command response will send a webhook message to the apps plugin which verifies the secret and forwards the request to the hello app. The `Hello, Webhooks!` app receives the webhook and posts an ephemeral message in Mattermost.

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

The following image shows the displayed confirmation message after the webhook is sent using the `/hello-webhooks send` command.
![webhookSent message](sent-webhook.png)

### Webhook call handler

```go
    // Webhook handler
    http.HandleFunc("/webhook/", webhookReceived)
```

`webhookReceived` receives the webhook message and posts a confirmation message in the channel.

```go
func webhookReceived(w http.ResponseWriter, req *http.Request) {
    creq := apps.CallRequest{}
    json.NewDecoder(req.Body).Decode(&creq)

    asBot := mmclient.AsBot(creq.Context)
    channelID := ""
    asBot.KVGet("channel_id", "", &channelID)

    asBot.CreatePost(&model.Post{
        ChannelId: channelID,
        Message:   fmt.Sprintf("received webhook, path `%s`, data: `%v`", creq.Path, creq.Values["data"]),
    })

    json.NewEncoder(w).Encode(apps.CallResponse{Type: apps.CallResponseTypeOK})
}
```

The following image shows the displayed confirmation message after the webhook is recieved.
![webhookReceived message](received-webhook.png)
