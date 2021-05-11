---
title: "How Should I Integrate?"
heading: "How to Integrate Mattermost"
description: "Mattermost has various integration points. Learn about the various ways you can integrate Mattermost with other services."
date: 2017-08-20T12:33:36-04:00
weight: 1
---

Very good question! Mattermost has many different integration points and this page will help you pick the right one(s) for the job.

### I just want to post into Mattermost

If you only want to post messages into a Mattermost channel, then all you need is an [incoming webhook](/integrate/incoming-webhooks/).

### I want to know when someone says something

Tracking what gets posted into a channel and receiving real-time events about it can be done using [outgoing webhooks](/integrate/outgoing-webhooks/). You can also respond to messages with outgoing webhooks.

### I want user interaction

If you want your users to be able to trigger actions from within Mattermost, adding your own custom [slash command](/integrate/slash-commands/) will do the trick.

That's not enough? You can include <a target="_blank" href="https://docs.mattermost.com/developer/interactive-messages.html">interactive messages</a> in posts from your slash commands, as well as from incoming and outgoing webhooks.

### I want to build an advanced bot

To build a richer bot integration, you can make full use of the [Mattermost REST API](/integrate/rest-api/). Everything that you see a Mattermost client doing, your integration can do too with this API.

### I want to build an interactive app

That's no problem. Our Apps provide a framework with utilities like a key-value store, bot account creation, OAuth permission scopes, and rich UX entry points.

Apps can be written in any language that supports HTTP, and work on our Mobile and Desktop clients. Apps can be hosted anywhere, on a Digital Ocean droplet, AWS EC2, or a server in your data centre. Take a look at our [introduction](https://developers.mattermost.com/integrate/apps/).

### One of these alone isn't enough

Good news! You can mix and match as many of these integration points you like to suit your needs. The choice is yours.

### I still need more

If these integration points aren't enough for what you had in mind, then take a look at [plugins](/extend/plugins/). They are very powerful and offer the ability to extend Mattermost in ways that integrations can't.
