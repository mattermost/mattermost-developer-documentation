---
title: Best practices
heading: "Best practices for Plugins on Mattermost"
description: "Read about some of the best practices for working with plugins in Mattermost."
weight: 0
aliases:
  - /extend/plugins/server/best-practices/
  - /integrate/plugins/server/best-practices/
---

## How should plugins serve publicly available static files?

Add all static files under a file directory named `public` within the plugin directory, and include the files in the plugin bundle using the Makefile.

## How do plugins make sure http requests are authentic?

Plugins can implement the [`ServeHTTP`]({{< ref "/integrate/reference/server/server-reference#Hooks.ServeHTTP" >}}) to listen to http requests. This can be used to receive post action requests when [Interactive Messages Buttons and Menus](https://docs.mattermost.com/developer/interactive-messages.html) are triggered by users.

When plugins act as an HTTP server, they serve requests from Mattermost clients (which are authenticated in a Mattermost sense), but may also serve HTTP requests from external services like webhooks. These requests from external services might use the Authorization header to authorize themselves against the plugin.

Since these requests are just HTTP requests, anyone can send them to the plugin. Hence the plugin must make sure the requests are authentic. The Mattermost Server sets the HTTP header `Mattermost-User-Id` when the request is made by an authenticated client. The plugin checks whether this header is set, and rejects all other requests.

From Mattermost v9.4, external systems can use this header to authenticate, but not in the context of a Mattermost user's token. HTTP requests to server-side plugins can use an Authorization header in the request for the plugin to use, as long as the token provided in the header is not a user token issued by the Mattermost server. This is useful for connecting external systems that require authentication through an Authorization header with their own token.
