---
title: Call metadata
heading: Call metadata
weight: 25
---
Calls can be configured to include additional metadata in the `context` field of the [request payload]({{<ref "call#request">}}). The call's `expand` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand">}}) field contains a list of the available metadata and how much of that data should be included.
No additional metadata is included with the request by default.

The `expand` value contains the following fields:

| Name                       | Type                          | Description                                           |
|:---------------------------|-------------------------------|:------------------------------------------------------|
| `app`                      | [ExpandLevel](#expand-levels) | Expands the app information.                          |
| `acting_user`              | [ExpandLevel](#expand-levels) | Expands the acting user information.                  |
| `acting_user_access_token` | [ExpandLevel](#expand-levels) | Include the user-level access token.                  |
| `channel`                  | [ExpandLevel](#expand-levels) | Expands the channel information.                      |
| `post`                     | [ExpandLevel](#expand-levels) | Expands the post information.                         |
| `root_post`                | [ExpandLevel](#expand-levels) | Expands the root post information.                    |
| `team`                     | [ExpandLevel](#expand-levels) | Expands the team information.                         |
| `user`                     | [ExpandLevel](#expand-levels) | Expands the subject user information.                 |
| `oauth2_app`               | [ExpandLevel](#expand-levels) | Expands the remote OAuth2 configuration data.         |
| `oauth2_user`              | [ExpandLevel](#expand-levels) | Expands the remote OAuth2 user.                       |
| `locale`                   | [ExpandLevel](#expand-levels) | Expands the user locale, to be used in localizations. |

#### Expand levels

Each ExpandLevel (`string`) value can be one of the following:

| Name      | Description                               |
|-----------|-------------------------------------------|
| `none`    | Include no data for the field.            |
| `all`     | Include all data available for the field. |
| `summary` | Include key metadata for the field.       |
| `id`      | Include only relevant identifiers (IDs).  |
