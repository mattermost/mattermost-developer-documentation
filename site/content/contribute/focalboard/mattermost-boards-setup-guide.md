---
title: "Mattermost Boards Plugin Guide"
heading: "Mattermost Boards Plugin Guide"
description: "Learn how to build the Mattermost Boards plugin."
date: 2022-03-24T00:40:23-07:00
weight: 2
---

**[Mattermost Boards](https://mattermost.com/boards/)** is the Mattermost plugin version of Focalboard that combines project management tools with messaging and collaboration for teams of all sizes. It is installed and enabled by default in Mattermost v6.0 and later. For working with Focalboard as a standalone application, please refer to the [Personal Server Setup Guide](../personal-server-setup-guide/).

## Building the plugin

Fork the [Focalboard repository](https://github.com/mattermost/focalboard) and clone it locally.

To install the dependencies:
```
cd mattermost-plugin/webapp
npm install --no-optional
cd ../..
make prebuild
```

To build the plugin:
```
make webapp
cd mattermost-plugin
make dist
```

Refer to the [dev-release.yml](https://github.com/mattermost/focalboard/blob/main/.github/workflows/dev-release.yml#L168) workflow for the up-to-date commands that are run as part of CI.

## Uploading and installing the plugin

1. Enable [custom plugins](https://developers.mattermost.com/integrate/admin-guide/admin-plugins-beta/#custom-plugins) by setting `PluginSettings.EnableUploads` to `true` and set `FileSettings.MaxFileSize` to a number larger than the size of the packed`.tar.gz` plugin file in bytes (e.g., `524288000`) in the Mattermost `config.json` file.
2. Navigate to **System Console > Plugins > Management** and upload the packed `.tar.gz` file from your `mattermost-plugin/dist` directory.
3. Enable the plugin.

## Deploying the plugin to a local Mattermost server

Instead of following the steps above, you can also set up a `mattermost-server` in local mode and automatically deploy `mattermost-plugin` via `make deploy`.

* Follow the steps in the [`mattermost-webapp` developer setup guide](https://developers.mattermost.com/contribute/webapp/developer-setup/) and then:
  * Open a new terminal window. In this terminal window, add an environmental variable to your bash via `MM_SERVICESETTINGS_SITEURL='http://localhost:8065'` ([docs](https://developers.mattermost.com/blog/subpath/#using-subpaths-in-development))
  * Build the web app via `make build`
* Follow the steps in the [`mattermost-server` developer setup guide](https://developers.mattermost.com/contribute/server/developer-setup/) and then:
  * Make sure Docker is running.
  * Run `make config-reset` to generate the `config/config.json` file:
    * Edit `config/config.json`:
      * Set `ServiceSettings > SiteURL` to `http://localhost:8065` ([docs](https://docs.mattermost.com/configure/configuration-settings.html#site-url))
      * Set `ServiceSettings > EnableLocalMode` to `true` ([docs](https://docs.mattermost.com/configure/configuration-settings.html#enable-local-mode))
      * Set `PluginSettings > EnableUploads` to `true` ([docs](https://developers.mattermost.com/integrate/admin-guide/admin-plugins-beta/#custom-plugins))
  * In this terminal window, add an environmental variable to your bash via `MM_SERVICESETTINGS_SITEURL='http://localhost:8065'` ([docs](https://developers.mattermost.com/blog/subpath/#using-subpaths-in-development))
  * Build and run the server via `make run-server`
* Follow the [steps above](#building-the-plugin) to install the dependencies.
* Run `make deploy` in the `mattermost-plugin` folder to automatically deploy your plugin to your local Mattermost server.
