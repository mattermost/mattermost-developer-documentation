---
title: "Quick start guide (Go)"
heading: "Writing a Mattermost app in Go"
description: "This quick start guide will walk you through the basics of writing a Mattermost app in Go."
weight: 10
---

The easiest way to start with developing Mattermost Apps in Go is to download
and run the
[hello-world](https://github.com/mattermost/mattermost-plugin-apps/examples/go/hello-world)
app. 

There you can learn about the anatomy of an Mattermost app. It illustrates the basic concepts of 
- [Manifest]({{< ref "manifest" >}}) which describes the app;
- [Bindings]({{< ref "bindings" >}}) that the app uses to bind itself to the Mattermost UI;
- [Interactivity]({{< ref "interactivity" >}}) with slash commands and forms;
- [Call handlers]({{< ref "call" >}}) - functions that process requests


We also provide focused examples for other use cases and Apps features:
- [Authenticate to 3rd parties using OAuth2](https://github.com/mattermost/mattermost-plugin-apps/examples/go/lifecycle)
- [Authenticate from Mattermost using JWT](https://github.com/mattermost/mattermost-plugin-apps/examples/go/jwt)
- [Respond to app lifecycle events](https://github.com/mattermost/mattermost-plugin-apps/examples/go/lifecycle)
- [Package an app to run on AWS or OpenFAAS](https://github.com/mattermost/mattermost-plugin-apps/examples/go/serverless)
- [Receive and process 3rd party webhooks](https://github.com/mattermost/mattermost-plugin-apps/examples/go/webhooks)