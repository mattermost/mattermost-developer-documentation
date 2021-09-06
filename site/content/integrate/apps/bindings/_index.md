---
title: "Bindings"
heading: "Bindings"
description: "TODO"
weight: 50
---

Bindings ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding)) are what establish the relationship between locations and calls. Whenever the bindings route is called, your app needs to provide the list of bindings available according to the context ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context)). Some fields included in the context:

- Your app's bot user access token
- The Mattermost Site URL
- The ID of the user requesting the bindings (acting user ID)
- The ID of the team the user is currently focused on
- The ID of the channel the user is currently focused on
- The ID of the post the user is currently focused on (if applicable)

**Note:** Bindings are fetched (and refreshed) on every channel switch. When the user moves to a different context (like opening a thread, or a post in a search view) new bindings may be fetched to provide the correct bindings for the thread/post context. Bindings are also fetched when an OAuth2 process is completed and when the application gets installed.

One example bindings response is the one from the [Hello World!](https://github.com/mattermost/mattermost-plugin-apps/blob/master/examples/go/hello-world/bindings.json) app.

The expected response should include the following:

| Type   | Function | Description           |
| :----- | :------- | :-------------------- |
| `data` | bindings | The list of bindings. |

Bindings are organized by top level locations. Top level bindings just need to define:

| Name       | Type     | Description                             |
| :--------- | :------- | :-------------------------------------- |
| `location` | string   | Top level location.                     |
| `bindings` | Bindings | A list of bindings under this location. |

`/in_post` bindings don't need to be defined in this call.

### `/post_menu` bindings

| Name       | Type   | Description                                                                                                       |
| :--------- | :----- | :---------------------------------------------------------------------------------------------------------------- |
| `location` | string | Name of this location. The whole path of locations will be added in the context. Must be unique in its level.     |
| `icon`     | string | (Optional) Either a fully-qualified URL, or a path for an app's static asset.                                     |
| `label`    | string | (Optional) Text to show in the item. Defaults to location. Must be unique in its level.                           |
| `call`     | Call   | (Optional) Call to perform. You must provide a call if there is no form, or the form itself does not have a call. |
| `form`     | Form   | (Optional) Modal form to open. You must provide a form with a call if there is no call defined in the binding.    |

The call for these bindings will include in the context the user ID, the post ID, the root post ID if any, the channel ID, and the team ID.

### `/channel_header` bindings

| Name       | Type   | Description                                                                                                                 |
| :--------- | :----- | :-------------------------------------------------------------------------------------------------------------------------- |
| `location` | string | Name of this location. The whole path of locations will be added in the context. Must be unique in its level.               |
| `icon`     | string | (Optional/Web App required) Either a fully-qualified URL, or a path for an app's static asset.                             |
| `label`    | string | (Optional) Text to show in the item on mobile and webapp collapsed view. Defaults to location. Must be unique in its level. |
| `hint`     | string | (Optional/Web App required) Text to show in tooltip.                                                                       |
| `call`     | Call   | (Optional) Call to perform. You must provide a call if there is no form, or the form itself does not have a call.           |
| `form`     | Form   | (Optional) Modal form to open. You must provide a form with a call if there is no call defined in the binding.              |

The context of the call for these bindings will include the user ID, the channel ID, and the team ID.

### `/command` bindings

For commands we can distinguish between leaf commands (executable subcommand) and partial commands.

A partial command must include:

| Name          | Type     | Description                                                                                                               |
| :------------ | :------- | :------------------------------------------------------------------------------------------------------------------------ |
| `location`    | string   | Name of this location. The whole path of locations will be added in the context. Must be unique in its level.             |
| `label`       | string   | The label to use to define the command. Cannot include spaces or tabs. Defaults to location. Must be unique in its level. |
| `hint`        | string   | (Optional) Hint line on command autocomplete.                                                                             |
| `description` | string   | (Optional) Description line on command autocomplete.                                                                      |
| `bindings`    | Bindings | List of subcommands.                                                                                                      |
| `call`        | Call     | (Optional) Call to be inherited by all its subcommands.                                                                   |
| `form`        | Form     | (Optional) Form to be inherited by all its subcommands.                                                                   |

A leaf command must include:

| Name          | Type   | Description                                                                                                                                  |
| :------------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`    | string | Name of this location. The whole path of locations will be added in the context. Must be unique in its level.                                   |
| `label`       | string | The label to use to define the command. Cannot include spaces or tabs. Defaults to location. Must be unique in its level.                       |
| `hint`        | string | (Optional) Hint line on command autocomplete.                                                                                                   |
| `description` | string | (Optional) Description line on command autocomplete.                                                                                           |
| `call`        | Call   | (Optional) Call to perform when executing the command. You must provide a call if there is no form, or the form itself does not have a call. |                                                                                                    |
| `form`        | Form   | (Optional) Form representing the parameters the command can receive. If no form is provided, a form call will be made to the specified call. |

The context of the call for these bindings will include the user ID, the post ID, the root post ID (if any), the channel ID, and the team ID. It will also include the raw command.

## Example data flow

<details><summary>Client Bindings Request</summary>

`GET /plugins/com.mattermost.apps/api/v1/bindings?user_id=ws4o4macctyn5ko8uhkkxmgfur&channel_id=qphz13bzbf8c7j778tdnaw3huc&scope=webapp`

</details>

<details><summary>Mattermost Bindings Request</summary>

`POST /plugins/com.mattermost.apps/example/hello/bindings`

```json
{
    "path": "/bindings",
    "context": {
        "app_id": "helloworld",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    }
}
```
</details>

<details><summary>App Binding Response</summary>

```json
{
    "type": "ok",
    "data": [
        {
            "location": "/channel_header",
            "bindings": [
                {
                    "location": "send-button",
                    "icon": "icon.png",
                    "label": "send hello message",
                    "call": {
                        "path": "/send-modal"
                    }
                }
            ]
        },
        {
            "location": "/post_menu",
            "bindings": [
                {
                    "location": "send-button",
                    "icon": "icon.png",
                    "label": "send hello message",
                    "call": {
                        "path": "/send",
                        "expand": {
                            "post": "all"
                        }
                    }
                }
            ]
        },
        {
            "location": "/command",
            "bindings": [
                {
                    "icon": "icon.png",
                    "description": "Hello World app",
                    "hint": "[send]",
                    "bindings": [
                        {
                            "location": "send",
                            "label": "send",
                            "call": {
                                "path": "/send-modal"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```
</details>
