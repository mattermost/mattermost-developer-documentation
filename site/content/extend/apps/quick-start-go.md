---
title: "Quick start guide (Go)"
heading: "Writing a Mattermost app in Go"
description: This quick start guide will walk you through the basics of writing a Mattermost app in Go."
date: 2020-04-15T00:00:00-05:00
subsection: Apps
weight: 10
---

This quick start guide will walk you through the basics of writing a Mattermost app.

## Prerequisites

Before you can start with your app, you first need to setup an local developers environment following the [server](/contribute/server/developer-setup/) and [webapp](/contribute/webapp/developer-setup/) setup guides. You must enable the apps feature flag before starting the Mattermost server by setting the enjoinment variable `MM_FEATUREFLAGS_AppsEnabled`  to `true` by e.g. adding `export MM_FEATUREFLAGS_AppsEnabled=true` to your `.bashrc`.

**Note:** Apps does not work with a production release of Mattermost right now. They can only be run in a development environment.

You also need have at least `go1.16` installed. Please follow the guide [here](https://golang.org/doc/install) to install the latest version.

## Install Apps plugin

The [Apps plugin](https://github.com/mattermost/mattermost-plugin-apps)) is a communication bridge between your app and the Mattermost server. To install it on your local server by cloning the code in a directory of your choice:
```bash
git clone https://github.com/mattermost/mattermost-plugin-apps.git
```

Then build the plugin using:
```bash
make dist
```

And upload it via the System Console to your local Mattermost server..

## Building the App


Start building your app by creating a directory for the code and setting up a new go-module:
```bash
mkdir my-app
cd my-app
go mod init my-app
```

Your apps has to provide a so called manifest. Create a file called `manifest.json` containing:

```json
{
	"app_id": "my-app",
	"display_name": "My App!",
	"app_type": "http",
	"root_url": "http://localhost:8080",
	"requested_permissions": [
		"act_as_bot"
	],
	"requested_locations": [
		"/channel_header",
		"/command"
	]
}
```
The manifest contains user facing metadata like a `display_name`, permissions that your require



Create a file named `main.go` with the following contents:

```go


```

<!--

This plugin will register an HTTP handler that will respond with "Hello, world!" when requested.

Build the executable that will be distributed with your plugin:

```bash
go build -o plugin.exe plugin.go
```

**Note:** Your executable is platform specific! If you're building the plugin for a server running on a different operating system, you'll need to use a slightly different command. For example, if you're developing the plugin from MacOS and deploying to a Linux server, you'll need to use this command:

```bash
GOOS=linux GOARCH=amd64 go build -o plugin.exe plugin.go
```

Also note that the ".exe" extension is required if you'd like your plugin to run on Windows, but is otherwise optional. Consider referencing [mattermost-plugin-starter-template](https://github.com/mattermost/mattermost-plugin-starter-template) for helpful build scripts.

Now, we'll need to define the required manifest describing your plugin's entry point. Create a file named `plugin.json` with the following contents:

```json
{
    "id": "com.mattermost.server-hello-world",
    "name": "Hello World",
    "server": {
        "executable": "plugin.exe"
    }
}
```

This manifest gives the server the location of your executable within your plugin bundle. Consult the [manifest reference]({{< ref "manifest-reference.md" >}}) for more details, including how to define a cross-platform bundle by defining multiple executables, and how to define a minimum required server version for your plugin.

Note that you may also use `plugin.yaml` to define the manifest.

Bundle the manifest and executable into a tar file:

```bash
tar -czvf plugin.tar.gz plugin.exe plugin.json
```

You should now have a file named `plugin.tar.gz` in your workspace. Congratulations! This is your first server plugin!

## Installing the Plugin

Install the plugin in one of the following ways:

1) Through System Console UI:

    - Log in to Mattermost as a System Admin.
    - Open the System Console at `/admin_console`
    - Navigate to **Plugins (Beta) > Management** and upload the `plugin.tar.gz` you generated above.
    - Click **Enable** under the plugin after it has uploaded.

2) Or, manually:

    - Extract `plugin.tar.gz` to a folder with the same name as the plugin id you specified in ``plugin.json``, in this case `com.mattermost.server-hello-world/`.
    - Add the plugin to the directory set by **PluginSettings > Directory** in your ``config.json`` file. If none is set, defaults to `./plugins` relative to your Mattermost installation directory. The resulting directory structure should look something like:

    ```
    mattermost/
        plugins/
            com.mattermost.server-hello-world/
                plugin.json
                plugin.exe
    ```
    - Restart the Mattermost server.

Once you've installed the plugin in one of the ways above, browse to `https://<your-mattermost-server>/plugins/com.mattermost.server-hello-world`, and you'll be greeted by your plugin.
-->
