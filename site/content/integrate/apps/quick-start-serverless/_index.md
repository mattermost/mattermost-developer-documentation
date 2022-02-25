---
title: "Quick start guide (serverless)"
heading: "Writing a Mattermost app for AWS and OpenFaaS, in Go"
description: "This quick start guide will walk you through the basics of writing a Mattermost app that can be deployed to serverless platforms, in Go."
weight: 15
---

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
go get github.com/mattermost/mattermost-plugin-apps/apps@master
```

### 1. Manifest (`./manifest.json`)

Your app has to provide a manifest, which declares app metadata. In this example, the following permissions are requested:

- Act as the app's bot user.
- Create slash commands.

Create a file called `manifest.json` containing:

```json
{
	"app_id": "hello-serverless",
	"version": "demo",
	"display_name": "Hello, Serverless!",
	"homepage_url": "https://github.com/mattermost/mattermost-plugin-apps",
	"requested_permissions": [
		"act_as_bot"
	],
	"requested_locations": [
		"/command"
	],
	"http": {
		"root_url": "http://localhost:8080"
	},
	"aws_lambda": {
		"functions": [
			{
				"path": "/",
				"name": "hello-serverless",
				"handler": "hello-serverless",
				"runtime": "go1.x"
			}
		]
	},
	"open_faas": {
		"functions": [
			{
				"path": "/",
				"name": "hello"
			}
		]
	}
}
```

### 2. Static (`./static`)

The example app will use an icon, you can download an example icon using:

```bash
mkdir ./static
curl https://github.com/mattermost/mattermost-plugin-apps/raw/master/examples/go/hello-serverless/static/icon.png -o static/icon.png
```

### 3. `./function` package

#### `bindings.json`
```json
{
	"type": "ok",
	"data": [
		{
			"location": "/command",
			"bindings": [
				{
					"icon": "icon.png",
					"label": "hello-serverless",
					"description": "Hello Serverless app",
					"hint": "[send]",
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

```go
module {{path-to-your-module}}/function

go 1.16

require github.com/mattermost/mattermost-plugin-apps v0.8.0
```

### 4. `./aws`
#### `main.go`
```go
package main

import (
    "net/http"

    "github.com/aws/aws-lambda-go/lambda"
    "github.com/awslabs/aws-lambda-go-api-proxy/httpadapter"
    "github.com/mattermost/mattermost-plugin-apps/apps"

    "{{path-to-your-module}}/function"
)

func main() {
    function.InitApp(apps.DeployAWSLambda)

    // run with the Lambda request re-marshaled back into an http.Request so that it works with mux.
    lambda.Start(httpadapter.New(http.DefaultServeMux).Proxy)
}
```

#### `go.mod`
```go
module {{path-to-your-module}}/aws

go 1.16

require (
	github.com/aws/aws-lambda-go v1.19.1
	github.com/awslabs/aws-lambda-go-api-proxy v0.11.0
	github.com/mattermost/mattermost-plugin-apps v0.8.0
	{{path-to-your-module}}/function v0.0.0-00010101000000-000000000000
)

replace {{path-to-your-module}}/function => ../function
```

### 5. `./http`
#### `main.go`
The HTTP main serves `./static` and `manifest.json` in addition to the app call paths.

```go
package main

import (
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/mattermost/mattermost-plugin-apps/apps"
	"github.com/mattermost/mattermost-plugin-apps/utils/httputils"

	"{{path-to-your-module}}/function"
)

func main() {
	mpath := flag.String("manifest", "", "path to the manifest file to serve on /manifest.json")
	spath := flag.String("static", "", "path to the static folder to serve on /static")
	flag.Parse()

	if mpath != nil && *mpath != "" {
		mdata, err := os.ReadFile(*mpath)
		if err != nil {
			panic(err)
		}
		http.HandleFunc("/manifest.json", httputils.HandleJSONData(mdata))
	}

	if spath != nil && *spath != "" {
		http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir(*spath))))
	}

	function.InitApp(apps.DeployHTTP)
	fmt.Println("Listening on :8080")
	panic(http.ListenAndServe(":8080", nil))
}
```

#### `go.mod`
```go
module {{path-to-your-module}}/http

go 1.16

require (
	github.com/mattermost/mattermost-plugin-apps v0.8.0
	{{path-to-your-module}}/function v0.0.0-00010101000000-000000000000
)

replace {{path-to-your-module}}/function => ../function
```

### 6. `./openfaas`
#### `manifest.yml`
```yml
version: 1.0
provider:
  name: openfaas
  # gateway will be overwritten by appsctl
  gateway: http://192.168.64.3:8080
functions:
  hello:
    lang: golang-middleware
    build_args:
      GO111MODULE: on
    handler: ./function
    # docker registry name will be prepended by appsctl
	image: hello-openfaas
```

#### `template`
Can be obtained by running `faas-cli template pull https://github.com/MrWormHole/golang-http-template`

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
