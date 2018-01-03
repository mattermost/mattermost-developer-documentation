---
title: Example Plugins
date: 2017-10-26T17:54:54-05:00
subsection: Plugins (Beta)
weight: 40
---

# Example Plugins

## Server "Hello, world!"

To get started extending server-side functionality with plugins, take a look at our [server "Hello, world!" tutorial](../server/hello-world).

## Web App "Hello, world!"

To get started extending browser-side functionality with plugins, take a look at our [web app "Hello, world!" tutorial](../webapp/hello-world).

## JIRA

The [JIRA plugin for Mattermost](https://github.com/mattermost/mattermost-plugin-jira) creates a webhook that your JIRA server can use to post messages to Mattermost when issues are created:

<img src="/img/extend/jira-plugin-screenshot.png" width="667" height="394" />

Topics demonstrated:

* Uses a custom HTTP handler to integrate with external systems.
* Defines a settings schema, allowing system administrators to configure the plugin via system console UI.
* Implements tests using the [plugin/plugintest](https://godoc.org/github.com/mattermost/mattermost-server/plugin/plugintest) package.
* Compiles and publishes releases for multiple platforms using Travis-CI.
