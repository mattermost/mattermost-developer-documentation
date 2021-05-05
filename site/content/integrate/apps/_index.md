---
title: "Apps (Developers Preview)"
heading: "Introduction"
description: "Apps are lightweight interactive add-ons to Mattermost."
weight: 90
---

Apps are lightweight, interactive add-ons to Mattermost which can use any HTTP-compatible hosting mechanism to run without dedicated infrastructure. Apps can:

- Display interactive, dynamic modal forms and message actions.
- Be written in any language.
- Attach themselves to locations in the Mattermost user interface (e.g. channel bar buttons, post menu, channel menu, commands), and can add their custom slash commands with full autocomplete.
- Receive webhooks from Mattermost, and third-parties, and use the Mattermost REST APIs to post messages, etc.
- Work on both Mobile and Desktop clients so developers can focus on the functionality of their apps.
- Be deployed using our serverless hosting infrastructure keeping data secure and supporting scalability by being stateless.
- Include dynamic fields, code as an on-demand function, and interactive modals.

When you develop using the Apps Framework, your apps can:

- Create slash commands

![image](app-slash-command.png)

- Post messages to channels

![image](app-bot.png)

- Add buttons to channel headers and post menus

![image](app-channel-header.png)

![image](app-action.png)

Apps are available as a Developers Preview and we're looking for your feedback! Share constructive feedback in the [Mattermost Apps channel](https://community.mattermost.com/core/channels/mattermost-apps) on our Mattermost community instance.

* Apps will soon be available for self-managed deployments as well as customers' own AWS environments.

Read the [JavaScript start guide]({{< ref "quick-start-js" >}}) or [Go quick start guide]({{< ref "quick-start-go" >}}) to learn how to write your first app.

## FAQ

### When would you build an app vs a custom slash command vs a webhook vs a plugin?

That depends on your use case, as they each have benefits.

The built-in [incoming webhook]({{< ref "incoming-webhooks" >}}) is great for simple use cases. It requires the incoming payload to contain a valid [Post](https://pkg.go.dev/github.com/nhannv/mattermost-server/model#Post) JSON object - but some external systems don't allow the customization of the fields included in the webhook payload. Compared to built-in webhooks, an App or plugin can be customized to receive an HTTP webhook posting from another system, and can process the incoming data then augment it or make an actionable message in a channel.

A plugin should be used when you need to [directly alter the UI]({{< ref "extend/plugins/webapp/best-practices" >}}) in Mattermost or you have a feature that requires low latency with the server (such as replacing characters in any message [before it is saved]({{< ref "extend/plugins/server/reference#Hooks.MessageWillBePosted" >}})). Currently, plugins have several [UX hooks]({{< ref "extend/plugins/server/reference#Hooks" >}}) that Apps cannot access, however we plan to add/migrate more UX hooks into the Apps Framework over time. Please see the [plugin documentation]({{< ref "extend/plugins" >}}) for more information.

### What's the difference between the apps framework and the plugin framework?

The App framework provides a few differences from plugins, including:

- Interactive elements are easier to use and develop.
- Compatible with both Mobile and Desktop clients without any extra code.

### What language should I use to write apps?

Any language you want. We currently have an [official driver for Go](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps), and we are planning to release other drivers in the future in conjunction with our community.
