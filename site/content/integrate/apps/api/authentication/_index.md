---
title: "Authentication"
heading: "Using Mattermost APIs with Apps"
description: "An app can use the Mattermost server REST API, as well as new App Services APIs offered specifically to Mattermost Apps."
weight: 200
---

**Note: OAuth2 is not yet implemented, for now session tokens are passed in as ActingUserAccessToken**

An app declares in its `Manifest` the `Locations` that it will be binding to, and `Permissions` it will require to operate. These are consented to by the system administrator when installing Mattermost apps interactively, in Mattermost.

Each app when installed into Mattermost gets an OAuth2 cientID/secret (not yet used), and a Bot User Account with a personal access token. 

Each call request an app receives contains a `bot_access_token` in the `context`. 

Additionaly, if the app was granted `act_as_user` permission, and the call's
`expand` contained `acting_user_access_token=all`, the call receives
`acting_user_access_token` in the request `context`.

Similarly, if the app was granted `act_as_admin` permission, the acting user is
a system administrator, and the call's `expand` contained
`admin_access_token=all`, the call receives `admin_access_token` in the
`context`.

Outgoing messages over HTTP can be authenticated with a secret-based JWT.
Outgoing calls to AWS are done via authenticated (invoke_user) AWS API access.
For outgoing calls to OpenFaaS authentication is still TBD.