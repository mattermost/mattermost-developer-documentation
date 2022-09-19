---
title: "Bindings"
heading: "Bindings"
weight: 30
aliases:
  - /integrate/apps/api/bindings/
---
Bindings ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding">}}) establish the relationship between [call]({{<ref "/integrate/apps/structure/call">}}) handlers and [locations]({{<ref "/integrate/apps/structure/manifest#locations">}}).
Whenever the bindings call is executed the App provides a list of bindings based on the [request context]({{<ref "/integrate/apps/structure/call#context">}}).

Bindings are refreshed when the App is installed, on every channel switch, and when an OAuth2 process has completed. Bindings may also be refreshed when the user moves to a different context, such as opening a thread or a post in a search view.


## Top level bindings

Bindings are organized by top level [locations]({{<ref "/integrate/apps/structure/manifest#locations">}}). The data structure of a top level binding is:

| Name       | Type                                                                                                                             | Description                             |
|:-----------|:---------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------|
| `location` | {{<newtabref title="Location" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Location">}} (`string`) | Top level location.                     |
| `bindings` | {{<newtabref title="Binding" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding">}} (list)       | A list of bindings under this location. |

{{<note "Note:">}}
Bindings for `/in_post` locations should not be included in the response to the bindings call.
{{</note>}}

## Sub-location bindings

Sub-location bindings use the following data structure:

| Name                                               | Type                                                                                                                       | Description                                                                                                           | Locations                                         |
|----------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|---------------------------------------------------|
| `location`                                         | string                                                                                                                     | The name of the binding location. Values must be unique within each top level binding.                                | all locations                                     |
| `icon`                                             | string                                                                                                                     | The App icon to display, either a fully-qualified URL or a path to an App static asset. Required for web app support. | `/channel_header`<br/>`/post_menu`                |
| `label`                                            | string                                                                                                                     | The primary text to display at the binding location; defaults to the value of the `location` field.                   | all locations                                     |
| `hint`                                             | string                                                                                                                     | Secondary text to display at the binding location                                                                     | `/channel_header`<br/>`/command`                  |
| `description`                                      | string                                                                                                                     | Extended help text used in modal forms and command autocomplete                                                       | `/command`                                        |
| `submit` {{<compass-icon icon-radiobox-marked>}}   | Call                                                                                                                       | Executes an action associated with the binding                                                                        | all locations                                     |
| `form` {{<compass-icon icon-radiobox-marked>}}     | Form                                                                                                                       | The modal form to display                                                                                             | `/channel_header`<br/>`/command`<br/>`/post_menu` |
| `bindings` {{<compass-icon icon-radiobox-marked>}} | {{<newtabref title="Binding" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding">}} (list) | Additional sub-location bindings                                                                                      | all locations                                     |

{{<note "Note" icon-radiobox-marked>}}
Only one of the `submit`, `form`, and `bindings` fields can be specified in a sub-location binding. Specifying more than one is treated as an error.
{{</note>}}

## Call context data

The following request context fields will be available to calls invoked at each binding location:

| Location          | Context fields                                                            |
|-------------------|---------------------------------------------------------------------------|
| `/channel_header` | `user_id`<br/>`channel_id`<br/>`team_id`                                  |
| `/command`        | `user_id`<br/>`root_post_id`<br/>`channel_id`<br/>`team_id`               |
| `/post_menu`      | `user_id`<br/>`post_id`<br/>`root_post_id`<br/>`channel_id`<br/>`team_id` |
| `/in_post`        | _TBD_                                                                     |

### `/command` bindings

For commands we can distinguish between leaf commands (executable subcommand) and partial commands.

A partial command must include:

| Name          | Type     | Description                                                                                                               |
|:--------------|:---------|:--------------------------------------------------------------------------------------------------------------------------|
| `location`    | string   | Name of this location. The whole path of locations will be added in the context. Must be unique in its level.             |
| `label`       | string   | The label to use to define the command. Cannot include spaces or tabs. Defaults to location. Must be unique in its level. |
| `hint`        | string   | (Optional) Hint line on command autocomplete.                                                                             |
| `description` | string   | (Optional) Description line on command autocomplete.                                                                      |
| `bindings`    | Bindings | List of subcommands.                                                                                                      |
| `call`        | Call     | (Optional) Call to be inherited by all its subcommands.                                                                   |
| `form`        | Form     | (Optional) Form to be inherited by all its subcommands.                                                                   |

A leaf command must include:

| Name          | Type   | Description                                                                                                                                  |
|:--------------|:-------|:---------------------------------------------------------------------------------------------------------------------------------------------|
| `location`    | string | Name of this location. The whole path of locations will be added in the context. Must be unique in its level.                                |
| `label`       | string | The label to use to define the command. Cannot include spaces or tabs. Defaults to location. Must be unique in its level.                    |
| `hint`        | string | (Optional) Hint line on command autocomplete.                                                                                                |
| `description` | string | (Optional) Description line on command autocomplete.                                                                                         |
| `call`        | Call   | (Optional) Call to perform when executing the command. You must provide a call if there is no form, or the form itself does not have a call. |
| `form`        | Form   | (Optional) Form representing the parameters the command can receive. If no form is provided, a form call will be made to the specified call. |

The context of the call for these bindings will include the user ID, the post ID, the root post ID (if any), the channel ID, and the team ID. It will also include the raw command.

## Bindings call response

The response to the bindings call should take the form of an `ok` [call response]({{<ref "/integrate/apps/structure/call#response">}}) where the `data` field contains the bindings.

For example:
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
					"label":"send hello message",
					"call": {
						"path": "/send-modal"
					}
				}
			]
		},
		{
			"location": "/command",
			"bindings": [
				{
					"icon": "icon.png",
					"label": "helloworld",
					"description": "Hello World app",
					"hint": "[send]",
					"bindings": [
						{
							"location": "send",
							"label": "send",
							"call": {
								"path": "/send"
							}
						}
					]
				}
			]
		}
	]
}
```

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
