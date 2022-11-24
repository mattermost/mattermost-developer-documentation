---
title: Plugins
heading: "Plugins in Mattermost"
description: "Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the Server and Web/Desktop Apps."
date: 2017-07-10T00:00:00-05:00
weight: 40
aliases:
  - /extend/plugins/
---

Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the Server and Web/Desktop Apps.

Share constructive feedback {{< newtabref href="https://forum.mattermost.com/t/plugin-system-upgrade-in-mattermost-5-2/5498" title="on our forum post" >}} or join the {{< newtabref href="https://community.mattermost.com/core/channels/developer-toolkit" title="Toolkit channel" >}} on our Mattermost community server.

## Features

### Customize user interfaces

Write a Web App plugin to add to the channel header, sidebars, main menu, and more. Register your plugin against a post type to render custom posts or wire up a root component to build an entirely new experience. All this is possible without having to fork the source code and rebase on every Mattermost release.

### Launch tightly-integrated services

Launch and manage Server plugins as services from your Mattermost server over RPC. Handle events via real-time hooks and invoke Mattermost server methods directly using a dedicated plugin API.

### Extend the Mattermost REST API

Extend the Mattermost REST API with custom endpoints for use by Web App plugins or third-party services. Custom endpoints have access to all the features of the standard Mattermost REST API, including personal access tokens and OAuth 2.0.

### Simple development and installation

Using the [server]({{< ref "/integrate/plugins/components/server/hello-world" >}}) and [web app]({{< ref "/integrate/plugins/components/webapp/hello-world" >}}) quick start guides, it's simple to set up a plugin development environment. You can also base your implementation off of {{< newtabref href="https://github.com/mattermost/mattermost-plugin-starter-template" title="mattermost-plugin-starter-template" >}}, complete with build scripts and templates. Once bundled as a gzipped .tar file, upload your plugin to a Mattermost server through the [System Console]({{< ref "/integrate/plugins/using-and-managing-plugins" >}}) or via the {{< newtabref href="https://api.mattermost.com/#tag/plugins" title="API" >}}.

Read the plugins [overview]({{< ref "/integrate/plugins/overview" >}}) to learn more.
