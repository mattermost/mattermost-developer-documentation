---
title: Overview
heading: "An Overview of Mattermost Plugins"
description: "Plugins are defined by a manifest file and contain at least a server or web app component, or both. Learn more in our overview of plugins."
date: 2018-07-10T00:00:00-05:00
weight: 1
---

Plugins are defined by a manifest file and contain at least a server or web app component, or both.

The [Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template) is a starting point and illustrates the different components of a Mattermost plugin.

A more detailed example is the [Demo Plugin](https://github.com/mattermost/mattermost-plugin-demo), which showcases many of the features of plugins.

### Manifest
The plugin manifest provides required metadata about the plugin, such as name and ID. It is defined in JSON or YAML. This is `plugin.json` in both the [sample](https://github.com/mattermost/mattermost-plugin-starter-template/blob/master/plugin.json) and [demo](https://github.com/mattermost/mattermost-plugin-demo/blob/master/plugin.json) plugins.

See the [manifest reference](/extend/plugins/manifest-reference/) for more information.

### Server
The server component of a plugin is written in Go and runs as a subprocess of the Mattermost server process. The Go code extends the [MattermostPlugin](https://godoc.org/github.com/mattermost/mattermost-server/v5/plugin#MattermostPlugin) struct that contains an [API](/extend/plugins/server/reference/#API) and allows for the implementation of [Hook](/extend/plugins/server/reference/#Hooks) methods that enable the plugin to interact with the Mattermost server.

The sample plugin implements this simply in [plugin.go](https://github.com/mattermost/mattermost-plugin-starter-template/blob/master/server/plugin.go) and the demo plugin splits the API and hook usage throughout [multiple files](https://github.com/mattermost/mattermost-plugin-demo/tree/master/server).

Read more about the server-side of plugins [here](/extend/plugins/server/).

### Web/Desktop App
The web app component of a plugin is written in JavaScript with [React](https://reactjs.org) and [Redux](https://redux.js.org/). The plugin's bundled JavaScript is included on the page and runs alongside the web app code as a [PluginClass](/extend/plugins/webapp/reference/#pluginclass) that has initialize and deinitialize methods available for implementation. The initialize function is passed through the [registry](/extend/plugins/webapp/reference/#registry) which allows the plugin to register React components, actions and hooks to modify and interact with the Mattermost web app.

The sample plugin has a [shell of an implemented PluginClass](https://github.com/mattermost/mattermost-plugin-starter-template/blob/master/webapp/src/index.js), while the demo plugin [contains a more complete example](https://github.com/mattermost/mattermost-plugin-demo/blob/master/webapp/src/plugin.jsx).

The desktop app is a shim of the web app, meaning any plugin that works in the web app will also work in the desktop app.

Read more about the web app component of plugins [here](/extend/plugins/webapp/).

### Mobile App
Currently there is no mobile app component of plugins but it is planned for the near term.


----

If you'd like to better understand how plugins work, [see the contributor documentation on plugins](/contribute/server/plugins/).
