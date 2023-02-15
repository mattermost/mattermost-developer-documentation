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
The App [manifest]({{<ref "/integrate/apps/structure/manifest">}}) must request the `remote_webhooks` permission to use webhooks.

## Webhook URL

The App webhook URL has the following format:

```
<mattermost_site_url>/plugins/com.mattermost.apps/apps/<app_id>/webhook/<sub_path>?secret=<authentication_secret>
```

| Parameter name          | Description                                                                                                               | Example value                   |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| `mattermost_site_url`   | The base URL of the Mattermost server.                                                                                    | `https://my-mattermost-server/` |
| `app_id`                | The App's ID as found in the [manifest]({{<ref "/integrate/apps/structure/manifest">}}).                                  | `my-app`                        |
| `sub_path`              | (_Optional_) The webhook sub-path. See the [Webhook call path](#webhook-call-path) section for more information.          | `my-sub-path`                   |
| `authentication_secret` | The webhook secret; used to authenticate the webhook request. See [Authentication](#authentication) for more information. | `cwsjhrdqebyf8qrnabtxio7k7r`    |

Using the above example values, the webhook URL will look like this:

`https://my-mattermost-server/plugins/com.mattermost.apps/apps/my-app/webhook/my-sub-path?secret=cwsjhrdqebyf8qrnabtxio7k7r`

When the external integration sends a `HTTP POST` request to this endpoint, your App will receive the request at the endpoint `/webhook/my-sub-path`. The same webhook URL can be used to process `HTTP HEAD` requests, in case the external integration requires this for webhook validation. The `/my-sub-path` part of the above URL is optional, and it can be defined as any string value.

### Webhook call path

The App [manifest]({{<ref "/integrate/apps/structure/manifest">}}) contains an optional property `on_remote_webhook` which defines the base [call]({{<ref "/integrate/apps/structure/call">}}) for incoming App webhooks.

The `sub_path` of a webhook URL is also optional. When it is defined, the call that is executed changes; the call path will be different.

Examples:

1. If the `on_remote_webhook` call path is not defined in the manifest and `sub_path` is also not defined, the call path will be `/webhook` and the webhook URL will be:

   ```
   <mattermost_site_url>/plugins/com.mattermost.apps/apps/<app_id>/webhook
   ```

2. If the `on_remote_webhook` call path is defined as `/my-webhooks` in the manifest but `sub_path` is not defined, the call path will be `/my-webhooks` and the webhook URL will be:

   ```
   <mattermost_site_url>/plugins/com.mattermost.apps/apps/<app_id>/webhook
   ```

3. If the `on_remote_webhook` call path is not defined in the manifest but `sub_path` is defined as `my-sub-path`, the call path will be `/webhook/my-sub-path` and the webhook URL will be:

   ```
   <mattermost_site_url>/plugins/com.mattermost.apps/apps/<app_id>/webhook/my-sub-path
   ```

4. If the `on_remote_webhook` call path is defined as `/my-webhooks` in the manifest and the `sub_path` is defined as `my-sub-path`, the call path will be `/my-webhooks/my-sub-path` and the webhook URL will be:

   ```
   <mattermost_site_url>/plugins/com.mattermost.apps/apps/<app_id>/webhook/my-sub-path
   ```

## Call request

The [call]({{<ref "/integrate/apps/structure/call">}}) executed for an App webhook will include additional information in the `values` field of the request:

| Name         | Data type | Description                                                                                                                  |
|--------------|-----------|------------------------------------------------------------------------------------------------------------------------------|
| `headers`    | map       | The HTTP headers used in the request.                                                                                        |
| `data`       | _any_     | The contents of the call request body.<br/>JSON bodies are automatically unmarshalled, otherwise the body is returned as-is. |
| `httpMethod` | string    | The HTTP method used in the request. e.g. `POST`, `GET`.                                                                     |
| `rawQuery`   | string    | Encoded URL query values, without the `?`.                                                                                   |

An example webhook call request looks like the following:

```http request
POST /webhook HTTP/1.1
Content-Type: application/json

{
    "path": "/webhook",
    "values": {
        "data": "",
        "headers": {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Content-Length": "0",
            "Mattermost-Session-Id": "",
            "User-Agent": "PostmanRuntime/7.30.0"
        },
        "httpMethod": "POST",
        "rawQuery": "secret=pszhs89rspyrje41khqouwbhce"
    },
    "context": {
        "acting_user_id": "mgbd1czngjbbdx6eqruqabdeie",
        "app_id": "hello-world",
        "mattermost_site_url": "http://mattermost:8066",
        "developer_mode": true,
        "app_path": "/plugins/com.mattermost.apps/apps/hello-world",
        "bot_user_id": "mgbd1czngjbbdx6eqruqabdeie",
        "bot_access_token": "nr7ne5p8oprkimkmt7xra67xjy",
        "acting_user_access_token": "nr7ne5p8oprkimkmt7xra67xjy",
        "oauth2": {}
    }
}
```

## Authentication

App webhooks support an API key-like authentication method that is enabled by default. A Mattermost server-generated secret named `webhook_secret` is provided in a call context where the `app` expand field is set to `all`.
The secret is expected to be appended to the webhook URL as a query value named `secret`.

Using the example from the previous section, the webhook URL will look like this:

`http://my-mattermost-server/plugins/com.mattermost.apps/apps/my-app/webhook/my-sub-path?secret=cwsjhrdqebyf8qrnabtxio7k7r`

The Mattermost server will authenticate incoming webhook requests by comparing the `secret` URL query value with the App's `webhook_secret`.
If an incoming webhook request does not include the correct secret, the request will be denied with an HTTP 401 response.

{{<note "Disable authentication:">}}
It is possible to disable webhook authentication by setting the `remote_webhook_auth_type` App manifest field to `none`.
The Mattermost server will not generate a webhook secret, will not perform any authentication against the call request, and will pass all webhook calls to the appropriate App call handlers.
This may have security and hosting cost implications.
{{</note>}}

### Get the webhook secret

A simple way to get the App's webhook secret is to use a slash command that executes a [call]({{<ref "/integrate/apps/structure/call" >}}) with the `app` expand field set to `all`.

For example, the following bindings create a slash command that will provide the webhook secret to its call:

```json
[
    {
        "location": "/command",
        "bindings": [
            {
                "location": "configure",
                "label": "configure",
                "description": "Configure the app",
                "submit": {
                    "path": "/configure",
                    "expand": {
                        "app": "all"
                    }
                }
            }
        ]
    }
]
```

The call request would look like this:

```json
{
    "path": "/configure",
    "expand": {
        "app": "all"
    },
    "context": {
        "app_id": "hello-world",
        "location": "/command/configure",
        "user_agent": "webapp",
        "track_as_submit": true,
        "mattermost_site_url": "http://mattermost:8066",
        "developer_mode": true,
        "app_path": "/plugins/com.mattermost.apps/apps/hello-world",
        "bot_user_id": "mgbd1czngjbbdx6eqruqabdeie",
        "bot_access_token": "q8idzs7dspf8ugra9sb7dkgxwe",
        "app": {
            "app_id": "hello-world",
            "version": "0.1.0",
            "webhook_secret": "cwsjhrdqebyf8qrnabtxio7k7r",
            "bot_user_id": "mgbd1czngjbbdx6eqruqabdeie",
            "bot_username": "hello-world",
            "remote_oauth2": {}
        },
        "acting_user": {
            "id": "7q7kaakokfdsdycy3pr9ctkc5r"
            // additional fields omitted for brevity
        },
        "oauth2": {}
    },
    "raw_command": "/configure "
}
```

The webhook secret can be found in the `context.app.webhook_secret` field.

Using the webhook secret above, a webhook URL for an App would look like the following:

`http://mattermost:8066/plugins/com.mattermost.apps/apps/hello-world/webhook/coffee-roast?secret=cwsjhrdqebyf8qrnabtxio7k7r`

## Example

An example of implementing App webhooks can be found in the {{<newtabref title="Mattermost apps examples repo" href="https://github.com/mattermost/mattermost-app-examples/tree/master/golang/webhooks">}}.
