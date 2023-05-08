---
title: "Apps"
heading: "Mattermost Apps"
description: "Apps are lightweight interactive add-ons to Mattermost."
weight: 30
subsection: apps
cascade:
  - subsection: apps
---

Apps are lightweight, interactive add-ons to Mattermost. They are hosted as their own service, as opposed to plugins which run directly alongside the server process.

Apps can:

- Display interactive, dynamic modal forms and message actions.
- Be written in any language.
- Attach themselves to locations in the Mattermost user interface (e.g. channel bar buttons, post menu, channel menu, commands), and add their custom slash commands with full autocomplete.
- Receive webhooks from Mattermost, and third-parties, and use the Mattermost REST APIs to post messages, etc.
- Work on both Mobile and Desktop clients. This way, developers can focus on the features of their Apps without writing code for each specific platform.
- Include dynamic fields, code as an on-demand function, and interactive modals.

When you develop using the Apps framework, your Apps can:

- Create slash commands

  ![image](app-slash-command-zoomed-in.png)

- Post messages to channels (and anything else possible with {{<newtabref title="Mattermost's API" href="https://api.mattermost.com/">}})

  ![image](app-bot.png)

- Add buttons to channel headers and post menus

  ![image](app-channel-header-zoomed-in.png)

  ![image](app-action-zoomed-in.png)

Apps are now generally available and we always appreciate your feedback! Share constructive feedback in the {{< newtabref href="https://community.mattermost.com/core/channels/mattermost-apps" title="Mattermost Apps channel" >}} on our Mattermost community instance.

We have quick start guides for [TypeScript]({{< ref "quickstart/quick-start-ts" >}}), [Go]({{< ref "quickstart/quick-start-go" >}}), and [Python]({{< ref "quickstart/quick-start-python" >}}) to learn how to write your first App.

## FAQ

### What version of Mattermost is needed?
    
For v1.0 of the apps framework, the minimum Mattermost Server version is v6.6.
For v1.2.0 of the apps framework, Mattermost Server v7.2 or later is needed.
For v1.2.1 of the apps framework, Mattermost Server v7.7.0 or later is needed.
    
### When would you build an App vs. a custom slash command vs. a webhook vs. a plugin?

That depends on your use case, as they each have benefits.

Each type of existing integration is sort of a la carte, whereas the App framework is an all-in-one package that supports its own version of some of those out of the box. Meaning when you install an App, you don't need to go create a separate bot account, OAuth app, webhooks etc. Some pieces are reused, such as the bot account mechanism, but some pieces were remade and are not reused, such as webhooks.

In the case of webhooks, the existing mechanism is only able to create posts, and only accepts an [incoming webhook]({{< ref "/integrate/webhooks/incoming" >}}) payload. It does not support other logic for handling arbitrary data structures from external systems.

A plugin should be used when you need to [directly alter the UI]({{< ref "integrate/plugins/components/webapp/best-practices" >}}) in Mattermost or you have a feature that requires low latency with the server (such as replacing characters in any message [before it is saved]({{< ref "integrate/plugins/components/server/reference#Hooks.MessageWillBePosted" >}})).

{{<note "Note:">}}
Plugins have several [UX hooks]({{< ref "integrate/plugins/components/server/reference#Hooks" >}}) that Apps cannot access. Please see the [plugin documentation]({{< ref "integrate/plugins" >}}) for more information.
{{</note>}}

### What's the difference between the Apps framework and the plugin framework?

The Apps framework provides a few differences from plugins, including:

-   Interactive elements are easier to use and develop.
-   Compatible with both Mobile and Desktop clients without any extra code.

### What language should I use to write Apps?

Any language you want. We currently have an {{<newtabref title="official driver for Go" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps">}}.

### How and where will my App be hosted?

1. **{{< newtabref href="https://mattermost.com/mattermost-cloud/" title="Mattermost Cloud" >}}** Apps. Cloud
   customers can use Apps from Mattermost Marketplace. Marketplace Apps are
   deployed as AWS Lambda functions, and their usage is included in the service.
   You can find more information about the Marketplace {{< newtabref href="https://mattermost.com/marketplace/" title="here" >}}. Example AWS Lambda Apps can be
   found
   {{<newtabref title="here" href="https://github.com/mattermost/mattermost-app-examples/tree/master/golang/serverless">}}
   (Go).
2. **External** (HTTP) Apps. Apps can be hosted as publicly (or privately) available HTTP
   services, the choice of hosting provider is yours. A self-managed Mattermost
   customer would be able to install your App from a URL. External Apps are not
   currently accepted in the Mattermost Marketplace.
3. **Customer-deployable** Apps. An App can be packaged as a bundle, deployable
   by the customer in their own hosting environment. Currently, {{< newtabref href="https://aws.amazon.com/lambda/" title="AWS Lambda" >}},
   {{< newtabref href="https://www.openfaas.com/" title="OpenFaaS" >}}, and {{< newtabref href="https://kubeless.io/" title="Kubeless" >}}
   are supported, with plans for more serverless platforms, Kubernetes, and
   docker compose. Customer-deployable Apps are not yet distributed via the
   Mattermost Marketplace.

### Can I write "internal" organization-specific Apps?

Yes. They can be packaged as "customer-deployable" bundles and then deployed on
the supported serverless platforms, or run as HTTP services on the
organization's own hosting infrastructure.
