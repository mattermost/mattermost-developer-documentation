---
title: Web App Plugins
date: 2017-10-26T17:56:25-05:00
subsection: Plugins
weight: 20
---

# Web App Plugins

Web app plugins are capable of overriding and extending React UI components of the Mattermost web and desktop apps.

Looking for a quick start? [See our "Hello, world!" tutorial](/extend/plugins/webapp/hello-world/).

Want the web app plugin reference doc? [Find it here](/extend/plugins/webapp/reference/).

## Features

#### Override React Components

Use your own implementations of web app React components to replace the default Mattermost implementations.

For example, if you want to build a custom implementation of the profile popover (sometimes called the profile hovercard) that appears when a user's profile picture is clicked on, simply write your own implementation of the [ProfilePopover](/extend/plugins/webapp/reference/#profilepopover) component and include it in your plugin.

For an example, see the [hovercardexample plugin](https://github.com/jwilander/hovercardexample).

#### Pluggable Extension Points

In addition to overriding existing Mattermost React components, you can add new components that don't already exist in Mattermost through extension points.

For example, the [ChannelHeaderButton](/extend/plugins/webapp/reference/#channelheaderbutton) extension point adds a new component in the top-right of the standard channel header, such as a button.

#### Custom Post Type Components

Web app plugins can also render different post components based on the post's type.

For example, you can create a post type `custom_poll` by building a [PostTypePlugin](/extend/plugins/webapp/reference/#posttypeplugin). Then, any time the web app sees that post type, it replaces the regular rendering of the post component with your own custom implementation.

Use this in conjunction with setting the post type in webhooks or slash commands, through the REST API or with a server plugin, and you can deeply integrate or extend Mattermost posts to fit your needs.

## How It Works

When a plugin is uploaded to a Mattermost server and activated, the server checks to see if there is a webapp portion included as part of the plugin by looking at the [plugin's manifest](/extend/plugins/manifest-reference/). If one is found, the server copies the bundled JavaScript included with the plugin into the static directory for serving. A WebSocket event is then fired off to the connected clients to let them know a new plugin has been activated.

On web app launch, a request is made to the server to get a list of plugins that contain web app components. The web app then proceeds to download and execute the JavaScript bundles for each plugin. A similar process happens if an already launched web app receives a WebSocket event for a newly activated plugin.

Once downloaded and executed, each plugin should have registered itself on the window. The web app then uses this to initialize the plugins by passing arguments, such as a function for registering components. Each plugin then registers the components they want to override, causing actions containing component implementations to be dispatched to the web app's plugin reducer.

To use these components, the web app makes use of a component called `Pluggable`. Any time `Pluggable` wraps a Mattermost React component, it becomes overridable. On render, `Pluggable` checks if the plugin reducer has a custom implementation of the component it wraps - if so, it renders the custom component. Otherwise it renders the default Mattermost implementation.

`Pluggable` is also used to add new extension points, by not wrapping any components and providing a prop called `pluggableName`. For an example, see how the [Root](/extend/plugins/webapp/reference/#root) component extension point is created.

Custom post types work similarly, but are registered slightly differently, use a separate reducer and have more of a custom implementation.
