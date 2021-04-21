---
title: "Apps Developer Guide"
heading: "Guide to Apps"
description: "An overview of Apps."
section: "apps"
weight: 20
---

## What are Apps?

Apps are applications external to Mattermost that can add new functionality to your Mattermost instance. 

External apps can:

- Reside in the same server as your Mattermost instance as they are outside of the Mattermost environment, but they can share the same machine.
- Use lambda functions however you would have to do all the provisioning, since they will not be tightly coupled with Mattermost.
- Be written in any language you want. Keep in mind that [AWS Lambda has some language limitations](https://aws.amazon.com/lambda/faqs/).

There are two types of apps:

- **AWS Lambda:** These are tightly coupled with Mattermost, and can be directly provisioned and managed from within Mattermost.
- **External apps:** These are hosted outside of Mattermost the Mattermost environment.

They both behave as HTTP servers, and Mattermost will reach several endpoints to get the needed information.

## Basics

### Manifest
All apps should define a manifest as a JSON file. The manifest location must be “ROOTURL/manifest”. The fields of the manifest are:

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

TODO: Manifest example

### Permissions

These are all the permissions an app can ask for:

| Field name                         | Field type                                         |
| :--------------------------------- | :------------------------------------------------- |
| `user_joined_channel_notification` | Be notified when users join channels               |
| `add_grants`                       | Add more grants (WITHOUT ADDITIONAL ADMIN CONSENT) |
| `act_as_user`                      | Use Mattermost REST API as connected users         |
| `act_as_bot`                       | Use Mattermost REST API as the app's bot user      |

### Locations

Locations are spaces in the UI where the app can add interactions.

| Field name        | Field type                                                                   |
| :---------------- | :--------------------------------------------------------------------------- |
| `/post_menu`      | An item in the post menu.                                                    |
| `/channel_header` | Webapp: A button in the channel header, Mobile: An item in the channel menu. |
| `/command`        | A slash command                                                              |
| `/in_post`        | Attachment embedded to a post.                                               |

### Call

A call is the definition of an action. The values are:

| Field name | Field type | Function                                                                                                  |
| :--------- | :--------- | :-------------------------------------------------------------------------------------------------------- |
| `url`      | string     | The app endpoint to call. Mattermost will call ROOTURL/url.                                               |
| `values`   | Object     | A set of elements to be interpreted by the app. Forms and slash commands will also populate these values. |
| `expand`   | Expand     | A definition of the information to expand to send to the app.                                             |

### Expand

To avoid extra communication between the app and Mattermost, you can include expansions in the calls. Expansions will send in the call request the whole information of the required fields. You can expand each value to the following leves: “none”, “all” or “summary”.

TODO: Define differences between all and summary

The possible expansions are:

| Field name                 | Field type                           |
| :------------------------- | :----------------------------------- |
| `app`                      | Expands the app information.         |
| `acting_user`              | Expands the Acting User information. |
| `acting_user_access_token` | A slash command                      |
| `admin_access_token`       | Include the admin access token.      |
| `channel`                  | Expands the channel information.     |
| `post`                     | Expands the post information.        |
| `root_post`                | Expands the root post information.   |
| `team`                     | Expands the team information.        |


## Call handling

### Call Request

When a call is performed, a POST request will be made to the endpoint defined in the call. The call will include a “Mattermost-App-Authorization” header, with a jwtToken. Along the default claims, it will also send the Acting User ID.

The call request will include:

| type                    | CallType    | The type of call being made.                                                               |
| :---------------------- | :---------- | :----------------------------------------------------------------------------------------- |
| `values`                | Object      | The pairs of key values present in the call. Can be populated by forms and slash commands. |
| `context`               | Context     | The context of the call.                                                                   |
| `raw_command`           | string      | The unparsed command for slash commands.                                                   |
| `description`           | string      | The description for your app. Used in the marketplace.                                     |
| `homepage_url`          | string      | The app homepage. Used in the marketplace and for OAuth purposes.                          |
| `root_url`              | string      | Base url to send all calls. Only needed for http apps.                                     |
| `requested_permissions` | Permissions | All the permissions needed by the app.                                                     |

The call type can be:

| type     | CallType                             |
| :------- | :----------------------------------- |
|          | Submit. (Empty string)               |
| `form`   | Request for a form.                  |
| `lookup` | Lookup for dynamic selects in forms. |

### Call Context

Depending on the location and expansions, calls will have different context. These are all the possible context values.

| type                       | CallType | The type of call being made.                                                        |
| :------------------------- | :------- | :---------------------------------------------------------------------------------- |
| `app_id`                   | string   | The app id                                                                          |
| `location`                 | Location | The location from which the call was performed.                                     |
| `subject`                  | Subject  | Event subject.                                                                      |
| `bot_user_id`              | string   | Bot user id                                                                         |
| `acting_user_id`           | string   | Id from the user performing the call                                                |
| `team_id`                  | string   | Id from the team from within the call was performed.                                |
| `channel_id`               | string   | Id from the channel from within the call was performed.                             |
| `post_id`                  | string   | root_post_id                                                                        |
| `root_post_id`             | string   | If the call was performed from a post in a thread, the root post id of that thread. |
| `mattermost_site_url`      | string   | Mattermost base URL                                                                 |
| `bot_access_token`         | string   | (Expansion)                                                                         |
| `acting_user`              | User     | (Expansion)                                                                         |
| `acting_user_access_token` | string   | (Expansion)                                                                         |
| `admin_access_token`       | string   | (Expansion)                                                                         |
| `app`                      | App      | (Expansion)                                                                         |
| `channel`                  | Channel  | (Expansion)                                                                         |
| `post`                     | Post     | (Expansion)                                                                         |
| `root_post`                | Post     | (Expansion)                                                                         |
| `team`                     | Team     | (Expansion)                                                                         |

### Call Response

There are several types of responses:

| type       | CallType                           |
| :--------- | :--------------------------------- |
|            | OK. (Empty string)                 |
| `error`    | An error has occurred.             |
| `form`     | Should open a form.                |
| `call`     | Should perform another call.       |
| `navigate` | Should navigate the user to a url. |

#### OK response

| type       | Response       |
| :--------- | :------------- |
| `type`     | (Empty string) |                                                                              |
| `markdown` | string         | (Optional) Markdown text that will be sent to the user as an ephemeral post. |

#### Error response

| type    | Error  |
| :------ | :----- |
| `type`  | error  |                                                                   |
| `error` | string | Markdown text that will be sent to the user as an ephemeral post. |

#### Form response

| type    | form |
| :------ | :--- |
| `type`  | form |               |
| `error` | form | Form to open. |

#### Navigate response

| type              | navigate |
| :---------------- | :------- |
| `type`            | navigate |                     |
| `navigate_to_url` | string   | URL to navigate to. |

## Special calls

### Install

When the app is installed, a special call is made to inform the app that it has been installed on the instance. This call is used mainly to initialize any needed information. If the app asks for Permissions to act as an user, the call will include among the values, the OAuth2 client secret, under the value “oauth2_client_secret”. The context will include the acting user ID, the app ID, the team ID, and the app and Admin access token expanded by default.

The expected responses are either OK or Error responses.

## Bindings

Bindings are what establish the relationship between locations and calls. Whenever it is called, you have to provide the list of bindings available according to the context. The context for the bindings call includes the app id, bot access token, team id, channel id, acting user id and mattermost site url. By default it does not expand any value.

The expected response should include the following:

|        |          |                      |
| :----- | :------- | :------------------- |
| `data` | bindings | The list of bindings |

Bindings are organized by top level locations. Top level bindings just need to define:

|            |          |                                         |
| :--------- | :------- | :-------------------------------------- |
| `location` | string   | Top level location                      |
| `bindings` | Bindings | A list of bindings under this location. |


`/in_post ` bindings do not need to be defined in this call.

### `/post_menu` bindings

|            |        |                                                                                 |
| :--------- | :----- | :------------------------------------------------------------------------------ |
| `location` | string | Name of this location. The whole path of locations will be added in the context |
| `icon`     | string | (Optional) Url to the icon                                                      |
| `label`    | string | Text to show in the item                                                        |
| `call`     | Call   | Call to perform                                                                 |

The call for these bindings will include in the context the user ID, the post ID, the root post ID if any, the channel ID and the team ID.
/channel_header bindings

|            |        |                                                                                  |
| :--------- | :----- | :------------------------------------------------------------------------------- |
| `location` | string | Name of this location. The whole path of locations will be added in the context. |
| `icon`     | string | (Optional) Url to the icon                                                       |
| `label`    | string | Text to show in the item on mobile and webapp collapsed view                     |
| `hint`     | string | Text to show in tooltip                                                          |
| `call`     | Call   | Call to perform.                                                                 |

The call for these bindings will include in the context the user ID, the channel ID and the team ID.


### `/command` bindings
For commands we can distinguish between leaf commands (executable subcommand) and partial commands.

A partial command must include:

|               |          |                                                      |
| :------------ | :------- | :--------------------------------------------------- |
| `location`    | string   | The label to use to define the command.              |
| `hint`        | string   | (Optional) Hint line on command autocomplete.        |
| `description` | string   | (Optional) Description line on command autocomplete. |
| `bindings`    | Bindings | List of subcommands.                                 |


A leaf command must include:

|               |        |                                                                                                                                              |
| :------------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `location`    | string | The label to use to define the command.                                                                                                      |
| `hint`        | string | (Optional) Hint line on command autocomplete.                                                                                                |
| `description` | string | (Optional) Description line on command autocomplete.                                                                                         |
| `call`        | Call   | Call to perform when executing the command                                                                                                   |
| `form`        | Form   | (Optional) Form representing the parameters the command can receive. If no form is provided, a form call will be made to the specified call. |

The call for these bindings will include in the context the user ID, the post ID, the root post ID if any, the channel ID and the team ID. It will also include the raw command.

## Interaction

### Modal Forms

Modal Forms open as a modal on the user interface as a result of a Form call response. They are defined by:

|                  |        |                                                                                              |
| :--------------- | :----- | :------------------------------------------------------------------------------------------- |
| `title`          | string | Title of the form, shown in the modal.                                                       |
| `header`         | string | (Optional) Text used as introduction in the form.                                            |
| `submit_buttons` | string | (Optional) Key of the field to be used as the submit buttons. Must be of type static_select. |
| `fields`         | Fields | List of fields in the form.                                                                  |
| `call`           | Call   | Call to perform for this form.                                                               |

The types of fields are:

|                  |                                                        |
| :--------------- | :----------------------------------------------------- |
| `text`           | Text field                                             |
| `static_select`  | A dropdown select with static elements.                |
| `dynamic_select` | A dropdown select that loads the elements dynamically. |
| `bool`           | A boolean selector represented as a checkbox.          |
| `user`           | A dropdown with to select users.                       |
| `channel`        | A dropdown to select channels.                         |

All fields include:

|               |           |                                                        |
| :------------ | :-------- | :----------------------------------------------------- |
| `name`        | string    | Key to use in the Values field of the call.            |
| `type`        | FieldType | The type of the field.                                 |
| `is_required` | bool      | (Optional) Whether the field needs to be filled.       |
| `value`       | value     | (Optional) Default value.                              |
| `description` | string    | (Optional) Text to show below the field describing it. |
| `modal_label` | string    | (Optional) Label to name the field in the modal.       |


Text fields may include:

|              |        |                                                                                                                                  |
| :----------- | :----- | :------------------------------------------------------------------------------------------------------------------------------- |
| `subtype`    | string | (Optional) The type of text that will be shown. Available types are one of text, textarea, email, number, password, tel, or url. |
| `min_length` | int    | (Optional) Validate the field length before performing the call.                                                                 |
| `max_length` | int    | (Optional) Validate the field length before performing the call.                                                                 |


Static select fields include:

|           |         |                           |
| :-------- | :------ | :------------------------ |
| `options` | Options | Options for the dropdown. |


Each Option includes:
|         |        |                       |
| :------ | :----- | :-------------------- |
| `label` | string | User facing string.   |
| `value` | string | Machine facing value. |


All select also include:

|           |      |                                                                                     |
| :-------- | :--- | :---------------------------------------------------------------------------------- |
| `refresh` | bool | (Optional) Allows the form to be refreshed when the value of a dropdown is changed. |


A modal form performs a lookup call to the call endpoint any time a dynamic dropdown is selected. The lookup call will include in the context the app id, the user id, the channel id, and the team id. The values will be populated with the current values of the form. The expected response is error or the following:

|      |         |         |                             |
| :--- | :------ | :------ | :-------------------------- |
| data |         |         |                             |
| -    | `items` | Options | The list of options to show |

If any select has the refresh value set as true, a form call to the call endpoint any time the select changes value. The form call will include in the context the app id, the user id, the channel id, and the team id. The values will be populated with the current values of the form. The expected response is a form response. The whole form will be updated with the new form.

On submit, the submit call to the call endpoint will be sent. The submit call will include in the context the app id, the user id, the channel id, and the team id. The values will be populated with the current values of the form.

## Commands as forms

Commands arguments are treated as forms. When a leaf command is typed, the arguments of the command are fetched. If the command binding has a Form attached, those will be used. If not, a form call will be made to the command call. The call will include in the context the app ID, user ID, the post ID, the root post ID if any, the channel ID and the team ID. The call will expect a form response.

A command form is defined as:
|          |        |                                                                                                                                |
| :------- | :----- | :----------------------------------------------------------------------------------------------------------------------------- |
| `fields` | Fields | List of fields in the form.                                                                                                    |
| `call`   | Call   | (Optional) Call to perform on all actions form related (including submit). If not provided, will use the command binding call. |

The type of fields is the same as for Modal forms.

All fields include:
|               |           |                                                                         |
| :------------ | :-------- | :---------------------------------------------------------------------- |
| `name`        | string    | Key to use in the Values field of the call, and as part of the command. |
| `type`        | FieldType | The type of the field.                                                  |
| `is_required` | bool      | Whether the field needs to be filled.                                   |
| `description` | string    | Text to show on the description line on autocomplete.                   |
| `hint`        | string    | Text to show on the hint line on autocomplete.                          |
| `label`       | string    | Label to name the field in autocomplete.                                |


Options are defined as:
|             |        |                                      |
| :---------- | :----- | :----------------------------------- |
| `label`     | string | User facing string.                  |
| `value`     | string | Machine facing value.                |
| `icon_data` | string | URL to icon to show on autocomplete. |

When the command is executed, a submit call will be performed on the call endpoint. The call will include in the context the app ID, user ID, the post ID, the root post ID if any, the channel ID and the team ID.

## Embedded Bindings

Posts can be embedded with bindings. These are used for asynchronous interaction with the user. In order to add an embedded binding you need to add an “app_bindings” property with a list of EmbeddedBindings. An EmbeddedBinding includes:
|            |         |                           |
| :--------- | :------ | :------------------------ |
| `app_id`   | string  | The app ID                |
| `title`    | string  | Title of the attachment   |
| `text`     | string  | Text of the attachment    |
| `bindings` | Binding | List of embedded bindings |


Bindings are of two types, buttons or selects.
Buttons include:

|            |        |                                                                         |
| :--------- | :----- | :---------------------------------------------------------------------- |
| `location` | string | Location name. The whole location path will be provided in the context. |
| `label`    | string | Label that will show in the button.                                     |
| `call`     | Call   | Call to be made when the button is clicked.                             |


Selects include:
|            |         |                                                                                                              |
| :--------- | :------ | :----------------------------------------------------------------------------------------------------------- |
| `location` | string  | Location name. The whole location path will be provided in the context.                                      |
| `label`    | string  | Label that will show in the button.                                                                          |
| `call`     | Call    | (Optional) Call to be made when the button is clicked. If none is provided, all options must include a call. |
| `bindings` | Binding | Options for the select.                                                                                      |

Options bindings include:
|            |        |                                                                                                                    |
| :--------- | :----- | :----------------------------------------------------------------------------------------------------------------- |
| `location` | string | Option name. The whole location path will be provided in the context.                                              |
| `label`    | string | User facing string.                                                                                                |
| `call`     | Call   | (Optional) Call to perform when the option is selected. If none is defined, it will take the call from the select. |

Whenever a button is clicked or a select field is selected, a submit call is performed to the corresponding call endpoint. The call will include in the context the app ID, user ID, the post ID, the root post ID if any, the channel ID and the team ID.
