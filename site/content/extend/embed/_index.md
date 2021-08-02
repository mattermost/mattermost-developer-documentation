---
title: "Embed"
heading: "Embedding Plugins with Mattermost"
description: "With Mattermost’s rich RESTful web service API and OAuth 2.0 support, you can build your own clients to embed Mattermost within any application."
date: 2017-05-10T00:00:00-05:00
---

With Mattermost's rich RESTful web service API and OAuth 2.0 support it's possible to build your own clients to embed Mattermost within any application of your choice.

Questions about embedding Mattermost? Ask in the [Toolkit channel](https://community.mattermost.com/core/channels/developer-toolkit) on our Mattermost community instance.

## Embedding Methods

### Browser Extensions and Add-Ons

Many modern browsers have support for extensions or add-ons that would allow you to build and embed a Mattermost client on web pages of your choice. Chrome has [extensions](https://developer.chrome.com/extensions), Firefox has [add-ons](https://addons.mozilla.org/en-US/developers/), and IE/Edge have [extensions](https://docs.microsoft.com/en-us/microsoft-edge/extensions).

We have an open-source [demo Chrome extension](https://github.com/mattermost/mattermost-chrome-extension) that demonstrates how to get an access token for a user. You can use this demo extension as a starting point for building your embedded Mattermost client.

### JavaScript Widget

If you have access to modify the pages of the application you would like to embed Mattermost into, it is possible to create a JavaScript widget that can be included on those pages.

Getting a user's access token could be done using the OAuth 2.0 implicit grant flow, similar to browser extensions. There are many JavaScript libraries that make using OAuth 2.0 simple, for example [client-oauth2](https://www.npmjs.com/package/client-oauth2).
