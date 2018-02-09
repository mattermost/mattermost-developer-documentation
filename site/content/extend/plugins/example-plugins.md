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

<img src="/img/extend/jira-plugin-screenshot.png" width="445" height="263" />

Topics demonstrated:

* Uses a custom HTTP handler to integrate with external systems.
* Defines a settings schema, allowing system administrators to configure the plugin via system console UI.
* Implements tests using the [plugin/plugintest](https://godoc.org/github.com/mattermost/mattermost-server/plugin/plugintest) package.
* Compiles and publishes releases for multiple platforms using Travis-CI.

## Memes

The [Memes plugin for Mattermost](https://github.com/mattermost/mattermost-plugin-memes) creates a slash command that can be used to create dank memes:

<img src="/img/extend/memes-plugin-screenshot.png" width="445" height="325" />

Topics demonstrated:

* Registers a custom slash command.
* Uses a custom HTTP handler to generate and serve content.
* Compiles and publishes releases for multiple platforms using Travis-CI.

## Zoom

The [Zoom plugin for Mattermost](https://github.com/mattermost/mattermost-plugin-zoom) adds UI elements that allow users to easily create and join Zoom meetings:

<img src="/img/extend/zoom-plugin-screenshot.png" width="445" height="295" />

Topics demonstrated:

* Uses a custom HTTP handler to integrate with external systems.
* Defines a settings schema, allowing system administrators to configure the plugin via system console UI.
* Implements tests using the [plugin/plugintest](https://godoc.org/github.com/mattermost/mattermost-server/plugin/plugintest) package.
* Creates rich posts using custom post types.
* Extends existing webapp components to extend the UI.
