---
title: "Manifest"
heading: "Manifest"
description: "App manifest spec"
weight: 10
aliases:
  - /integrate/apps/api/manifest/
  - /integrate/apps/manifest
---

All Apps should define a manifest ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Manifest">}}) as a JSON object.
The fields of the manifest are described in the following table:

| Name                                                         | Type                        | Description                                                                                                                                                                                                                                                                                   |
|:-------------------------------------------------------------|:----------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `app_id`{{<compass-icon icon-star "Mandatory Value">}}       | string                      | ID for your App.                                                                                                                                                                                                                                                                              |
| `homepage_url`{{<compass-icon icon-star "Mandatory Value">}} | string                      | The App homepage. Used in the Marketplace and for OAuth purposes.                                                                                                                                                                                                                             |
| `version`                                                    | string                      | The version of your App, formatted as `v00.00.0000`.                                                                                                                                                                                                                                          |
| `display_name`{{<compass-icon icon-star "Mandatory Value">}} | string                      | The display name for your App.                                                                                                                                                                                                                                                                |
| `description`                                                | string                      | The description for your App. Used in the product Marketplace. Provide examples of key functionality the App provides in a short paragraph.                                                                                                                                                   |
| `icon`                                                       | string                      | The icon for your App. Must be a relative path to a PNG image in the static assets folder. Used as the bot account icon and in the product Marketplace.                                                                                                                                       |
| `requested_permissions`                                      | [Permissions](#permissions) | List of permissions needed by the App.                                                                                                                                                                                                                                                        |
| `requested_locations`                                        | [Locations](#locations)     | The list of top-level locations that the App intends to bind to.                                                                                                                                                                                                                              |
| `bindings`                                                   | [Call]({{<ref "call">}})    | The call invoked to retrieve bindings. Default value: `/bindings`                                                                                                                                                                                                                             |
| `on_install`                                                 | [Call]({{<ref "call">}})    | The call invoked when the App is installed.                                                                                                                                                                                                                                                   |
| `on_uninstall`                                               | [Call]({{<ref "call">}})    | The call invoked when the App is uninstalled, before the App is removed.                                                                                                                                                                                                                      |
| `on_version_changed`                                         | [Call]({{<ref "call">}})    | The call invoked when the App needs to be upgraded or downgraded.                                                                                                                                                                                                                             |
| `get_oauth2_connect_url`                                     | [Call]({{<ref "call">}})    | The call invoked when an OAuth2 authentication flow has started.                                                                                                                                                                                                                              |
| `on_oauth2_complete`                                         | [Call]({{<ref "call">}})    | The call invoked when an OAuth2 authentication flow has successfully completed.                                                                                                                                                                                                               |
| `on_remote_webhook`                                          | [Call]({{<ref "call">}})    | The call invoked when an App [webhook]({{<ref "/integrate/apps/functionality/external-webhooks/">}}) is received from a remote system.                                                                                                                                                        |
| `remote_webhook_auth_type`                                   | string                      | Specifies how incoming App [webhook]({{<ref "/integrate/apps/functionality/external-webhooks/">}}) messages from remote systems should be authenticated by Mattermost. One of `""`, `none`, or `secret`. Default value: `""`.<br/>The value `""` is treated as if it were the value `secret`. |
| `aws_lambda`{{<compass-icon icon-star "Mandatory Value">}}   | [AWSLambda](#aws-lambda)    | Metadata for an App that can be deployed to AWS Lambda and S3 services, and is accessed using the AWS APIs.                                                                                                                                                                                   |
| `open_faas`{{<compass-icon icon-star "Mandatory Value">}}    | [OpenFAAS](#openfaas)       | Metadata for an App that can be deployed to OpenFAAS.                                                                                                                                                                                                                                         |
| `http`{{<compass-icon icon-star "Mandatory Value">}}         | [HTTP](#http)               | Metadata for an App that is already deployed externally and is accessed using HTTP.                                                                                                                                                                                                           |

{{<note "Mandatory values" "icon-star" "Mandatory Value">}}
- The `app_id`, `display_name` and `homepage_url` values must be specified.
- At least one deployment method - `aws_lambda`, `open_faas`, or `http` - must be specified.
{{</note>}}

For example, a typical App manifest would look like the following:

```json
{
	"app_id": "hello-world",
    "version":"v0.8.0",
	"display_name": "Hello, world!",
	"icon": "icon.png",
	"homepage_url": "https://github.com/mattermost/mattermost-plugin-apps",
	"requested_permissions": [
		"act_as_bot"
	],
	"requested_locations": [
		"/channel_header",
		"/command"
	],
	"on_install": {
        "path": "/install"
	},
	"http": {
		"root_url": "http://localhost:4000"
	}
}
```

### Permissions

Apps need to request permissions from the System Admin who is installing them. After an App is installed and available to end users, each user in Mattermost will need to "authenticate" with your App.
Using the `act_as_user` permission, your App will be performing an API call on behalf of each authenticated user.

The following table lists the supported permissions ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Permission">}}) an app can request:

| Name                               | Description                                                                                                                                 |
|:-----------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------|
| `act_as_bot`                       | Use Mattermost REST API as the app's bot user.                                                                                              |
| `act_as_user`                      | Use Mattermost REST API as a connected user.                                                                                                |
| `remote_oauth2`                    | Use remote (third-party) OAuth2 support, and store secrets and tokens to third-party system(s) within the Mattermost server.                |
| `remote_webhooks`                  | Receive webhooks from a remote (third-party) system and process them as a bot. This will typically add a notification message to a channel. |

### Locations

Locations ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Location">}}) are spaces in the UI where an App can add interactions. Locations in the App framework are supported on the mobile, desktop, and web app clients unless otherwise noted. This list of locations will grow over time as the App framework expands.

| Name              | Description                                                                                                                                                                                                                                                                                                                                                          |
|:------------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `/post_menu`      | An item in a Mattermost post's dropdown menu (e.g., Message Action) where the user can leverage message content as part of the App's action.<br/><br/>For example, someone reports a bug in a channel with some details, then using the "post-menu" button, the message's content could be used to create a new "bug" object in a tracking system.                   |
| `/channel_header` | A button in the channel header on the desktop app or the web app, and an item in the channel menu on the mobile app. This is used for actions that take place at the channel level.<br/><br/>For example, a button for the user to set up a notification subscription for all new tickets in system XYZ to be posted to the current channel.                         |
| `/command`        | A slash command accessed by typing `/` at the beginning of any new message in Mattermost.<br/><br/>For example, a slash command `/ticketing --name "test Ticket" --priority high` can capture two fields and create a ticket in an external system. The options for the `priority` field could be displayed to the user in a pick list to reduce their need to type. |
| `/in_post`        | A form that is embedded within a message in Mattermost. Used to interact with users without switching context to an interactive dialog.<br/><br/>For example, confirming simple things like "Did you complete your OKR review yet? (Yes/No)" options can be presented to the user and they can simply check off a box.                                               |

### Deployment methods

#### HTTP

Provides configuration for accessing an app that is deployed externally of Mattermost and is accessible via HTTP.

| Name       | Description                                                                                                                                              |
|:-----------|:---------------------------------------------------------------------------------------------------------------------------------------------------------|
| `root_url` | Base URL for all calls and static asset requests.                                                                                                        |
| `use_jwt`  | Include a secret-based JWT in all requests to the App. The secret must be provided by the App to the System Admin and entered when the App is installed. |

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

Provides configuration for deploying an App onto the AWS Lambda and S3 services.
All fields are mandatory ({{<compass-icon icon-star "Mandatory Value">}}).

| Name                                                      | Type                 | Description       |
|:----------------------------------------------------------|:---------------------|:------------------|
| `functions`{{<compass-icon icon-star "Mandatory Value">}} | AWS Lambda functions | List of functions |

Each AWS Lambda function contains the following fields:

| Name                                                    | Description                                                                                                                                                                                             |
|:--------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `path`{{<compass-icon icon-star "Mandatory Value">}}    | Root path of calls to be mapped to this function. For example: `"/"`                                                                                                                                    |
| `name`{{<compass-icon icon-star "Mandatory Value">}}    | Function's base name; used to compose the actual AWS Lambda name.                                                                                                                                       |
| `handler`{{<compass-icon icon-star "Mandatory Value">}} | The name of the function handler.                                                                                                                                                                       |
| `runtime`{{<compass-icon icon-star "Mandatory Value">}} | AWS Lambda runtime to use.<br/>See the {{<newtabref title="Lambda runtimes" href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html">}} documentation for a list of supported runtimes. |

Example:
```json
{
  	"aws_lambda": {
    	"functions": [
	  		{
	    		"path": "/",
	  	  		"name": "my-funct",
	  	  		"handler": "my-funct",
	  	  		"runtime": "go1.x"
 			}
		]
	}
}
```

#### OpenFaaS

Provides configuration for deploying an App onto OpenFaaS and `faasd` platforms.
All fields are mandatory ({{<compass-icon icon-star "Mandatory Value">}}).

| Name                                                      | Type               | Description       |
|:----------------------------------------------------------|:-------------------|:------------------|
| `functions`{{<compass-icon icon-star "Mandatory Value">}} | OpenFaaS functions | List of functions |

Each function contains the following fields:

| Name                                                 | Description                                                                                                        |
|:-----------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------|
| `path`{{<compass-icon icon-star "Mandatory Value">}} | Root path of calls to be mapped to this function. For example: `"/"`                                               |
| `name`{{<compass-icon icon-star "Mandatory Value">}} | Function's base name.<br/>Used to compose the actual OpenFaaS function name, combined with the App ID and version. |

Example:
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
