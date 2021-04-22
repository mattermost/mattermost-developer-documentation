---
title: "Apps (Developers Preview)"
heading: "Introduction"
description: "Apps are lightweight interactive add-ons to Mattermost."
section: "integrate"
weight: 90
---

Apps are lightweight, interactive add-ons to Mattermost which can use any HTTP-compatible hosting mechanism to run without dedicated infrastructure. Apps can:

- Display interactive, dynamic Modal forms and Message Actions.
- Be written in any language.
- Attach themselves to locations in the Mattermost user interface (e.g. channel bar buttons, post menu, channel menu, commands), and can add their custom `/` commands with full Autocomplete.
- Receive webhooks from Mattermost, and third-parties, and use the Mattermost REST APIs to post messages, etc.
- Be hosted externally (HTTP) and on Mattermost Cloud (AWS Lambda)*.
- Work on both Mobile and Desktop apps so developers can focus on the functionality of their apps.
- Be deployed using our Mattermost serverless hosting infrastructure keeping data secure and supporting scalability.

When you develop using the Apps Framework, your apps can:

- Create slash commands
- Post messages to channels
- Add buttons to channel headers, menus
- Interactive modals
- Dynamic fields
- Code as an on-demand function

Apps are available as a Developers Preview and we're looking for your feedback! Share constructive feedback in the [Mattermost Apps channel](https://community.mattermost.com/core/channels/mattermost-apps) on our Mattermost community instance.

* Apps will soon be available for self-managed deployments as well as customers' own AWS environments.

## Developing apps

We recommend starting off with local development. Visit the [Developer Setup Guide](https://developers.mattermost.com/contribute/server/developer-setup/) for information about setting up your development environment.

Next, read the [quick start guide]({{< ref  "quick-start-go" >}}) to learn how to write your first app.

### App lifecycle

- [App Lifecycle]({{< ref "lifecycle" >}})
- godoc: [appsctl](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/cmd/appsctl) - CLI tool used to provision Mattermost Apps in development and production.

### [Using Mattermost APIs]({{< ref "using-mattermost-api" >}})

### [Using third-party APIs]({{< ref "using-third-party-api" >}})

### Functions and calls

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/hello.go#L45) `send` function.
- [Post Menu Message Flow]({{< ref example-post-menu >}}) - Message flow to define a Post Menu action, then have a user click it.
- godoc: [Call](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call) - Describes how to call a function.
- godoc: [CallRequest](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest) - Structure of a request to a function.
- godoc: [Context](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context) - Extra data passed to call requests.
- godoc: [Expand](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand) - Controls context expansion.

### Forms

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/send_form.json) `send` form.
- [Interactive Message Flows]({{< ref example-interactivity >}}) - Message flow to define a Post Menu action, then have a user click it.
- godoc [Form](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form)
- godoc [Field](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field)

### Bindings and locations

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/bindings.json) bindings.
- godoc [Binding](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding)

### Autocomplete

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/bindings.json) bindings.

### Modals

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/send_form.json) `send` form.

### [In-post interactivity](({{< ref "example-interactivity" >}}))
