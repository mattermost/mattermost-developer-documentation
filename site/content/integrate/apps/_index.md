---
title: "Apps"
heading: "Overview"
description: "Apps are lightweight interactive add-ons to mattermost."
section: "apps"
---

- Display interactive, dynamic Modal forms and Message Actions.
- Attach themselves to locations in the Mattermost UI (e.g. channel bar buttons, post menu, channel menu, commands), and can add their custom /commands with full Autocomplete.
- Receive webhooks from Mattermost, and from 3rd parties, and use the Mattermost REST APIs to post messages, etc.
- Be hosted externally (HTTP), on Mattermost Cloud (AWS Lambda), and soon on-prem and in customers' own AWS environments.
- Be developed in any language*.

# Contents

## Development environment

- DRAFT [Google Doc](https://docs.google.com/document/d/1-o9A8l65__rYbx6O-ZdIgJ7LJgZ1f3XRXphAyD7YfF4/edit#) - Dev environment doc.

## Hello, World

- [Anatomy]({{< ref "hello-world" >}}) of a simple app.

## Functions, Calls

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/hello.go#L45) `send` function.
- [Post Menu Message Flow]({{< ref example-post-menu >}}) - message flow to define a Post Menu action, then have a user click it.
- godoc: [Call](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call) - describes how to call a function.
- godoc: [CallRequest](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest) - structure of a request to a function.
- godoc: [Context](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context) - extra data passed to call requests.
- godoc: [Expand](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand) - controls context expansion.

## Forms

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/send_form.json) `send` form.
- [Interactive Message Flows]({{< ref example-interactivity >}}) - message flow to define a Post Menu action, then have a user click it.
- godoc [Form](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form)
- godoc [Field](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field)

## Bindings and Locations

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/bindings.json) bindings.
- godoc [Binding](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding)

## Autocomplete

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/bindings.json) bindings.

## Modals

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/send_form.json) `send` form.

## In-Post Interactivity

## [Using Mattermost APIs]({{< ref "using-mattermost-api" >}})

## [Using 3rd party APIs]({{< ref "using-third-party-api" >}})

## App Lifecycle
- [App Lifecycle]({{< ref "lifecycle" >}})
- godoc: [appsctl](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/cmd/appsctl) - CLI tool used to provision Mattermost Apps in development and production.
