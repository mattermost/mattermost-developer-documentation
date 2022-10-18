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

| Name                                                   | Type                     | Description                                                                                     |
|:-------------------------------------------------------|:-------------------------|:------------------------------------------------------------------------------------------------|
| `title`{{<compass-icon icon-star "Mandatory Value">}}  | string                   | Title of the form, shown in modal dialogs.                                                      |
| `call`{{<compass-icon icon-star "Mandatory Value">}}   | [Call]({{<ref "call">}}) | Call to perform for this form.                                                                  |
| `fields`{{<compass-icon icon-star "Mandatory Value">}} | [Fields](#fields)        | List of fields in the form.                                                                     |
| `header`                                               | string                   | Text used as introduction in modal dialogs.                                                     |
| `footer`                                               | string                   | Text used at the end of modal dialogs.                                                          |
| `icon`                                                 | string                   | Either a fully-qualified URL, or a path for an app's [static asset]({{<ref "static-assets">}}). |
| `submit_buttons`                                       | string                   | Key of the field to be used as the submit buttons. Must be of type `static_select`.             |

{{<note "Mandatory values">}}
Fields with mandatory values are marked by a {{<compass-icon icon-star "Mandatory Value">}}.
{{</note>}}

### Fields

The structure of a form field ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field">}}) is defined in the following table:

| Name                                                 | Type                               | Description                                                                   |
|:-----------------------------------------------------|:-----------------------------------|:------------------------------------------------------------------------------|
| `name`{{<compass-icon icon-star "Mandatory Value">}} | string                             | Key to use in the values field of the call. Cannot include spaces or tabs.    |
| `type`{{<compass-icon icon-star "Mandatory Value">}} | [FieldType](#field-types) (string) | The type of the field.                                                        |
| `is_required`                                        | bool                               | Whether the field has a mandatory value.                                      |
| `multiselect`                                        | bool                               | Whether a select field allows multiple values to be selected.                 |
| `value`                                              | _any_                              | The field's default value.                                                    |
| `description`                                        | string                             | Short description of the field, displayed beneath the field in modal dialogs. |
| `modal_label`                                        | string                             | Label of the field in modal dialogs. Defaults to `name` if not defined.       |

### Field types

The types of form fields are:

| Name                               | Description                                              |
|:-----------------------------------|:---------------------------------------------------------|
| [`text`](#text-fields)             | A plain text field.                                      |
| [`static_select`](#select-fields)  | A dropdown select with static elements.                  |
| [`dynamic_select`](#select-fields) | A dropdown select that loads the elements dynamically.   |
| `bool`                             | A boolean selector represented as a checkbox.            |
| `user`                             | A dropdown to select users.                              |
| `channel`                          | A dropdown to select channels.                           |
| [`markdown`](#markdown-fields)     | An arbitrary markdown text. Only visible on modal forms. |

#### Text fields

The following fields can be included for `text` fields:

| Name         | Type                                              | Description                                                      |
|:-------------|:--------------------------------------------------|:-----------------------------------------------------------------|
| `subtype`    | [TextFieldSubtype](#text-field-subtypes) (string) | The type of text field that will be shown.                       |
| `min_length` | int                                               | The minimum length of text for the input to be considered valid. |
| `max_length` | int                                               | The maximum length of text for the input to be considered valid. |

##### Text field subtypes

| Name       | Description |
|------------|-------------|
| `input`    |             |
| `textarea` |             |
| `email`    |             |
| `number`   |             |
| `password` |             |
| `tel`      |             |
| `url`      |             |

#### Select fields

Select fields have the following additional configuration:

| Name                                                    | Type                                   | Description                                                              |
|:--------------------------------------------------------|:---------------------------------------|:-------------------------------------------------------------------------|
| `options`{{<compass-icon icon-star "Mandatory Value">}} | [SelectOption](#static-select-options) | List of options for the dropdown.                                        |
| `refresh`                                               | bool                                   | Allows the form to be refreshed when the value of a dropdown is changed. |
| `multiselect`                                           | bool                                   | You can select more than one element in this field.                      |

##### Static select options

| Name                                                  | Type   | Description                                                               |
|:------------------------------------------------------|:-------|:--------------------------------------------------------------------------|
| `label`{{<compass-icon icon-star "Mandatory Value">}} | string | User-facing string. Defaults to `value` and must be unique on this field. |
| `value`{{<compass-icon icon-star "Mandatory Value">}} | string | Machine-facing value. Must be unique on this field.                       |

##### Dynamic select options

A form in a modal dialog performs a lookup [call]({{<ref "call">}}) to the call endpoint any time a dynamic dropdown option is selected. The lookup call will include the App, user, channel, and team IDs in the context. The values will be populated with the current values of the form. The expected response is error or the following:

| Name | Type    | Item                                   | Description                  |
|:-----|:--------|:---------------------------------------|:-----------------------------|
| data |         |                                        |                              |
| -    | `items` | [SelectOption](#static-select-options) | The list of options to show. |

If any select has the refresh value set as `true`, a form call to the call endpoint happens any time the select changes value. The form call will include in the context the app ID, the user ID, the channel ID, and the team ID. The values will be populated with the current values of the form. The expected response is a form response. The whole form will be updated with the new form.

On submit, the submit call to the call endpoint will be sent. The submit call will include in the context the app ID, the user ID, the channel ID, and the team ID. The values will be populated with the current values of the form.

#### Markdown fields

Markdown fields are a special field that allows you to better format your form. They will not generate any value in the form submission sent to the app. The content is defined in the field description.

## Slash command arguments

Slash command arguments are treated as forms. When a leaf command is typed, the arguments of the command are fetched. If the command binding has a form attached, those will be used. If not, a form call will be made to the command call. The call will include in the context the app ID, user ID, the post ID, the root post ID (if any), the channel ID, and the team ID. The call will expect a form response.

During autocomplete, the user can open the form as a Modal form to finish completing the command. Any fields not supported by commands (like markdown fields) or form attributes not visible in commands (like the title) will be shown when opened as a Modal form.

A command form is defined as:

| Name     | Type   | Description                                                                                                                    |
|:---------|:-------|:-------------------------------------------------------------------------------------------------------------------------------|
| `fields` | Fields | List of fields in the form.                                                                                                    |
| `call`   | Call   | (Optional) Call to perform on all actions form related (including submit). If not provided, will use the command binding call. |

The type of fields is the same as for Modal forms.

All fields include:

| Name          | Type      | Description                                                                                                                                                        |
|:--------------|:----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `name`        | string    | Key to use in the values field of the call, and as part of the command. Cannot include spaces nor tabs.                                                            |
| `type`        | FieldType | The type of the field.                                                                                                                                             |
| `is_required` | bool      | Whether the field needs to be filled.                                                                                                                              |
| `description` | string    | Text to show on the description line on autocomplete.                                                                                                              |
| `hint`        | string    | Text to show on the hint line on autocomplete.                                                                                                                     |
| `label`       | string    | Label to name the field in autocomplete. Defaults to `name`. Must be unique.                                                                                       |
| `position`    | int       | (Optional) Positional argument (can be provided without a --flag). `If >0`, indicates the position this field is in. `If =-1`, it is considered the last argument. |

Options are defined as:

| Name        | Type   | Description                          |
|:------------|:-------|:-------------------------------------|
| `label`     | string | User-facing string.                  |
| `value`     | string | Machine-facing value.                |
| `icon_data` | string | URL to icon to show on autocomplete. |

All select also include:

| Name          | Type | Description                                                    |
|:--------------|:-----|:---------------------------------------------------------------|
| `multiselect` | bool | (Optional) You can select more than one element in this field. |

When the command is executed, a submit call will be performed on the call endpoint. The call will include in the context the app ID, user ID, the post ID, the root post ID if any, the channel ID, and the team ID.

## Embedded bindings

Posts can be embedded with bindings. These are used for asynchronous interaction with the user. In order to add an embedded binding you need to add an `app_bindings` property with a list of `EmbeddedBindings`. An `EmbeddedBinding` includes:

| Name       | Type    | Description                |
|:-----------|:--------|:---------------------------|
| `app_id`   | string  | The app ID.                |
| `title`    | string  | Title of the attachment.   |
| `text`     | string  | Text of the attachment.    |
| `bindings` | Binding | List of embedded bindings. |


Bindings are of two types, buttons or selects.

Buttons include:

| Name       | Type   | Description                                                                                                                                         |
|:-----------|:-------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
| `location` | string | Location name. The whole location path will be provided in the context.                                                                             |
| `label`    | string | Label that will show in the button. Defaults to location. Must be unique in its level.                                                              |
| `call`     | Call   | (Optional) Call to be made when the button is selected. You must provide a call if there is no form, or the form itself does not have a call.       |
| `form`     | Form   | (Optional) Form to open in a modal form when the button is clicked. You must provide a form with a call if there is no call defined in the binding. |

Selects include:

| Name       | Type    | Description                                                             |
|:-----------|:--------|:------------------------------------------------------------------------|
| `location` | string  | Location name. The whole location path will be provided in the context. |
| `label`    | string  | Label that will show in the button.                                     |
| `call`     | Call    | (Optional) Call to be made inherited by the options.                    |
| `form`     | Form    | (Optional) Form to be inherited by the options.                         |
| `bindings` | Binding | Options for the select.                                                 |

Options bindings include:

| Name       | Type   | Description                                                                                                                                          |
|:-----------|:-------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `location` | string | Option name. The whole location path will be provided in the context.                                                                                |
| `label`    | string | User-facing string. Defaults to location. Must be unique in its level.                                                                               |
| `call`     | Call   | (Optional) Call to perform when the option is selected. You must provide a call if there is no form, or the form itself does not have a call.        |
| `form`     | Form   | (Optional) Form to open in a modal form when the option is selected. You must provide a Form with a Call if there is no Call defined in the Binding. |

Whenever a button is clicked or a select field is selected, a submit call is performed to the corresponding call endpoint. The call will include in the context the app ID, user ID, the post ID, the root post ID if any, the channel ID and the team ID.

## Example data flows

### Click channel header

<details><summary>Client Submit Request</summary>

`POST /plugins/com.mattermost.apps/api/v1/call`
```json
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
</details>

<details><summary>MM Submit Request</summary>

`POST /plugins/com.mattermost.apps/example/hello/send-modal/submit`
```json
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
</details>

<details><summary>App Form Response</summary>

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
</details>


### Selected user in modal

`refresh: true` is used to tell the client to notify the server when a value is selected from this field

<details><summary>Client Form Request</summary>

`POST /plugins/com.mattermost.apps/api/v1/call`

```json
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
</details>

<details><summary>MM Form Request</summary>

`POST /plugins/com.mattermost.apps/hello/send/form`
```json
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
</details>

<details><summary>App Form Response</summary>

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
</details>


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

### Returning a main error and errors for specific fields (includes picture)

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
![modal-errors.png](error3.png)
</details>
