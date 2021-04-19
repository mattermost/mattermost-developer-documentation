---
title: "Apps"
heading: "Overview"
description: "Apps are lightweight interactive add-ons to mattermost."
section: "integrate"
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

- [Anatomy](01-anatomy-hello.md) of a simple app.

## Functions, Calls

- Example: [Hello, World](/server/examples/go/helloworld/hello.go#L45) `send` function.
- [Post Menu Message Flow](02-example-post-menu.md) - message flow to define a Post Menu action, then have a user click it.
- godoc: [Call](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Call) - describes how to call a function.
- godoc: [CallRequest](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest) - structure of a request to a function.
- godoc: [Context](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Context) - extra data passed to call requests.
- godoc: [Expand](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Expand) - controls context expansion.

## Forms

- Example: [Hello, World](/server/examples/go/helloworld/send_form.json) `send` form.
- [Interactive Message Flows](03-example-interactivity.md) - message flow to define a Post Menu action, then have a user click it.
- godoc [Form](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Form)
- godoc [Field](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Field)

## Bindings and Locations

- Example: [Hello, World](/server/examples/go/helloworld/bindings.json) bindings.
- godoc [Binding](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Binding)

## Autocomplete

- Example: [Hello, World](/server/examples/go/helloworld/bindings.json) bindings.

## Modals

- Example: [Hello, World](/server/examples/go/helloworld/send_form.json) `send` form.

## In-Post Interactivity

## [Using Mattermost APIs](05-using-mattermost-api.md)

## [Using 3rd party APIs](06-using-3rdparty-api.md)

## App Lifecycle
- [App Lifecycle](07-lifecycle.md)
- godoc: [appsctl](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/cmd/appsctl) - CLI tool used to provision Mattermost Apps in development and production.
