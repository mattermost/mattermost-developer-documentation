---
title: "Apps"
heading: "Mattermost Apps"
description: "Mattermost Apps."
date: "2017-01-19T12:01:23-04:00"
section: "integrate"
---

# Overview

Apps are lightweight interactive add-ons to mattermost. Apps can:

- Display interactive, dynamic Modal forms and Message Actions.
- Attach themselves to locations in the Mattermost UI (e.g. channel bar buttons, post menu, channel menu, commands), and can add their custom /commands with full Autocomplete.
- Receive webhooks from Mattermost, and from 3rd parties, and use the Mattermost REST APIs to post messages, etc.
- Be hosted externally (HTTP), on Mattermost Cloud (AWS Lambda), and soon on-prem and in customers' own AWS environments.
- Be developed in any language*.

# Contents

## Development environment

- DRAFT [Google Doc](https://docs.google.com/document/d/1-o9A8l65__rYbx6O-ZdIgJ7LJgZ1f3XRXphAyD7YfF4/edit#) - Dev environment doc.

## Hello, World

- [Anatomy](01-anatomy-hello.md) of a simple app.

## Functions, Calls

- Example: [Hello, World](/server/examples/go/helloworld/hello.go#L45) `send` function.
- [Post Menu Message Flow](02-example-post-menu.md) - message flow to define a Post Menu action, then have a user click it.
- godoc: [Call](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Call) - describes how to call a function.
- godoc: [CallRequest](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest) - structure of a request to a function.
- godoc: [Context](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Context) - extra data passed to call requests.
- godoc: [Expand](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Expand) - controls context expansion.

## Forms

- Example: [Hello, World](/server/examples/go/helloworld/send_form.json) `send` form.
- [Interactive Message Flows](03-example-interactivity.md) - message flow to define a Post Menu action, then have a user click it.
- godoc [Form](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Form)
- godoc [Field](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Field)

## Bindings and Locations

- Example: [Hello, World](/server/examples/go/helloworld/bindings.json) bindings.
- godoc [Binding](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Binding)

## Autocomplete

- Example: [Hello, World](/server/examples/go/helloworld/bindings.json) bindings.

## Modals

- Example: [Hello, World](/server/examples/go/helloworld/send_form.json) `send` form.

## In-Post Interactivity

## [Using Mattermost APIs](05-using-mattermost-api.md)

## [Using 3rd party APIs](06-using-3rdparty-api.md)

## App Lifecycle
- [App Lifecycle](07-lifecycle.md)
- godoc: [appsctl](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/cmd/appsctl) - CLI tool used to provision Mattermost Apps in development and production.


# Hello World!

Here is an example of an HTTP App ([source](/examples/go/helloworld)),
written in Go and runnable on http://localhost:8080. 

- It contains a `manifest.json`, declares itself an HTTP application that acts
  as a bot and attaches to locations in UI.
- In its `bindings` function it attaches `send-modal` to a button in the channel
  header, and `send` to a /helloworld command
- It contains a `send` function that sends a parameterized message back to the
  user. 
- It contains a `send-modal` function that forces displaying the `send` form as
  a Modal.

To install "Hello, World" on a locally-running instance of Mattermost follow
these steps (go 1.16 is required):
```sh
cd .../mattermost-plugin-apps/examples/go/helloworld
go run . 
```

In Mattermost desktop app run:
```
/apps debug-add-manifest --url http://localhost:8080/manifest.json
/apps install --app-id helloworld
```

Then you can try clicking the "Hello World" channel header button, which brings up a modal:
![image](https://user-images.githubusercontent.com/1187448/110829345-da81d800-824c-11eb-96e7-c62637242897.png)
type `testing` and click Submit, you should see:
![image](https://user-images.githubusercontent.com/1187448/110829449-fb4a2d80-824c-11eb-8ade-d20e0fbd1b94.png)

You can also use `/helloworld send` command.

## Manifest
The manifest declares App metadata, For HTTP apps like this no paths mappings
are needed. The Hello World App requests the *permission* to act as a Bot, and
to *bind* itself to the channel header, and to /commands.

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

## Bindings and Locations
Locations are named elements in Mattermost UI. Bindings specify how App's calls
should be displayed at, and invoked from these locations. 

The Hello App creates a Channel Header button, and adds a `/helloworld send` command.

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

## Functions and Form
Functions handle user events and webhooks. The Hello World App exposes 2 functions:
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

The functions use a simple form with 1 text field named `"message"`, the form
submits to `/send`.

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

# App Lifecycle

## App Bundle

An app bundle is a convenient way to deliver an app to the Mattermost ecosystem. It provides a way to organize code and resources needed for an app to run. An app bundle is created by the developer of the app. Mattermost uses app bundles to provision and install/uninstall apps.

The app bundle contains a `manifest.json` file, a `static/` folder (optional), and one or several lambda function bundles.

- The `static/` folder contains all the static files the app needs. For the Mattermost AWS apps static files are automatically provisioned and stored in the dedicated AWS S3 bucket. Apps have unlimited access to them by providing the static file name to the Apps Plugin. For the third-party hosted AWS apps, static files are stored in the different S3 bucket (specified by the third-party). For the HTTP Apps, when creating a server, the developer should store the static files in the `/static/$FILE_NAME` relative URL.
- The `manifest.json` file contains details about the app such as appID, appVersion, appType (HTTP or an AWS app), requested permissions, requested locations, and information about the functions such as function path, name, runtime and handler.
- Each of the lambda function bundles is a valid and runnable AWS Lambda function, which are provisioned in the AWS by the [Mattermost Apps Cloud Deployer](https://github.com/mattermost/mattermost-apps-cloud-deployer). The AWS Lambda function bundle is a `.zip` file which contains scripts or compiled programs and their dependencies. Note that it must be less than 50 MB.Exact specification of the bundle varies for different runtimes. For example one can see more details for `node.js` bundles [here](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html).

## Development

## Submit to Marketplace

## Provision

### Provisioning in third-party AWS

Note that third-party apps are not supported in the Mattermost Cloud, they are used only for developer testing convenience. Provisioning in the third party AWS cloud environment is done by the **appsctl** tool using the command:

`go run ./cmd/appsctl/ provision app /PATH/TO/YOUR/APP/BUNDLE`

It reads appropriate AWS credentials from environment variables:

`APPS_PROVISION_AWS_ACCESS_KEY`

`APPS_PROVISION_AWS_SECRET_KEY`

We need an app bundle to provision an app. The bundle might be provisioned from the local disk, from S3 (not implemented yet) or from some URL (not implemented yet). Provisioning consists of three parts:

1. Creating the lambda functions with appropriate policies.
2. Storing static assets in the dedicated S3 bucket.
3. Storing app’s manifest file in the same dedicated S3 bucket.

AWS Lambda functions have semantic names, which means that a function described in the manifest.json file translates to AWS as `$appID_$appVersion_$functionName` to avoid collisions with other apps' or other versions' functions. And **appsctl** provisions lambda functions using this name. For example a name of a `servicenow` app's lambda function might be `com-mattermost-servicenow_0-1-0_go-function`. App developer does not need to worry about the AWS lambda function names, Apps Plugin takes care of it. Dedicated S3 bucket name is stored in the environment variable:

`MM_APPS_S3_BUCKET`

which stores all apps' static assets and manifest files.

All files in the static folder of the bundle are considered to be the app's static assets and are stored in the above mentioned bucket. Stored assets also have semantic keys and are generated using the rule - `static/$appID_$appVersion/filename`. For example `servicenow` app's static file key can be `"static/com.mattermost.servicenow_0.1.0_app/photo.png"`. App developer does not need to worry about the static asset keys, Apps Plugin takes care of it.

The `manifest.json` file of an app is stored in the same S3 bucket as well with the key - `manifests/$appID_$appVersion.json`.

![](imgs/provisioning-in-3rd-party-aws.png)

### Provisioning In Mattermost AWS Cloud

To be provisioned in AWS Mattermost Cloud an app bundle is uploaded to the specific S3 bucket. On a new app release, a bundle is created by the circleCI and uploaded to S3. [Mattermost apps cloud deployer](https://github.com/mattermost/mattermost-apps-cloud-deployer), running as a k8s cron job every hour, detects the S3 upload, creates appropriate lambda functions, assets, and manifest the same way the **appsclt** does for the third-party accounts.

The deployer needs lambda function names, asset keys, and manifest key to provision the app. It calls the `aws.GetProvisionDataFromFile(/PATH/TO/THE/APP/BUNDLE)` from the Apps Plugin to get the provision data. Same data can be generated using the command:

`go run ./cmd/appsctl/ generate-terraform-data /PATH/TO/YOUR/APP/BUNDLE` 

![](imgs/provisioning-in-mm-aws.png)

## Publish

Publishing or registering an app in a Mattermost installation means the app will be shown in the Marketplace of the installation and it can be later installed by the System Admin and used by the users. On a totally new app registration or on a registration of the new version of the already registered app, a new version of the Apps Plugin is cut. The `manifests.json` file is updated and a new app is added in the listing. Later, the plugin is installed in the appropriate installations (using feature flags if necessary). 

After the plugin update Apps Plugin synchronizes the list of the registered apps by downloading appropriate manifests from the S3 and storing them in memory. So the Marketplace shows renewed app listings and sysadmin can install a new app(or new version). It is worth mentioning here that Apps Plugin needs AWS credentials to download from S3 as well as to invoke lambda functions. Those credentials are read from the following environment variables:

`APPS_INVOKE_AWS_ACCESS_KEY`

`APPS_INVOKE_AWS_SECRET_KEY`

## Install

Installing is a process when sysadmin installs provisioned and already registered/published apps in their Mattermost installation. As mentioned above list of the registered apps are in the memory of the Apps Plugin. Whenever the System Admin executes an `/install` slash command or selects **Install** in the Marketplace appropriate permissions are requested and the app is installed. A bot and an OAuth app are created on installation, `OnInstall` call is sent to the app(relevant lambda function) as well.

![](imgs/install-mm-aws-app.png)

Apps are installed with `apps install`:

- Manifest -> Installed App
  - Consent to permissions, locations, OAuth app type
  - Create Bot+Access Token, OAuth App
  - HTTP: collect app’s JWT secret
- Invoke “OnInstall” callback on the App
  - Admin access token
- Also Uninstall/Enable/Disable per App

## Uninstall

A System Admin can uninstall an app using the `/uninstall` slash command. On uninstallation appropriate bot and an OAuth app are deleted, `OnUninstall` call is sent to the app as well. Worth mentioning that the current implementation is not deleting the user data.

## Upgrade/downgrade consideration

## appsctl

# Interactivity

This page shows the payloads for browser request/responses, and App server request/responses.

## Get Bindings

<details><summary>Client Bindings Request</summary>

`GET` /plugins/com.mattermost.apps/api/v1/bindings?user_id=ws4o4macctyn5ko8uhkkxmgfur&channel_id=qphz13bzbf8c7j778tdnaw3huc&scope=webapp

</details>

<details><summary>MM Bindings Request</summary>
POST /plugins/com.mattermost.apps/example/hello/bindings

```json
{
    "path": "/bindings",
    "context": {
        "app_id": "helloworld",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    }
}
```
</details>

<details><summary>App Binding Response</summary>

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
                    "label": "send hello message",
                    "call": {
                        "path": "/send-modal"
                    }
                }
            ]
        },
        {
            "location": "/post_menu",
            "bindings": [
                {
                    "location": "send-button",
                    "icon": "http://localhost:8080/static/icon.png",
                    "label": "send hello message",
                    "call": {
                        "path": "/send",
                        "expand": {
                            "post": "all"
                        }
                    }
                }
            ]
        },
        {
            "location": "/command",
            "bindings": [
                {
                    "icon": "http://localhost:8080/static/icon.png",
                    "description": "Hello World app",
                    "hint": "[send]",
                    "bindings": [
                        {
                            "location": "send",
                            "label": "send",
                            "call": {
                                "path": "/send-modal"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```
</details>

## Clicked Channel Header

<details><summary>Client Submit Request</summary>

POST /plugins/com.mattermost.apps/api/v1/call

```json
{
    "path": "/send-modal/submit",
    "context": {
        "app_id": "helloworld",
        "location": "send-button",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "user_agent": "webapp"
    },
    "expand": {}
}
```

</details>

<details><summary>MM Submit Request</summary>

POST /plugins/com.mattermost.apps/example/hello/send-modal/submit
```json
{
    "path": "/send-modal/submit",
    "expand": {},
    "context": {
        "app_id": "helloworld",
        "location": "send-button",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "sqo3nwt377ys3co78jzye3cwmw"
    }
}
```

</details>

<details><summary>App Form Response</summary>

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
            },
            {
                "type": "user",
                "name": "user",
                "label": "user",
                "refresh": true
            },
            {
                "type": "dynamic_select",
                "name": "lookup",
                "label": "lookup"
            }
        ],
        "call": {
            "path": "/send"
        }
    }
}
```

</details>

## Selected user in modal

`refresh: true` is used to tell the client to notify the server when a value is selected from this field

<details><summary>Client Form Request</summary>

POST /plugins/com.mattermost.apps/api/v1/call

```json
{
    "path": "/send/form",
    "expand": {},
    "values": {
        "message": "This is great!",
        "user": {
            "label": "mickmister",
            "value": "81bqom3kjjbo7bcjcnzs6dc8uh"
        }
    },
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "f45uwdqsejdnzjtyy19ysqr44w",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    },
    "raw_command": "/helloworld send",
    "selected_field": "user"
}
```

</details>

<details><summary>MM Form Request</summary>

POST /plugins/com.mattermost.apps/hello/send/form

```json
{
    "path": "/send/form",
    "expand": {},
    "values": {
        "message": "This is great!",
        "user": {
            "label": "mickmister",
            "value": "81bqom3kjjbo7bcjcnzs6dc8uh"
        }
    },
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "f45uwdqsejdnzjtyy19ysqr44w",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    },
    "raw_command": "/helloworld send",
    "selected_field": "user"
}
```

</details>

<details><summary>App Form Response</summary>

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
			},
			{
				"type": "user",
				"name": "user",
				"label": "user",
				"refresh": true
			},
			{
				"type": "dynamic_select",
				"name": "lookup",
				"label": "lookup"
			}
        ],
        "call": {
            "path": "/send"
        }
    }
}
```

</details>

## Dynamic Lookup

<details><summary>Client Lookup Request</summary>

POST /plugins/com.mattermost.apps/api/v1/call

```json
{
    "path": "/send/lookup",
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "root_id": "",
        "channel_id": "f45uwdqsejdnzjtyy19ysqr44w",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "user_agent": "webapp"
    },
    "values": {
        "message": null,
        "user": null,
        "lookup": {
            "icon_data": "",
            "label": "Option 1",
            "value": "option1"
        }
    },
    "expand": {},
    "raw_command": "/helloworld send",
    "query": "o",
    "selected_field": "lookup"
}
```

</details>

<details><summary>MM Lookup Request</summary>

POST /plugins/com.mattermost.apps/example/hello/send/lookup

```json
{
    "path": "/send/lookup",
    "expand": {},
    "values": {
        "lookup": {
            "icon_data": "",
            "label": "Option 1",
            "value": "option1"
        },
        "message": null,
        "user": null
    },
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "f45uwdqsejdnzjtyy19ysqr44w",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    },
    "raw_command": "/helloworld send",
    "selected_field": "lookup",
    "query": "o"
}
```

</details>

<details><summary>App Lookup Response</summary>

```json
{
    "type": "ok",
    "data": {
        "items": [
            {
                "label": "Option 1",
                "value": "option1",
                "icon_data": ""
            },
            {
                "label": "Option 2",
                "value": "option2",
                "icon_data": ""
            }
        ]
    }
}
```

</details>

## Submitted Modal

<details><summary>Client Submit Request</summary>

POST /plugins/com.mattermost.apps/api/v1/call
```json
{
    "path": "/send/submit",
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "root_id": "",
        "channel_id": "qxb1zg7eqjn1ixwuwhwtgmt55o",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "user_agent": "webapp"
    },
    "values": {
        "message": "the message",
        "user": {
            "label": "mickmister",
            "value": "81bqom3kjjbo7bcjcnzs6dc8uh"
        },
        "lookup": {
            "icon_data": "",
            "label": "Option 1",
            "value": "option1"
        }
    },
    "expand": {},
    "raw_command": "/helloworld send"
}
```

</details>

<details><summary>MM Submit Request</summary>

POST /plugins/com.mattermost.apps/example/hello/send/submit

```json
{
    "path": "/send/submit",
    "expand": {},
    "values": {
        "lookup": {
            "icon_data": "",
            "label": "Option 1",
            "value": "option1"
        },
        "message": "the message",
        "user": {
            "label": "mickmister",
            "value": "81bqom3kjjbo7bcjcnzs6dc8uh"
        }
    },
    "context": {
        "app_id": "helloworld",
        "location": "/command",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "qxb1zg7eqjn1ixwuwhwtgmt55o",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    },
    "raw_command": "/helloworld send"
}
```

</details>

<details><summary>App Submit Response</summary>

```json
{
    "type":"ok",
    "markdown":"Sent survey to mickmister."
}
```

</details>

## Returning a single error

<details><summary>Main Error Response</summary>

```json
{
    "type":"error",
    "error":"This is the error."
}
```

</details>

## Returning errors for specific fields

<details><summary>Field-specific Error Response</summary>

```json
{
    "type":"error",
    "data": {
        "errors":{
            "somefield": "This field seems to have an invalid value."
        }
    }
}
```

</details>

## Returning a main error and errors for specific fields (includes picture)

<details><summary>Main Error and Field-specific Error Response</summary>

```json
{
    "type":"error",
    "error":"This is the error.",
    "data": {
        "errors":{
            "somefield": "This field seems to have an invalid value."
        }
    }
}
```

![modal-errors.png](https://user-images.githubusercontent.com/6913320/112268885-0722f000-8c4e-11eb-9ad1-2874e89049cd.png)

</details>

# Post Menu Example

In this example, the bindings specify to expand the post the user clicks on:

![binding-form-diagram.png](https://user-images.githubusercontent.com/6913320/109165112-2e6ac800-7749-11eb-8d83-d495258f3f1e.png)

<details><summary>Diagram Source</summary>

https://sequencediagram.org

```
title Bindings + Form Example

Client->MM: Visit ChannelA, fetch bindings (Client Bindings Request)
MM->App:Fetch bindings with call (MM Bindings Request)
App->3rd Party Integration:Check user status
3rd Party Integration->App:Return user status
App->MM:Return bindings (App Bindings Response)
MM->Client:Return bindings, render App's post menu item
Client->MM:Clicked post menu item. Perform submit call (Client Submit Request)
MM->App:Perform submit call (MM Submit Request)
App->3rd Party Integration:Do something useful
3rd Party Integration->App:Return something useful
App->MM:Return new modal form (App Form Response)
MM->Client:Return modal form, open modal
```

</details>

## Fetch bindings

<details><summary>Client Bindings Request</summary>

GET /plugins/com.mattermost.apps/api/v1/bindings?channel_id=ei748ohj3ig4ijofs5tr47wozh&scope=webapp

</details>

<details><summary>MM Bindings Request</summary>
POST /plugins/com.mattermost.apps/example/hello/bindings

```json
{
    "path": "/bindings",
    "context": {
        "app_id": "helloworld",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "gcn6r3ac178zbxwiw5pc38e8zc"
    }
}
```

</details>

<details><summary>App Bindings Response</summary>

```json
{
    "type": "ok",
    "data": [
        {
            "location": "/post_menu",
            "bindings": [
                {
                    "location": "send-button",
                    "icon": "http://localhost:8080/static/icon.png",
                    "label": "send hello message",
                    "call": {
                        "path": "/send-modal",
                        "expand": {
                            "post": "all"
                        }
                    }
                }
            ]
        }
    ]
}
```
</details>

## Clicked post menu item

<details><summary>Client Submit Request</summary>

POST /plugins/com.mattermost.apps/api/v1/call
```json
{
    "path": "/send-modal/submit",
    "expand": {
        "post": "all"
    },
    "context": {
        "app_id": "helloworld",
        "location": "send-button",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "post_id": "jysnx7byebf49yxx1uynefajiy",
        "root_id": "",
        "user_agent": "webapp"
    }
}
```

</details>

<details><summary>MM Submit Request</summary>

POST /plugins/com.mattermost.apps/example/hello/send/submit
```json
{
    "path": "/send-modal/submit",
    "expand": {
        "post": "all"
    },
    "context": {
        "app_id": "helloworld",
        "location": "send-button",
        "bot_user_id": "i4wzxbk1hbbufq8rnecso96oxr",
        "acting_user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
        "team_id": "t35b8k7hginoujwn76tfatue5e",
        "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
        "post_id": "jysnx7byebf49yxx1uynefajiy",
        "mattermost_site_url": "http://localhost:8065",
        "user_agent": "webapp",
        "bot_access_token": "sqo3nwt377ys3co78jzye3cwmw",
        "post": {
            "id": "jysnx7byebf49yxx1uynefajiy",
            "create_at": 1616447014367,
            "update_at": 1616447014367,
            "edit_at": 0,
            "delete_at": 0,
            "is_pinned": false,
            "user_id": "81bqom3kjjbo7bcjcnzs6dc8uh",
            "channel_id": "ytqokpzzcinszf7ywrbdfitusw",
            "root_id": "",
            "parent_id": "",
            "original_id": "",
            "message": "Hey I have a question",
            "type": "",
            "props": {},
            "hashtags": "",
            "pending_post_id": "",
            "reply_count": 0,
            "last_reply_at": 0,
            "participants": null
        }
    }
}
```

</details>

<details><summary>App Form Response</summary>

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
            },
            {
                "type": "user",
                "name": "user",
                "label": "user",
                "refresh": true
            },
            {
                "type": "dynamic_select",
                "name": "lookup",
                "label": "lookup"
            }
        ],
        "call": {
            "path": "/send"
        }
    }
}
```

</details>

# Using Mattermost APIs

## Authentication and Permissions

**OAuth2 is not yet implemented, for now session tokens are passed in as ActingUserAccessToken**

An app can use the Mattermost server REST API, as well as new "App Services" APIs offered specifically to Mattermost Apps. An app authenticates its requests to Mattermost by providing access tokens, usually Bot Access token, or user's OAuth2 access token. Each call request sent to the app includes Mattermost site URL, and optionally one or more access tokens the app can use.

What tokens the app gets, and what access the app may have with them depends on the combination of App granted permissions, the tokens requested in call.Expand, and their respective access rights.

- godoc: [Permission](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Permission) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Permission) -
  describes the available permissions.
- tickets:
  - [MM-??]()

## Apps Subscriptions API
- godoc: [Subscription](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) -
  [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps#Subscription) -
  describes the Subscription request.
- godoc: [Go Client](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client.Subscribe) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client.Subscribe) - The methods to post Subscribe/Unsubscribe requests.

Subscribe and Unsubscribe APIs are invocable with Bot, User, or Admin tokens, however they may fail if the token lacks access to the resource. For instance, the app's Bot account needs to be invited to the channel before the app can subscribe to the events in the channel as the Bot. 
## Apps KV Store API
- godoc: [Go Client](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client.KVDelete) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client.KVDelete) - The methods for KV Get/Set/Delete requests.

The KV APIs require the use of the Bot Account Token, and will fail if a user token is provided.

## Mattermost REST API
- godoc: [Go Client](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client) - [local](http://localhost:6060/pkg/github.com/mattermost/mattermost-plugin-apps/apps/mmclient/#Client) - mmclient.Client includes the *model.Client4 Mattermost REST API client, pre-initialized with the auth token.

# Using 3rd party APIs

Mattermost Apps framework provides services for using remote (3rd party) OAuth2
HTTP APIs, and receiving authenticated webhook notifications from remote
systems. There are 2 examples here to illustrate the [OAuth2](#hello-oauth2) and
[webhook](#hello-webhooks) support.

## Hello OAuth2!

Here is an example of an HTTP App ([source](/examples/go/hello-oauth2)),
written in Go and runnable on http://localhost:8080. 

- It contains a `manifest.json`, declares itself an HTTP application, requests
  permissions and binds itself to locations in the Mattermost UI.
- In its `bindings` function it declares 3 commands: `configure`, `connect`, and
  `send`.
- Its `send` function mentions the user by their Google name, and lists their
  Google Calendars.

To install "Hello, OAuth2" on a locally-running instance of Mattermost follow
these steps (go 1.16 is required):
```sh
cd .../mattermost-plugin-apps/examples/go/hello-oauth2
go run . 
```

In Mattermost desktop app run:
```
/apps debug-add-manifest --url http://localhost:8080/manifest.json
/apps install --app-id hello-oauth2
```

You need to configure your [Google API
Credentials](https://console.cloud.google.com/apis/credentials) for the App. Use
`{MattermostSiteURL}/com.mattermost.apps/apps/hello-oauth2/oauth2/remote/complete`
for the `Authorized redirect URIs` field. After configuring the credentials, in Mattermost desktop app run:
```
/hello-oauth2 configure --client-id {ClientID} --client-secret {ClientSecret}
```

Now, you can connect your account to Google with `/hello-oauth2 connect` command, and then try `/hello-oauth2 send`.

### Manifest
Hello OAuth2! is an HTTP App, it requests the *permissions* to act as an Admin to change the App's OAuth2 config, as a User to connect and send. It binds itself to /commands.

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

### Bindings and Locations
The Hello OAuth2! creates 3 commands: `/helloworld configure|connect|send`.

```json
{
	"type": "ok",
	"data": [
		{
			"location": "/command",
			"bindings": [
				{
					"icon": "http://localhost:8080/static/icon.png",
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

`/hello-oauth2 configure` sets up the Google OAuth2 credentials. It accepts 2
string flags, `--client-id` and `--client-secret`. Submit will require an Admin
token to affect the changes.

```json
{
	"type": "form",
	"form": {
		"title": "Configures Google OAuth2 App credentials",
		"icon": "http://localhost:8080/static/icon.png",
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

The command handler uses an admin-only `StoreOAuth2App` API to store the
credentials, and make them available to future Calls with
`expand.oauth2_app="all"`.

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

### Connecting as a User

#### connect Command
`/hello-oauth2 connect` formats and displays a link that starts the OAuth2 flow
with the remote system. The URL (provided to the app in the `Context`) is
handled by the apps framework. It will:
- create a 1-time secret ("state")
- invoke
oauth2Connect to generate the remote URL that starts the flow
- redirect the user's browser there

Note expand.oauth2_app="all" in the form definition, it includes the App's
OAuth2 Mattermost-hosted callback URL in the request Context.

This command should soon be provided by the framework, see
[MM-34561](https://mattermost.atlassian.net/browse/MM-34561).

```json
{
	"type": "form",
	"form": {
		"title": "Connect to Google",
		"icon": "http://localhost:8080/static/icon.png",
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

#### OAuth2 Call Handlers

To handle the OAuth2 "connect" flow, the app provides 2 Calls: `/oauth2/connect` that returns the URL to redirect the user to, and `/oauth2/complete` which gets invoked once the flow is finished, and the `state` parameter is verified.

```go
	// Handle an OAuth2 connect URL request.
	http.HandleFunc("/oauth2/connect", oauth2Connect)

	// Handle a successful OAuth2 connection.
	http.HandleFunc("/oauth2/complete", oauth2Complete)
```

**oauth2Connect** extracts the necessary data from the request's Context and Values ("state"), and composes a Google OAuth2 initial URL.

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

**oauth2Complete** is called upon the successful completion (including the
validation of the "state"). It is responsible for creating an OAuth2 token, and
storing it in the Mattermost OAuth2 user store.

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

#### Obtaining an OAuth2 "Config" for a Call

The App is responsible for composing its own remote OAuth2 config, using the
remote system-specific settings. The ClientID and ClientSecret are stored in
Mattermost OAuth2App record, and are included in the request Context if
specified with expand.oauth2_app="all".

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

### send Command

`/hello-oauth2 send` sends the user a message that includes the Google user name
on the account, and lists the Google Calendars.

The form requests that submit calls expand "oauth2_user" which is where the app
stored the OAuth2 token upon a successful connect.

```json
{
	"type": "form",
	"form": {
		"title": "Send a Google-connected 'hello, world!' message",
		"icon": "http://localhost:8080/static/icon.png",
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
