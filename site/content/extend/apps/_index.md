---
title: "Apps (Developers Preview)"
heading: "Apps in Mattermost"
description: "TODO: Mattermost supports plugins that offer powerful features for extending and deeply integrating with both the server and web/desktop apps."
date: 2020-04-15T00:00:00-05:00
weight: 50
section: extend
---

Apps are lighweight interactive add-ons to mattermost. Apps can:
- display interactive, dynamic Modal forms and Message Actions.
- attach themselves to locations in the Mattermost UI (e.g. channel bar buttons,
  post menu, channel menu, commands), and can add their custom /commands with
  full Autocomplete.
- receive webhooks from Mattermost, and from 3rd parties, and use the Mattermost
  REST APIs to post messages, etc. 
- be hosted externally (HTTP), on Mattermost Cloud (AWS Lambda), and soon
  on-prem and in customers' own AWS environments.
- be developed in any language*


Apps are available as a Developers Preview and we're looking for your feedback! Share constructive feedback in the [Mattermost Apps channel](https://community.mattermost.com/core/channels/mattermost-apps) on our Mattermost community instance.


Read the [quick start guide]({{< ref  "quick-start-go" >}}) to learn how to write your first app.
