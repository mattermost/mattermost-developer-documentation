---
title: Plugins (Beta)
heading: "Plugins in Mattermost"
description: "Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the server and web/desktop apps."
date: 2017-07-10T00:00:00-05:00
---

Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the server and web/desktop apps.

Plugins are still in beta and we're looking for your feedback! Share constructive feedback [on our forum post](https://forum.mattermost.org/t/plugin-system-upgrade-in-mattermost-5-2/5498) or join the [Toolkit channel](https://community.mattermost.com/core/channels/developer-toolkit) on our Mattermost community instance.

## Features

### Customize User Interfaces
Write a web app plugin to add to the channel header, sidebars, main menu and more. Register your plugin against a post type to render custom posts or wire up a root component to build an entirely new experience. All this is possible without having to fork the source code and rebase on every Mattermost release.

### Launch Tightly Integrated Services
Launch and manage server plugins as services from your Mattermost server over RPC. Handle events via real-time hooks and invoke Mattermost server methods directly using a dedicated plugin API.

### Extend the Mattermost REST API
Extend the Mattermost REST API with custom endpoints for use by web app plugins or third-party services. Custom endpoints have access to all the features of the standard Mattermost REST API, including personal access tokens and OAuth 2.0.

### Simple Development and Installation
Using the [server](/extend/plugins/server/hello-world/) and [web app](/extend/plugins/webapp/hello-world/) quick start guides, it's simple to set up a plugin development environment. You can also base your implementation off of [mattermost-plugin-starter-template](https://github.com/mattermost/mattermost-plugin-starter-template), complete with build scripts and templates. Once bundled as a gzipped tar file, upload your plugin to a Mattermost server through the [System Console](https://about.mattermost.com/default-plugin-uploads/) or via the [API](https://api.mattermost.com/#tag/plugins).

----
Read the plugins [overview](/extend/plugins/overview/) to learn more.
