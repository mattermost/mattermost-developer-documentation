---
title: "Calls"
heading: "Calls"
weight: 20
aliases:
  - /integrate/apps/api/call/
  - /integrate/apps/call
---
A Call defines an App action that can be invoked, or a request for App data.

{{<note "Note:">}}
Content on this page refers to the Mattermost Apps framework and not to the Mattermost Calls product functionality.
{{</note>}}

## Data structure

The data structure of a call ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call">}}) is described in the following table:

| Name     | Type                                | Description                                                                                                                      |
| :------- | :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- |
| `path`   | string                              | The path of the call. For Apps deployed using HTTP, the path is appended to the App's `RootURL`.                                 |
| `expand` | [Expand]({{<ref "call-metadata">}}) | Specifies [additional metadata]({{<ref "call-metadata">}}) to include in the call request, such as channel and post information. |
| `state`  | map                                 | A set of elements to be interpreted by the App. Forms and slash commands will also populate these values.                        |

An example call looks like this:

```json
{
    "path": "/my-handler",
    "expand": {
        "app": "all",
        "user": "summary"
    },
    "state": {}
}
```

## Request

When a call is performed, a POST request will be made to the endpoint defined in the call. The call will include a JSON Web Token (JWT) in the `Mattermost-App-Authorization` header. The Acting User's ID is included in the request by default.

The data structure of a call request ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest">}}) is described in the following table:

| Name             | Type                                | Description                                                                                |
| :--------------- | :---------------------------------- | :----------------------------------------------------------------------------------------- |
| `path`           | string                              | (See above)                                                                                |
| `expand`         | [Expand]({{<ref "call-metadata">}}) | (See above)                                                                                |
| `state`          | map                                 | (See above)                                                                                |
| `values`         | map                                 | The pairs of key values present in the call. Can be populated by forms and slash commands. |
| `context`        | [Context](#context)                 | The context of the call.                                                                   |
| `raw_command`    | string                              | The unparsed command for slash commands.                                                   |
| `selected_field` | string                              | Specifies the field name to use for lookups and refreshes.                                 |
| `query`          | string                              | The user-supplied query string to use for lookups and refreshes.                           |

An example call request looks like the following (some `context` fields omitted for brevity):

```json
{
    "path": "/send",
    "expand": {},
    "context": {
        "app_id": "hello-world",
        "location": "/command/helloworld/send",
        "acting_user": {
            "id": "k86a9cy93f8azx7jjiy5xfq5jc"
        },
        "oauth2": {}
    },
    "raw_command": "/helloworld send"
}
```

### Context

The request `context` field contains metadata about the request. The data structure of the context ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context">}}) field is described in the following table:

| Name                                                                                            | Type                                                                                                                            | Description                                                                         |
| :---------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------- |
| `subject`                                                                                       | Subject (`string`)                                                                                                              | Event subject.                                                                      |
| `channel_id`                                                                                    | string                                                                                                                          | ID from the channel from within which the call was performed.                       |
| `team_id`                                                                                       | string                                                                                                                          | ID from the team from within which the call was performed.                          |
| `post_id`                                                                                       | string                                                                                                                          | ID from the post from within which the call was performed.                          |
| `root_post_id`                                                                                  | string                                                                                                                          | If the call was performed from a post in a thread, the root post ID of that thread. |
| `app_id`                                                                                        | AppID (`string`)                                                                                                                | The app ID.                                                                         |
| `location`                                                                                      | Location (`string`)                                                                                                             | The location from which the call was performed.                                     |
| `user_agent`                                                                                    | string                                                                                                                          | User agent used to perform the call.<br/>Valid values are: `mobile`, `webapp`.      |
| `track_as_submit`                                                                               | bool                                                                                                                            | Whether the call was caused by a submit action from a binding or form.              |
| `mattermost_site_url`                                                                           | string                                                                                                                          | Mattermost base URL.                                                                |
| `developer_mode`                                                                                | bool                                                                                                                            | Whether the Apps framework is running in Developer mode.                            |
| `app_path`                                                                                      | string                                                                                                                          | App's path on the Mattermost instance (appendable to `mattermost_site_url`).        |
| `bot_user_id`                                                                                   | string                                                                                                                          | Bot user ID.                                                                        |
| `bot_access_token`{{<compass-icon icon-star "Field will not be populated by default">}}         | string                                                                                                                          | (Expansion)                                                                         |
| `app`{{<compass-icon icon-star "Field will not be populated by default">}}                      | {{<newtabref title="App" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#App">}}                     | Details about the installed record of the App.                                      |
| `acting_user`{{<compass-icon icon-star "Field will not be populated by default">}}              | {{<newtabref title="User" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#User">}}                    | (Expansion)                                                                         |
| `acting_user_access_token`{{<compass-icon icon-star "Field will not be populated by default">}} | string                                                                                                                          | (Expansion)                                                                         |
| `locale`{{<compass-icon icon-star "Field will not be populated by default">}}                   | string                                                                                                                          | (Expansion)                                                                         |
| `channel`{{<compass-icon icon-star "Field will not be populated by default">}}                  | {{<newtabref title="Channel" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#Channel">}}              | (Expansion)                                                                         |
| `channel_member`{{<compass-icon icon-star "Field will not be populated by default">}}           | {{<newtabref title="ChannelMember" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#ChannelMember">}}  | (Expansion)                                                                         |
| `team`{{<compass-icon icon-star "Field will not be populated by default">}}                     | {{<newtabref title="Team" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#Team">}}                    | (Expansion)                                                                         |
| `team_member`{{<compass-icon icon-star "Field will not be populated by default">}}              | {{<newtabref title="TeamMember" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#TeamMember">}}        | (Expansion)                                                                         |
| `post`{{<compass-icon icon-star "Field will not be populated by default">}}                     | {{<newtabref title="Post" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#Post">}}                    | (Expansion)                                                                         |
| `root_post`{{<compass-icon icon-star "Field will not be populated by default">}}                | {{<newtabref title="Post" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#Post">}}                    | (Expansion)                                                                         |
| `user`{{<compass-icon icon-star "Field will not be populated by default">}}                     | {{<newtabref title="User" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#User">}}                    | (Expansion)                                                                         |
| `mentioned`{{<compass-icon icon-star "Field will not be populated by default">}}                | {{<newtabref title="User" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#User">}} (list)             | (Expansion)                                                                         |
| `oauth2`{{<compass-icon icon-star "Field will not be populated by default">}}                   | {{<newtabref title="OAuth2Context" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#OAuth2Context">}} | (Expansion)                                                                         |

{{<note "Expanded metadata fields" "icon-star" "Fields will not be expanded by default">}}
The data in these fields will not be expanded by default. The originating call's `expand` values, and the call session's permissions determine what fields are expanded.
For more information on expanding metadata in the request context, see the [Call metadata]({{<ref "call-metadata">}}) page.
{{</note>}}

An example context field looks like this:

```json
{
    "context": {        
        "app_id": "hello-world",
        "location": "/command/helloworld/send",
        "user_agent": "webapp",
        "track_as_submit": true,
        "mattermost_site_url": "http://localhost:8066",
        "developer_mode": true,
        "app_path": "/plugins/com.mattermost.apps/apps/hello-world",
        "bot_user_id": "3sjcm1ztkbfhpnddz389ycq1pe",
        "bot_access_token": "tt59irtaopd7fegi3taamd7dxw",
        "acting_user": {
            "id": "k86a9cy93f8azx7jjiy5xfq5jc",
            "delete_at": 0,
            "username": "",
            "auth_service": "",
            "email": "",
            "nickname": "",
            "first_name": "",
            "last_name": "",
            "position": "",
            "roles": "",
            "locale": "",
            "timezone": null,
            "disable_welcome_email": false
        },
        "oauth2": {}
    }
}
```

## Response

The data structure of a call response is described in the following table:

| Name                   | Type                                                                                                          | Description                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                 | [CallResponseType](#call-response-types)                                                                      | The type of response being returned.                                                                                                                                                   |
| `text`                 | string                                                                                                        | Used by the `ok` and `error` response types to return a markdown message that is sent to the user as an ephemeral post.                                                                |
| `data`                 | map                                                                                                           | Used by the `ok` response type to return additional data.                                                                                                                              |
| `navigate_to_url`      | string                                                                                                        | Used by the `navigate` response type to redirect the user to a specified URL.                                                                                                          |
| `use_external_browser` | bool                                                                                                          | Used by the `navigate` response type to indicate the system web browser should be used when redirecting the user to an URL.                                                            |
| `form`                 | {{<newtabref title="Form" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form">}} | Used by the `form` response type to specify a form to display.                                                                                                                         |
| `refresh_bindings`     | bool                                                                                                          | If `true`, forces App bindings to be refreshed immediately. Does not apply to error responses or responses for bindings calls. For optimal performance, this should be used sparingly. |

An example call response looks like this:

```json
{
    "type": "ok",
    "text": "### Success!\n\nThe operation completed successfully."
}
```

### Call response types

There are several types of supported responses ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallResponseType">}}):

| Value      | Description                         |
| :--------- | :---------------------------------- |
| `ok`       | The action completed successfully.  |
| `error`    | An error has occurred.              |
| `form`     | Should open a form.                 |
| `navigate` | Should navigate the user to an URL. |
