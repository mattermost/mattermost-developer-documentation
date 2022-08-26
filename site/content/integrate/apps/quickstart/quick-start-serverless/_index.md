---
title: "Serverless on AWS or OpenFaaS in Go"
heading: "Create a serverless Mattermost app on AWS or OpenFaaS in Go"
description: "This quick start guide will walk you through the basics of using creating a serverless Mattermost app in Go on AWS or OpenFaaS."
weight: 10
aliases:
  - /integrate/apps/quick-start-serverless/
---

This quick start guide will walk you through the basics of using creating a serverless Mattermost app in Go on AWS or OpenFaaS. In this guide you will review an app that:

- Contains a `manifest.json`, declares itself an HTTP application that acts as a bot, uses webhooks, and attaches to locations in the Mattermost interface.
- Attaches `send` function to a `/hello-serverless` command, accepting an optional `message` argument.

This app will focus on the functionality of the actual serverless app in this example. For more information about [how to package a Mattermost app for serverless deployments]({{< ref "/integrate/apps/deploy/package-for-aws/" >}}), [how to deploy a Mattermost app to AWS]({{< ref "/integrate/apps/deploy/deploy-aws/" >}}), or [how to deploy a Mattermost app to OpenFaaS]({{< ref "/integrate/apps/deploy/deploy-openfaas/" >}}) please refer to the corresponding guides.

## Prerequisites

Before you can start with your app, you first need to set up your environment by following the [developer setup guide]({{< ref "/integrate/apps/quickstart" >}}).

You also need at least `go1.16` installed. Please follow the [official guide](https://golang.org/doc/install) to install the latest version.

## Download and start the app

In the same [mattermost-app-examples repository](https://github.com/mattermost/mattermost-app-examples) you cloned via the [developer setup guide]({{< ref "/integrate/apps/quickstart" >}}) above, navigate to the [`golang/serverless`](https://github.com/mattermost/mattermost-app-examples/tree/master/golang/serverless) directory and start the Docker compose:

```sh
cd golang/serverless
docker compose up
```

The `docker-compose.yml` uses the HTTP-based version of the serverless app for the sake of trying it out locally. You'll see Docker install the Go modules and then the app will come online and print the following message:

```
Install via /apps install http http://mattermost-apps-golang-serverless:8080/manifest.json 
```

## Install the app on Mattermost

Next, access your development Mattermost server at [http://localhost:8065](http://localhost:8065) and use the `/apps install http http://mattermost-apps-golang-serverless:8080/manifest.json ` slash command to install the webhooks app. Select `Agree to grant the app access to APIs and Locations` and click `Submit` to finish the installation.

## Use the app

You can now use the `/hello-serverless send` command with an optional `message` argument. This will cause the app's bot user to DM you a response:

![image](response.png)

If you included `message` in the slash command, that would also be included in the response.

## Review the app

To understand the app, examine the following elements:

### Manifest

The app must provide a manifest, which declares app metadata. In this example, the following permissions are requested via the `/manifest.json` endpoint:

- Create posts as a bot.
- Create slash commands.

### Bindings and locations

Locations are named elements in the Mattermost user interface. Bindings specify how an app's calls should be displayed and invoked from these locations. This app uses only uses the slash command location.

### Functions

Functions handle user events and webhooks. The webhooks app uses only one main function via a slash command:

- `/hello-serverless send` slash command with an optional `message` argument that sends DMs the user's channel via the app bot.

All of the logic for the serverless app can be found in `golang/serverless/function/handler.go`, which is the shared function file across all deployment types (HTTP, AWS, and OpenFaaS) for this app. In this file you can review the `send` function that corresponds with the above slash command via a binding. The binding contains a `form` with a `submit` function that sends an interpolated message back to the user. As a slash command, the form's one optional `message` will be collected as an argument from the user's command.

### Assets

Apps may include static assets. Only one asset is used in this example for this app, `icon.png`. Static assets must be served under the `static` path.

## Uninstall the app

Once you're done with the app, you can uninstall it via the `/apps uninstall hello-serverless` slash command. Alternatively, you can use `/apps debug clean` to remove all data for all installed apps.

To stop and clean up the app from Docker after you're done, use the following command in the `golang/serverless` directory:

```sh
docker compose down
```

## Explore serverless deployments

Now that you've examined the app in HTTP mode, you can next look at deploying them to your desired serverless plaform. Check out the guides on [how to deploy a Mattermost app to AWS]({{< ref "/integrate/apps/deploy/deploy-aws/" >}}) or [how to deploy a Mattermost app to OpenFaaS]({{< ref "/integrate/apps/deploy/deploy-openfaas/" >}}), depending on which platform you're targeting.

## Conclusion

You now know how to create a Mattermost app in Go. If you have questions about building apps or want to show off what you're building, join us on the [Integrations & Apps channel in the Mattermost Community server](https://community.mattermost.com/core/channels/integrations)!



This quick start guide explains the basics of writing a Mattermost app that can
be deployed to serverless platforms like AWS Lambda and OpenFaaS. In this guide
you will build an app that contains:

- [`manifest.json`](#1-manifest-manifestjson), declares itself an application
  that can be deployed as HTTP, AWS Lambda, or OpenFaaS, that acts as a bot, and
  attaches to locations in the user interface.
- [`static/`](#2-static-static) with static assets.
- [`function/`](#3-function-package) package that implements most of the app,
  and is ready to be deployed to OpenFaaS. [`bindings.json`](#bindingsjson) to
  attach the [`send_form.json`](#send_formjson) form to the `/hello-serverless
  send` command. [`send()`](#functiongo) go function sends a message back to the
  user.
- [`aws/`](#4-aws) folder with `main.go` for AWS Lambda.
- [`http/`](#5-http) folder with `main.go` to run a standalone HTTP server.
- [`openfaas/`](#6-openfaas) folder with `manifest.yml` to deploy as an OpenFaaS function, and
  a `golang-middleware` template.
- [`Makefile`](#7-makefile) that can build aws and openfaas bundles (`make dist`).

See complete source code of the example [here](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-serverless).



#### `send_form.json`

```json
{
	"type": "form",
	"form": {
		"title": "Hello, serverless!",
		"icon": "/static/icon.png",
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

### `function.go`

```go
package function

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/mattermost/mattermost-plugin-apps/apps"
	"github.com/mattermost/mattermost-plugin-apps/apps/appclient"
	"github.com/mattermost/mattermost-plugin-apps/utils/httputils"
)

//go:embed bindings.json
var bindingsData []byte

//go:embed send_form.json
var formData []byte

// Handler for OpenFaaS and faasd.
func Handle(w http.ResponseWriter, r *http.Request) {
	InitApp(apps.DeployOpenFAAS)
	http.DefaultServeMux.ServeHTTP(w, r)
}
```

Note: names `package function` and `func Handle` appear to be required
(hardcoded) for OpenFaaS.

`golang-middleware` template makes use of adding boilerplate handlers to
`http.DefaultServeMux`, so we just need to add our handlers and serve.

```go
var deployType apps.DeployType

func InitApp(dt apps.DeployType) {
	// Returns the Channel Header and Command bindings for the App.
	http.HandleFunc("/bindings", httputils.HandleJSONData(bindingsData))

	// The form for sending a Hello message.
	http.HandleFunc("/send/form", httputils.HandleJSONData(formData))

	// The main handler for sending a Hello message.
	http.HandleFunc("/send/submit", send)

	deployType = dt
}

func send(w http.ResponseWriter, req *http.Request) {
	creq := apps.CallRequest{}
	json.NewDecoder(req.Body).Decode(&creq)

	message := fmt.Sprintf("Hello from a serververless app running as %s!", deployType)
	v, ok := creq.Values["message"]
	if ok && v != nil {
		message += fmt.Sprintf(" ...and %s!", v)
	}

	asBot := appclient.AsBot(creq.Context)
	asBot.DM(creq.Context.ActingUserID, message)

	httputils.WriteJSON(w,
		apps.NewOKResponse(nil, "Created a post in your DM channel."))
}
```

#### `go.mod` and `go.sum`

Since package `function` is built independently by OpenFaaS, add its own `go.mod` for its ddependencies:

```
module {{path-to-your-module}}/function

go 1.16

require github.com/mattermost/mattermost-plugin-apps v0.8.0
```

### 7. `Makefile`
```make
.PHONY: all
## all: builds and runs the app locally
all: dist run
```

`make run` will run locally, as an http server

```make
.PHONY: run
## run: runs the app locally
run:
	go run ./http --manifest=manifest.json --static=static
```

`make dist-aws` will create an AWS bundle, a zip file that includes:
- `manifest.json`
- `/static`
- `hello-serverless.zip` which in turn contains a linux-amd64 executable,
  `hello-serverless`.

```make
.PHONY: dist-aws
## dist-aws: creates the bundle file for AWS Lambda deployments
dist-aws:
	rm -rf dist/aws && mkdir -p dist/aws
	cd aws ; \
	 	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o ../dist/aws/hello-serverless .
	cp manifest.json dist/aws
	cp -r static dist/aws
	cd dist/aws ; \
		zip -m hello-serverless.zip hello-serverless ; \
		zip -rm ../bundle-aws.zip hello-serverless.zip manifest.json static
	rm -r dist/aws
```

`make dist-openfaas` will create an OpenFaaS bundle, a zip file that includes:
- `manifest.json`
- `manifest.yml`
- `/static`
- `/function`
- `/template`
After unzipping and pre-processing `manifest.yml`, one should be able to run `faas-cli up -f manifest.yml` for the bundle.

```make
.PHONY: dist-openfaas
## dist-openfaas: creates the bundle file for OpenFaaS deployments
dist-openfaas:
	rm -rf dist/openfaas && mkdir -p dist/openfaas
	cp manifest.json dist/openfaas
	cp -r static dist/openfaas
	cp -r function dist/openfaas
	cp openfaas/manifest.yml dist/openfaas
	cp -r openfaas/template dist/openfaas
	cd dist/openfaas ; \
		zip -rq ../bundle-openfaas.zip *
	rm -r dist/openfaas

.PHONY: dist
## dist: creates all bundles
dist: dist-aws dist-openfaas
```
