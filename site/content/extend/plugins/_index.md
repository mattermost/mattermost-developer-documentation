---
title: Plugins
date: 2017-10-26T17:56:19-05:00
section: extend
---

# Plugins (Beta)

Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the server and web/desktop apps.

Plugins are still in early beta and we're looking for your feedback! Share constructive feedback [on our forum post](https://forum.mattermost.org/t/mattermost-plugins-in-beta/4123) or join the [Developer Toolkit channel](https://pre-release.mattermost.com/core/channels/developer-toolkit) on our Mattermost instance.

## Features

### Customize User Interfaces
Using web app plugins, easily override a set of Mattermost React components, inject your own custom components and render custom post components by post type. Powerful UI customization without having to fork the web app source and rebase on every Mattermost release.

### Launch Tightly Integrated Services
Launch and manage server plugins as services from your Mattermost server with access to hooks and a RPC API. Listen for and intercept events in real-time on the Mattermost server with hooks and performantly interact with the server through the API.

### Extend the Mattermost REST API
Extend the Mattermost REST API with custom endpoints for use by the web app plugins or by third-party services. Custom endpoints have access to all the features of the standard Mattermost REST API, including personal access tokens and OAuth 2.0.

### Simple Development and Installation
Using the [mdk tool](https://www.npmjs.com/package/mdk), and both our [server]({{<extendurl>}}/plugins/server/hello-world) and [web app]({{<extendurl>}}/plugins/webapp/hello-world) quick start guides, it's simple to set up a plugin development environment. Once built, simply tar and gzip your plugin and upload it to a Mattermost server through the System Console.

----
Read more about [web app]({{<extendurl>}}/plugins/webapp/) and [server]({{<extendurl>}}/plugins/server/) plugins.
