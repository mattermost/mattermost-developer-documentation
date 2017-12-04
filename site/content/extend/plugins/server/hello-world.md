---
title: Quick Start (Hello, world!)
date: 2017-10-26T17:54:54-05:00
subsection: Server Plugins
weight: -10
---

# Hello, world!

This tutorial will walk you through the basics of extending the Mattermost server.

## Prerequisites

Mattermost plugins extend the server using a Go API. You'll need a functioning Go environment, so follow [Go's Getting Started](https://golang.org/doc/install) guide if needed.

You'll also need a Mattermost server to install and test the plugin. This server must have "Enable" and "EnableUploads" set to true in the "PluginSettings" section of its config file.

## Building the Plugin

The process that will communicate with the Mattermost server is built using a set of APIs provided by the source code for the Mattermost server.

Run this command to download the source code for the Mattermost server: `go get -u github.com/mattermost/mattermost-server`

Now, create a directory to act as your workspace, and create a file named "plugin.go" inside of it with the following contents:

{{<plugingoexamplecode name="_helloWorld">}}

This plugin will register an HTTP handler that will respond with "Hello, world!" when requested.

Run this command to build the executable that will be distributed with your plugin: `go build plugin.go`

**Note:** Your executable is platform specific! If you're building the plugin for a server running on a different operating system, you'll need to use a slightly different command. For example, if you're using developing the plugin from MacOS and deploying to a Linux server, you'll need to use this command: `GOOS=linux GOARCH=amd64 go build plugin.go`

Now, we'll need to define a manifest, which is required for every plugin. Create a file named "plugin.yaml" with the following contents:

```yaml
id: com.mattermost.server-hello-world
name: Server "Hello, world!"
backend:
    executable: plugin
```

This manifest gives the server the location of our executable within our bundle.

Bundle the manifest and executable up with this command: `tar -czvf plugin.tar.gz plugin plugin.yaml`

You should now have a file named "plugin.tar.gz" in your workspace. Congratulations! This is your first plugin!

## Installing the Plugin

Open up Mattermost as a system administrator, navigate to **Plugins > Management** and upload the `plugin.tar.gz` you generated above.

Click "Activate" under the plugin when it's done uploading.

Type the following path into your address bar, appending it to your Mattermost server's domain, and you'll be greeted by your plugin: `/plugins/com.mattermost.server-hello-world`
