---
title: "Hello, lambda!"
heading: "Hello, Lambda! Test App"
description: "TODO"
weight: 50
---

The hello-lambda test app is available if you would like to test provisioning an app. This will add a manifest to the S3 bucket and add a corresponding lambda function to AWS. The app can then be installed from your Mattermost server and tested through the `/hello-lambda` slash command.

Build hello-lambda bundle

`cd ./examples/go/hello-lambda && make dist; cd -`  
`go run ./cmd/appsctl provision app ./examples/go/hello-lambda/dist/bundle.zip`
