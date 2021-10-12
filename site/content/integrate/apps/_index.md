---
title: "Apps (Developers Preview)"
heading: "Mattermost Apps"
description: "Apps are lightweight interactive add-ons to Mattermost."
weight: 20
---

Apps are lightweight, interactive add-ons to Mattermost which can be hosted as HTTP services, or as serverless functions on AWS Lambda, OpenFaaS, Kubernetes, etc. to run without dedicated infrastructure. Apps can:

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

Read the [JavaScript start guide]({{< ref "quick-start-js" >}}) or [Go quick start guide]({{< ref "quick-start-go" >}}) to learn how to write your first app.

## FAQ

### When would you build an app vs a custom slash command vs a webhook vs a plugin?

That depends on your use case, as they each have benefits.

The built-in [incoming webhook]({{< ref "incoming-webhooks" >}}) is great for simple use cases. It requires the incoming payload to contain a valid [Post](https://pkg.go.dev/github.com/nhannv/mattermost-server/model#Post) JSON object - but some external systems don't allow the customization of the fields included in the webhook payload. Compared to built-in webhooks, an App or plugin can be customized to receive an HTTP webhook posting from another system, and can process the incoming data then augment it or make an actionable message in a channel.

A plugin should be used when you need to [directly alter the UI]({{< ref "integrate/plugins/webapp/best-practices" >}}) in Mattermost or you have a feature that requires low latency with the server (such as replacing characters in any message [before it is saved]({{< ref "integrate/plugins/server/reference#Hooks.MessageWillBePosted" >}})). Currently, plugins have several [UX hooks]({{< ref "integrate/plugins/server/reference#Hooks" >}}) that Apps cannot access, however we plan to add/migrate more UX hooks into the Apps Framework over time. Please see the [plugin documentation]({{< ref "integrate/plugins" >}}) for more information.

### What's the difference between the apps framework and the plugin framework?

The App framework provides a few differences from plugins, including:

- Interactive elements are easier to use and develop.
- Compatible with both Mobile and Desktop clients without any extra code.

### What language should I use to write apps?

Any language you want. We currently have an [official driver for Go](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps), and we are planning to release other drivers in the future in conjunction with our community.

### How and where will my app be hosted?

1. **[Mattermost Cloud](https://mattermost.com/mattermost-cloud/)** apps. Cloud
   customers can use apps from Mattermost Marketplace. Marketplace apps are
   deployed as AWS Lambda functions, and their usage is included in the service.
   You can find more information about the Marketplace and how to submit your
   app at [here TBD](https://mattermost.com). Example AWS Lambda apps can be
   found
   [here](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/js/aws_hello)
   (JavaScript) and
   [here](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-serverless)
   (go).
2. **External** (HTTP) apps. Apps can be hosted as publicly (or privately) available HTTP
   services, the choice of hosting provider is yours. A self-managed Mattermost
   customer would be able to install your app from a URL. External apps are not
   currently accepted in the Mattermost Marketplace.
3. **Customer-deployable** apps. An app can be packaged as a bundle, deployable
   by the customer in their own hosting environment. Currently, [AWS
   Lambda](https://aws.amazon.com/lambda/),
   [OpenFaaS](https://www.openfaas.com/), and [Kubeless](https://kubeless.io/)
   are supported, with plans for more serverless platforms, Kubernetes, and
   docker compose. Customer-deployable apps are not yet distributed via the
   Mattermost Marketplace.

### Can I write "internal" organization-specific apps?

Yes. They can be packaged as "customer-deployable" bundles and then deployed on
the supported serverless platforms, or run as HTTP services on the
organization's own hosting infrastructure.
