---
title: "Apps (Developers Preview)"
heading: "Introduction"
description: "Apps are lightweight interactive add-ons to Mattermost."
section: "integrate"
weight: 90
---

Apps are lightweight, interactive add-ons to Mattermost which use serverless hosting to run without any dedicated infrastructure. Apps can:

- Display interactive, dynamic Modal forms and Message Actions.
- Be written in several different languages.
- Attach themselves to locations in the Mattermost user interface (e.g. channel bar buttons, post menu, channel menu, commands), and can add their custom `/` commands with full Autocomplete.
- Receive webhooks from Mattermost, and third-parties, and use the Mattermost REST APIs to post messages, etc.
- Be hosted externally (HTTP) and on Mattermost Cloud (AWS Lambda)*.
- Work on both Mobile and Desktop apps so developers can focus on the functionality of their apps.
- Be deployed using our Mattermost serverless hosting infrastructure keeping data secure and supporting scalability.

Apps are available as a Developers Preview and we're looking for your feedback! Share constructive feedback in the [Mattermost Apps channel](https://community.mattermost.com/core/channels/mattermost-apps) on our Mattermost community instance.

* Apps will soon be available for self-managed deployments as well as customers' own AWS environments.

Read the [quick start guide]({{< ref  "quick-start-go" >}}) to learn how to write your first app.

## Mattermost serverless app hosting

Mattermost serverless hosting allows for easy app installation from the App Marketplace by a System Admin and uses AWS Lambda serverless technology instead of relying on a physical server. Developers who create apps using a serverless development approach can easily deploy apps securely, efficiently, and at scale in the Mattermost Cloud.

## Developing serverless apps

### Development environment

Visit the [Developer Setup Guide](https://developers.mattermost.com/contribute/server/developer-setup/) for information about setting up your development environment.

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
