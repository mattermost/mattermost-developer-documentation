---
title: "Apps (Developers Preview)"
heading: "Introduction"
description: "Apps are lightweight interactive add-ons to Mattermost."
section: "integrate"
weight: 90
---

Apps are lightweight, interactive add-ons to Mattermost which can use any HTTP-compatible hosting mechanism to run without dedicated infrastructure. Apps can:

- Display interactive, dynamic Modal forms and Message Actions.
- Be written in any language.
- Attach themselves to locations in the Mattermost user interface (e.g. channel bar buttons, post menu, channel menu, commands), and can add their custom `/` commands with full Autocomplete.
- Receive webhooks from Mattermost, and third-parties, and use the Mattermost REST APIs to post messages, etc.
- Work on both Mobile and Desktop apps so developers can focus on the functionality of their apps.
- Be deployed using our Mattermost serverless hosting infrastructure keeping data secure and supporting scalability.

When you develop using the Apps Framework, your apps can:

- Create slash commands
- Post messages to channels
- Add buttons to channel headers, menus
- Interactive modals
- Dynamic fields
- Code as an on-demand function

Apps are available as a Developers Preview and we're looking for your feedback! Share constructive feedback in the [Mattermost Apps channel](https://community.mattermost.com/core/channels/mattermost-apps) on our Mattermost community instance.

* Apps will soon be available for self-managed deployments as well as customers' own AWS environments.

Read the [quick start guide]({{< ref  "quick-start-go" >}}) to learn how to write your first app.


## FAQ

### What language should I use to write apps?

Any language you want. However, the only language with an official driver right now is Go.
