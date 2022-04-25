---
title: "Manifest"
heading: "App Manifest"
description: "App manifest spec"
weight: 100
---

All apps should define a manifest
([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Manifest))
as a JSON file. The fields of the manifest are:

| Name                    | Type        | Description                                                                                                                              |
| :---------------------- | :---------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `app_id`(*)             | string      | ID for your app.                                                                                                                         |
| `homepage_url`(*)       | string      | The app homepage. Used in the Marketplace and for OAuth purposes.                                                                        |
| `version`               | string      | The version of your app. Recommended format: `v00.00.000`. |
| `display_name`          | string      | The display name for your app.                                                                                                           |
| `description`           | string      | The description for your app. Used in the Marketplace. Provide examples of key functionality the App provides in a short paragraph.      |
| `icon`                  | string      | The icon for your app. Used as the bot account icon and in the Marketplace. A relative path in the static assets folder of a .PNG image. |
| `requested_permissions` | Permissions | All the permissions needed by the app.                                                                                                   |
| `requested_locations`   | Locations   | The list of top-level locations that the application intends to bind to.                                                                 |
| `bindings`              | Call        | The call gets invoked to retrieve bindings. By default invoke `/bindings`.                                                               |
| `on_disable`            | Call        | The call gets invoked when the app is disabled after having been enabled.                                                                |
| `on_enable`             | Call        | The call gets invoked when the app is enabled after having been disabled.                                                                |
| `on_install`            | Call        | The call gets invoked when the app gets installed.                                                                                       |
| `on_uninstall`          | Call        | The call gets invoked when the app gets uninstalled, before the app is actually removed.                                                 |
| `get_oauth2_connect_url` | Call        | called when the App's "connect to 3rd party" link is clicked, to be redirected to the OAuth flow. It must return Data set to the remote OAuth2 redirect URL. |
| `on_oauth2_complete` | Call        | called upon successful completion of the remote (3rd party) OAuth2 flow, and after the "state" has already been validated. |
| `on_remote_webhook` | Call        | called upon a (validated) webhook message received from a 3rd party system. |
| `remote_webhook_auth_type` | string | specifies how the incoming webhook messages should be authenticated. "secret" (default), "none", or "jwt" (not yet supported) |

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

Apps need to request permissions from the admin who is installing them. After an app is installed and available to end-users, each user in Mattermost will need to "authenticate" with your App. Using the `act_as_user` permission, your App will be performing an API call on each authenticated user's behalf.

Below are the permissions ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Permission)) an app can currently ask for:

| Name                               | Description                                                                                                                                                                                                                                                                |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user_joined_channel_notification` | Be notified when users join channels.                                                                                                                                                                                                                                      |
| `act_as_bot`                       | Use Mattermost REST API as the app's bot user.                                                                                                                                                                                                                             |
| `act_as_user`                      | Use Mattermost REST API as connected users.                                                                                                                                                                                                                                |
| `act_as_admin`                     | Use Mattermost REST API as a System Admin. This gives permission for an App to use certain API endpoints that are reserved for administrators. Use this permission only if required (ie: your App is designed to help maintain or automate certain administrator actions). |
| `remote_oauth2`                    | Use remote (third-party) OAuth2 support, and will store secrets and tokens to third-party system(s) within the Mattermost server.                                                                                                                                          |
| `remote_webhooks`                  | Receive webhooks from a remote (third-party) system, and process them as a bot (which will typically, will add a notification message to a channel)                                                                                                                        |


### Locations

Locations ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Location)) are spaces in the UI where an app can add interactions. Locations in the App framework are supported on the Mobile/Desktop/Webapp clients unless otherwise noted. This list of locations will grow over time as the App Framework expands.

| Name              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/post_menu`      | An item in a Mattermost post's dropdown menu (aka Message Action) where the user can leverage the message content as part of your App's action. A good example for using the post menu: someone reports a bug in a channel with some details, then using the "post-menu" button the message's content could be used to create a new "bug" object in a tracking system.                                                                                                                                                                                                        |
| `/channel_header` | Webapp: A button in the channel header, Mobile: An item in the channel menu. This is used for actions that take place at the channel level, for example a button for the user to set up a notification subscription for all new tickets in system XYZ to be posted to the current channel                                                                                                                                                                                                                                                                                     |
| `/command`        | A slash command accessed by typing `/` at the beginning of any new message in Mattermost. Slash commands are an easy way for power-users to perform actions in external systems via a "chat-command-line" that can interactively provide the users with hints and suggestions based on dynamic lookups. For example, a slash command `/ticketing --name "test Ticket" --priority high` can capture two fields and create a ticket in an external system. The options for "priority" field could be displayed to the user in a multi-select menu to reduce their need to type. |
| `/in_post`        | A form that is embedded within a message in Mattermost. Used to interact with users without switching context to an Interactive Dialog. Great for confirming simple things - like "Did you complete your OKR review yet? (Yes/No) options can be presented to the user and they can simply check off a box.                                                                                                                                                                                                                                                                  |

### Deployment Information

#### `http`: Apps accessible via HTTP

Provides configuration for accessing an app that is deployed exterally of Mattermost and is accessible via HTTP.

| Name       | Description                                                                                                                                               |
| :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root_url` | Base URL to send all calls and static asset requests to.                                                                                                  |
| `use_jwt`  | Include a secret-based JWT in all requests to the App. The secret must be provided by the app to the sysadmin and entered at the app's installation time. |

Example:
```json
{
	"http": {
		"root_url": "https://myurl.test/somepath",
		"use_jwt": true
	}
}
```

#### `aws_lambda`: Apps deployable and accessible as AWS Lambda functions and S3 static assets

Provides configuration for deploying an app (bundle) onto the AWS Lambda and S3
services and accessing it there.

| Name           | Type                | Description       |
| :------------- | :------------------ | :---------------- |
| `functions`(*) | AWS Lambda Function | List of functions |

Each function contains the following fields:

| Name         | Description                                                                                                                                                                      |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `path`(*)    | (Root) path of calls to be mapped to this function, e.g. `"/"`                                                                                                                   |
| `name`(*)    | Function's base name. Is used as a base name to compose the actual AWS Lambda name. `{name}.zip` is used looking up the lambda function in an app bundle by `appsctl aws deploy` |
| `handler`(*) | The name of the handler go function                                                                                                                                              |
| `runtime`(*) | AWS Lambda runtime to use, see [here](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)                                                                         |

Example (some fields omitted):
```json
{
  	"aws_lambda": {
    	"functions": [
	  		{
	    		"path": "/",
	  	  		"name": "my-funct"
 			}
		]
	}
}
```

#### `open_faas`: Apps deployable and accessible as OpenFaaS or faasd functions

Provides configuration for deploying an app (bundle) onto OpenFaaS and faasd platforms.

| Name           | Type              | Description       |
| :------------- | :---------------- | :---------------- |
| `functions`(*) | OpenFaaS Function | List of functions |

Each function contains the following fields:

| Name      | Description                                                                                                             |
| :-------- | :---------------------------------------------------------------------------------------------------------------------- |
| `path`(*) | (Root) path of calls to be mapped to this function, e.g. `"/"`                                                          |
| `name`(*) | Function's base name. Is used as a base name to compose the actual OpenFaaS name, combined with the app ID and version. |

Example (some fields omitted):
```json
{
  	"open_faas": {
    	"functions": [
	  		{
	    		"path": "/",
	  	  		"name": "my-funct"
  			}
		]
	}
}
```
