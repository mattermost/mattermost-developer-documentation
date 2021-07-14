---
title: "Third-party APIs"
heading: "Using third-party APIs for Apps"
description: "Mattermost Apps framework provides services for using remote (third-party) OAuth2 HTTP APIs, and receiving authenticated webhook notifications from remote systems."
weight: 90
---

There are two examples here to illustrate [OAuth2](#hello-oauth2) and [Webhook](#hello-webhooks) support. Both are HTTP apps written in Go and runnable on `http://localhost:8080`.

### [Hello, OAuth2 example]({{< ref hello-oauth2 >}})

This is an example of an HTTP app ([source](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-oauth2)) that connects a user via oauth2.

### [Hello, Webhooks example]({{< ref hello-webhooks >}})

This is an example of an HTTP app ([source](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-webhooks)) that sends and receives a webhook notification.

