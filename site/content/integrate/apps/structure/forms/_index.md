---
title: Forms
heading: Forms
weight: 40
aliases:
  - /integrate/apps/api/interactivity/
  - /integrate/apps/interactivity/
---
Mattermost Apps use a single data structure for user input: the Form. A form gets input from a modal dialog or from slash command arguments.
Forms in a modal dialog open on the user interface as a result of a [call]({{<ref "call">}}) response.

## Data structure

The structure of a form ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form">}}) is defined in the following table:

| Name                                                   | Type                     | Description                                                                                                                                                   |
|:-------------------------------------------------------|:-------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `title`{{<compass-icon icon-star "Mandatory Value">}}  | string                   | Title of the form, shown in modal dialogs.                                                                                                                    |
| `submit`{{<compass-icon icon-star "Mandatory Value">}} | [Call]({{<ref "call">}}) | Call to perform when the form is submitted or the slash command is executed.                                                                                  |
| `fields`{{<compass-icon icon-star "Mandatory Value">}} | [Fields](#fields)        | List of fields in the form.                                                                                                                                   |
| `source`{{<compass-icon icon-star "Mandatory Value">}} | [Call]({{<ref "call">}}) | Call to perform when a form's fields are not defined or when the form needs to be refreshed.                                                                  |
| `header`                                               | string                   | Text used as introduction in modal dialogs.                                                                                                                   |
| `footer`                                               | string                   | Text used at the end of modal dialogs.                                                                                                                        |
| `icon`                                                 | string                   | Either a fully-qualified URL, or a path for an app's [static asset]({{<ref "static-assets">}}).                                                               |
| `submit_buttons`                                       | string                   | Name of the form field to be used as the list of submit buttons. Must be a `static_select` or `dynamic_select` field. Default value is a single button: `OK`. |

{{<note "Mandatory values">}}
- Fields with mandatory values are marked by a {{<compass-icon icon-star "Mandatory Value">}}.
- At least one of `fields` or `source` must be defined.
{{</note>}}

### Fields

The structure of a form field ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field">}}) is defined in the following table:

| Name                                                 | Type                                              | Description                                                                                                                                           |
|:-----------------------------------------------------|:--------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`{{<compass-icon icon-star "Mandatory Value">}} | string                                            | Key to use in the values field of the call. Cannot include spaces or tabs.                                                                            |
| `type`{{<compass-icon icon-star "Mandatory Value">}} | [FieldType](#field-types) (string)                | The type of the field.                                                                                                                                |
| `is_required`                                        | bool                                              | Whether the field has a mandatory value.                                                                                                              |
| `readonly`                                           | bool                                              | Whether a field's value is read-only.                                                                                                                 |
| `value`                                              | _any_                                             | The field's default value.                                                                                                                            |
| `description`                                        | string                                            | Short description of the field, displayed beneath the field in modal dialogs.                                                                         |
| `label`                                              | string                                            | The label of the flag parameter; used with autocomplete. Ignored for positional parameters.                                                           |
| `hint`                                               | string                                            | The hint text for the field; used with autocomplete.                                                                                                  |
| `position`                                           | int                                               | The index of the positional argument. A value greater than zero indicates the position this field is in. A value of `-1` indicates the last argument. |
| `multiselect`                                        | bool                                              | Whether a select field allows multiple values to be selected.                                                                                         |
| `modal_label`                                        | string                                            | Label of the field in modal dialogs. Defaults to `label` if not defined.                                                                              |
| `refresh`                                            | bool                                              | Allows the form to be refreshed when the value of the field has changed.                                                                              |
| `options`                                            | [SelectOption](#select-options)                   | A list of options for static select fields.                                                                                                           |
| `lookup`                                             | [Call]({{<ref "call">}})                          | A call that returns a list of options for dynamic select fields.                                                                                      |
| `subtype`                                            | [TextFieldSubtype](#text-field-subtypes) (string) | The subtype of `text` field that will be shown.                                                                                                       |
| `min_length`                                         | int                                               | The minimum length of `text` field input.                                                                                                             |
| `max_length`                                         | int                                               | The maximum length of `text` field input.                                                                                                             |

### Field types

The types of form fields are:

| Name                      | Description                                                           |
|:--------------------------|:----------------------------------------------------------------------|
| `text`                    | A plain text field.                                                   |
| `static_select`           | A dropdown select with static elements.                               |
| `dynamic_select`          | A dropdown select that loads the elements dynamically.                |
| `bool`                    | A boolean selector represented as a checkbox.                         |
| `user`                    | A dropdown to select users.                                           |
| `channel`                 | A dropdown to select channels.                                        |
| `markdown`                | An arbitrary markdown text; only visible in modal dialogs. Read-only. |

#### Text fields

##### Text field subtypes

The `text` field subtypes, except `textarea`, map to the types of the HTML `input` form element. The available subtypes are listed in the following table:

| Subtype Name                                                                                                     | Description                                                      |
|------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| {{<newtabref title="input" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/text">}}        | A single-line text input field.                                  |
| {{<newtabref title="textarea" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea">}}       | A multi-line text input field; uses the HTML `textarea` element. |
| {{<newtabref title="email" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email">}}       | A field for editing an email address.                            |
| {{<newtabref title="number" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number">}}     | A field for entering a number; includes a spinner component.     |
| {{<newtabref title="password" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/password">}} | A single-line text input field whose value is obscured.          |
| {{<newtabref title="tel" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/tel">}}           | A field for entering a telephone number.                         |
| {{<newtabref title="url" href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/url">}}           | A field for entering a URL.                                      |

#### Select fields

##### Select options

The data structure of an option (`SelectOption`) in a select field is defined by the following table:

| Name                                                  | Type   | Description                                                               |
|:------------------------------------------------------|:-------|:--------------------------------------------------------------------------|
| `label`{{<compass-icon icon-star "Mandatory Value">}} | string | User-facing string. Defaults to `value` and must be unique on this field. |
| `value`{{<compass-icon icon-star "Mandatory Value">}} | string | Machine-facing value. Must be unique on this field.                       |
| `icon_data`                                           | string | URL to icon to show on autocomplete.                                      |

##### Dynamic select options

A dynamic select field gets its options by performing the `lookup` call. The [call request]({{<ref "call#request">}}) will include the App, user, channel, and team IDs in the context.
The [call response]({{<ref "call#response">}}) is expected to contain the list of select field options in the `items` key of the `data` map. Each option is of the type [SelectOption](#select-options).

Example `lookup` call response:

```json
{
    "type": "ok",
    "data": {
        "items": [
            {
                "label": "Option One",
                "value": "option_1"
            },
            {
                "label": "Option Two",
                "value": "option_2"
            }
        ]
    }
}
```

##### Select field refresh

If the `refresh` value is set to `true`, the [xxxxx]() call is performed any time the field's value changes. The call request will include the App, user, channel, and team IDs in the context; the current values of the form are also included.
The call response is expected to contain a full, updated form definition.

#### Markdown fields

Markdown fields are a special field that allows you to better format your form. They will not generate any value in the form submission sent to the App. The content is defined in the `description` property of the field.

### Form submission

When the form is submitted, either by executing a slash command or clicking a submit button, the form's `submit` call will be performed.
The call request will include the App, user, channel, and team IDs in the context; the current values of the form are also included.

## Slash command arguments

Slash command arguments and flags are defined by form fields. When a slash command is typed, the command arguments are retrieved from the command's form.
If a form was not included with the command binding, the binding's call will be invoked to provide a form response.
The call request will include the App, user, post, root post (if any), channel, and team IDs in the context.

{{<collapse id="slash-command-flags-example" title="Example form with flag arguments">}}
```json
{
    "location": "sub",
    "label": "sub",
    "description": "Subscribe to an event",
    "form": {
        "fields": [
            {
                "name": "eventname",
                "label": "event-name",
                "type": "text",
                "subtype": "input",
                "description": "The name of the event to subscribe to",
                "is_required": true
            },
            {
                "name": "teamid",
                "label": "team-id",
                "type": "text",
                "subtype": "input",
                "description": "The ID of the team"
            },
            {
                "name": "channelid",
                "label": "channel-id",
                "type": "text",
                "subtype": "input",
                "description": "The ID of the channel"
            }
        ]
    }
}
```
{{</collapse>}}
{{<collapse id="slash-command-positional-example" title="Example form with positional arguments">}}
```json
{
    "location": "sub",
    "label": "sub",
    "description": "Subscribe to an event",
    "form": {
        "fields": [
            {
                "name": "eventname",
                "label": "event-name",
                "type": "text",
                "subtype": "input",
                "description": "The name of the event to subscribe to",
                "is_required": true,
                "position": 1
            },
            {
                "name": "teamid",
                "label": "team-id",
                "type": "text",
                "subtype": "input",
                "description": "The ID of the team",
                "position": 2
            },
            {
                "name": "channelid",
                "label": "channel-id",
                "type": "text",
                "subtype": "input",
                "description": "The ID of the channel",
                "position": 3
            }
        ]
    }
}
```
{{</collapse>}}

During [autocomplete]({{<ref "/integrate/slash-commands">}}), the user can open the form in a modal dialog to finish entering command arguments.
Any fields not supported by commands, such as markdown fields, or form attributes not visible in commands, such as the title, will be shown when the form is opened as a modal dialog.

![Screenshot of slash command autocomplete](slash-command-autocomplete.png)

![Screenshot of autocomplete modal dialog](slash-command-autocomplete-modal-dialog.png)

When the slash command is executed, the form's `submit` call will be performed. The call request will include the App, user, post, root post (if any), channel, and team IDs in the context.

## End-to-end examples

### Click channel header

{{<collapse id="click_channel_header-client_submit_request" title="Client submit request">}}
```http request
POST /plugins/com.mattermost.apps/api/v1/call HTTP/1.1
Content-Type: application/json

{
    "path": "/send-modal/submit",
    "context": {
        "app_id": "helloworld",
        "location": "send-button",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "user_agent": "webapp"
    },
    "expand": {}
}
```
{{</collapse>}}
{{<collapse id="click_channel_header-mm_submit_request" title="MM submit request">}}
```http request
POST /plugins/com.mattermost.apps/example/hello/send-modal/submit HTTP/1.1
Content-Type: application/json

{
    "path": "/send-modal/submit",
    "expand": {},
    "context": {
        "app_id": "helloworld",
        "location": "send-button",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "sqo3nwt377ys3co78jzye3cwmw"
    }
}
```
{{</collapse>}}
{{<collapse id="click_channel_header-app_form_response" title="App form response">}}
```json
{
    "type": "form",
    "form": {
        "title": "Hello, world!",
        "icon": "icon.png",
        "fields": [
            {
                "type": "text",
                "name": "message",
                "label": "message"
            },
            {
                "type": "user",
                "name": "user",
                "label": "user",
                "refresh": true
            },
            {
                "type": "dynamic_select",
                "name": "lookup",
                "label": "lookup"
            }
        ],
        "call": {
            "path": "/send"
        }
    }
}
```
{{</collapse>}}

### Selected user in modal

{{<collapse id="selected_user_modal-client_form_request" title="Client form request">}}
```http request
POST /plugins/com.mattermost.apps/api/v1/call HTTP/1.1
Content-Type: application/json

{
    "path": "/send/form",
    "expand": {},
    "values": {
        "message": "This is great!",
        "user": {
            "label": "mickmister",
            "value": "81bqom3kjjbo7bcjcnzs6dc8uh"
        }
    },
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "f45uwdqsejdnzjtyy19ysqr44w",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    },
    "raw_command": "/helloworld send",
    "selected_field": "user"
}
```
{{</collapse>}}
{{<collapse id="selected_user_modal-mm_form_request" title="MM form request">}}
```http request
POST /plugins/com.mattermost.apps/hello/send/form HTTP/1.1
Content-Type: application/json

{
    "path": "/send/form",
    "expand": {},
    "values": {
        "message": "This is great!",
        "user": {
            "label": "mickmister",
            "value": "81bqom3kjjbo7bcjcnzs6dc8uh"
        }
    },
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "f45uwdqsejdnzjtyy19ysqr44w",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    },
    "raw_command": "/helloworld send",
    "selected_field": "user"
}
```
{{</collapse>}}
{{<collapse id="selected_user_modal-app_form_response" title="App form response">}}
```json
{
    "type": "form",
    "form": {
        "title": "Hello, world!",
        "icon": "icon.png",
        "fields": [
            {
				"type": "text",
				"name": "message",
				"label": "message"
			},
			{
				"type": "user",
				"name": "user",
				"label": "user",
				"refresh": true
			},
			{
				"type": "dynamic_select",
				"name": "lookup",
				"label": "lookup"
			}
        ],
        "call": {
            "path": "/send"
        }
    }
}
```
{{<note>}}
`"refresh": true` is used to tell the client to notify the server when a value is selected from this field
{{</note>}}
{{</collapse>}}

## Dynamic lookup

<details><summary>Client Lookup Request</summary>

`POST /plugins/com.mattermost.apps/api/v1/call`
```json
{
    "path": "/send/lookup",
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "root_id": "",
        "channel_id": "f45uwdqsejdnzjtyy19ysqr44w",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "user_agent": "webapp"
    },
    "values": {
        "message": null,
        "user": null,
        "lookup": {
            "icon_data": "",
            "label": "Option 1",
            "value": "option1"
        }
    },
    "expand": {},
    "raw_command": "/helloworld send",
    "query": "o",
    "selected_field": "lookup"
}
```
</details>

<details><summary>MM Lookup Request</summary>

`POST /plugins/com.mattermost.apps/example/hello/send/lookup`
```json
{
    "path": "/send/lookup",
    "expand": {},
    "values": {
        "lookup": {
            "icon_data": "",
            "label": "Option 1",
            "value": "option1"
        },
        "message": null,
        "user": null
    },
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "f45uwdqsejdnzjtyy19ysqr44w",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    },
    "raw_command": "/helloworld send",
    "selected_field": "lookup",
    "query": "o"
}
```
</details>

<details><summary>App Lookup Response</summary>

```json
{
    "type": "ok",
    "data": {
        "items": [
            {
                "label": "Option 1",
                "value": "option1",
                "icon_data": ""
            },
            {
                "label": "Option 2",
                "value": "option2",
                "icon_data": ""
            }
        ]
    }
}
```
</details>

### Submitted modal

<details><summary>Client Submit Request</summary>

`POST /plugins/com.mattermost.apps/api/v1/call`
```json
{
    "path": "/send/submit",
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "root_id": "",
        "channel_id": "qxb1zg7eqjn1ixwuwhwtgmt55o",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "user_agent": "webapp"
    },
    "values": {
        "message": "the message",
        "user": {
            "label": "mickmister",
            "value": "81bqom3kjjbo7bcjcnzs6dc8uh"
        },
        "lookup": {
            "icon_data": "",
            "label": "Option 1",
            "value": "option1"
        }
    },
    "expand": {},
    "raw_command": "/helloworld send"
}
```
</details>

<details><summary>MM Submit Request</summary>

`POST /plugins/com.mattermost.apps/example/hello/send/submit`
```json
{
    "path": "/send/submit",
    "expand": {},
    "values": {
        "lookup": {
            "icon_data": "",
            "label": "Option 1",
            "value": "option1"
        },
        "message": "the message",
        "user": {
            "label": "mickmister",
            "value": "81bqom3kjjbo7bcjcnzs6dc8uh"
        }
    },
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "qxb1zg7eqjn1ixwuwhwtgmt55o",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    },
    "raw_command": "/helloworld send"
}
```
</details>

<details><summary>App Submit Response</summary>

```json
{
    "type":"ok",
    "markdown":"Sent survey to mickmister."
}
```
</details>


### Returning a single error

<details><summary>Main Error Response</summary>

```json
{
    "type":"error",
    "error":"This is the error."
}
```
</details>

### Returning errors for specific fields

<details><summary>Field-specific Error Response</summary>

```json
{
    "type":"error",
    "data": {
        "errors":{
            "somefield": "This field seems to have an invalid value."
        }
    }
}
```
</details>

### Returning a main error and errors for specific fields

<details><summary>Main Error and Field-specific Error Response</summary>

```json
{
    "type":"error",
    "error":"This is the error.",
    "data": {
        "errors":{
            "somefield": "This field seems to have an invalid value."
        }
    }
}
```
</details>
