---
title: Call metadata
heading: Expand call metadata
weight: 30
---
Calls can be configured to expand additional metadata into the `context` field of the [request payload]({{<ref "call#request">}}). The call's `expand` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand">}}) field contains a list of the available metadata and how much of that data should be expanded. Metadata is not expanded by default.

The `expand` value contains the following fields:

| Name                       | Type                          | Description                                           |
|:---------------------------|-------------------------------|:------------------------------------------------------|
| `app`                      | [ExpandLevel](#expand-levels) | Expands the app information.                          |
| `acting_user`              | [ExpandLevel](#expand-levels) | Expands the acting user information.                  |
| `acting_user_access_token` | [ExpandLevel](#expand-levels) | Include the user-level access token.                  |
| `locale`                   | [ExpandLevel](#expand-levels) | Expands the user locale, to be used in localizations. |
| `channel`                  | [ExpandLevel](#expand-levels) | Expands the channel information.                      |
| `channel_member`           | [ExpandLevel](#expand-levels) | Expands channel member information.                   |
| `team`                     | [ExpandLevel](#expand-levels) | Expands the team information.                         |
| `team_member`              | [ExpandLevel](#expand-levels) | Expands team member information.                      |
| `post`                     | [ExpandLevel](#expand-levels) | Expands the post information.                         |
| `root_post`                | [ExpandLevel](#expand-levels) | Expands the root post information.                    |
| `user`                     | [ExpandLevel](#expand-levels) | Expands the subject user information.                 |
| `oauth2_app`               | [ExpandLevel](#expand-levels) | Expands the remote OAuth2 configuration data.         |
| `oauth2_user`              | [ExpandLevel](#expand-levels) | Expands the remote OAuth2 user data.                  |


#### Expand levels

Each ExpandLevel (`string`) value can be one of the following:

| Name      | Description                               |
|-----------|-------------------------------------------|
| `none`    | Include no data for the field.            |
| `all`     | Include all data available for the field. |
| `summary` | Include key metadata for the field.       |
| `id`      | Include only relevant identifiers (IDs).  |

### Available information

The following table details what sub-fields are included for each metadata field for the `summary` and `id` ExpandLevels:

| Metadata Field                                    | Data Type                                                                                                                       | `summary` level<br/>sub-fields                                                                                                                                             | `id` level<br/>sub-fields |
|---------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| `app`                                             | {{<newtabref title="App" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#App">}}                     | `app_id`<br/>`version`<br/>`bot_user_id`<br/>`bot_username`                                                                                                                | no sub-fields             |
| `acting_user`                                     | {{<newtabref title="User" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#User">}}                    | `bot_description`<br/>`delete_at`<br/>`email`<br/>`first_name`<br/>`id`<br/>`is_bot`<br/>`last_name`<br/>`locale`<br/>`nickname`<br/>`roles`<br/>`timezone`<br/>`username` | `id`                      |
| `acting_user_access_token`<br/>(`all` level only) | string                                                                                                                          | no sub-fields                                                                                                                                                              | no sub-fields             |
| `locale`                                          | string                                                                                                                          | same as `all` level                                                                                                                                                        | _n/a_                     |
| `channel`                                         | {{<newtabref title="Channel" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#Channel">}}              | `id`<br/>`deleted_at`<br/>`team_id`<br/>`type`<br/>`display_name`<br/>`name`                                                                                               | `id`                      |
| `channel_member`                                  | {{<newtabref title="ChannelMember" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#ChannelMember">}}  | same as `all` level                                                                                                                                                        | no sub-fields             |
| `team`                                            | {{<newtabref title="Team" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#Team">}}                    | `id`<br/>`display_name`<br/>`name`<br/>`description`<br/>`email`<br/>`type`                                                                                                | `id`                      |
| `team_member`                                     | {{<newtabref title="TeamMember" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#TeamMember">}}        | same as `all` level                                                                                                                                                        | no sub-fields             |
| `post`/`root_post`                                | {{<newtabref title="Post" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#Post">}}                    | `id`<br/>`type`<br/>`user_id`<br/>`channel_id`<br/>`root_id`<br/>`message`                                                                                                 | `id`                      |
| `user`                                            | {{<newtabref title="User" href="https://pkg.go.dev/github.com/mattermost/mattermost/server/public/model#User">}}                    | `bot_description`<br/>`delete_at`<br/>`email`<br/>`first_name`<br/>`id`<br/>`is_bot`<br/>`last_name`<br/>`locale`<br/>`nickname`<br/>`roles`<br/>`timezone`<br/>`username` | `id`                      |
| `oauth2_app`                                      | {{<newtabref title="OAuth2Context" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#OAuth2Context">}} | no sub-fields                                                                                                                                                              | no sub-fields             |
| `oauth2_user`                                     | _any_                                                                                                                           | no sub-fields                                                                                                                                                              | no data                   |

{{<note "OAuth2 metadata:">}}
Note that the metadata returned by the `oauth2_app` and `oauth2_user` metadata fields above will be contained in the `oauth2` field of the [request context]({{<ref "/integrate/apps/structure/call#context">}}).
{{</note>}}
