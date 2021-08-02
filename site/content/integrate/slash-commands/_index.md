---
title: "Slash Commands"
heading: "Slash Commands at Mattermost"
description: "Slash commands trigger an HTTP request to a web service that can in turn post one or more messages in response."
date: "2017-08-19T12:01:23-04:00"
weight: 40
---

Slash commands are messages that begin with `/` and trigger an HTTP request to a web service that can in turn post one or more messages in response.

Unlike outgoing webhooks, slash commands work in private channels and direct messages in addition to public channels, and can be configured to auto-complete when typing. Note that while Mattermost includes a number of built-in slash commands, this document concerns itself only with the slash commands that can be configured as custom integrations.


### Basic Usage

Follow [the admin guide](https://docs.mattermost.com/developer/slash-commands.html#custom-slash-command) to create a slash command.

After creating the slash command, you'll be given a `token`. __Treat this as a secret.__ Anyone who has this token will be able to mimic requests to your application.

If you configured a slash command with a trigger word of `test`, a request URL of `http://example.com/slash-command` and a `POST` request method, and someone posts the message

```
/test asd
```

to your Town Square channel, your endpoint will receive:

```http
POST / HTTP/1.1
Host: 127.0.0.1:8080
User-Agent: mattermost-5.9.0
Content-Length: 548
Accept: application/json
Authorization: Token nezum4kpu3faiec7r7c5zt6tfy
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip

channel_id=i3bb9xfyqt8rtbyshmyhgsj16c&
channel_name=town-square&
command=%2Ftest&
response_url=http%3A%2F%2F10.0.0.5%3A8065%2Fhooks%2Fcommands%2Fzozc1xwxybdedeyz8djwjpngny&
team_domain=rrrr&
team_id=tsb8crrn5tgqtedpkt81b4tcya&
text=asd&
token=nezum4kpu3faiec7r7c5zt6tfy&
trigger_id=NG1kM3lyN2NqYmQxcGNyc2s0Nmo5em0xb2M6azF4NGFxZGp5MzgxM2M4NG03NzFlb2M5eG86MTU1MTIwODE5NTQyNzpNRVVDSUhSdWFrdmVGZ0RhTTd6UERoMWVEVndZK2NGbXlSYUxWQ054SVRLZGdxTWZBaUVBeGQvOU95NTFOeWxiTWVsRE1ZK0d4S2FzL2Z1TUU2Y0J1bW5JbFBCOXVEVT0%3D&
user_id=k1x4aqdjy3813c84m771eoc9xo&
user_name=tester
```

As evidenced by the `Content-Type`, this is a typical `form-urlencoded` payload similar to what you would receive from a `<form method="POST">` element on an HTML web page.

Upon receiving one of these requests, your integration should immediately confirm that the `token` provided in the request body matches the one given to you after the slash command was created. If it does not match, it is strongly recommended that you reject the request. This ensures that the request actually came from Mattermost.

Once the request is verified, you can emit a message in the channel where the slash command was invoked by responding with a 200 status code and including a response body as follows:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 59

{"text": "Hello, this is a response from a slash command."}
```

Be sure to set the `Content-Type` to `application/json` otherwise your response will be displayed as plaintext.

### Delayed and multiple responses

You can use the `response_url` parameter to supply multiple responses or a delayed response to a slash command. Response URLs can be used to send five additional messages within a 30-minute time period from the original command invocation.

Delayed responses are useful when the action takes more than three seconds to perform. For instance:
- Retrieval of data from external third-party services, where the response time may take longer than three seconds.
- Report generation, batch processing or other long-running processes that take longer than three seconds to respond.

Any requests that are made to the response URL should either be a plain text or JSON-encoded body. The JSON-encoded message supports both [Markdown formatting](https://docs.mattermost.com/help/messaging/formatting-text.html) and [message attachments](https://docs.mattermost.com/developer/message-attachments.html).

### Parameters

Slash command responses support more than just the `text` field. Here is a full list of supported parameters.

| Parameter | Description | Required |
|---|---|---|
| text | [Markdown-formatted](https://docs.mattermost.com/help/messaging/formatting-text.html) message to display in the post. | If `attachments` is not set, yes |
| response\_type | Set to blank or `ephemeral` to reply with a message that only the user can see. <br> Set to `in_channel` to create a regular message.<br> Defaults to `ephemeral`. | No |
| username | Overrides the username the message posts as.<br> Defaults to the username set during webhook creation or the webhook creator's username if the former was not set.<br> Must be enabled [in the configuration](https://docs.mattermost.com/administration/config-settings.html#enable-integrations-to-override-usernames). | No |
| channel\_id | Overrides the channel to which the message gets posted.<br> Defaults to the channel in which the command was issued. | No |
| icon\_url | Overrides the profile picture the message posts with.<br> Defaults to the URL set during webhook creation or the webhook creator's profile picture if the former was not set.<br> Must be enabled [in the configuration](https://docs.mattermost.com/administration/config-settings.html#enable-integrations-to-override-profile-picture-icons). | No |
| goto\_location | A URL to redirect the user to. Supports many protocols, including `http://`, `https://`, `ftp://`, `ssh://` and `mailto://`.| No |
| attachments | [Message attachments](https://docs.mattermost.com/developer/message-attachments.html) used for richer formatting options. | If `text` is not set, yes |
| type | Sets the post `type`, mainly for use by plugins.<br> If not blank, must begin with `custom_`. Passing `attachments` will ignore this field and set the type to `slack_attachment`. | No |
| extra\_responses | An array of responses used to send more than one post in your response. Each item in this array takes the shape of its own command response, so it can include any of the other parameters listed here, except `goto\_location` and `extra\_responses` itself. Available in Mattermost v5.6 and later. | No |
| skip_slack_parsing | If set to `true` Mattermost will skip the Slack-compatibility handling. Useful if the post contains text or code which is incorrectly handled by the Slack-compatibility logic. Available in Mattermost v5.20 and later. | No |
| props | Sets the post `props`, a JSON property bag for storing extra or meta data on the post.<br> Mainly used by other integrations accessing posts through the REST API.<br> The following keys are reserved: `from_webhook`, `override_username`, `override_icon_url` and `attachments`. | No |

An example request using some more parameters would look like this:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 696

{
    "response_type": "in_channel",
    "text": "\n#### Test results for July 27th, 2017\n@channel here are the requested test results.\n\n| Component  | Tests Run   | Tests Failed                                   |\n| ---------- | ----------- | ---------------------------------------------- |\n| Server     | 948         | :white_check_mark: 0                           |\n| Web Client | 123         | :warning: 2 [(see details)](http://linktologs) |\n| iOS Client | 78          | :warning: 3 [(see details)](http://linktologs) |\n\t\t      ",
    "username": "test-automation"
    "icon_url": "https://www.mattermost.org/wp-content/uploads/2016/04/icon.png",
    "props": {
        "test_data": {
            "ios": 78,
            "server": 948,
            "web": 123
        }
    },
}
```

### FAQ

#### How do I debug slash commands?

To debug slash commands in System Console > Logs, set System Console > Logging > Enable Webhook Debugging to true and set System Console > Logging > Console Log Level to DEBUG.

#### How do I send multiple responses from a slash command.

You can send multiple responses with an `extra_responses` parameter as follows.

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 696

{
    "response_type": "in_channel",
    "text": "\n#### Test results for July 27th, 2017\n@channel here are the requested test results.\n\n| Component  | Tests Run   | Tests Failed                                   |\n| ---------- | ----------- | ---------------------------------------------- |\n| Server     | 948         | :white_check_mark: 0                           |\n| Web Client | 123         | :warning: 2 [(see details)](http://linktologs) |\n| iOS Client | 78          | :warning: 3 [(see details)](http://linktologs) |\n\t\t      ",
    "username": "test-automation",
    "icon_url": "https://www.mattermost.org/wp-content/uploads/2016/04/icon.png",
    "props": {
        "test_data": {
            "ios": 78,
            "server": 948,
            "web": 123
        }
    },
    "extra_responses": [
       {
         "text": "message 2",
         "username": "test-automation"
       },
       {
         "text": "message 3",
         "username": "test-automation"
       }
     ]
}
```

#### What if my slash command takes time to build a response?

Reply immediately with an `ephemeral` message to confirm response of the command, and then use the `response_url` to send up to five additional messages within a 30-minute time period from the original command invocation.

#### Why does my slash command fail to connect to `localhost`?

By default, Mattermost prohibits outgoing connections that resolve to certain common IP ranges, including the loopback (`127.0.0.0/8`) and various private-use subnets.

During development, you may override this behaviour by setting `ServiceSettings.AllowedUntrustedInternalConnections` to `"127.0.0.0/8"` in your `config.json` or via the System Console's Advanced > Developer page. See the [admin guide's notes](https://docs.mattermost.com/administration/config-settings.html#allow-untrusted-internal-connections-to) for more details.

#### Should I configure my slash command to use `POST` or `GET`?

Best practice suggests using `GET` only if a request is considered idempotent. This means that the request can be repeated safely and can be expected to return the same response for a given input. Some servers hosting your slash command may also impose a limit to the amount of data passed through the query string of a `GET` request.

Ultimately, however, the choice is yours. If in doubt, configure your slash command to use a `POST` request.

<div class="alert alert-warning" role="alert">
Note that slash commands configured to use a <code>GET</code> request were broken prior to Mattermost release 5.0.0. The payload was incorrectly encoded in the body of the <code>GET</code> request instead of in the query string. While it was still technically possible to extract the payload, this was non-standard and broke some development stacks.
</div>

#### Why does my slash command always fail with `returned an empty response`?

If you are emitting the `Content-Type: application/json` header, your body must be valid JSON. Any JSON decoding failure will result in this error message.

Also, you must provide a `response_type`. Mattermost does not assume a default if this field is missing.

#### Why does my slash command print the JSON data instead of formatting it?

Ensure you are emitting the `Content-Type: application/json` header, otherwise your body will be treated as plain text and posted as such.

#### Are slash commands Slack-compatible?

See the [admin guide's notes on Slack compatibility](https://docs.mattermost.com/developer/slash-commands.html#slack-compatibility).

#### How do I use Bot Accounts to reply to slash commands?

##### If you are developing an integration
- Set up a [Personal Access Token](https://docs.mattermost.com/developer/personal-access-tokens.html) for the Bot Account you want to reply with.
- Use the [REST API](https://api.mattermost.com/#tag/posts%2Fpaths%2F~1posts%2Fpost) to create a post with the Access Token.

##### If you are developing a plugin

Use [`CreatePost`](https://developers.mattermost.com/extend/plugins/server/reference/#API.CreatePost) plugin API. Make sure to set the  `UserId` of the post to the `UserId` of the Bot Account. If you want to create an ephemeral post, use [`SendEphemeralPost`](https://developers.mattermost.com/extend/plugins/server/reference/#API.SendEphemeralPost) plugin API instead.
