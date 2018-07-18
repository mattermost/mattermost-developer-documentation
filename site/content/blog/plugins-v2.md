---
title: "Plugin System Overhaul"
date: 2018-07-18T15:35:09-04:00
---
Mattermost 5.2 will include major overhauls to the plugin system. Over the last six months of plugins being in beta we've received a lot of great feedback from the community and customers building Mattermost plugins, as well as from our core team building plugins. We've taken this experience and feedback and used it to overhaul our plugin system. This brings us a step closer to moving plugins out of beta and into a full stable release.

#### Switching to HashiCorp's go-plugin
The biggest change to the plugin system is that the server-side is now built on top of HashiCorp's production-proven [go-plugin](https://github.com/hashicorp/go-plugin). We made this decision as the system we built ourselves was very similar to go-plugin and with go-plugin we get the insurance of stability from a system that has been used in production for years. We also get slew of features that will make Mattermost plugins even better over time.

#### Server-side Plugins in Any Language
One the of features we get from switching to HashiCorp's go-plugin is support for [gRPC](https://grpc.io/), meaning that the server-side of plugins can be written in any language with gRPC support. Most popular languages support gRPC and with a bit of boilerplate you can start writing the server-side of plugins in languages other than Go.

#### Server-side Hooks
Server-side plugin hooks have had a [Context](https://godoc.org/github.com/mattermost/mattermost-server/plugin#Context) added to them as the first parameter. Right now the `Context` is blank but in the future we will be adding useful context-specific information, such as request IDs and other tracing/logging information.

We've also added many more hooks, such as allowing plugins to intercept/reject post creation and triggering events when a user joins or leaves channels/teams. For all available hooks see the [godoc](https://godoc.org/github.com/mattermost/mattermost-server/plugin#Hooks).

#### Extensibility Over Replacement
One of the big features of the initial implementation of the client-side plugin system was to allow overriding or replacing existing Mattermost UI components with custom ones. This worked well when the paradigm was one large plugin was installed at a time, but quickly fell down when multiple plugins wanted to override the same component. To address this the new plugin system for the web and desktop apps is focused on providing extensibility over replacement.

What this means is that the focus is less on overriding Mattermost UI components and more on allowing one or more plugins to extend these components by custom components into certain pluggable locations. This makes it feasible for many plugins to be installed and work together, instead of fighting over which plugin gets to override a single component.

#### More New Features
In addition to the larger changes above, the new plugin system in Mattermost 5.2 will also have some other cool new features:

* Enhanced plugin logging - log like you normally would to stdout or stderr, or use the new logging API, either way it will get captured in the Mattermost server logs
* Custom WebSocket events - publish your own WebSocket events from the server-side of your plugin and add function handlers for those events on your client-side
* Expanded APIs - new APIs give more power and options both server-side and client-side
* CLI management - fully manage plugins from the Mattermost command-line interface

#### Breaking Changes
All these great changes will require changes to any plugins built for pre-5.2 Mattermost. See our [migration guide]() for steps on how to update your plugins.

#### Thanks
Huge shout out to our community for all the feedback and help with plugins. Especially to [santos22](https://github.com/santos22) for adding CLI commands and [dschalla](https://github.com/dschalla) for adding server-side hooks and APIs.

---

For the full documentation on plugins, see [developers.mattermost.com/extend/plugins](https://developers.mattermost.com/extend/plugins/).