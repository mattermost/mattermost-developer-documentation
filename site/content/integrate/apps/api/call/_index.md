---
title: "Call"
heading: "Call"
description: "TODO"
weight: 300
---


A call ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call)) is the definition of an action. The values are:

| Name     | Type   | Description                                                                                               |
| :------- | :----- | :-------------------------------------------------------------------------------------------------------- |
| `path`   | string | The path of the call. For HTTP apps, the path is appended to the app's `RootURL`.                         |
| `expand` | Expand | A definition of the information to expand to send to the app.                                             |
| `state`  | Object | A set of elements to be interpreted by the app. Forms and slash commands will also populate these values. |

### Expand

To avoid extra communication between the app and Mattermost, you can include expansions in the calls. Expansions ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand)) will send in the call request the whole information of the required fields. You can expand each value to the following levels: `none`, `all`, or `summary`.

TODO: Define differences between all and summary

The possible expansions are:

| Name                       | Description                                           |
| :------------------------- | :---------------------------------------------------- |
| `app`                      | Expands the app information.                          |
| `acting_user`              | Expands the acting user information.                  |
| `acting_user_access_token` | Include the user-level access token.                  |
| `channel`                  | Expands the channel information.                      |
| `post`                     | Expands the post information.                         |
| `root_post`                | Expands the root post information.                    |
| `team`                     | Expands the team information.                         |
| `user`                     | Expands the subject user information.                 |
| `oauth2_app`               | Expands the remote OAuth2 configuration data.         |
| `oauth2_user`              | Expands the remote OAuth2 user.                       |
| `locale`                   | Expands the user locale, to be used in localizations. |


## Call handling

### Call request

When a call is performed, a POST request will be made to the endpoint defined in the call. The call will include a “Mattermost-App-Authorization” header, with a jwtToken. Along the default claims, it will also send the Acting User ID.

The call request ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest)) will include:

| Name             | Type    | Description                                                                                |
| :--------------- | :------ | :----------------------------------------------------------------------------------------- |
| `values`         | Object  | The pairs of key values present in the call. Can be populated by forms and slash commands. |
| `context`        | Context | The context of the call.                                                                   |
| `raw_command`    | string  | The unparsed command for slash commands.                                                   |
| `selected_field` | string  | Used in lookups and form refresh to communicate what field.                                |
| `query`          | string  | Used in lookups and form refresh what query strings is entered by the user.                |


### Call context

Depending on the location and expansions, calls will have different context. These are all the possible context ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context)) values.

| Name                       | Type     | Description                                                                         |
| :------------------------- | :------- | :---------------------------------------------------------------------------------- |
| `app_id`                   | string   | The app ID.                                                                         |
| `location`                 | Location | The location from which the call was performed.                                     |
| `subject`                  | Subject  | Event subject.                                                                      |
| `bot_user_id`              | string   | Bot user ID.                                                                        |
| `acting_user_id`           | string   | ID from the user performing the call.                                               |
| `user_id`                  | string   | ID from the user which is the subject of the call.                                  |
| `team_id`                  | string   | ID from the team from within which the call was performed.                          |
| `channel_id`               | string   | ID from the channel from within which the call was performed.                       |
| `post_id`                  | string   | ID from the post from within which the call was performed.                          |
| `root_post_id`             | string   | If the call was performed from a post in a thread, the root post ID of that thread. |
| `app_path`                 | string   | App's path on the Mattermost instance (appendable to `mattermost_site_url`).        |
| `mattermost_site_url`      | string   | Mattermost base URL.                                                                |
| `user_agent`               | string   | User agent used to perform the call. It can be either `webapp` or `mobile`.         |
| `bot_access_token`         | string   | (Expansion)                                                                         |
| `acting_user`              | User     | (Expansion)                                                                         |
| `acting_user_access_token` | string   | (Expansion)                                                                         |
| `oauth2`                   | App      | (Expansion)                                                                         |
| `app`                      | App      | (Expansion)                                                                         |
| `channel`                  | Channel  | (Expansion)                                                                         |
| `post`                     | Post     | (Expansion)                                                                         |
| `root_post`                | Post     | (Expansion)                                                                         |
| `team`                     | Team     | (Expansion)                                                                         |
| `user`                     | User     | (Expansion)                                                                         |
| `locale`                   | string   | (Expansion)                                                                         |

### Call response

There are several types ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallResponseType)) of responses:

| Value      | Description                        |
| :--------- | :--------------------------------- |
| `ok`       | OK.                                |
| `error`    | An error has occurred.             |
| `form`     | Should open a form.                |
| `navigate` | Should navigate the user to a URL. |

#### OK response

| Name       | Type   | Description                                                                  |
| :--------- | :----- | :--------------------------------------------------------------------------- |
| `type`     | string | Use `ok`.                                                                    |
| `text` | string | (Optional) Markdown text that will be sent to the user as an ephemeral post. |
| `data` | Object | (Optional) data that will be returned from the call. |

#### Error response

| Name    | Type   | Description                                                       |
| :------ | :----- | :---------------------------------------------------------------- |
| `type`  | string | Use `error`.                                                      |
| `text` | string | Markdown text that will be displayed to the user, as an error message. |

#### Form response

| Name   | Type   | Description   |
| :----- | :----- | :------------ |
| `type` | string | Use `form`.   |
| `form` | form   | Form to open. |

#### Navigate response

| Name                   | Type   | Description                                                  |
| :--------------------- | :----- | :----------------------------------------------------------- |
| `type`                 | string | Use `navigate`.                                              |
| `navigate_to_url`      | string | URL to navigate to.                                          |
| `use_external_browser` | bool   | Whether the navigation link wll open in an external browser. |

## Special calls

### Install

When the app is installed and `on_install` is defined in the [manifest]{{< ref "manifest" >}}, a special call is made to inform the app that it has been installed on the instance. This call is used mainly to initialize any needed information.

The expected responses are either OK or Error responses.
