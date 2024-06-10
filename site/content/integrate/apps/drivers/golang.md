---
title: Golang
description: The golang App driver
weight: 10
---
The Golang driver is a package which wraps HTTP REST calls, making it more convenient to access the Apps API and the Mattermost REST API.
Use this package if you do not want to make HTTP REST calls yourself.

## Installation

Create a new directory for your App, and then create a new Golang module `go mod init`:

```shell
mkdir my-app
cd my-app
go mod init github.com/MY_USERNAME/MY_APP_REPO
```

Install the driver using `go get`. The version number `v1.1.0` in the command below  can be updated to reference newer releases.

```shell
go get github.com/mattermost/mattermost-plugin-apps@v1.1.0
```

### Main package

At its core, an App is a collection of HTTP REST endpoints. The Apps framework includes an HTTP REST handler (router) implementation for convenience.
The HTTP handler can be swapped out for any handler that implements the Golang `http.Handler` interface.

Using the provided HTTP handler, a `main.go` file for an App would look like the following:

```go
package main

import (
    "net/http"
    "github.com/mattermost/mattermost-plugin-apps/utils/httputils"
)

func main() {
    // Create an instance of the endpoint handler
    handler := httputils.NewHandler()
    
    // HTTP endpoints will be defined here
    
    // Start the HTTP server using the endpoint handler
    server := http.Server{
		Addr:    "my-app-hostname:4000",
		Handler: handler,
	}
	_ = server.ListenAndServe()
}
```

## Manifest

The App manifest is an instance of the `apps.Manifest` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Manifest">}}) struct.

```go
var (
    appManifest = apps.Manifest{
		AppID:       apps.AppID("hello-world"),
		Version:     apps.AppVersion("0.1.0"),
		HomepageURL: "https://github.com/MY_USERNAME/MY_APP_REPO",
		DisplayName: "Hello world!",
		Description: "Example Golang App for Mattermost",
		Icon:        "icon.png",
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

A utility method, `httputils.DoHandleJSON` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/utils/httputils#DoHandleJSON">}}), simplifies the `manifest.json` handler by automating the conversion of the response data to JSON and sending the response.

```go
func main() {
    // ...
    handler.HandleFunc("/manifest.json", httputils.DoHandleJSON(appManifest))
    // ...
}
```

The `httputils` package can be referenced by adding `"github.com/mattermost/mattermost-plugin-apps/utils/httputils"` to the import statement.

## Bindings and forms

App bindings and forms use the `apps.Binding` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding">}}) and `apps.Form` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form">}}) structs, respectively.

```go
var (
    // A form with a single text input field and a Submit button
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

    // Bind a button that shows a Form to the Channel Header
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

    // Bind a slash command using a Form for input
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

    // Collect all App bindings into a slice
	bindings = []apps.Binding{
		channelHeaderBinding,
		commandBinding,
	}
)
```

A utility method, `apps.NewDataResponse` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#NewDataResponse">}}), along with `apps.DoHandleJSON`, simplifies the bindings handler by wrapping the bindings in an `apps.CallResponse` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallResponse">}}) struct, converting it to JSON, and sending the response.

```go
func main() {
    // ...
    handler.HandleFunc("/bindings", httputils.DoHandleJSON(apps.NewDataResponse(bindings)))
    // ...
}
```

## Call handlers

The call handler's request body contains a JSON-marshalled version of the `apps.CallRequest` ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest">}}) struct.
The response body is an instance of the `apps.CallResponse` struct marshalled to JSON.
Several [helper functions](#call-response-helpers) are available to construct common call responses such as text, form, or lookup.

```go
func submitHandler(w http.ResponseWriter, r *http.Request) {
	// Unmarshal the request body into an apps.CallRequest struct
	callRequest := new(apps.CallRequest)
	err := json.NewDecoder(r.Body).Decode(callRequest)
	if err != nil {
		// handle the error
		return
	}

	// Construct the response message using the input form's `message` value
	message := "Hello, world!"
	submittedMessage, ok := callRequest.Values["message"].(string)
	if ok {
		message += " ...and " + submittedMessage + "!"
	}

	// Create an instance of the API Client
	botClient := appclient.AsBot(callRequest.Context)

	// Post a DM
	channel, _, err := botClient.CreateDirectChannel(
	    callRequest.Context.BotUserID,
	    callRequest.Context.ActingUser.Id,
	)
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
	callResponse := apps.NewTextResponse("Created a post in your DM channel.")
	err = httputils.WriteJSON(w, callResponse)
	if err != nil {
		// handle the error
		return
	}
}
```

The call handler is registered with the HTTP router in a similar way to the bindings and manifest endpoints.

```go
func main() {
    // ...
    handler.HandleFunc("/submit", submitHandler)
    // ...
}
```

## Static assets

Apps usually contain a number of static assets such as images that are collected in a single location, such as a disk or compiled into the App binary.
Golang provides a helper function, `http.FileServer` ({{<newtabref title="godoc" href="https://pkg.go.dev/net/http#FileServer">}}), which creates a static asset handler suitable for serving assets from a disk.
In the example below, a handler for static assets in the `static` directory is registered for all endpoint paths beginning with `/static/`.

```go
func main() {
    // ...
    handler.
        PathPrefix("/static/").
        Handler(http.FileServer(http.Dir("static")))
    // ...
}
```

{{<note>}}
When referencing a static asset in a manifest, binding, or form, a prefix of `/static/` is implicitly added to the asset name.
{{</note>}}

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
	"github.com/mattermost/mattermost/server/public/model"
)

var (
	// App manifest
	appManifest = apps.Manifest{
		AppID:       apps.AppID("hello-world"),
		Version:     apps.AppVersion("0.1.0"),
		HomepageURL: "https://github.com/MY_USERNAME/MY_APP_REPO",
		DisplayName: "Hello world!",
		Description: "Example Golang App for Mattermost",
		Icon:        "icon.png",
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

    // A form with a single text input field and a Submit button
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

    // Bind a button that shows a Form to the Channel Header
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

    // Bind a slash command using a Form for input
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

    // Collect all App bindings into a slice
	bindings = []apps.Binding{
		channelHeaderBinding,
		commandBinding,
	}
)

// Handlers

func submitHandler(w http.ResponseWriter, r *http.Request) {
	// Unmarshal the request body into an apps.CallRequest struct
	callRequest := new(apps.CallRequest)
	err := json.NewDecoder(r.Body).Decode(callRequest)
	if err != nil {
		// handle the error
		return
	}

	// Construct the response message using the input form's `message` value
	message := "Hello, world!"
	submittedMessage, ok := callRequest.Values["message"].(string)
	if ok {
		message += " ...and " + submittedMessage + "!"
	}

	// Create an instance of the API Client
	botClient := appclient.AsBot(callRequest.Context)

	// Post a DM
	channel, _, err := botClient.CreateDirectChannel(
	    callRequest.Context.BotUserID,
	    callRequest.Context.ActingUser.Id,
	)
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
	callResponse := apps.NewTextResponse("Created a post in your DM channel.")
	err = httputils.WriteJSON(w, callResponse)
	if err != nil {
		// handle the error
		return
	}
}

func main() {
	// Create an instance of the endpoint handler
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

## Function reference

### Call response helpers

The following call response helpers are part of the `apps.CallResponse` type ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallResponse">}}):

| Function name       | Description                                                                                                                                                                                                                               |
|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `NewErrorResponse`  | Creates a new `apps.CallResponse` struct that wraps an `error` variable.                                                                                                                                                                  |
| `NewDataResponse`   | Creates a new `apps.CallResponse` struct using the supplied object as the value of the `data` field.                                                                                                                                      |
| `NewTextResponse`   | Creates a new `apps.CallResponse` struct using the supplied string as the value of the `text` field.                                                                                                                                      |
| `NewFormResponse`   | Creates a new `apps.CallResponse` struct using the supplied `apps.Form` struct as the value of the `form` field.                                                                                                                          |
| `NewLookupResponse` | Creates a new `apps.CallResponse` struct using the supplied slice of select field options (`[]apps.SelectOption` {{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#SelectOption">}}). |

### Utility functions

The following utility functions are part of the `httputils` package ({{<newtabref title="godoc" href="https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/utils/httputils">}}):

| Function name      | Description                                                                                           |
|--------------------|-------------------------------------------------------------------------------------------------------|
| `WriteJSONStatus`  | Marshalls the supplied object into JSON and sends the JSON data with a custom HTTP status code.       |
| `WriteJSON`        | Marshalls the supplied object into JSON and sends the JSON data with a `200 OK` HTTP status code.     |
| `DoHandleJSONData` | Creates a handler function that responds with JSON-encoded data in the form of a byte slice.          |
| `DoHandleData`     | Creates a handler function that responds with the supplied byte slice and HTTP `Content-Type` header. |
| `DoHandleJSON`     | Creates a handler function that responds with the JSON-encoded version of the supplied object.        |
