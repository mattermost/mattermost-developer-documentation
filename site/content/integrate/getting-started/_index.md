---
title: "Get Started"
heading: "Integrate & Extend Mattermost"
description: "Extend Mattermost with Apps, APIs, plugins, webhooks, and more."
weight: 5
aliases: 
    - /integrate/getting-started/how-should-i-integrate/
    - /extend/getting-started
---
Mattermost offers a wealth of methods to add functionality and customize the experience to suit your needs, whether you want to add new user capabilities with slash commands, build an advanced chatbot, or completely change the functionality of your server.


## Apps

Apps are lightweight, interactive add-ons that can be written in any language and run on any HTTP-compatible hosting service. They’re for developers who want the most effective way to build Mattermost customizations and improvements efficiently.

[Build your App now]({{< ref "/integrate/apps" >}})


## API

Interact with users, channels, and everything else that happens on your Mattermost server via a modern REST API that meets the OpenAPI specification. The API is for developers who want to build bots and other interactions that don’t rely on customizing the Mattermost user experience.

[View the API Reference](https://api.mattermost.com/).


## Plugins

Plugins are the most comprehensive way to add new features and customization, but come with additional development overhead and must be written in Go. They’re for developers who need tightly integrated services or want to improve the server, mobile, desktop, and web apps without making contributions to the core codebase.

[Get started with plugins.]({{< ref "/integrate/plugins" >}})


## Other Ways to Integrate & Extend



* Slash Commands - Enable your users to [trigger custom actions]({{< ref "/integrate/other-integrations/slash-commands" >}}) from within Mattermost.
* Webhooks - Post to channels with [incoming webhooks]({{< ref "/integrate/other-integrations/incoming-webhooks" >}}), or listen for new messages with [outgoing webhooks]({{< ref "/integrate/other-integrations/outgoing-webhooks" >}}).
* Embed - Learn how to use the Mattermost API to [embed Mattermost]({{< ref "/integrate/other-integrations/embed" >}}) into web browsers and web applications.
* Customize - Modify the source code for the server or web app to make basic [changes and customization]({{< ref "/integrate/other-integrations/customization" >}}).
* Interactive Messages - Create messages that include [interactive functionality](https://docs.mattermost.com/developer/interactive-messages.html).
