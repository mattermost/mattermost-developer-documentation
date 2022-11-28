---
title: "Package Apps for AWS"
heading: "Package Apps for AWS Lambda"
weight: 30
aliases:
  - /integrate/apps/package/
  - /integrate/apps/package-aws/
---

Developers must prepare apps for deployment to AWS which includes creating an app bundle and making the app runnable as an AWS Lamda function.

## App bundle

An app bundle is a convenient way to deliver an app to the Mattermost ecosystem. It provides a way to organize code and resources needed for an app to run. An app bundle is created by the developer of the app. Mattermost uses app bundles to deploy and install/uninstall apps.

The app bundle contains a `manifest.json` file, a `static/` folder (optional), and one or several lambda function bundles.

- The `static/` folder contains all the static files the app needs. For the Mattermost AWS apps, static files are automatically deployed and stored in the dedicated AWS S3 bucket. Apps have unlimited access to them by providing the static file name to the Apps Plugin. For the third-party hosted AWS apps, static files are stored in a different S3 bucket (specified by the third-party). For the HTTP apps, when creating a server, the developer should store the static files in the `/static/$FILE_NAME` relative URL.
- The `manifest.json` file contains details about the app such as appID, appVersion, appType (HTTP or an AWS app), requested permissions, requested locations, and information about the functions such as function path, name, runtime, and handler.
- Each of the lambda function bundles is a valid and runnable AWS Lambda function, deployed in AWS by the {{< newtabref href="https://github.com/mattermost/mattermost-apps-cloud-deployer" title="Mattermost Apps Cloud Deployer" >}}. The AWS Lambda function bundle is a `.zip` file which contains scripts or compiled programs and their dependencies. Note that it must be smaller than 50 MB. Exact specification of the bundle varies for different runtimes. For example one can see more details for `node.js` bundles {{< newtabref href="https://docs.aws.amazon.com/lambda/latest/dg/nodejs-package.html" title="here" >}}.

## Making your app runnable as an AWS Lambda function

In order for your app to run as an AWS Lambda function it must use one of the supported languages for AWS Lambda. You can find the list {{< newtabref href="https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html" title="here" >}}.

It's important to design an app in a _stateless_ way, as its lifetime only spans one request. No persistent information should be stored except using the [store API endpoints]({{< ref "mattermost-api#apps-kv-store-api" >}}) provided by the Apps Framework.

A language library is used to emulate an HTTP to your app. For go you might use https://github.com/awslabs/aws-lambda-go-api-proxy.

Finally you need to define the AWS function in the manifest of your app by adding `aws_lambda` to it which has the following fields:

| Name      | Description                                                                                                              |
|:----------|:-------------------------------------------------------------------------------------------------------------------------|
| `path`    | The lambda function with its path being the longest-matching prefix of the call's path which will be invoked for a call. |
| `name`    | A human-readable name.                                                                                                   |
| `handler` | The name of the handler function.                                                                                        |
| `runtime` | The AWS Lambda runtime to use.                                                                                           |

For a go app the manifest snippet would look like this:

```json
{
    "aws_lambda": [
        {
            "path": "/",
            "name": "go-function",
            "handler": "$YOUR_APP_NAME",
            "runtime": "go1.x"
        }
    ]
}
```
