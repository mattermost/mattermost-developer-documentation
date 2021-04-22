---
title: "Manifest"
heading: "Manifest"
description: "TODO"
section: "apps"
weight: 30
---

All apps should define a manifest ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Manifest)) as a JSON file. The manifest location must be `$ROOTURL/manifest.json`. The fields of the manifest are:

| Field name              | Field type              | Function                                                                                    |
| :---------------------- | :---------------------- | :------------------------------------------------------------------------------------------ |
| `app_id`                | string                  | ID for your app                                                                             |
| `app_type`              | http/aws_lambda/builtin | The type of app you are developing                                                          |
| `display_name`          | string                  | The display name for your app                                                               |
| `description`           | string                  | The description for your app. Used in the marketplace.                                      |
| `homepage_url`          | string                  | The app homepage. Used in the marketplace and for OAuth purposes.                           |
| `root_url`              | string                  | Base url to send all calls. Only needed for http apps.                                      |
| `requested_permissions` | Permissions             | All the permissions needed by the app.                                                      |
| `requested_locations`   | Locations               | The list of top-level locations that the application intends to bind to.                    |
| `install`               | Call                    | The call to be made when the app gets enabled. By default invoke `/install`, expanding App. |
| `bindings`              | Call                    | The call to be made to retrieve bindings. By default invoke `/bindings`.                    |

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

| Field name                         | Field type                                                                            |
| :--------------------------------- | :------------------------------------------------------------------------------------ |
| `user_joined_channel_notification` | Be notified when users join channels                                                  |
| `add_grants`                       | Add more grants (WITHOUT ADDITIONAL ADMIN CONSENT)                                    |
| `act_as_bot`                       | Use Mattermost REST API as the app's bot user                                         |
| `act_as_user`                      | Use Mattermost REST API as connected users                                            |
| `act_as_admin`                     | Use Mattermost REST API as a System Admin                                             |
| `remote_oauth2`                    | Use remote (3rd party) OAuth2 support, and will store secrets to 3rd party system(s). |
| `remote_webhooks`                  | Receive webhooks from a remote (3rd party) system, and process them as Bot            |


### Locations

Locations ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Location)) are spaces in the UI where the app can add interactions.

| Field name        | Field type                                                                   |
| :---------------- | :--------------------------------------------------------------------------- |
| `/post_menu`      | An item in the post menu.                                                    |
| `/channel_header` | Webapp: A button in the channel header, Mobile: An item in the channel menu. |
| `/command`        | A slash command                                                              |
| `/in_post`        | Attachment embedded to a post.                                               |
