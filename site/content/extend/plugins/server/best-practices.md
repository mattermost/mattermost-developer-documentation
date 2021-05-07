---
title: Best Practices
heading: "Best Practices for Plugins on Mattermost"
description: "Read about some of the best practices for working with plugins in Mattermost."
weight: 0
---

## How should plugins serve publicly available static files?

Add all static files under a file directory named `public` within the plugin directory, and include the files in the plugin bundle using the Makefile.

## How can plugins make sure http requests are authentic?

Plugins can implement the [`ServeHTTP`](https://developers.mattermost.com/extend/plugins/server/reference/#Hooks.ServeHTTP) to listen to http requests. This can e.g. be used to receive post action requests when [Interactive Messages Buttons and Menus](https://docs.mattermost.com/developer/interactive-messages.html) are triggered by users. Since these requests are just http requests, anyone can send them to the plugin. Hence the plugin must make sure the requests are authentic. The Mattermost Server sets the http header `Mattermost-User-Id` if and only if the request is made by an authenticated client. The plugin therefore has to only check if this header is set and reject all other requests.
