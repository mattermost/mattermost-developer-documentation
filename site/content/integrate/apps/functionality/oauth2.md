---
title: OAuth2 authentication
heading: OAuth2 authentication
description: How to authenticate to remote services using OAuth2 from your App
weight: 50
mermaid: true
# TODO: add alias for /integrate/apps/authentication/oauth2 and its aliases
---
The App framework provides support for authenticating with remote services using OAuth2, including storage of app secrets and user tokens.

There are three operations that can be performed:

1. Register the client ID and secret for a remote OAuth2 provider
2. Set or update a user's access token
3. Get a user's access token

The operations can be performed in two ways:

- Using HTTP REST endpoints
- Using a [driver]({{<ref "/integrate/apps/drivers">}})

{{<note>}}
To use the OAuth2 functions in an App, the [manifest]({{<ref "/integrate/apps/structure/manifest">}}) must request the `remote_oauth2` permission.
{{</note>}}

## OAuth2 authentication flow

The OAuth2 authentication flow is initiated by the user invoking an App call, usually from a slash command or form. The call requires that the `oauth2_app`  and `oauth2_user` context fields are expanded.

The App returns a URL that redirects the user to the App's `/oauth2/connect` endpoint, where a URL to the OAuth2 provider is returned, redirecting the user to continue the flow.

When the user has completed their authentication with the remote provider, they are redirected to the App's `/oauth2/complete` endpoint to complete the flow.

{{<mermaid>}}
graph TD
    A[User invokes an App call<br/>using a slash command] --> B[Call returns URL to start<br/>authentication flow]
    B -->|User follows URL| C[Mattermost redirects user to<br/>App /oauth2/connect endpoint]
    C --> D[App returns redirect URL<br/>to OAuth2 provider]
    D -->|User authenticates with provider| E[Provider redirects to<br/>App /oauth2/complete endpoint]
    E --> F[App stores user's token]
{{</mermaid>}}

## Use HTTP REST endpoints

### Endpoint URL

OAuth2 data is managed using a single HTTP REST endpoint:

`<mattermost_site_url>/plugins/com.mattermost.apps/api/v1/oauth2`

Replace `<mattermost_site_url>` with the base URL to the Mattermost server.
The `<mattermost_site_url>` value can be obtained from a [call request context]({{<ref "/integrate/apps/structure/call#context">}}).

#### Authorization

An authorization token is required when invoking HTTP REST endpoints for OAuth2. The token must be set in the `Authorization` header as a bearer token. The `bot_access_token` or `acting_user_access_token` field of the call request context will contain the token; either token can be used.

### Register a remote OAuth2 provider with HTTP REST

Example HTTP request to register the client ID and secret for a remote OAuth2 provider:

```http request
POST /plugins/com.mattermost.apps/api/v1/oauth2/app HTTP/1.1
Authorization: Bearer xxxxxxxxxxxx
Content-Type: application/json

{
    "client_id": "xxxxxxxxxxxx",
    "client_secret": "xxxxxxxxxxxx"
}
```

{{<note "Updating provider registration:">}}
To update an existing provider, use the HTTP `PUT` method instead of the HTTP `POST` method.
{{</note>}}

### Set or update a user access token with HTTP REST

Example HTTP request to set a user access token:

```http request
POST /plugins/com.mattermost.apps/api/v1/oauth2/user HTTP/1.1
Authorization: Bearer xxxxxxxxxxxx
Content-Type: application/json

{
    "token": "xxxxxxxxxxxx"
}
```

{{<note "Updating a user access token:">}}
To update an existing user access token, use the HTTP `PUT` method instead of the HTTP `POST` method.
{{</note>}}

### Get a user access token with HTTP REST

Example HTTP request to get a user access token:

```http request
GET /plugins/com.mattermost.apps/api/v1/oauth2/user HTTP/1.1
Authorization: Bearer xxxxxxxxxxxx
Accept: application/json
```

Example response:

```json
{
    "token": "xxxxxxxxxxxx"
}
```

## Use a driver

### Register a remote OAuth2 provider with a driver

### Set or update a user access token with a driver

### Get a user access token with a driver
