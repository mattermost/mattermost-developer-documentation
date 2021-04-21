---
title: "Apps (Developers Preview)"
heading: "Overview"
description: "Apps are lightweight interactive add-ons to Mattermost."
section: "integrate"
---

Apps are lightweight, interactive add-ons to Mattermost. Apps can:

- Display interactive, dynamic Modal forms and Message Actions.
- Attach themselves to locations in the Mattermost user interface (e.g. channel bar buttons, post menu, channel menu, commands), and can add their custom `/` commands with full Autocomplete.
- Receive webhooks from Mattermost, and third-parties, and use the Mattermost REST APIs to post messages, etc.
- Be hosted externally (HTTP), on Mattermost Cloud (AWS Lambda), and soon in self-managed as well as customers' own AWS environments.
- Be developed in any language*.

Apps are available as a Developers Preview and we're looking for your feedback! Share constructive feedback in the [Mattermost Apps channel](https://community.mattermost.com/core/channels/mattermost-apps) on our Mattermost community instance.

Read the [quick start guide]({{< ref  "quick-start-go" >}}) to learn how to write your first app.

## Development environment

Visit the [Developer Setup Guide](https://developers.mattermost.com/contribute/server/developer-setup/) for information about setting up your development environment.

## Functions and calls

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/hello.go#L45) `send` function.
- [Post Menu Message Flow]({{< ref example-post-menu >}}) - Message flow to define a Post Menu action, then have a user click it.
- godoc: [Call](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call) - Describes how to call a function.
- godoc: [CallRequest](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest) - Structure of a request to a function.
- godoc: [Context](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context) - Extra data passed to call requests.
- godoc: [Expand](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand) - Controls context expansion.

## Forms

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/send_form.json) `send` form.
- [Interactive Message Flows]({{< ref example-interactivity >}}) - Message flow to define a Post Menu action, then have a user click it.
- godoc [Form](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form)
- godoc [Field](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field)

## Bindings and locations

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/bindings.json) bindings.
- godoc [Binding](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding)

## Autocomplete

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/bindings.json) bindings.

## Modals

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/send_form.json) `send` form.

## In-post interactivity

({{< ref "example-interactivity" >}})

## Using Mattermost APIs

{{< ref "using-mattermost-api" >}}

## Using third-party APIs

{{< ref "using-third-party-api" >}}

## App Lifecycle

- [App Lifecycle]({{< ref "lifecycle" >}})
- godoc: [appsctl](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/cmd/appsctl) - CLI tool used to provision Mattermost Apps in development and production.
