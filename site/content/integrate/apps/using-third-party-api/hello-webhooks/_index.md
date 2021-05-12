---
title: "Hello Webhooks Example"
heading: "Hello Webhooks Example"
description: "In this example, the http app will demonstrate connect webhooks"
weight: 90
---


## Hello, Webhooks!

This is an example of an HTTP app ([source](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-webhooks)), written in Go and runnable on http://localhost:8080.

- It contains a `manifest.json`, declares itself an HTTP application, requests permissions, and binds itself to locations in the Mattermost user interface.
- In its `bindings` function it declares three commands: `configure`, `connect`, and `send`.
- Its `send` function mentions the user by their Google name, and lists their Google Calendars.

To install "Hello, Webhooks" on a locally-running instance of Mattermost follow these steps (go 1.16 is required):

```sh
git clone https://github.com/mattermost/mattermost-plugin-apps.git
cd mattermost-plugin-apps/examples/go/hello-webhooks
go run . 
```

In the Mattermost Desktop client run:

```
/apps debug-add-manifest --url http://localhost:8080/manifest.json
/apps install hello-oauth2
```

You need to configure your [Google API Credentials](https://console.cloud.google.com/apis/credentials) for the app. Use `$MATTERMOST_SITE_URL$/com.mattermost.apps/apps/hello-oauth2/oauth2/remote/complete` for the `Authorized redirect URIs` field. After configuring the credentials, in the Mattermost Desktop client run:

```
/hello-oauth2 configure --client-id $CLIENT_ID --client-secret $CLIENT_SECRET
```

