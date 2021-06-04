---
title: "Third-party APIs"
heading: "Using third-party APIs for Apps"
description: "Mattermost Apps framework provides services for using remote (third-party) OAuth2 HTTP APIs, and receiving authenticated webhook notifications from remote systems."
weight: 90
---

There are two examples here to illustrate the [OAuth2](#hello-oauth2) and [webhook](#hello-webhooks) support.

## Hello OAuth2!

This is an example of an HTTP app ([source](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-oauth2)), written in Go and runnable on http://localhost:8080.

- It contains a `manifest.json`, declares itself an HTTP application, requests permissions, and binds itself to locations in the Mattermost user interface.
- In its `bindings` function it declares three commands: `configure`, `connect`, and `send`.
- Its `send` function mentions the user by their Google name, and lists their Google Calendars.

To install "Hello, OAuth2" on a locally-running instance of Mattermost follow these steps (go 1.16 is required):

```sh
git clone https://github.com/mattermost/mattermost-plugin-apps.git
cd mattermost-plugin-apps/examples/go/hello-oauth2
go run . 
```

In the Mattermost Desktop client run:

```
/apps install http http://localhost:8080/manifest.json
```

You need to configure your [Google API Credentials](https://console.cloud.google.com/apis/credentials) for the app. Use `$MATTERMOST_SITE_URL$/com.mattermost.apps/apps/hello-oauth2/oauth2/remote/complete` for the `Authorized redirect URIs` field. After configuring the credentials, in the Mattermost Desktop client run:

```
/hello-oauth2 configure --client-id $CLIENT_ID --client-secret $CLIENT_SECRET
```

Now, you can connect your account to Google with `/hello-oauth2 connect` command, and then try `/hello-oauth2 send`.

### Manifest

Hello OAuth2! is an HTTP app, it requests the *permissions* to act as a System Admin to change the app's OAuth2 config, as a user to connect and send. It binds itself to `/` commands.

```json
{
	"app_id": "hello-oauth2",
	"version":"demo",
	"display_name": "Hello, OAuth2!",
	"app_type": "http",
	"root_url": "http://localhost:8080",
	"homepage_url": "https://github.com/mattermost/mattermost-plugin-apps/examples/go/hello-oauth2",
	"requested_permissions": [
		"act_as_admin",
		"act_as_user",
		"remote_oauth2"
	],
	"requested_locations": [
		"/command"
	]
}
```

### Bindings and locations

The Hello OAuth2 app creates three commands: `/helloworld configure | connect | send`.

```json
{
	"type": "ok",
	"data": [
		{
			"location": "/command",
			"bindings": [
				{
					"icon": "icon.png",
					"label": "helloworld",
					"description": "Hello remote (3rd party) OAuth2 App",
					"hint": "[configure | connect | send]",
					"bindings": [
						{
							"location": "configure",
							"label": "configure",
							"call": {
								"path": "/configure"
							}
						},
						{
							"location": "connect",
							"label": "connect",
							"call": {
								"path": "/connect"
							}
						},
						{
							"location": "send",
							"label": "send",
							"call": {
								"path": "/send"
							}
						}
					]
				}
			]
		}
	]
}
```

### Configuring OAuth2

`/hello-oauth2 configure` sets up the Google OAuth2 credentials. It accepts two string flags, `--client-id` and `--client-secret`. Submit will require an Admin token to affect the changes.

```json
{
	"type": "form",
	"form": {
		"title": "Configures Google OAuth2 App credentials",
		"icon": "icon.png",
		"fields": [
			{
				"type": "text",
				"name": "client_id",
				"label": "client-id",
				"is_required": true
			},
			{
				"type": "text",
				"name": "client_secret",
				"label": "client-secret",
				"is_required": true
			}
		],
		"call": {
			"path": "/configure",
			"expand": {
				"admin_access_token": "all"
			}
		}
	}
}
```

The command handler uses an admin-only `StoreOAuth2App` API to store the credentials, and make them available to future calls with `expand.oauth2_app="all"`.

```go
func configure(w http.ResponseWriter, req *http.Request) {
	creq := apps.CallRequest{}
	json.NewDecoder(req.Body).Decode(&creq)
	clientID, _ := creq.Values["client_id"].(string)
	clientSecret, _ := creq.Values["client_secret"].(string)

	asAdmin := mmclient.AsAdmin(creq.Context)
	asAdmin.StoreOAuth2App(creq.Context.AppID, clientID, clientSecret)

	json.NewEncoder(w).Encode(apps.CallResponse{
		Markdown: "updated OAuth client credentials",
	})
}
```

### Connecting as a user

#### `connect` command

`/hello-oauth2 connect` formats and displays a link that starts the OAuth2 flow with the remote system. The URL (provided to the app in the `Context`) is handled by the apps framework. It will:

- Create a one-time secret ("state").
- Invoke `oauth2Connect` to generate the remote URL that starts the flow.
- Redirect the user's browser there.

Note `expand.oauth2_app="all"` in the form definition, it includes the app's OAuth2 Mattermost-hosted callback URL in the request context. This command should soon be provided by the framework, see [MM-34561](https://mattermost.atlassian.net/browse/MM-34561).

```json
{
	"type": "form",
	"form": {
		"title": "Connect to Google",
		"icon": "icon.png",
		"call": {
			"path": "/connect",
			"expand": {
				"oauth2_app": "all"
			}
		}
	}
}
```

```go
func connect(w http.ResponseWriter, req *http.Request) {
	creq := apps.CallRequest{}
	json.NewDecoder(req.Body).Decode(&creq)

	json.NewEncoder(w).Encode(apps.CallResponse{
		Markdown: md.Markdownf("[Connect](%s) to Google.", creq.Context.OAuth2.ConnectURL),
	})
}
```

#### OAuth2 call handlers

To handle the OAuth2 `connect` flow, the app provides two calls: `/oauth2/connect` that returns the URL to redirect the user to, and `/oauth2/complete` which gets invoked once the flow is finished, and the `state` parameter is verified.

```go
	// Handle an OAuth2 connect URL request.
	http.HandleFunc("/oauth2/connect", oauth2Connect)

	// Handle a successful OAuth2 connection.
	http.HandleFunc("/oauth2/complete", oauth2Complete)
```

`oauth2Connect` extracts the necessary data from the request's context and values ("state"), and composes a Google OAuth2 initial URL.

```go
func oauth2Connect(w http.ResponseWriter, req *http.Request) {
	creq := apps.CallRequest{}
	json.NewDecoder(req.Body).Decode(&creq)
	state, _ := creq.Values["state"].(string)

	url := oauth2Config(&creq).AuthCodeURL(state, oauth2.AccessTypeOffline, oauth2.ApprovalForce)
	json.NewEncoder(w).Encode(apps.CallResponse{
		Type: apps.CallResponseTypeOK,
		Data: url,
	})
}
```

`oauth2Complete` is called upon the successful completion (including the validation of the "state"). It is responsible for creating an OAuth2 token, and storing it in the Mattermost OAuth2 user store.

```go
func oauth2Complete(w http.ResponseWriter, req *http.Request) {
	creq := apps.CallRequest{}
	json.NewDecoder(req.Body).Decode(&creq)
	code, _ := creq.Values["code"].(string)

	token, _ := oauth2Config(&creq).Exchange(context.Background(), code)

	asActingUser := mmclient.AsActingUser(creq.Context)
	asActingUser.StoreOAuth2User(creq.Context.AppID, token)

	json.NewEncoder(w).Encode(apps.CallResponse{})
}
```

#### Obtaining an OAuth2 "Config" for a call

The app is responsible for composing its own remote OAuth2 config, using the remote system-specific settings. The `ClientID` and `ClientSecret` are stored in Mattermost OAuth2App record, and are included in the request context if specified with `expand.oauth2_app="all"`.

```go
import (
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

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

### `send` command

`/hello-oauth2 send` sends the user a message that includes the Google user name on the account, and lists the Google Calendars. The form requests that submit calls expand `oauth2_user` which is where the app stored the OAuth2 token upon a successful connect.

```json
{
	"type": "form",
	"form": {
		"title": "Send a Google-connected 'hello, world!' message",
		"icon": "icon.png",
		"call": {
			"path": "/send",
			"expand": {
				"oauth2_user": "all"
			}
		}
	}
}
```

```go
func send(w http.ResponseWriter, req *http.Request) {
	creq := apps.CallRequest{}
	json.NewDecoder(req.Body).Decode(&creq)

	oauthConfig := oauth2Config(&creq)
	token := oauth2.Token{}
	remarshal(&token, creq.Context.OAuth2.User) // go JSON is quirky!
	ctx := context.Background()
	tokenSource := oauthConfig.TokenSource(ctx, &token)
	oauth2Service, _ := oauth2api.NewService(ctx, option.WithTokenSource(tokenSource))
	calService, _ := calendar.NewService(ctx, option.WithTokenSource(tokenSource))
	uiService := oauth2api.NewUserinfoService(oauth2Service)

	ui, _ := uiService.V2.Me.Get().Do()
	message := fmt.Sprintf("Hello from Google, [%s](mailto:%s)!", ui.Name, ui.Email)
	cl, _ := calService.CalendarList.List().Do()
	if cl != nil && len(cl.Items) > 0 {
		message += " You have the following calendars:\n"
		for _, item := range cl.Items {
			message += "- " + item.Summary + "\n"
		}
	} else {
		message += " You have no calendars.\n"
	}

	json.NewEncoder(w).Encode(apps.CallResponse{
		Markdown: md.MD(message),
	})
}
```

## Hello Webhooks!

This is an example of an HTTP app ([source](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-webhooks)), written in Go and runnable on http://localhost:8080.
