---
title: "Structure"
heading: "Apps structure"
description: "An overview of the structure of an App"
weight: 30
aliases:
  - /integrate/apps/api/
---

Apps consist of three kinds of assets:

1. A [manifest]({{< ref "manifest" >}}), which contains App details such as name, version, requested permissions, and deployment methods.

2. [Call]({{< ref "call" >}}) handlers, which are functions that handle incoming requests from the Mattermost server.

3. [Static assets]({{<ref "static-assets">}}), such as images.

To interact with users, an App must [bind]({{< ref "bindings" >}}) a call handler to a [location]({{<ref "manifest#locations">}}) in the Mattermost user interface. These locations may be slash commands, toolbar and menu items, or embedded in posts.

![image](apps-calls_bindings_locations_v2.svg)

A [Binding]({{< ref "bindings" >}}) may display a [Form]({{< ref "interactivity" >}}), or it may invoke a call that will return a form. Forms allow the user to input information with limited dynamic behavior, such as dynamically-populated pick lists, or form refreshes on field changes.
