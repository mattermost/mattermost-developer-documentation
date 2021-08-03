---
title: "Customizing Mattermost"
heading: "Customizing Mattermost: An Introduction"
description: "Learn more about customizing Mattermost to create a more personalized experience depending on the needs of your deployment."
weight: 50
aliases: [/extend/customization/]
---

Mattermost allows for a variety of customization options and modifications, making it possible to create a more adequate experience depending on the needs of each deployment.

There are a few limitations regarding [how the re-branding of Mattermost](https://www.mattermost.org/trademark-standards-of-use/) must be handled, as well as the fact that changes to the Enterprise Edition's source code isn't supported. However these limitations can be overcome with the utilization of [Plugins](/integrate/plugins/).

# Customizable Components

## Server (Team Edition only)
The [Mattermost server](https://github.com/mattermost/mattermost-server)'s source code, written in Golang, may be customized to deliver additional functionalities or to meet specific security requirements.

It's recommended that you attempt to meet such customizations by leveraging the [Plugin framework](/integrate/plugins/) in order to avoid creating any breaking changes, however details on how to build a custom server may be found [here](/integrate/other-integrations/customization/server-build/).

## Server Files
Some parts of server-side customizations don't require changes to the source code. View more details on which server files may be customized in [here](/integrate/other-integrations/customization/server-files/).

Note: Modifications to server files can be utilized on both Team Edition and Enterprise Editions.

## Web App
Mattermost's web application runs on React, and [its codebase](https://github.com/mattermost/mattermost-webapp) has been open-sourced (regardless of which edition your server uses). You can view details on how to customize the web app in [here](/integrate/other-integrations/customization/webapp/). Keep in mind, however, that some changes to the web app can also leverage the [Plugin](/integrate/plugins/webapp/) framework, which can help reduce the necessity of rebasing your custom client to each Mattermost release.
