---
title: "Mattermost API"
heading: "Use Mattermost REST APIs with Apps"
description: "An App can use the Mattermost server REST API, as well as new App services APIs offered specifically to Mattermost Apps."
weight: 40
aliases:
  - /integrate/apps/using-mattermost-api/
  - /integrate/apps/api/mattermost-api/
---
Apps frequently need to call the Mattermost API in order to perform actions as the bot user or as the current user accessing the app.

The Apps framework exposes the Mattermost REST API, both directly through HTTP calls and for Golang developers via a [driver]({{<ref "/integrate/apps/drivers">}}) that makes interacting with the Mattermost server easier and more convenient.

For example, the Mattermost REST API documentation shows how to call {{<newtabref title="Mattermost AddChannelMember API here" href="https://api.mattermost.com/#tag/channels/operation/AddChannelMember">}}

### Authorization of Mattermost REST API calls in Apps

An authorization token is required when invoking the Mattermost API via HTTP. The token must be set in the `Authorization` header as a bearer token. This bearer token can be either the `bot_access_token` to make the call as the bot, or the `acting_user_access_token` to make the call as the current user access the app.

### Calling the Mattermost REST API via the Golang Driver

Golang developers can also call the {{<newtabref title="Mattermost AddChannelMember API" href="https://api.mattermost.com/#tag/channels/operation/AddChannelMember">}} via the [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) using the following code.

For example, the [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) `appclient` package includes a `Client` struct which implements the Mattermost Server's {{<newtabref title="client library" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#Client4">}}.
The following code creates an instance of the `Client` struct and adds a bot to a channel in response to a [call]({{<ref "/integrate/apps/structure/call">}}):

```go
// Create an instance of the REST API client, acting as a bot (vs. a user)
client := appclient.AsBot(callRequest.Context)
// Add the bot to the channel with ID `channelId`
channelMember, response, err := client.AddChannelMember(channelId, callRequest.Context.BotUserID)
if err != nil {
    // handle the error
}   
```

