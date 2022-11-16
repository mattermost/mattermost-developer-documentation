---
title: Golang
description: The golang App driver
weight: 10
---
The following sections assume you've created a new, empty Golang project. 

## Installation

Install the driver using `go get`. The version number - `v1.1.1` in the command below - can be updated to reference newer releases.

```shell
go get github.com/mattermost/mattermost-plugin-apps@v1.1.1
```

### Main package

The following `main.go` example can be used as a starting point for using the Golang driver:

```go
package main

import (
    "net/http"
    "github.com/mattermost/mattermost-plugin-apps/utils/httputils"
)

func main() {
    // Create an instance of the endpoint handler; it's an instance of the Router from github.com/gorilla/mux
    handler := httputils.NewHandler()
    
    // HTTP endpoints will be created here
    
    // Start the HTTP server using the endpoint handler
    server := http.Server{
		Addr:    "my-app-hostname:4000",
		Handler: handler,
	}
	_ = server.ListenAndServe()
}
```

The endpoint handler used above can be swapped out for any handler that implements the `http.Handler` interface.

## Manifest

```go
var (
    appManifest = apps.Manifest{
		AppID:       apps.AppID("hello-world"),
		Version:     apps.AppVersion("0.1.0"),
		HomepageURL: "https://github.com/MY_USERNAME/MY_APP_REPO",
		DisplayName: "Hello world!",
		Description: "Example Golang App for Mattermost",
		RequestedPermissions: apps.Permissions{
			apps.PermissionActAsBot,
		},
		RequestedLocations: apps.Locations{
			apps.LocationChannelHeader,
			apps.LocationCommand,
		},
		Deploy: apps.Deploy{
			HTTP: &apps.HTTP{
				RootURL: "http://my-app-hostname:4000",
			},
		},
	}
)
```

```go
func main() {
    handler := httputils.NewHandler()
    // ...
    handler.HandleFunc("/manifest.json", httputils.DoHandleJSON(appManifest))
    // ...
}
```

## Bindings and forms

```go
var (
    appForm = apps.Form{
		Title: "I'm a form!",
		Icon:  "icon.png",
		Fields: []apps.Field{
			{
				Type:                 apps.FieldTypeText,
				Name:                 "message",
				Label:                "message",
				AutocompletePosition: 1,
			},
		},
		Submit: apps.NewCall("/submit"),
	}

	channelHeaderBinding = apps.Binding{
		Location: apps.LocationChannelHeader,
		Bindings: []apps.Binding{
			{
				Location: "send-button",
				Icon:     "icon.png",
				Label:    "send hello message",
				Form:     &appForm,
			},
		},
	}

	commandBinding = apps.Binding{
		Location: apps.LocationCommand,
		Bindings: []apps.Binding{
			{
				Location:    "send-command",
				Label:       "send hello message",
				Description: appManifest.Description,
				Hint:        "[send]",
				Bindings: []apps.Binding{
					{
						Location: "send",
						Label:    "send",
						Form:     &appForm,
					},
				},
			},
		},
	}

	bindings = []apps.Binding{
		channelHeaderBinding,
		commandBinding,
	}
)
```

```go
func main() {
    // ...
    handler.HandleFunc("/bindings", httputils.DoHandleJSON(apps.NewDataResponse(bindings)))
    // ...
}
```

## Call handlers

```go
func submitHandler(w http.ResponseWriter, r *http.Request) {
	// Read the request body
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		// handle the error
		return
	}
	// Unmarshal the request body into an apps.CallRequest struct
	callRequest := new(apps.CallRequest)
	err = json.Unmarshal(bodyBytes, callRequest)
	if err != nil {
		// handle the error
		return
	}

	// Construct the response message using the input form's `message` value
	message := "Hello, world!"
	submittedMessageIntf, ok := callRequest.Values["message"]
	if ok {
		submittedMessage, ok := submittedMessageIntf.(string)
		if ok {
			message += " ...and " + submittedMessage + "!"
		}
	}

	// Create an instance of the API Client
	botClient := appclient.AsBot(callRequest.Context)

	// Post a DM
	channel, _, err := botClient.CreateDirectChannel(callRequest.Context.BotUserID, callRequest.Context.ActingUser.Id)
	if err != nil {
		// handle the error
		return
	}
	post := &model.Post{
		ChannelId: channel.Id,
		Message:   message,
	}
	_, err = botClient.CreatePost(post)
	if err != nil {
		// handle the error
		return
	}

	// Construct the call response and send it
	callResponse := apps.CallResponse{
		Type: apps.CallResponseTypeOK,
		Text: "Created a post in your DM channel.",
	}
	encodedResponse, err := json.Marshal(callResponse)
	if err != nil {
		// handle the error
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(encodedResponse)
}
```

```go
func main() {
    // ...
    handler.HandleFunc("/submit", submitHandler)
    // ...
}
```

## Static assets

```go
func main() {
    // ...
    handler.
        PathPrefix("/static/").
        Handler(http.FileServer(http.Dir("static")))
    // ...
}
```

## Example

{{<collapse id="golang-full-example" title="Full example code">}}
```go
package main

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/mattermost/mattermost-plugin-apps/apps"
	"github.com/mattermost/mattermost-plugin-apps/apps/appclient"
	"github.com/mattermost/mattermost-plugin-apps/utils/httputils"
	"github.com/mattermost/mattermost-server/v6/model"
)

var (
	// Manifest

	appManifest = apps.Manifest{
		AppID:       apps.AppID("hello-world"),
		Version:     apps.AppVersion("0.1.0"),
		HomepageURL: "https://github.com/MY_USERNAME/MY_APP_REPO",
		DisplayName: "Hello world!",
		Description: "Example Golang App for Mattermost",
		RequestedPermissions: apps.Permissions{
			apps.PermissionActAsBot,
		},
		RequestedLocations: apps.Locations{
			apps.LocationChannelHeader,
			apps.LocationCommand,
		},
		Deploy: apps.Deploy{
			HTTP: &apps.HTTP{
				RootURL: "http://my-app-hostname:4000",
			},
		},
	}

	// Bindings and forms

	appForm = apps.Form{
		Title: "I'm a form!",
		Icon:  "icon.png",
		Fields: []apps.Field{
			{
				Type:                 apps.FieldTypeText,
				Name:                 "message",
				Label:                "message",
				AutocompletePosition: 1,
			},
		},
		Submit: apps.NewCall("/submit"),
	}

	channelHeaderBinding = apps.Binding{
		Location: apps.LocationChannelHeader,
		Bindings: []apps.Binding{
			{
				Location: "send-button",
				Icon:     "icon.png",
				Label:    "send hello message",
				Form:     &appForm,
			},
		},
	}

	commandBinding = apps.Binding{
		Location: apps.LocationCommand,
		Bindings: []apps.Binding{
			{
				Location:    "send-command",
				Label:       "send hello message",
				Description: appManifest.Description,
				Hint:        "[send]",
				Bindings: []apps.Binding{
					{
						Location: "send",
						Label:    "send",
						Form:     &appForm,
					},
				},
			},
		},
	}

	bindings = []apps.Binding{
		channelHeaderBinding,
		commandBinding,
	}
)

// Handlers

func submitHandler(w http.ResponseWriter, r *http.Request) {
	// Read the request body
	bodyBytes, err := io.ReadAll(r.Body)
	if err != nil {
		// handle the error
		return
	}
	// Unmarshal the request body into an apps.CallRequest struct
	callRequest := new(apps.CallRequest)
	err = json.Unmarshal(bodyBytes, callRequest)
	if err != nil {
		// handle the error
		return
	}

	// Construct the response message using the input form's `message` value
	message := "Hello, world!"
	submittedMessageIntf, ok := callRequest.Values["message"]
	if ok {
		submittedMessage, ok := submittedMessageIntf.(string)
		if ok {
			message += " ...and " + submittedMessage + "!"
		}
	}

	// Create an instance of the API Client
	botClient := appclient.AsBot(callRequest.Context)

	// Post a DM
	channel, _, err := botClient.CreateDirectChannel(callRequest.Context.BotUserID, callRequest.Context.ActingUser.Id)
	if err != nil {
		// handle the error
		return
	}
	post := &model.Post{
		ChannelId: channel.Id,
		Message:   message,
	}
	_, err = botClient.CreatePost(post)
	if err != nil {
		// handle the error
		return
	}

	// Construct the call response and send it
	callResponse := apps.CallResponse{
		Type: apps.CallResponseTypeOK,
		Text: "Created a post in your DM channel.",
	}
	encodedResponse, err := json.Marshal(callResponse)
	if err != nil {
		// handle the error
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(encodedResponse)
}

func main() {
	// Create an instance of the endpoint handler; it's an instance of the Router from github.com/gorilla/mux
	handler := httputils.NewHandler()

	// Manifest
	handler.HandleFunc("/manifest.json", httputils.DoHandleJSON(appManifest))

	// Bindings and forms
	handler.HandleFunc("/bindings", httputils.DoHandleJSON(apps.NewDataResponse(bindings)))

	// Handlers
	handler.HandleFunc("/submit", submitHandler)

	// Static assets
	handler.
		PathPrefix("/static/").
		Handler(http.FileServer(http.Dir("static")))

	// Start the HTTP server using the endpoint handler
	server := http.Server{
		Addr:    "my-app-hostname:4000",
		Handler: handler,
	}
	_ = server.ListenAndServe()
}
```
{{</collapse>}}
