---
title: High Availabilty
date: 2018-07-10T00:00:00-05:00
subsection: Plugins (Beta)
weight: 60
---

# High Availability

Mattermost servers have the ability to run in High Availability (HA) mode, meaning a cluster of Mattermost app servers running together as a single Mattermost deployment. This document covers best practices for writing plugins so that they work in HA and how to deploy plugins to HA setups.

## Writing Plugins

It is imporant that all plugins consider HA environments when being built.

Plugins are started as subprocesses of the main Mattermost process on each app server. This means a Mattermost deployment that has three app servers will have three separate copies of the same plugin running. Each running copy of the plugin will be isolated from one another on different servers. Therefore, to run properly in HA the plugin's server-side code must be stateless.

To be stateless, the plugin's server-side must not retain any data in memory that might be used by the plugin in the future. Any data that needs to be retained should be stored in a place that all running copies of the plugin have access to. For example, the [key-value store](/extend/plugins/server/reference/#API.KVSet) the plugin API provides.

To better explain the problem with having a plugin store data in-memory, consider this case:

Let's say we have two Mattermost app servers running together in HA and an installed plugin with a feature that alerts a user any time a trigger word is posted in a channel.

1. The user uses the web app side of the plugin to set the word `hello` as the trigger word
2. An HTTP request is made to the server-side of the plugin to set `hello`
3. The plugin process running on app server 1 handles the request and stores `hello` in a variable

In this scenario, the trigger word is now only set for the plugin process running on app server 1. The plugin process running on app server 2 is unaware that the trigger word is `hello`. This means when someone posts a message containing `hello` and the request is load balanced to app server 2, the plugin is not going to alert our user when it should. 

The proper way to deal with this case would be for the plugin to store the trigger word in a glboal store, such as the KV store. Then any time a user posts the plugin can pull the trigger word from the store and properly alert the user, regardless of which app server handles the request.

## Deploying

Plugins must be deployed to HA enviroments by uploading and extracting plugin bundles into the directory configured by [PluginSettings.Directory](https://docs.mattermost.com/administration/config-settings.html#directory) of `config.json`, on each app server in the cluster. You cannot upload plugins using the System Console UI when running in HA.

Once deployed, the plugins directory should look something like this:

```sh
 plugins
 ├── com.mattermost.demo-plugin
 │   ├── plugin.json
 │   ├── server
 │   │   ├── plugin-darwin-amd64
 │   │   ├── plugin-linux-amd64
 │   │   └── plugin-windows-amd64.exe
 │   └── webapp
 │       └── main.js
 ├── jira
 │   ├── plugin.exe
 │   └── plugin.yaml
 ├── zoom
 │   ├── plugin.json
 │   ├── server
 │   │   └── plugin.exe
 │   └── webapp
 │       └── zoom_bundle.js
```

It is recommended that you automate plugin deployment as part of your Mattermost deployment jobs.

To enable a plugin once deployed, you can use the System Console UI under `Plugins -> Management`.