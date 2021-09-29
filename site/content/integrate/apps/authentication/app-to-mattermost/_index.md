---
title: "To Mattermost"
heading: "Authenticating apps with Mattermost"
description: "TODO"
weight: 100
---

An app declares in its `Manifest` the `Locations` that it will be binding to,
and `Permissions` it will require to operate. These are consented to by the
system administrator when installing Mattermost apps interactively, in
Mattermost.

Each app when installed into Mattermost gets an OAuth2 Cient ID and a secret
(not yet used), and a Bot User Account with a personal access token. Each call
may receive a combination of `bot_access_token`, `acting_user_access_token`, and
`admin_access_token` as applicable. 

**Note: OAuth2 to Mattermost is not yet implemented, for now session tokens are passed in as ActingUserAccessToken**

Each call request sent to the app includes Mattermost site URL, and optionally one or more access tokens the app can use. The app then authenticates its requests to Mattermost by providing one of the tokens, usually Bot access token or OAuth2 token. 

What tokens the app gets, and what access the app may have with them depends on the combination of App granted permissions, the tokens requested in `call.Expand`, and their respective access rights.

Each call request an app receives contains a `bot_access_token` in the request
`context`. 

Additionaly, if the app was granted `act_as_user` permission, and the call's
`expand` contained `acting_user_access_token=all`, the call receives
`acting_user_access_token` in the request `context`. Otherwise,
`acting_user_access_token` is empty.

Similarly, if the app was granted `act_as_admin` permission, the acting user is
a system administrator, and the call's `expand` contained
`admin_access_token=all`, the call receives `admin_access_token` in the request
`context`. Otherwise, `admin_access_token` is empty.

See [here]({{< ref "manifest#permissions">}}) to learn more about the available permissions