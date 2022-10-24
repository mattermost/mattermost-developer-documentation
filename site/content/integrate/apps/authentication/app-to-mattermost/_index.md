---
title: "To Mattermost"
heading: "Authenticate with Mattermost"
weight: 10
---

An app declares in its `Manifest` the `Locations` that it will be binding to,
and `Permissions` it will require to operate. These are consented to by the
System Admin when installing Mattermost apps interactively, in
Mattermost.

Each app when installed into Mattermost gets an OAuth2 Client ID and a secret
(not yet used), and a bot user account with a personal access token. Each call
may receive a combination of `bot_access_token`, `acting_user_access_token`, and
`admin_access_token` as applicable.

{{<note "Note:">}}
**OAuth2 to Mattermost is not yet implemented, for now session tokens are
passed in as ActingUserAccessToken**
{{</note>}}

Each call request sent to the app includes Mattermost site URL, and optionally
one or more access tokens the app can use. The app then authenticates its
requests to Mattermost by providing one of the tokens, usually bot access token
or OAuth2 token.

What tokens the app gets, and what access the app may have with them depends on
the combination of App granted permissions, the tokens requested in
`call.Expand`, and their respective access rights.

If the app was granted `act_as_bot` permission each call request it receives
contains a `bot_access_token` in the request `context`.

Additionaly, if the app was granted `act_as_user` permission, and the call's
`expand` contained `acting_user_access_token=all`, the call receives
`acting_user_access_token` in the request `context`. Otherwise,
`acting_user_access_token` is empty.

Similarly, if the app was granted `act_as_admin` permission, the acting user is
a System Admin, and the call's `expand` contained
`admin_access_token=all`, the call receives `admin_access_token` in the request
`context`. Otherwise, `admin_access_token` is empty.

See [here]({{< ref "/integrate/apps/structure/manifest#permissions" >}}) to learn more about the available
permissions
