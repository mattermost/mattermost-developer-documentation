---
title: Server Plugins
heading: "Mattermost Server Plugins"
description: "Server plugins are subprocesses invoked by the server that communicate with Mattermost using remote procedure calls (RPC)."
date: 2018-07-10T00:00:00-05:00
weight: 10
---

Server plugins are subprocesses invoked by the server that communicate with Mattermost using remote procedure calls (RPC).

Looking for a quick start? [See our "Hello, world!" tutorial](/extend/plugins/server/hello-world/).

Want the server plugin reference doc? [Find it here](/extend/plugins/server/reference/).

## Features

#### RPC API

Use the [RPC API](/extend/plugins/server/reference/#API) to execute create, read, update and delete (CRUD) operations on server data models.

For example, your plugin can consume events from a third-party webhook and create corresponding posts in Mattermost, without having to host your code outside Mattermost.

#### Hooks

Register for [hooks](/extend/plugins/server/reference/#Hooks) and get alerted when certain events occur.

For example, consume the [OnConfigurationChange](/extend/plugins/server/reference/#Hooks.OnConfigurationChange) hook to respond to server configuration changes, or the [MessageHasBeenPosted](/extend/plugins/server/reference/#Hooks.MessageHasBeenPosted) hook to respond to posts.

#### REST API

Implement the [ServeHTTP](/extend/plugins/server/reference/#Hooks.ServeHTTP) hook to extend the existing Mattermost REST API.

Plugins with both a web app and server component can leverage this REST API to exchange data. Alternatively, expose your REST API to services and developers connecting from outside Mattermost.

## How It Works

When starting a plugin, the server consults the [plugin's manifest](/extend/plugins/manifest-reference/) to determine if a server component was included. If found, the server launches a new process using the executable included with the plugin.

The server will trigger the [OnActivate](/extend/plugins/server/reference/#Hooks.OnActivate) hook if the plugin is successfully started, allowing you to perform startup events. If the plugin is disabled, the server will trigger the [OnDeactivate](/extend/plugins/server/reference/#Hooks.OnDeactivate) hook. While running, the server plugin can consume hook events, make API calls, launch threads or subprocesses of its own, interact with third-party services or do anything else a regular program can do.
