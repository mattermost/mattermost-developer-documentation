---
title: "Mattermost API"
heading: "Using Mattermost REST APIs with Apps"
description: "An app can use the Mattermost server REST API, as well as new App Services APIs offered specifically to Mattermost Apps."
weight: 600
---

See [here]({{< ref "app-to-mattermost">}}) to learn more authenticating to the REST APIs

## Apps API

The go driver [`appclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client) support method for KV Get/Set/Delete.

The KV APIs require the use of the Bot Account Token, and will fail if a user token is provided.

## Mattermost REST API

[`appclient.Client`](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/appclient#Client) does includes the [`model.Client4`](https://pkg.go.dev/github.com/mattermost/mattermost-server/v5/model#Client4) Mattermost REST API client, pre-initialized with the auth token.
