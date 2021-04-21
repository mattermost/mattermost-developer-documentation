---
title: "Hello World!"
heading: "Anatomy of a Hello World! App"
description: "Creating your first app."
section: "apps"
weight: 20
---

Here is an example of an HTTP app ([source](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld)), written in Go and runnable on http://localhost:8080.

- It contains a `manifest.json`, declares itself an HTTP application that acts as a bot and attaches to locations in the user interface.
- In its `bindings` function it attaches `send-modal` to a button in the channel header, and `send` to a `/helloworld` command.
- It contains a `send` function that sends a parameterized message back to the user. 
- It contains a `send-modal` function that forces displaying the `send` form as a modal.

To install "Hello, World" on a locally-running instance of Mattermost follow these steps (go 1.16 is required):

```sh
git clone https://github.com/mattermost/mattermost-plugin-apps.git
cd mattermost-plugin-apps/examples/go/helloworld
go run 
```

In the Mattermost Desktop App run:

```
/apps debug-add-manifest --url http://localhost:8080/manifest.json
/apps install --app-id helloworld
```

Then select the "Hello World" channel header button, which brings up a modal:

![image](modal.png)

Type `testing` and select **Submit**, you should see:

![image](submit.png)

You can also use `/helloworld send` command.

## Manifest

The manifest declares App metadata, For HTTP apps like this no path mappings are needed. The Hello World app requests the *permission* to act as a Bot, and to *bind* itself to the channel header, and to `/` commands.

```json
{
	"app_id": "helloworld",
	"display_name": "Hello, world!",
	"app_type": "http",
	"root_url": "http://localhost:8080",
	"requested_permissions": [
		"act_as_bot"
	],
	"requested_locations": [
		"/channel_header",
		"/command"
	]
}
```

## Bindings and locations

Locations are named elements in the Mattermost user interface. Bindings specify how  an app's calls should be displayed at, and invoked from, these locations.

The Hello, World! app creates a channel header button, and adds a `/helloworld send` command.

```json
{
	"type": "ok",
	"data": [
		{
			"location": "/channel_header",
			"bindings": [
				{
					"location": "send-button",
					"icon": "http://localhost:8080/static/icon.png",
					"label":"send hello message",
					"call": {
						"path": "/send-modal"
					}
				}
			]
		},
		{
			"location": "/command",
			"bindings": [
				{
					"icon": "http://localhost:8080/static/icon.png",
					"label": "helloworld",
					"description": "Hello World app",
					"hint":        "[send]",
					"bindings": [
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

## Functions and form

Functions handle user events and webhooks. The Hello World app exposes two functions:

- `/send` that services the command and modal.
- `/send-modal` that forces the modal to be displayed.

```go
func main() {
	// Serve its own manifest as HTTP for convenience in dev. mode.
	http.HandleFunc("/manifest.json", writeJSON(manifestData))

	// Returns the Channel Header and Command bindings for the App.
	http.HandleFunc("/bindings", writeJSON(bindingsData))

	// The form for sending a Hello message.
	http.HandleFunc("/send/form", writeJSON(formData))

	// The main handler for sending a Hello message.
	http.HandleFunc("/send/submit", send)

	// Forces the send form to be displayed as a modal.
	// TODO: ticket: this should be unnecessary.
	http.HandleFunc("/send-modal/submit", writeJSON(formData))

	// Serves the icon for the App.
	http.HandleFunc("/static/icon.png", writeData("image/png", iconData))

	http.ListenAndServe(":8080", nil)
}

func send(w http.ResponseWriter, req *http.Request) {
	c := apps.CallRequest{}
	json.NewDecoder(req.Body).Decode(&c)

	message := "Hello, world!"
	v, ok := c.Values["message"]
	if ok && v != nil {
		message += fmt.Sprintf(" ...and %s!", v)
	}
	mmclient.AsBot(c.Context).DM(c.Context.ActingUserID, message)

	json.NewEncoder(w).Encode(apps.CallResponse{})
}
```

The functions use a simple form with one text field named `"message"`, the form submits to `/send`.

```json
{
	"type": "form",
	"form": {
		"title": "Hello, world!",
		"icon": "http://localhost:8080/static/icon.png",
		"fields": [
			{
				"type": "text",
				"name": "message",
				"label": "message"
			}
		],
		"call": {
			"path": "/send"
		}
	}
}
```

## Icons 

Apps may include static assets. At the moment, only icons are used.
