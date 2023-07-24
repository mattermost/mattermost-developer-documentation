---
title: OAuth2 authentication
heading: OAuth2 authentication
description: How to authenticate to remote services using OAuth2 from your App
weight: 50
mermaid: true
aliases:
  - /integrate/apps/using-third-party-api/hello-oauth2/
  - /integrate/apps/authentication/app-to-third-party/
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

The OAuth2 authentication flow is initiated by the user invoking an App call, usually from a slash command or form. The call requires that the `oauth2_app`  and `oauth2_user` context fields are expanded with expand level `all`.

The App returns a URL that redirects the user to the App's `/oauth2/connect` endpoint, where a URL to the OAuth2 provider is returned, redirecting the user to continue the flow.

When the user has completed their authentication with the remote provider, they are redirected to the App's `/oauth2/complete` endpoint to complete the flow.

{{<mermaid>}}
graph TD
    A[User invokes an App call<br/>using a slash command] --> B[Call returns URL to start<br/>authentication flow]
    B -->|User clicks URL<br/>Mattermost client opens browser| C[Mattermost redirects user to<br/>App /oauth2/connect endpoint]
    C --> D[App returns redirect URL<br/>to OAuth2 provider]
    D -->|User authenticates with provider| E[Provider redirects to<br/>App /oauth2/complete endpoint]
    E --> F[App exchanges authentication<br/>code for token]
    F --> G[App stores user's token]
{{</mermaid>}}

{{<note "App OAuth2 endpoints:">}}
The `/oauth2/connect` and `/oauth2/complete` calls can be customized using the `get_oauth2_connect_url` and `on_oauth2_complete` properties of the App's manifest, respectively.
{{</note>}}

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
{{<note >}}
A [bindings]({{<ref "/integrate/apps/structure/bindings">}}) refresh is triggered on every change of the user token.
{{</note>}}

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

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to register the OAuth2 provider client ID and client secret:

```go
// configure is the App call invoked by the system administrator to register OAuth2 provider details.
// The call should be configured to accept two values: client_id and client_secret.
func configure(w http.ResponseWriter, req *http.Request) {
	// Decode the call request data
	creq := new(apps.CallRequest)
	err := json.NewDecoder(req.Body).Decode(creq)
	if err != nil {
		// handle the error
	}
	// Read the client_id and client_secret values from the request
	clientID, ok := creq.Values["client_id"].(string)
	if !ok {
		// handle the error
	}
	clientSecret, ok := creq.Values["client_secret"].(string)
	if !ok {
		// handle the error
	}
	// Get an instance of the API client as the acting user
	asUser := appclient.AsActingUser(creq.Context)
	// Register the OAuth2 provider's details (client ID and client secret)
	err = asUser.StoreOAuth2App(apps.OAuth2App{
		ClientID:     clientID,
		ClientSecret: clientSecret,
	})
	if err != nil {
		// handle the error
	}
	// Respond with a success message
	err = json.NewEncoder(w).Encode(
		apps.NewTextResponse("updated OAuth client credentials"),
	)
	if err != nil {
		// handle the error
	}
}
```

### Set or update a user access token with a driver

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to set a user access token:

```go
// oauth2Complete is the App call invoked at the end of an OAuth2 authorization flow
func oauth2Complete(w http.ResponseWriter, req *http.Request) {
	// Decode the call request data
	callRequest := new(apps.CallRequest)
	err := json.NewDecoder(req.Body).Decode(callRequest)
	if err != nil {
		// handle the error
	}
	// Read the authorization code from the call request values
	authCode, ok := callRequest.Values["code"].(string)
	if !ok {
		// handle the error
	}
	// Exchange the authorization code for a token
	token, err := oauth2Config(callRequest).Exchange(context.Background(), authCode)
	if err != nil {
		// handle the error
	}
	// Get an instance of the API client as the acting user
	client := appclient.AsActingUser(callRequest.Context)
	// Store the OAuth2 token for the acting user
	err = client.StoreOAuth2User(token)
	if err != nil {
		// handle the error
	}
	// Return a success response
	err = httputils.WriteJSON(w, apps.NewDataResponse(nil))
	if err != nil {
		// handle the error
	}
}
```

#### OAuth2 configuration

The Golang `oauth2Config` function referenced in the example above is responsible for creating a `oauth2.Config` ({{<newtabref title="godoc" href="https://pkg.go.dev/golang.org/x/oauth2#Config">}}) struct which contains the necessary information to exchange an authorization code for a token.

Example Golang code for the `oauth2Config` function referencing a Google OAuth2 provider:

```go
func oauth2Config(creq *apps.CallRequest) *oauth2.Config {
    return &oauth2.Config{
        ClientID:     creq.Context.OAuth2.ClientID,
        ClientSecret: creq.Context.OAuth2.ClientSecret,
        Endpoint:     google.Endpoint,
        RedirectURL:  creq.Context.OAuth2.CompleteURL,
        Scopes: []string{
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        },
    }
}
```

### Get a user access token with a driver

Example [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) code to get a user access token:

```go
func useRemoteService(w http.ResponseWriter, req *http.Request) {
	// Decode the call request data
	callRequest := new(apps.CallRequest)
	err := json.NewDecoder(req.Body).Decode(callRequest)
	if err != nil {
		// handle the error
	}
	// Get an instance of the API client as the acting user
	client := appclient.AsActingUser(callRequest.Context)
	// Get the user's token
	var userToken string
	err = client.GetOAuth2User(&userToken)
	if err != nil {
		// handle the error
	}
	// Use the token
	// ...
	// Return a success response
	err = httputils.WriteJSON(w, apps.NewDataResponse(nil))
	if err != nil {
		// handle the error
	}
}
```

{{<note>}}
The user's access token can also be obtained from the call request context `oauth2_user` field. The call must be configured to expand the `oauth2_user` context field at the `all` level.
{{</note>}}
