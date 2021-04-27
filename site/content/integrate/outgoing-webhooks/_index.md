---
title: "Outgoing Webhooks"
heading: "Outgoing Webhooks at Mattermost"
description: "Outgoing webhooks let you receive an event as an HTTP POST when messages get posted into a Mattermost channel."
date: "2017-08-19T12:01:23-04:00"
weight: 30
---

Outgoing webhooks let you receive an event as an HTTP POST when messages get posted into a Mattermost channel, with the option to respond with your own message.

They can be configured to send events for one or both of the following conditions:

* A message is posted in a specific channel
* The first word of a message matches or starts with one of the configured trigger words

### Basic Usage

Follow [the admin guide](https://docs.mattermost.com/developer/webhooks-outgoing.html#create-an-outgoing-webhook) to create the webhook.

After creating the webhook you'll be given a `token`. __Treat this as a secret.__ Anyone who has this token will be able to mimic requests to your application.

Based on how you configured your webhook, the callback URL(s) you provided will receive HTTP POSTs similar to:

```http
POST /your-url HTTP/1.1
Content-Length: 244
Host: <your-host-name>
Accept: application/json
Content-Type: application/x-www-form-urlencoded

channel_id=hawos4dqtby53pd64o4a4cmeoo&
channel_name=town-square&
team_domain=someteam&
team_id=kwoknj9nwpypzgzy78wkw516qe&
post_id=axdygg1957njfe5pu38saikdho&
text=some+text+here&
timestamp=1445532266&
token=zmigewsanbbsdf59xnmduzypjc&
trigger_word=some&
user_id=rnina9994bde8mua79zqcg5hmo&
user_name=somename&
file_ids=znana9194bde8mua70zqcg5hmo
```

If you configured your webhook to use `application/json` content, the request would be:

```http
POST /your-url HTTP/1.1
Content-Length: 378
Host: <your-host-name>
Accept: application/json
Content-Type: application/json

{
  "channel_id": "hawos4dqtby53pd64o4a4cmeoo",
  "channel_name": "town-square",
  "team_domain": "someteam",
  "team_id": "kwoknj9nwpypzgzy78wkw516qe",
  "post_id": "axdygg1957njfe5pu38saikdho",
  "text": "some text here",
  "timestamp": "1445532266",
  "token": "zmigewsanbbsdf59xnmduzypjc",
  "trigger_word": "some",
  "user_id": "rnina9994bde8mua79zqcg5hmo",
  "user_name": "somename",
  "file_ids": "znana9194bde8mua70zqcg5hmo"
}
```

Upon receiving one of these requests, your integration should immediately confirm that the `token` provided in the request body matches the one given to you after the webhook was created. If it does not match, it is strongly recommended that you reject the request. This ensures that the request actually came from Mattermost.

If your application does not want to post a message back into the channel as a response, simply return a 200 status code with no response body.

To respond with a message in the channel the event came from, respond with a 200 status code but also include a response body like so:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 63

{"text": "Hello, this is a response from an outgoing webhook."}
```

Make sure you set the `Content-Type` to `application/json` otherwise your response will be interpreted as plaintext.

### Parameters

Outgoing webhooks support more than just the `text` field. Here is a full list of supported parameters.

| Parameter | Description | Required |
|---|---|---|
| text | [Markdown-formatted](https://docs.mattermost.com/help/messaging/formatting-text.html) message to display in the post.<br> To trigger notifications, use `@<username>`, `@channel` and `@here` like you would in normal Mattermost messaging. | If `attachments` is not set, yes |
| response\_type | Set to "comment" to reply to the message that triggered it.<br> Set to blank or "post" to create a regular message.<br> Defaults to "post". | No |
| username | Overrides the username the message posts as.<br> Defaults to the username set during webhook creation or the webhook creator's username if the former was not set.<br> Must be enabled [in the configuration](https://docs.mattermost.com/administration/config-settings.html#enable-integrations-to-override-usernames). | No |
| icon\_url | Overrides the profile picture the message posts with.<br> Defaults to the URL set during webhook creation or the webhook creator's profile picture if the former was not set.<br> Must be enabled [in the configuration](https://docs.mattermost.com/administration/config-settings.html#enable-integrations-to-override-profile-picture-icons). | No |
| attachments | [Message attachments](https://docs.mattermost.com/developer/message-attachments.html) used for richer formatting options. | If `text` is not set, yes |
| type | Sets the post `type`, mainly for use by plugins.<br> If not blank, must begin with "custom\_". Passing `attachments` will ignore this field and set the type to `slack\_attachment`. | No |
| props | Sets the post `props`, a JSON property bag for storing extra or meta data on the post.<br> Mainly used by other integrations accessing posts through the REST API.<br> The following keys are reserved: "from\_webhook", "override\_username", "override\_icon\_url", "webhook\_display\_name" and "attachments". | No |

An example request using some more parameters would look like this:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 755

{
  "response_type": "comment",
  "username": "test-automation",
  "icon_url": "https://www.mattermost.org/wp-content/uploads/2016/04/icon.png",
  "text": "\n#### Test results for July 27th, 2017\n@channel here are the requested test results.\n\n| Component  | Tests Run   | Tests Failed                                   |\n| ---------- | ----------- | ---------------------------------------------- |\n| Server     | 948         | :white_check_mark: 0                           |\n| Web Client | 123         | :warning: 2 [(see details)](http://linktologs) |\n| iOS Client | 78          | :warning: 3 [(see details)](http://linktologs) |\n\t\t      ",
  "props": {
    "test_data": {
    "server": 948,
    "web": 123,
    "ios": 78
    }
  }
}
```

### Slack Compatibility

See the [admin guide's notes on Slack compatibility](https://docs.mattermost.com/developer/webhooks-outgoing.html#slack-compatibility).

### Tips and Best Practices

1. If the `text` is longer than the allowable character limit per post, the message is split into multiple consecutive posts, each within the character limit. Servers running Mattermost Server v5.0 or later [can support posts up to 16383 characters](https://docs.mattermost.com/administration/important-upgrade-notes.html).
2. Your webhook integration may be written in any programming language as long as it supports handling HTTP POST requests.
3. Outgoing webhooks are supported in public channels only. If you need a trigger that works in a private channel or a direct message, consider using a [slash command](/integrate/slash-commands/) instead.
