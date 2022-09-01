---
title: "Manifest"
heading: "Manifest"
description: "App manifest spec"
weight: 10
aliases:
  - /integrate/apps/api/manifest/
---

All Apps should define a manifest ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Manifest">}}) as a JSON file.
The fields of the manifest are:

| Name                       | Type                        | Description                                                                                                                                     |
|:---------------------------|:----------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------|
| `app_id`(*)                | string                      | ID for your App.                                                                                                                                |
| `homepage_url`(*)          | string                      | The App homepage. Used in the Marketplace and for OAuth purposes.                                                                               |
| `version`                  | string                      | The version of your App, formatted as `v00.00.0000`.                                                                                            |
| `display_name`             | string                      | The display name for your App.                                                                                                                  |
| `description`              | string                      | The description for your App. Used in the Marketplace. Provide examples of key functionality the App provides in a short paragraph.             |
| `icon`                     | string                      | The icon for your App. Must be a relative path to a PNG image in the static assets folder. Used as the bot account icon and in the Marketplace. |
| `requested_permissions`    | [Permissions](#permissions) | List of permissions needed by the App.                                                                                                          |
| `requested_locations`      | [Locations](#locations)     | The list of top-level locations that the application intends to bind to.                                                                        |
| `bindings`                 | [Call]({{<ref "call">}})    | The call invoked to retrieve bindings. Default value: `/bindings`                                                                               |
| `on_install`               | [Call]({{<ref "call">}})    | The call invoked when the App is installed.                                                                                                     |
| `on_uninstall`             | [Call]({{<ref "call">}})    | The call invoked when the App is uninstalled, before the App is removed.                                                                        |
| `on_version_changed`       | [Call]({{<ref "call">}})    | The call invoked when the App needs to be upgraded or downgraded.                                                                               |
| `get_oauth2_connect_url`   | [Call]({{<ref "call">}})    | The call invoked with the App's "connect to 3rd party" link is clicked, to be redirected to the OAuth flow.                                     |
| `on_oauth2_complete`       | [Call]({{<ref "call">}})    | The call invoked when the OAuth flow has successfully completed.                                                                                |
| `on_remote_webhook`        | [Call]({{<ref "call">}})    | The call invoked when an HTTP webhook is received from a remote system.                                                                         |
| `remote_webhook_auth_type` | string                      | Specifies how incoming webhook messages from remote systems should be authenticated by Mattermost.                                              |
| `aws_lambda`(*)            | [AWSLambda](#aws-lambda)    | Metadata for an App that can be deployed to AWS Lambda and S3 services, and is accessed using the AWS APIs.                                     |
| `open_faas`(*)             | [OpenFAAS](#openfaas)       | Metadata for an App that can be deployed to OpenFAAS.                                                                                           |
| `http`(*)                  | [HTTP](#http)               | Metadata for an App that is already deployed externally and is accessed using HTTP.                                                             |

{{<note "Mandatory values (*)">}}
- The `app_id` and `homepage_url` values must be specified.
- A deployment method - `aws_lambda`, `open_faas`, or `http` - must be specified.
{{</note>}}

For example, a typical App manifest would look like the following:

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

Apps need to request permissions from the admin who is installing them. After an app is installed and available to end users, each user in Mattermost will need to "authenticate" with your app. Using the `act_as_user` permission, your app will be performing an API call on each authenticated user's behalf.

Below are the supported permissions ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Permission">}}) an app can request:

| Name                               | Description                                                                                                                                         |
|:-----------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
| `user_joined_channel_notification` | Be notified when users join channels.                                                                                                               |
| `act_as_bot`                       | Use Mattermost REST API as the app's bot user.                                                                                                      |
| `act_as_user`                      | Use Mattermost REST API as connected users.                                                                                                         |
| `remote_oauth2`                    | Use remote (third-party) OAuth2 support, and will store secrets and tokens to third-party system(s) within the Mattermost server.                   |
| `remote_webhooks`                  | Receive webhooks from a remote (third-party) system, and process them as a bot (which will typically, will add a notification message to a channel) |


### Locations

Locations ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Location">}}) are spaces in the UI where an app can add interactions. Locations in the App framework are supported on the Mobile/Desktop/Webapp clients unless otherwise noted. This list of locations will grow over time as the App Framework expands.

| Name              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|:------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/post_menu`      | An item in a Mattermost post's dropdown menu (aka Message Action) where the user can leverage the message content as part of your App's action. A good example for using the post menu: someone reports a bug in a channel with some details, then using the "post-menu" button the message's content could be used to create a new "bug" object in a tracking system.                                                                                                                                                                                                        |
| `/channel_header` | Webapp: A button in the channel header, Mobile: An item in the channel menu. This is used for actions that take place at the channel level, for example a button for the user to set up a notification subscription for all new tickets in system XYZ to be posted to the current channel                                                                                                                                                                                                                                                                                     |
| `/command`        | A slash command accessed by typing `/` at the beginning of any new message in Mattermost. Slash commands are an easy way for power-users to perform actions in external systems via a "chat-command-line" that can interactively provide the users with hints and suggestions based on dynamic lookups. For example, a slash command `/ticketing --name "test Ticket" --priority high` can capture two fields and create a ticket in an external system. The options for "priority" field could be displayed to the user in a multi-select menu to reduce their need to type. |
| `/in_post`        | A form that is embedded within a message in Mattermost. Used to interact with users without switching context to an Interactive Dialog. Great for confirming simple things - like "Did you complete your OKR review yet? (Yes/No)" options can be presented to the user and they can simply check off a box.                                                                                                                                                                                                                                                                  |

### Deployment methods

#### HTTP

Provides configuration for accessing an app that is deployed exterally of Mattermost and is accessible via HTTP.

| Name       | Description                                                                                                                                               |
|:-----------|:----------------------------------------------------------------------------------------------------------------------------------------------------------|
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

#### AWS Lambda

Provides configuration for deploying an app (bundle) onto the AWS Lambda and S3
services and accessing it there.

| Name           | Type                | Description       |
|:---------------|:--------------------|:------------------|
| `functions`(*) | AWS Lambda Function | List of functions |

Each function contains the following fields:

| Name         | Description                                                                                                                                                                      |
|:-------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
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

#### OpenFaaS

Provides configuration for deploying an app (bundle) onto OpenFaaS and `faasd` platforms.

| Name           | Type              | Description       |
|:---------------|:------------------|:------------------|
| `functions`(*) | OpenFaaS Function | List of functions |

Each function contains the following fields:

| Name      | Description                                                                                                             |
|:----------|:------------------------------------------------------------------------------------------------------------------------|
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
