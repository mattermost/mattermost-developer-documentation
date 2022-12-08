---
title: Webhooks
heading: App webhooks
weight: 30
aliases:
  - /integrate/apps/api/third-party-webhooks/
  - /integrate/apps/using-third-party-api/
  - /integrate/apps/using-third-party-api/hello-webhooks/
---
The Apps framework offers the ability to directly integrate with webhooks. An App webhook is executed through a special endpoint on the Mattermost Server and can require an authentication secret.
The App [manifest]({{<ref "/integrate/apps/structure/manifest">}}) needs to request the `remote_webhooks` permission to use webhooks.

The App webhook URL has the following format:

```
<mattermost_site_url>/plugins/com.mattermost.apps/apps/<app_id>/webhook/<sub_path>
```

| Parameter name        | Description                                                                             | Example value                   |
|-----------------------|-----------------------------------------------------------------------------------------|---------------------------------|
| `mattermost_site_url` | The base URL of the Mattermost server.                                                  | `https://my-mattermost-server/` |
| `app_id`              | The App's ID as found in the [manifest]({{<ref "/integrate/apps/structure/manifest">}}) | `my-app`                        |
| `sub_path`            | An arbitrary path defined by the App                                                    | `my-webhook-path`               |

Using the above example values, the webhook URL will look like this:

`http://my-mattermost-server/plugins/com.mattermost.apps/apps/my-app/webhook/my-webhook-path`

The `/webhook` call is made every time an App webhook is accessed. The `sub_path` of the webhook URL can be obtained from the `path` property of the call request.

## Webhook authentication

App webhooks support an API key-like authentication method. A Mattermost server-generated `webhook_secret` is provided during App installation and is used by the implementer to validate a webhook request.

There are two steps to enable this authentication method:

1. Set the `remote_webhook_auth_type` property of the App manifest to `secret`.
2. Define an `on_install` [call]({{<ref "/integrate/apps/structure/call">}}) in the App manifest with the `app` expand property set to `summary` or `all`.
   The `webhook_secret` property of the `app` context field in the call request contains the webhook secret.

{{<note>}}
The webhook secret should be stored by the App for authenticating incoming webhook requests. The App [key-value store]({{<ref "/integrate/apps/functionality/kv-store">}}) is suitable for storing the webhook secret. 
{{</note>}}

When this authentication method is enabled, webhook requests will contain a parameter named `secret` which should be verified against the known webhook secret. If the secrets don't match, the webhook request can be considered invalid.

Using the example from the previous section, the webhook URL will look like this:

`http://my-mattermost-server/plugins/com.mattermost.apps/apps/my-app/webhook/my-webhook-path?secret=xxxxxxxxxxxxxxxx`

An App's [manifest]({{<ref "/integrate/apps/structure/manifest">}}) would define an `on_install` call to get the secret like this:

```json
{
	"app_id": "hello-world",
    "version": "0.1.0",
	"display_name": "Hello, world!",
	"icon": "icon.png",
	"homepage_url": "https://my-site/my-repo",
	"requested_permissions": [
		"act_as_bot",
		"remote_webhooks"
	],
	"requested_locations": [
		"/channel_header",
		"/command",
		"/post_menu"
	],
	"http": {
		"root_url": "http://localhost:4000"
	},
	"remote_webhook_auth_type": "secret",
	"on_install": {
        "path": "/installed",
        "expand": {
            "app": "all"
        }
	}
}
```

The `context` of the `on_install` call request will look like the following:

```json
{
    "path": "/installed",
    "context": {
        "app_id": "hello-world",
        "developer_mode": true,
        "app": {
            "app_id": "my-app",
            "version": "0.1.0",
            "webhook_secret": "9a44ckeqytd3bftn3c3y53968o",
            "bot_user_id": "7q7kaakokfdsdycy3pr9ctkc5r",
            "bot_username": "hello-world"
        },
        "oauth2": {}
    }
}
```

## Example

An example of implementing App webhooks can be found in the {{<newtabref title="Mattermost apps examples repo" href="https://github.com/mattermost/mattermost-app-examples/tree/master/golang/webhooks">}}.
