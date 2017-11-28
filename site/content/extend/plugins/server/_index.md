---
title: Server Plugins
date: 2017-10-26T17:56:25-05:00
subsection: Plugins
weight: 10
---

# Server Plugins

Server plugins are capable of extending the Mattermost server by running processes on the server that interact with Mattermost via remote procedure calls (RPC).

Looking for a quick start? [See our "Hello, world!" guide](/extend/plugins/server/hello-world/).

Want the server plugin reference doc? [Find it here](/extend/plugins/server/reference/).

## Features

#### RPC API

With the [RPC API](/extend/plugins/server/reference/#API), your server plugin can create, read, update and delete operations on server data models.

A common use case is a plugin listening to a third-party webhook, creating posts in Mattermost based on events received from the webhook.

#### Hooks

With [hooks](/extend/plugins/server/reference/#Hooks), get alerted by RPC when certain server events occur. For example, use the [OnConfigurationChange](/extend/plugins/server/reference/#Hooks.OnConfigurationChange) hook to get alerted of server configuration changes.

#### REST API

Use the [ServeHTTP](/extend/plugins/server/reference/#Hooks.ServeHTTP) hook to extend the existing Mattermost REST API with your plugin.

This is useful when building plugins that contain both web app and server parts. The server part can expose new functionality to the web app part, as if it was another part of the Mattermost REST API.

## How It Works

When a plugin is uploaded to a Mattermost server and activated, the server checks to see if there is a backend portion included as part of the plugin by looking at the [plugin's manifest](/extend/plugins/manifest-reference/). If one is found, the server will start a new process using the executable included with the plugin.

Immediately after start-up, the `OnActivate` hook is triggered via RPC. Similarly, on plugin deactivation the `OnDeactivate` hook is triggered.

Once running, the server plugin can listen to hooks, make API calls, interact with third-party services or do whatever else it needs to.
