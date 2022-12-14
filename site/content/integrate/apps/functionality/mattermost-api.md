---
title: "Mattermost API"
heading: "Use Mattermost REST APIs with Apps"
description: "An App can use the Mattermost server REST API, as well as new App services APIs offered specifically to Mattermost Apps."
weight: 40
aliases:
  - /integrate/apps/using-mattermost-api/
  - /integrate/apps/api/mattermost-api/
---
The Apps framework exposes the Mattermost REST API, through a [driver]({{<ref "/integrate/apps/drivers">}}), to make interacting with the Mattermost server more convenient.

For example, the [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) `appclient` package includes a `Client` struct which implements the Mattermost Server's {{<newtabref title="client library" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6@v6.7.2/model#Client4">}}.
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

