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
The App manifest needs to request the `remote_webhooks` permission to use webhooks.

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

### Retrieve the secret key

When the App is first installed, the `OnInstall` [call]({{<ref "/integrate/apps/structure/call">}}) handler will receive a context value of `app.webhook_secret` in the request. This value should be persisted by the App for authenticating incoming webhook requests. The App key-value store is suitable for storing the secret.

{{<note>}}
The `OnInstall` call must have the `app` expand field set to `summary` or `all` for the generated secret key to be populated in the call request.
{{</note>}}

For example, an Golang App's [manifest]({{<ref "/integrate/apps/structure/manifest">}}) would define an `OnInstall` call to get the secret like this:

```go
appManifest = apps.Manifest{
    AppID:       apps.AppID("hello-world"),
    Version:     apps.AppVersion("0.1.0"),
    HomepageURL: "https://my-site/my-repo",
    DisplayName: "Hello, world!",
    RequestedPermissions: apps.Permissions{
        apps.PermissionActAsBot,
        apps.PermissionRemoteWebhooks,
    },
    RequestedLocations: apps.Locations{
        apps.LocationChannelHeader,
        apps.LocationCommand,
        apps.LocationPostMenu,
    },
    Deploy: apps.Deploy{
        HTTP: &apps.HTTP{
            RootURL: "http://my-site:4000",
        },
    },
    OnInstall: &apps.Call{
        Path: "/installed",
        Expand: &apps.Expand{
            App: apps.ExpandSummary,
        },
    },
}
```

The `context` of the call request will look like the following:

```json
{
    "path": "/installed",
    "context": {
        "app_id": "my-app",
        "developer_mode": true,
        "app": {
            "app_id": "my-app",
            "version": "0.1.0",
            "webhook_secret": "9a44ckeqytd3bftn3c3y53968o",
            "bot_user_id": "7q7kaakokfdsdycy3pr9ctkc5r",
            "bot_username": "my-app"
        },
        "oauth2": {}
    }
}
```

### Example

An example of implementing App webhooks can be found in the {{<newtabref title="Mattermost apps examples repo" href="https://github.com/mattermost/mattermost-app-examples/tree/master/golang/webhooks">}}.
