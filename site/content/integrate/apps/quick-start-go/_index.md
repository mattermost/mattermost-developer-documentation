---
title: "Quick start guide (Go)"
heading: "Writing a Mattermost app in Go"
description: "This quick start guide will walk you through the basics of writing a Mattermost app in Go."
weight: 10
---

This quick start guide explains the basics of writing a Mattermost app. In this guide you will build an app that:

- Contains a `manifest`, declares itself an HTTP application that acts as a bot, and attaches to locations in the user interface.
- Attaches the form `send-modal` in its `bindings` to a button in the channel header, and the form `send` to a `/helloworld` command.
- Contains a `send` function that sends a parameterized message back to the user.
- Contains a `send-modal` function that forces displaying the `send` form as a modal.

## Prerequisites

Before you can start with your app, you first need to set up a local developer environment following the [server](/contribute/server/developer-setup/) and [webapp](/contribute/webapp/developer-setup/) setup guides. You must enable the apps feature flag before starting the Mattermost server by setting the environment variable `MM_FEATUREFLAGS_AppsEnabled` to `true` by e.g. adding `export MM_FEATUREFLAGS_AppsEnabled=true` to your `.bashrc` or using `make run-server MM_FEATUREFLAGS_AppsEnabled=true`.

In the System Console, ensure that the following are set to **true**:

- `Enable Bot Account Creation`
- `Enable OAuth 2.0 Service Provider`

You also need at least `go1.16` installed. Please follow the guide [here](https://golang.org/doc/install) to install the latest version.

### Install the Apps plugin

The [apps plugin](https://github.com/mattermost/mattermost-plugin-apps) is a communication bridge between your app and the Mattermost server. To install it on your local server, start by cloning the code in a directory of your choice run:

```bash
git clone https://github.com/mattermost/mattermost-plugin-apps.git
```

Then build the plugin using:

```bash
cd mattermost-plugin-apps
make dist
```

Then upload it to your local Mattermost server via the System Console.

## Building the app

Start building your app by creating a directory for the code and setting up a new go module:

```bash
mkdir my-app
cd my-app
go mod init my-app
go get github.com/mattermost/mattermost-plugin-apps@master
```

## Inside the app

You can use the
[helloworld](https://github.com/mattermost/mattermost-plugin-apps/examples/go/hello-world)
example as a starting point for your app.

The `helloworld` app adds a `/helloworld send` command, with an optional custom
message, and sends it back to the user. It also adds a button in the channel
header that displays a modal prompt to enter the message, then executes the same
`send` function upon submit.

It is built as an http server, exposes `/manifest.json` for its manifest,
`/bindings` for the bindings definitions, and `/send` for the send command. The
form used to gather the custom message is static, and is embedded in the
bindings. 

It conists of just 2 files: `hello.go` with all of the app's logic, and
`icon.png` for the display of the app and its messages.

#### hello.go

```go
package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/mattermost/mattermost-plugin-apps/apps"
	"github.com/mattermost/mattermost-plugin-apps/apps/appclient"
	"github.com/mattermost/mattermost-plugin-apps/utils/httputils"
)

//go:embed icon.png
var IconData []byte

// Manifest declares the app's metadata. It must be provided for the app to be
// installable. In this example, the following permissions are requested:
//   - Create posts as a bot.
//   - Add icons to the channel header that will call back into your app when
//     clicked.
//   - Add a /-command with a callback.
var Manifest = apps.Manifest{
	// App ID must be unique across all Mattermost Apps.
	AppID: "hello-world",

	// App's release/version.
	Version: "v0.8.0",

	// A (long) display name for the app.
	DisplayName: "Hello, world!",

	// The icon for the app's bot account, same icon is also used for bindings
	// and forms.
	Icon: "icon.png",

	// HomepageURL is required for an app to be installable.
	HomepageURL: "https://github.com/mattermost/mattermost-plugin-apps/examples/go/hello-world",

	// Need ActAsBot to post back to the user.
	RequestedPermissions: []apps.Permission{
		apps.PermissionActAsBot,
	},

	// Add UI elements: a /-command, and a channel header button.
	RequestedLocations: []apps.Location{
		apps.LocationChannelHeader,
		apps.LocationCommand,
	},

	// Running the app as an HTTP service is the only deployment option
	// supported.
	Deploy: apps.Deploy{
		HTTP: &apps.HTTP{
			RootURL: "http://localhost:4000",
		},
	},
}

// The details for the App UI bindings
var Bindings = []apps.Binding{
	{
		Location: apps.LocationChannelHeader,
		Bindings: []apps.Binding{
			{
				Location: "send-button",        // an app-chosen string.
				Icon:     "icon.png",           // reuse the App icon for the channel header.
				Label:    "send hello message", // appearance in the "more..." menu.
				Form:     &SendForm,            // the form to display.
			},
		},
	},
	{
		Location: "/command",
		Bindings: []apps.Binding{
			{
				// For commands, Location is not necessary, it will be defaulted to the label.
				Icon:        "icon.png",
				Label:       "helloworld",
				Description: "Hello World app", // appears in autocomplete.
				Hint:        "[send]",          // appears in autocomplete, usually indicates as to what comes after choosing the option.
				Bindings: []apps.Binding{
					{
						Label: "send", // "/helloworld send" sub-command.
						Form:  &SendForm,
					},
				},
			},
		},
	},
}

// SendForm is used to display the modal after clicking on the channel header
// button. It is also used for `/helloworld send` sub-command's autocomplete. It
// contains just one field, "message" for the user to customize the message.
var SendForm = apps.Form{
	Title: "Hello, world!",
	Icon:  "icon.png",
	Fields: []apps.Field{
		{
			Type:  "text",
			Name:  "message",
			Label: "message",
		},
	},
	Submit: apps.NewCall("/send"),
}

// main sets up the http server, with paths mapped for the static assets, the
// bindings callback, and the send function.
func main() {
	// Serve static assets: the manifest and the icon.
	http.HandleFunc("/manifest.json",
		httputils.DoHandleJSON(Manifest))
	http.HandleFunc("/static/icon.png",
		httputils.DoHandleData("image/png", IconData))

	// Bindinings callback.
	http.HandleFunc("/bindings",
		httputils.DoHandleJSON(Bindings))

	// The main handler for sending a Hello message.
	http.HandleFunc("/send", Send)

	addr := ":4000" // matches manifest.json
	fmt.Println("Listening on", addr)
	fmt.Println("Use '/apps install http http://localhost" + addr + "/manifest.json' to install the app") // matches manifest.json
	log.Fatal(http.ListenAndServe(addr, nil))
}

// Send sends a DM back to the user.
func Send(w http.ResponseWriter, req *http.Request) {
	c := apps.CallRequest{}
	json.NewDecoder(req.Body).Decode(&c)

	message := "Hello, world!"
	v, ok := c.Values["message"]
	if ok && v != nil {
		message += fmt.Sprintf(" ...and %s!", v)
	}
	appclient.AsBot(c.Context).DM(c.Context.ActingUserID, message)

	httputils.WriteJSON(w,
		apps.NewTextResponse("Created a post in your DM channel."))
}
```


#### icon.png

Apps may include icons. In this example, the icon is served directly from the go program, as `/static/icon.png`. One can also create and serve an entire `/static` folder using `http.FileServer`. Static assets must be served under the `static` path.

Download the example icon using:

```bash
curl https://github.com/mattermost/mattermost-plugin-apps/raw/master/examples/go/hello-world/icon.png -o icon.png
```

## Installing the app

Run your app using:

```
go run .
```

Then run the following slash commands on your Mattermost server:

```
/apps install http http://localhost:4000/manifest.json
```

Confirm the installation in the modal that pops up.

## Using the app

Select the "Hello World" channel header button in Mattermost, which brings up a modal:

![image](modal.png)

Type `testing` and select **Submit**, you should see:

![image](submit.png)

You can also use the `/helloworld send` command by typing `/helloworld send --message Hi!`. This posts the message to the Mattermost channel that you're currently in.

![image](command.png)


## Uninstalling the app

Uninstall the app using:

```
/apps uninstall hello-world
```
