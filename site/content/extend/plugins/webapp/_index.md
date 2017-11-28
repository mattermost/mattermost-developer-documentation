---
title: Web App Plugins
date: 2017-10-26T17:56:25-05:00
subsection: Plugins
weight: 20
---

# Web App Plugins

Web app plugins are capable of overriding and extending React UI components of the Mattermost web and desktop apps.

Looking for a quick start? [Check out our "Hello, world!" guide.](/extend/plugins/webapp/hello-world/)

Want the web app plugin reference? [It can be found here.](/extend/plugins/webapp/reference/)

## Features

#### Override React Components
By providing your own implementations of React components, replace the default Mattermost implementations to fit the needs of your plugin.

For example, if you want to build a custom implemenation of the profile popover (sometimes called profile hovercard) that appears when a user's profile picture is clicked on, simply write your own implementation of the [ProfilePopover](/extend/plugins/webapp/reference/#profilepopover) component and include it in your plugin.

#### Pluggable Extension Points
In addition to overriding existing Mattermost UI components, there also certain extension points that allow you to add new components that don't exist normally in Mattermost.

For example, the [ChannelHeaderButton](/extend/plugins/webapp/reference/#channelheaderbutton) will add a new component (presumbably a button, but could be anything) in the top-right of the standard channel header.

#### Custom Post Type Components
Web app plugins also have the ability to render different post components based on that post's type.

For example, by building a [PostTypePlugin](/extend/plugins/webapp/reference/#posttypeplugin) you can create a post type `custom_poll` and any time the web app sees that post type, it will replace the regular rendering of the post component with your own custom implementation.

Use this in conjunction with setting the post type in webhooks, slash commands, through the REST API or with a server plugin and you can have powerful control to deeply integrate or extend Mattermost posts to fit your needs.

## How It Works

When a plugin is uploaded to a Mattermost server and activated, the server checks to see if there is a webapp portion included as part of the plugin by looking at the [plugin's manigest](/extend/plugins/manifest-reference/). If one is found, the server will copy the bundled JavaScript included with the plugin into the static directory for serving. A WebSocket event is then fired off to the connected clients to let them know a new plugin has been activated.

On web app launch, a request will be made to the server to get a list of plugins that contain web app components. The web app will then proceed to download and execute the JavaScript bundles for each plugin. A similar process happens if an already launched web app, receives a WebSocket event for a newly activated plugin.

Once downloaded and executed, each plugin should have registered itself on the window. The web app will then use this to initialize the plugins by passing in some arguments, such as a function for registering components. The plugins will then each register the components they want to override, causing actions, containing component implementations, to be dispatched to the web app's plugin reducer.

To use these components, the web app makes use of a component called `Pluggable`. Any time the `Pluggable` component wraps a Mattermost React component, that component becomes overridable. On render, the `Pluggable` component checks if the plugin reducer has a custom implementation of the component it wraps. If so, it will render the custom component. If not, it will continue with business as usual and render the default Mattermost implementation.

`Pluggable` is also used to add new extension points, by not wrapping any components and providing a prop called `pluggableName`. For example, this is how the [Root](/extend/plugins/webapp/reference/#root) component extension point is created.

Custom post types work similarly, but are registered slightly differently, use a separate reducer and have a bit more of a custom implementation.
