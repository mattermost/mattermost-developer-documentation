---
title: "Bindings"
heading: "Bindings"
description: "TODO"
weight: 400
---

Bindings
([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding))
tell the Mattermost Client what UI elements to display for the app, and what to
do if the "feature" is interacted with. To display anything in the Client the
app needs to handle the bindings call. When it is invoked, your app needs to
provide the list of bindings available according to the context
([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context)).
Some fields included in the context:

- Your app's bot user access token
- The Mattermost Site URL
- The ID of the user requesting the bindings (acting user ID)
- The ID of the team the user is currently focused on
- The ID of the channel the user is currently focused on
- The ID of the post the user is currently focused on (if applicable)

**Note:** Bindings are fetched (and refreshed) on every channel switch. When the user moves to a different context (like opening a thread, or a post in a search view) new bindings may be fetched to provide the correct bindings for the thread/post context. Bindings are also fetched when an OAuth2 process is completed and when the application gets installed.

The expected response should include the following:

| Name   | Type | Description           |
| :----- | :-------- | :-------------------- |
| `type` | string    | "ok" |
| `data` | []Binding | The list of (top-level) bindings and their sub-bindings. |

### top-level bindings
Bindings are organized by top level locations. Top level bindings just need to define:

| Name       | Type     | Description                             |
| :--------- | :------- | :-------------------------------------- |
| `location` | string   | A pre-defined top level location, e.g. `/command`. |
| `bindings` | []Binding | A list of bindings for this location. |

<!-- TODO: how to customise top-level /-command -->

**NOTE**: `/in_post` bindings should not be included in the bindings response.


### all bindings (common attributes)

Each Binding consists of:

| Name   | Type | Description           |
| :----- | :------- | :-------------------- |
| `Location` | string | (Optional) Location allows the App to identify where in the UX the Call request comes from. defaults to the App ID. Location defaults to Label, one of them must be provided. |
| `Label` | string | (Optional) Label is the (usually short) primary text to display at the location. For command autocomplete, Label defaults to Location, one of them must be provided. |
| `Description` | string | (Optional) Description is the extended help text, used in post-embedded, modals and command autocomplete. |
| `Hint` | string | (Optional) Hint is the secondary text to display, used in command autocomplete and channel header. |
| `Icon` | string | (Optional) Icon is the icon to display, should be either a fully-qualified URL, or a path for an app's static asset. |

Each binding must include one of the following:

| Name   | Type | Description           |
| :----- | :------- | :-------------------- |
| `submit` | Call |  The call to perform immediately if the Binding is invoked by the user. |
| `form` | Form | The (modal) form to open to gather more info, or to confirm submission.  |
| `bindings` | Bindings | Sub-bindings, used for sub-commands and sub-menus. |
<!-- TODO: "open_as" -->

### `/post_menu` bindings

| Name       | Type   | Description                                                                                                       |
| :--------- | :----- | :---------------------------------------------------------------------------------------------------------------- |
| `label`    | string | (Optional) Label is used as the text to show in the post menu. |

The call for these bindings will include in the context the user ID, the post ID, the root post ID if any, the channel ID, and the team ID.

### `/channel_header` bindings

| Name       | Type   | Description                                                                                                                 |
| :--------- | :----- | :-------------------------------------------------------------------------------------------------------------------------- |
| `label`    | string | (Optional) Text to show in the item on mobile and webapp collapsed view. |
| `hint`     | string | (required for Web App) Text to show in tooltip. |

The context of the call for these bindings will include the user ID, the channel ID, and the team ID.

### `/command` bindings

For commands we can distinguish between leaf commands (executable subcommand) and partial commands.

A partial command must include:

| Name | Type | Description |
| :---- | :------- | :---- |
| `label`       | string   | (Optional) The label to use to define the command. Cannot include spaces or tabs. Defaults to location. Must be unique in its level. |
| `hint`        | string   | (Optional) Hint line on command autocomplete.                                                                             |
| `description` | string   | (Optional) Description line on command autocomplete.                                                                      |
| `bindings`    | Bindings | List of subcommands.                                                                                                      |

A leaf command must include either `submit` or a `form`, and may include the following fields:

| Name          | Type   | Description |
| :------------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | string   | (Optional) The label to use to define the command. Cannot include spaces or tabs. Defaults to location. Must be unique in its parent location. |
| `hint`        | string   | (Optional) Hint line on command autocomplete.                                                                             |
| `description` | string   | (Optional) Description line on command autocomplete.                                                                                         |

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
                    "form": {
                        "--form--": "--definition--"
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
                    "submit": {
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
                            "submit": {
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
