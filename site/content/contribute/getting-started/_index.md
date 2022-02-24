---
title: "Contribute Code"
heading: "Contribute Code to Mattermost"
description: "Learn how to contribute code to the core Mattermost repositories."
date: "2018-05-19T12:01:23-04:00"
aliases: 
    - /contribute/
weight: 1
---

This site is for developers who want to contribute code to the core Mattermost project. If you’re looking for other ways to contribute, [head over to our website](https://mattermost.com/contribute/). Before getting started, it’s a good idea to review our guide on [integrating and extending Mattermost]({{< ref "/integrate/getting-started" >}}) because you might be able to build the improvements you want without needing to contribute them upstream.


## Technical Overview

The Mattermost core repositories include:
* [Server]({{< ref "/contribute/server" >}}) - Highly-scalable Mattermost installation written in Go
* [Web App]({{< ref "/contribute/webapp" >}}) - JavaScript client app built on React and Redux
* [Mobile Apps]({{< ref "/contribute/mobile" >}}) - JavaScript client apps for Android and iOS built on React Native
* [Desktop App]({{< ref "/contribute/desktop" >}}) - An Electron wrapper around the web app project that runs on Windows, Linux, and macOS
* [Core Plugins]({{< ref "/contribute/plugins" >}}) - A core set of officially-maintained plugins that provide a variety of improvements to Mattermost.

Improvements to Mattermost may require you to contribute to multiple projects; if you’re unsure where to start, the server repository is generally the best way to get introduced to the codebase.


## How to Contribute Code

If you’re looking for an existing issue to help with, check out the [help wanted tickets on GitHub](https://mattermost.com/pl/help-wanted). If you see any that you’re interested in working on, comment on it to let everyone know you’re working on it. If there’s no ticket for what you want to contribute, see our guide on [contributing without a ticket.]({{< ref "contributions-without-ticket.md" >}})

Once you’ve created some code that you want to contribute, follow our [pull request checklist]({{< ref "contribution-checklist.md" >}}) to submit your contribution for [review]({{< ref "code-review.md" >}}), and one of our [core committers](https://handbook.mattermost.com/contributors/contributors/core-committers) will reach out with any feedback, questions, or requests they have.


## How to Get Help With Your Contribution

Our contributor community is segmented into [guilds]({{< ref "guilds.md" >}}) that focus on specific components within the Mattermost ecosystem. Each guild has a leader and a channel on our [community chat server](https://docs.mattermost.com/guides/community-chat.html) where you can ask questions about your contribution.
