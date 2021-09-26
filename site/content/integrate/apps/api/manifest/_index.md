---
title: "App Manifest"
heading: "App Manifest"
description: "App manifest spec"
weight: 100
---

All apps should define a manifest
([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Manifest))
as a JSON file. The fields of the manifest are:

| Name                    | Type                   | Description                                                                                                                                                                           |
| :---------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app_id`(*)             | string       | ID for your app.  |
| `homepage_url`(*)       | string       | The app homepage. Used in the Marketplace and for OAuth purposes. |
| `version`               | string       | The version of your app. |
| `display_name`          | string       | The display name for your app. |
| `description`           | string       | The description for your app. Used in the Marketplace. |
| `icon`                  | string       | The icon for your app. Used as the bot account icon and in the Marketplace. A relative path in the static assets folder of a .PNG image. |
| `requested_permissions` | Permissions  | All the permissions needed by the app. |
| `requested_locations`   | Locations    | The list of top-level locations that the application intends to bind to. |
| `bindings`              | Call         | The call gets invoked to retrieve bindings. By default invoke `/bindings`. |
| `on_disable`            | Call         | The call gets invoked when the app is disabled after having been enabled.  |
| `on_enable`             | Call         | The call gets invoked when the app is enabled after having been disabled.  |
| `on_install`            | Call         | The call gets invoked when the app gets installed.  |
| `on_uninstall`          | Call         | The call gets invoked when the app gets uninstalled, before the app is actually removed. |

- (*) `app_id` and `homepage_url` must be provided and valid.
- `on_...` callbacks are not invoked unless explicitly provided in the manifest.
`bindings` defaults to `/bindings` with nothing expanded.
- In addition, an app must define at least one of the following deployment types, as a section
in its `manifest.json`: `"http"`, `"aws_lambda"`, `"kubeless"`, or
`"open_faas"`. 

An example manifest looks like this:
```json
{
	"app_id": "hello-world",
    "version":"v0.8.0",
	"display_name": "Hello, world!",
	"icon": "icon.png",
	"homepage_url": "https://github.com/mattermost/mattermost-plugin-apps/examples/go/hello",
	"requested_permissions": [
		"act_as_bot"
	],
	"requested_locations": [
		"/channel_header",
		"/command"
	],
	"http": {
		"root_url": "http://localhost:4000"
	}
}
```

### Permissions

These are all the permissions ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Permission)) an app can ask for:

| Name                               | Description                                                                               |
| :--------------------------------- | :---------------------------------------------------------------------------------------- |
| `user_joined_channel_notification` | Be notified when users join channels.                                                     |
| `act_as_bot`                       | Use Mattermost REST API as the app's bot user.                                            |
| `act_as_user`                      | Use Mattermost REST API as connected users.                                               |
| `act_as_admin`                     | Use Mattermost REST API as a System Admin.                                                |
| `remote_oauth2`                    | Use remote (third-party) OAuth2 support, and will store secrets to third-party system(s). |
| `remote_webhooks`                  | Receive webhooks from a remote (third-party) system, and process them as bot.             |


### Locations

Locations ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Location)) are spaces in the UI where the app can add interactions.

| Name              | Description                                                                  |
| :---------------- | :--------------------------------------------------------------------------- |
| `/post_menu`      | An item in the post menu.                                                    |
| `/channel_header` | Webapp: A button in the channel header, Mobile: An item in the channel menu. |
| `/command`        | A slash command.                                                             |
| `/in_post`        | Attachment embedded to a post.                                               |

### Deployment Information

#### `http`: Apps accessible via HTTP

Provides configuration for accessing an app that is deployed exterally of Mattermost and is accessible via HTTP.

| Name                               | Description                                                                               |
| :--------------------------------- | :---------------------------------------------------------------------------------------- |
| `root_url` | Base URL to send all calls and static asset requests to. |
| `use_jwt`  | Include a secret-based JWT in all requests to the App. The secret must be provided by the app to the sysadmin and entered at the app's installation time. |

#### `aws_lambda`: Apps deployable and accessible as AWS Lambda functions and S3 static assets

Provides configuration for deploying an app (bundle) onto the AWS Lambda and S3
services and accessing it there.

| Name          | Type                | Description |
| :------------ | :------------------ | :---------------- |
| `function`(*) | AWS Lambda Function | List of functions |

Each function contains the following fields:

| Name         | Description |
| :----------- | :---------- |
| `path`(*)    | (Root) path of calls to be mapped to this function, e.g. `"/"` |
| `name`(*)    | Function's base name. Is used as a base name to compose the actual AWS Lambda name. `{name}.zip` is used looking up the function in an app bundle by `appsctl aws deploy` |
| `handler`(*) | The name of the handler go function |
| `runtime`(*) | AWS Lambda runtime to use, e.g. `"go1.x"` |

#### `open_faas`: Apps deployable and accessible as OpenFaaS or faasd functions

Provides configuration for deploying an app (bundle) onto OpenFaaS and faasd platforms.

| Name          | Type              | Description |
| :------------ | :---------------- | :---------------- |
| `function`(*) | OpenFaaS Function | List of functions |

Each function contains the following fields:

| Name      | Description |
| :-------- | :---------- |
| `path`(*) | (Root) path of calls to be mapped to this function, e.g. `"/"` |
| `name`(*) | Function's base name. Is used as a base name to compose the actual OpenFaaS name, combined with the app ID and version. |

#### `Kubeless`: Apps deployable and accessible as Kubeless

Provides configuration for deploying an app (bundle) onto Kubeless serverless platform on Kubernetes.

| Name          | Type              | Description |
| :------------ | :---------------- | :---------------- |
| `function`(*) | Kubeless Function | List of functions |

Each function contains the following fields:

| Name      | Description |
| :-------- | :---------- |
| `path`(*) | (root) path of calls to be mapped to this function, e.g. `"/"` |
| `handler`(*) | the name of the language-specific function to invoke |
| `file`(*) | the name of the file to invoke |
| `runtime`(*) | Kubeless runtime to use |
| `deps_file` | Dependencies file for the function (`go.mod` or `requirements.txt`) |
| `timeout` | Function completion timeout in seconds, default none |
| `port` | IPV4 port to use in the function image, default 8080 |
