---
title: "Call"
heading: "Call"
description: "TODO"
weight: 40
---


A call ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call)) is the definition of an action. The values are:

| Field name | Field type | Function                                                                                                  |
| :--------- | :--------- | :-------------------------------------------------------------------------------------------------------- |
| `url`      | string     | The app endpoint to call. Mattermost will call `$ROOTURL/url`.                                            |
| `values`   | Object     | A set of elements to be interpreted by the app. Forms and slash commands will also populate these values. |
| `expand`   | Expand     | A definition of the information to expand to send to the app.                                             |

### Expand

To avoid extra communication between the app and Mattermost, you can include expansions in the calls. Expansions ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand)) will send in the call request the whole information of the required fields. You can expand each value to the following leves: “none”, “all” or “summary”.

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

The call request ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest)) will include:

| type                    | CallType    | The type of call being made.                                                               |
| :---------------------- | :---------- | :----------------------------------------------------------------------------------------- |
| `values`                | Object      | The pairs of key values present in the call. Can be populated by forms and slash commands. |
| `context`               | Context     | The context of the call.                                                                   |
| `raw_command`           | string      | The unparsed command for slash commands.                                                   |
| `description`           | string      | The description for your app. Used in the marketplace.                                     |
| `homepage_url`          | string      | The app homepage. Used in the marketplace and for OAuth purposes.                          |
| `root_url`              | string      | Base url to send all calls. Only needed for http apps.                                     |
| `requested_permissions` | Permissions | All the permissions needed by the app.                                                     |

The call type ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallType)) can be:

| type     | CallType                             |
| :------- | :----------------------------------- |
| `submit` | Submit.                              |
| `form`   | Request for a form.                  |
| `cancel` | A form was canceled.                 |
| `lookup` | Lookup for dynamic selects in forms. |

### Call Context

Depending on the location and expansions, calls will have different context. These are all the possible context ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context)) values.

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

There are several types ([godoc](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallResponseType)) of responses:

| type       | CallType                           |
| :--------- | :--------------------------------- |
| `ok`       | OK.                                |
| `error`    | An error has occurred.             |
| `form`     | Should open a form.                |
| `call`     | Should perform another call.       |
| `navigate` | Should navigate the user to a url. |

#### OK response

| type       | Response |
| :--------- | :------- |
| `type`     | ok       |                                                                              |
| `markdown` | string   | (Optional) Markdown text that will be sent to the user as an ephemeral post. |

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

When the app is installed, a special call is made to inform the app that it has been installed on the instance. This call is used mainly to initialize any needed information. If the app asks for Permissions to act as an user, the call will include among the values, the OAuth2 client secret, under the value `oauth2_client_secret`. The context will include the acting user ID, the app ID, the team ID, and the app and Admin access token expanded by default.

The expected responses are either OK or Error responses.
