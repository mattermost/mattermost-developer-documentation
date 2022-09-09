---
title: "Calls"
heading: "Calls"
weight: 20
aliases:
  - /integrate/apps/api/call/
---
A call ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call">}}) defines an App action that can be invoked.

{{<note "Note:">}}
Content on this page refers to the Mattermost Apps framework and not to the Mattermost Calls functionality.
{{</note>}}

The definition of a call is:

| Name     | Type                                | Description                                                                                                                      |
|:---------|:------------------------------------|:---------------------------------------------------------------------------------------------------------------------------------|
| `path`   | string                              | The path of the call. For Apps deployed using HTTP, the path is appended to the App's `RootURL`.                                 |
| `expand` | [Expand]({{<ref "call-metadata">}}) | Specifies [additional metadata]({{<ref "call-metadata">}}) to include in the call request, such as channel and post information. |
| `state`  | Object                              | A set of elements to be interpreted by the App. Forms and slash commands will also populate these values.                        |

## Request

When a call is performed, a POST request will be made to the endpoint defined in the call. The call will include a JWT in the `Mattermost-App-Authorization` header. The Acting User ID is included in the request by default.

The call request ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest">}}) will include:

| Name             | Type                | Description                                                                                |
|:-----------------|:--------------------|:-------------------------------------------------------------------------------------------|
| `values`         | Object              | The pairs of key values present in the call. Can be populated by forms and slash commands. |
| `context`        | [Context](#context) | The context of the call.                                                                   |
| `raw_command`    | string              | The unparsed command for slash commands.                                                   |
| `selected_field` | string              | Used in lookups and form refresh to communicate what field.                                |
| `query`          | string              | Used in lookups and form refresh what query strings is entered by the user.                |

### Context

The request `context` field contains metadata about the request. The definition of the context ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context">}}) field is:

| Name                                                               | Type                                                                                                                            | Description                                                                         |
|:-------------------------------------------------------------------|:--------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------|
| `acting_user_id`                                                   | string                                                                                                                          | ID from the user performing the call.                                               |
| `subject`                                                          | Subject (`string`)                                                                                                              | Event subject.                                                                      |
| `user_id`                                                          | string                                                                                                                          | ID from the user which is the subject of the call.                                  |
| `channel_id`                                                       | string                                                                                                                          | ID from the channel from within which the call was performed.                       |
| `team_id`                                                          | string                                                                                                                          | ID from the team from within which the call was performed.                          |
| `post_id`                                                          | string                                                                                                                          | ID from the post from within which the call was performed.                          |
| `root_post_id`                                                     | string                                                                                                                          | If the call was performed from a post in a thread, the root post ID of that thread. |
| `app_id`                                                           | AppID (`string`)                                                                                                                | The app ID.                                                                         |
| `location`                                                         | Location (`string`)                                                                                                             | The location from which the call was performed.                                     |
| `user_agent`                                                       | string                                                                                                                          | User agent used to perform the call.<br/>Valid values are: `mobile`, `webapp`.      |
| `track_as_submit`                                                  | bool                                                                                                                            | Whether the call was caused by a submit action from a binding or form.              |
| `mattermost_site_url`                                              | string                                                                                                                          | Mattermost base URL.                                                                |
| `developer_mode`                                                   | bool                                                                                                                            | Whether the Apps framework is running in Developer mode.                            |
| `app_path`                                                         | string                                                                                                                          | App's path on the Mattermost instance (appendable to `mattermost_site_url`).        |
| `bot_user_id`                                                      | string                                                                                                                          | Bot user ID.                                                                        |
| `bot_access_token`{{<compass-icon icon-arrow-expand-all>}}         | string                                                                                                                          | (Expansion)                                                                         |
| `app`{{<compass-icon icon-arrow-expand-all>}}                      | {{<newtabref title="App" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#App">}}                     | Details about the installed record of the App.                                      |
| `acting_user`{{<compass-icon icon-arrow-expand-all>}}              | {{<newtabref title="User" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#User">}}                    | (Expansion)                                                                         |
| `acting_user_access_token`{{<compass-icon icon-arrow-expand-all>}} | string                                                                                                                          | (Expansion)                                                                         |
| `locale`{{<compass-icon icon-arrow-expand-all>}}                   | string                                                                                                                          | (Expansion)                                                                         |
| `channel`{{<compass-icon icon-arrow-expand-all>}}                  | {{<newtabref title="Channel" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#Channel">}}              | (Expansion)                                                                         |
| `channel_member`{{<compass-icon icon-arrow-expand-all>}}           | {{<newtabref title="ChannelMember" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#ChannelMember">}}  | (Expansion)                                                                         |
| `team`{{<compass-icon icon-arrow-expand-all>}}                     | {{<newtabref title="Team" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#Team">}}                    | (Expansion)                                                                         |
| `team_member`{{<compass-icon icon-arrow-expand-all>}}              | {{<newtabref title="TeamMember" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#TeamMember">}}        | (Expansion)                                                                         |
| `post`{{<compass-icon icon-arrow-expand-all>}}                     | {{<newtabref title="Post" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#Post">}}                    | (Expansion)                                                                         |
| `root_post`{{<compass-icon icon-arrow-expand-all>}}                | {{<newtabref title="Post" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#Post">}}                    | (Expansion)                                                                         |
| `user`{{<compass-icon icon-arrow-expand-all>}}                     | {{<newtabref title="User" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#User">}}                    | (Expansion)                                                                         |
| `mentioned`{{<compass-icon icon-arrow-expand-all>}}                | {{<newtabref title="User" href="https://pkg.go.dev/github.com/mattermost/mattermost-server/v6/model#User">}} (list)             | (Expansion)                                                                         |
| `oauth2`{{<compass-icon icon-arrow-expand-all>}}                   | {{<newtabref title="OAuth2Context" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#OAuth2Context">}} | (Expansion)                                                                         |

{{<note "Expanded metadata fields" "icon-arrow-expand-all">}}
The data in these fields will not be populated by default. For more information on expanding metadata in the request context, see the [Call metadata]({{<ref "call-metadata">}}) page.
{{</note>}}

## Response

There are several types of responses ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallResponseType">}}) :

| Value      | Description                         |
|:-----------|:------------------------------------|
| `ok`       | The action completed successfully.  |
| `error`    | An error has occurred.              |
| `form`     | Should open a form.                 |
| `navigate` | Should navigate the user to an URL. |

### `ok` response

| Name       | Type   | Description                                                                  |
|:-----------|:-------|:-----------------------------------------------------------------------------|
| `type`     | string | The string "`ok`".                                                           |
| `markdown` | string | (Optional) Markdown text that will be sent to the user as an ephemeral post. |

### `error` response

| Name    | Type   | Description                                                       |
|:--------|:-------|:------------------------------------------------------------------|
| `type`  | string | The string "`error`".                                             |
| `error` | string | Markdown text that will be sent to the user as an ephemeral post. |

### `form` response

| Name   | Type                                                                                                          | Description                         |
|:-------|:--------------------------------------------------------------------------------------------------------------|:------------------------------------|
| `type` | string                                                                                                        | The string "`form`".                |
| `form` | {{<newtabref title="Form" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form">}} | The definition of the form to open. |

### `navigate` response

| Name                   | Type   | Description                                                  |
|:-----------------------|:-------|:-------------------------------------------------------------|
| `type`                 | string | Use `navigate`.                                              |
| `navigate_to_url`      | string | URL to navigate to.                                          |
| `use_external_browser` | bool   | Whether the navigation link wll open in an external browser. |

