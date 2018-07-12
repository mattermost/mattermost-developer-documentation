---
title: Plugins
date: 2018-07-10T00:00:00-05:00
section: extend
---

# Plugins

Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the server and web/desktop apps.

We're looking for your feedback! Join the [Developer Toolkit channel](https://pre-release.mattermost.com/core/channels/developer-toolkit) on our Mattermost community instance.

## Features

### Customize User Interfaces
Write a web app plugin to add to the channel header, sidebars, main menu and more. Register your plugin against a post type to render custom posts. Or wire up a root component to build an entirely new experience. All this is possible without having to fork the source code and rebase on every Mattermost release.

### Launch Tightly Integrated Services
Launch and manage server plugins as services from your Mattermost server over RPC. Handle events via real-time hooks and invoke Mattermost server methods directly using a dedicated plugin API.

### Extend the Mattermost REST API
Extend the Mattermost REST API with custom endpoints for use by web app plugins or third-party services. Custom endpoints have access to all the features of the standard Mattermost REST API, including personal access tokens and OAuth 2.0.

### Simple Development and Installation
Using the [server](/extend/plugins/server/hello-world) and [web app](/extend/plugins/webapp/hello-world) quick start guides, it's simple to set up a plugin development environment. Or base your implementation off of [mattermost-plugin-sample](https://github.com/mattermost/mattermost-plugin-sample), complete with best practices and build scripts. Once bundled as a gzipped tar file, upload your plugin to a Mattermost server through the [System Console](https://about.mattermost.com/default-plugin-uploads) or via the [API](https://api.mattermost.com/#tag/plugins).

----
Read more about [server](/extend/plugins/server/) and [web app](/extend/plugins/webapp/) plugins.
