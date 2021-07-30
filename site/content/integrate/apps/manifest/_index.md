---
title: "Manifest"
heading: "Manifest"
description: "TODO"
weight: 30
---

All apps should define a manifest ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Manifest)) as a JSON file. The manifest location must be `$ROOTURL/manifest.json`. The fields of the manifest are:

| Name                    | Type                   | Description                                                                                                                                                                           |
| :---------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app_id`                | string                 | ID for your app.                                                                                                                                                                      |
| `app_type`              | string                 | The hosting type of app you are developing. Can be `http` or `aws_lambda`or `builtin`.                                                                                                |
| `version`               | string                 | The version of your app.                                                                                                                                                              |
| `homepage_url`          | string                 | The app homepage. Used in the Marketplace and for OAuth purposes.                                                                                                                     |
| `display_name`          | string                 | The display name for your app.                                                                                                                                                        |
| `description`           | string                 | The description for your app. Used in the Marketplace.                                                                                                                                |
| `icon`                  | string                 | The icon for your app. Used as the bot account icon and in the Marketplace. A relative path in the static assets folder of a .PNG image.                                               |
| `bindings`              | Call                   | The call gets invoked to retrieve bindings. By default invoke `/bindings`.                                                                                                            |
| `on_install`            | Call                   | The call gets invoked when the app gets installed. By default invoke `/install`, expanding app.                                                                                       |
| `on_uninstall`          | Call                   | The call gets invoked when the app gets uninstalled, before the app is actually removed. It's not called unless explicitly provided in the manifest.                                  |
| `requested_permissions` | Permissions            | All the permissions needed by the app.                                                                                                                                                |
| `requested_locations`   | Locations              | The list of top-level locations that the application intends to bind to.                                                                                                              |
| `root_url`              | string                 | Base URL to send all calls. Only needed for HTTP apps.                                                                                                                                |
| `aws_lambda`            | []AWSLambdaDescription | A list of [AWS Lambda descriptions](https://aws.amazon.com/de/lambda/) to be used for hosting the app. Learn more about hosting your app in AWS [here]({{< ref "deployment-aws" >}}). |

An example manifest looks like this:
```json
{
	"app_id": "hello-world",
    "display_name": "Hello, world!",
	"app_type": "http",
	"root_url": "http://localhost:8080",
	"requested_permissions": [
		"act_as_bot"
	],
	"requested_locations": [
		"/channel_header",
		"/command"
	]
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
