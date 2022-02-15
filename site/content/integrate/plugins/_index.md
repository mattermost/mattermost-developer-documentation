---
title: Plugins
heading: "Plugins in Mattermost"
description: "Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the Server and Web/Desktop Apps."
date: 2017-07-10T00:00:00-05:00
weight: 40
aliases: [/extend/plugins/]
---

Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the Server and Web/Desktop Apps.

Share constructive feedback [on our forum post](https://forum.mattermost.org/t/plugin-system-upgrade-in-mattermost-5-2/5498) or join the [Toolkit channel](https://community.mattermost.com/core/channels/developer-toolkit) on our Mattermost community server.

## Features

### Customize user interfaces

Write a Web App plugin to add to the channel header, sidebars, main menu, and more. Register your plugin against a post type to render custom posts or wire up a root component to build an entirely new experience. All this is possible without having to fork the source code and rebase on every Mattermost release.

### Launch tightly-integrated services

Launch and manage Server plugins as services from your Mattermost server over RPC. Handle events via real-time hooks and invoke Mattermost server methods directly using a dedicated plugin API.

### Extend the Mattermost REST API

Extend the Mattermost REST API with custom endpoints for use by Web App plugins or third-party services. Custom endpoints have access to all the features of the standard Mattermost REST API, including personal access tokens and OAuth 2.0.

### Simple development and installation

Using the [server]({{< ref "/integrate/plugins/server/hello-world" >}}) and [web app]({{< ref "/integrate/plugins/webapp/hello-world" >}}) quick start guides, it's simple to set up a plugin development environment. You can also base your implementation off of [mattermost-plugin-starter-template](https://github.com/mattermost/mattermost-plugin-starter-template), complete with build scripts and templates. Once bundled as a gzipped .tar file, upload your plugin to a Mattermost server through the [System Console](https://developers.mattermost.com/integrate/admin-guide/admin-plugins-beta/) or via the [API](https://api.mattermost.com/#tag/plugins).

Read the plugins [overview]({{< ref "/integrate/plugins/overview" >}}) to learn more.
