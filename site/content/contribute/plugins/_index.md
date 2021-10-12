---
title: "Plugins"
heading: "Mattermost Plugins: An Introduction"
description: "Mattermost plugins are isolated pieces of code written in Go and/or React. They’re separate from the main repositories."
date: "2018-03-19T12:01:23-04:00"
weight: 10
---

Mattermost plugins are isolated pieces of code written in Go and/or React. They're separate from the main repositories and are used to extend the functionality of the Mattermost server and webapp. 

- The Go portions run directly on the Mattermost server, and are managed by the server at runtime. 
- The React portions run in each user's browser, allowing developers to modify the user interface in [several ways]({{< ref "/integrate/plugins/webapp/best-practices" >}}).

The plugin Help Wanted tickets are located in each plugin's respective GitHub repository. In order to browse all of the open tickets, see the plugin [Help Wanted tickets](https://mattermost.com/pl/help-wanted-plugins/) page with links to specific plugin repositories, as well as queries for Help Wanted tickets in all repositories. The [All Plugins Up for Grabs](https://github.com/issues?utf8=%E2%9C%93&q=repo%3Amattermost%2Fmattermost-plugin-agenda+repo%3Amattermost%2Fmattermost-plugin-antivirus+repo%3Amattermost%2Fmattermost-plugin-autolink+repo%3Amattermost%2Fmattermost-plugin-aws-SNS+repo%3Amattermost%2Fmattermost-plugin-custom-attributes+repo%3Amattermost%2Fmattermost-oembed-plugin+repo%3Amattermost%2Fmattermost-plugin-giphy+repo%3Amattermost%2Fmattermost-plugin-github+repo%3Amattermost%2Fmattermost-plugin-gitlab+repo%3Amattermost%2Fmattermost-plugin-google-calendar+repo%3Amattermost%2Fmattermost-plugin-jenkins+repo%3Amattermost%2Fmattermost-plugin-jira+repo%3Amattermost%2Fmattermost-plugin-msoffice+repo%3Amattermost%2Fmattermost-plugin-solar-lottery+repo%3Amattermost%2Fmattermost-plugin-suggestions+repo%3Amattermost%2Fmattermost-plugin-todo+repo%3Amattermost%2Fmattermost-plugin-webex+repo%3Amattermost%2Fmattermost-plugin-welcomebot+repo%3Amattermost%2Fmattermost-plugin-zoom+repo%3Amattermost%2Fmattermost-plugin-msteams-meetings+is%3Aopen+is%3Aissue+archived%3Afalse+label%3A%22help%20wanted%22%20label%3A%22up%20for%20grabs%22%20) link is useful to browse all repositories at once.

The plugin [developer setup]({{< ref "/integrate/plugins/developer-setup" >}}) and [developer workflow](/integrate/plugins/developer-workflow/) pages are useful to learn about the plugin development environment. You can find more information about plugins in general [here](/integrate/plugins/).

**Note:** The `make` commands listed in the [developer workflow](https://developers.mattermost.com/integrate/plugins/developer-workflow/#common-make-commands-for-working-with-plugins) page should be executed to run certain tests before submitting a PR. The commands are listed by order of their importance.
