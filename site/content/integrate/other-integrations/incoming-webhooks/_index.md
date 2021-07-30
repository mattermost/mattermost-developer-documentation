---
title: "Incoming Webhooks"
heading: "Incoming Webhooks at Mattermost"
description: "Incoming webhooks let you post some data to a Mattermost endpoint to create a message in a channel."
date: "2017-08-19T12:01:23-04:00"
weight: 20
---

Incoming webhooks let you POST some data to a Mattermost endpoint to create a message in a channel.

### Basic Usage

Follow [the admin guide](https://docs.mattermost.com/developer/webhooks-incoming.html#simple-incoming-webhook) to create the webhook endpoint. It'll look something like this:

```
https://your-mattermost-server.com/hooks/xxx-generatedkey-xxx
```

__Treat this endpoint as a secret.__ Anyone who has it will be able to post messages to your Mattermost instance.

To use the endpoint, have your application make the following request:

```http
POST /hooks/xxx-generatedkey-xxx HTTP/1.1
Host: your-mattermost-server
Content-Type: application/json
Content-Length: 63

{"text": "Hello, this is some text\nThis is more text. :tada:"}
```

As a curl:

```bash
curl -i -X POST -H 'Content-Type: application/json' -d '{"text": "Hello, this is some text\nThis is more text. :tada:"}' http://{your-mattermost-site}/hooks/xxx-generatedkey-xxx
```

For compatibility with Slack incoming webhooks, if no `Content-Type` header is set then the request body must be prefixed with `payload=`, like so:

```bash
payload={"text": "Hello, this is some text\nThis is more text. :tada:"}
```

A successful request will get the following response:

```http
HTTP/1.1 200 OK
Content-Type: text/plain
X-Request-Id: hoan6o9ws7rp5xj7wu9rmysrte
X-Version-Id: 4.7.1.dev.12799cd77e172e8a2eba0f9091ec1471.false
Date: Sun, 04 Mar 2018 17:19:09 GMT
Content-Length: 2

ok
```

All webhook posts will display a `BOT` indicator next to the username in Mattermost clients, to help prevent against [phishing attacks](https://en.wikipedia.org/wiki/Phishing).

### Parameters

Incoming webhooks support more than just the `text` field. Here is a full list of supported parameters.

| Parameter | Description | Required |
|---|---|---|
| text | [Markdown-formatted](https://docs.mattermost.com/help/messaging/formatting-text.html) message to display in the post.<br> To trigger notifications, use `@<username>`, `@channel` and `@here` like you would in normal Mattermost messaging. | If `attachments` is not set, yes |
| channel | Overrides the channel the message posts in. Use the channel's name and not the display name, e.g. use `town-square`, not `Town Square`.<br> Use an "@" followed by a username to send to a direct message.<br> Defaults to the channel set during webhook creation.<br> The webhook can post to any public channel and private channel the webhook creator is in.<br> Posts to direct messages will appear in the DM between the targeted user and the webhook creator. | No |
| username | Overrides the username the message posts as.<br> Defaults to the username set during webhook creation or the webhook creator's username if the former was not set.<br> Must be enabled [in the configuration](https://docs.mattermost.com/administration/config-settings.html#enable-integrations-to-override-usernames). | No |
| icon\_url | Overrides the profile picture the message posts with.<br> Defaults to the URL set during webhook creation or the webhook creator's profile picture if the former was not set.<br> Must be enabled [in the configuration](https://docs.mattermost.com/administration/config-settings.html#enable-integrations-to-override-profile-picture-icons). | No |
| icon\_emoji | Overrides the profile picture and `icon_url` parameter.<br> Defaults to none and is not set during webhook creation.<br> Must be enabled [in the configuration](https://docs.mattermost.com/administration/config-settings.html#enable-integrations-to-override-profile-picture-icons).<br> The expected content is an emoji name, as typed in a message, either with or without `:`. | No |
| attachments | [Message attachments](https://docs.mattermost.com/developer/message-attachments.html) used for richer formatting options. | If `text` is not set, yes |
| type | Sets the post `type`, mainly for use by plugins.<br> If not blank, must begin with "custom\_". | No |
| props | Sets the post `props`, a JSON property bag for storing extra or meta data on the post.<br> Mainly used by other integrations accessing posts through the REST API.<br> The following keys are reserved: "from\_webhook", "override\_username", "override\_icon\_url", "override\_icon\_emoji", "webhook\_display\_name", "card", and "attachments".<br> Props `card` allows for extra information (markdown formatted text) to be sent to Mattermost that will only be displayed in the RHS panel after a user clicks on an 'info' icon displayed alongside the post.<br> The info icon cannot be customized and is only rendered visible to the user if there is `card` data passed into the message.<br> This is only available in v5.14+.<br> There is currently no Mobile support for `card` functionality. | No |


An example request using some more parameters would look like this:

```http
POST /hooks/xxx-generatedkey-xxx HTTP/1.1
Host: your-mattermost-server
Content-Type: application/json
Content-Length: 630

{
  "channel": "town-square",
  "username": "test-automation",
  "icon_url": "https://www.mattermost.org/wp-content/uploads/2016/04/icon.png",
  "text": "#### Test results for July 27th, 2017\n@channel please review failed tests.\n\n| Component  | Tests Run   | Tests Failed                                   |\n|:-----------|:-----------:|:-----------------------------------------------|\n| Server     | 948         | :white_check_mark: 0                           |\n| Web Client | 123         | :warning: 2 [(see details)](http://linktologs) |\n| iOS Client | 78          | :warning: 3 [(see details)](http://linktologs) |"
}
```

An example request displaying additional data in the right-hand side panel, by passing Markdown text into the `card` field of the `props` object would look like this:

```http
POST /hooks/xxx-generatedkey-xxx HTTP/1.1
Host: your-mattermost-server
Content-Type: application/json


{
  "channel": "town-square",
  "username": "Winning-bot",
  "text": "#### We won a new deal!",
  "props": {
    "card": "Salesforce Opportunity Information:\n\n [Opportunity Name](http://salesforce.com/OPPORTUNITY_ID)\n\n-Salesperson: **Bob McKnight** \n\n Amount: **$300,020.00**"
  }
}
```

When there is `props` object with a `card` property attached to the webhook payload, the posted message displays a small info icon next to the timestamp. Clicking this icon expands the right-hand side panel to display the Markdown included in the `card` property:

![image](https://user-images.githubusercontent.com/915956/64055959-ec0cfe80-cb44-11e9-8ee3-b64d47c86032.png)

### Slack Compatibility

See the [admin guide's notes on Slack compatibility](https://docs.mattermost.com/developer/webhooks-incoming.html#slack-compatibility).

### Tips and Best Practices

1. If the `text` is longer than the allowable character limit per post, the message is split into multiple consecutive posts, each within the character limit. Servers running Mattermost Server v5.0 or later [can support posts up to 16383 characters](https://docs.mattermost.com/administration/important-upgrade-notes.html).
2. Your webhook integration may be written in any programming language as long as it supports sending an HTTP POST request.
3. Both `application/x-www-form-urlencoded` and `multipart/form-data` are supported `Content-Type` headers. If no `Content-Type` is provided, `application/json` is assumed.
