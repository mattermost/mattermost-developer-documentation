---
title: "App Lifecycle"
heading: "The App Lifecycle"
description: "The app lifecycle."
section: "apps"
weight: 100
---

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

All files in the static folder of the bundle are considered to be the app's static assets and are stored in the above mentioned bucket. Stored assets also have semantic keys and are generated using the rule - `static/$appID_$appVersion/filename`. For example `servicenow` app's static file key can be `"static/com.mattermost.servicenow_0.1.0_app/photo.png"`. The app developer does not need to worry about the static asset keys, as the Apps Plugin takes care of it.

The `manifest.json` file of an app is stored in the same S3 bucket as well with the key - `manifests/$appID_$appVersion.json`.

![](provisioning-in-3rd-party-aws.png)

### Provisioning in Mattermost AWS Cloud

To be provisioned in AWS Mattermost Cloud an app bundle is uploaded to the specific S3 bucket. On a new app release, a bundle is created by the circleCI and uploaded to S3. [Mattermost apps cloud deployer](https://github.com/mattermost/mattermost-apps-cloud-deployer), running as a k8s cron job every hour, detects the S3 upload, creates appropriate lambda functions, assets, and manifest the same way the **appsclt** does for the third-party accounts.

The deployer needs lambda function names, asset keys, and manifest key to provision the app. It calls the `aws.GetProvisionDataFromFile(/PATH/TO/THE/APP/BUNDLE)` from the Apps Plugin to get the provision data. Same data can be generated using the command:

`go run ./cmd/appsctl/ generate-terraform-data /PATH/TO/YOUR/APP/BUNDLE` 

![](provisioning-in-mm-aws.png)

## Publish

Publishing or registering an app in a Mattermost installation means the app will be shown in the Marketplace of the installation and it can be later installed by the System Admin and used by the users. On a totally new app registration or on a registration of the new version of the already registered app, a new version of the Apps Plugin is cut. The `manifests.json` file is updated and a new app is added in the listing. Later, the plugin is installed in the appropriate installations (using feature flags if necessary).

After the plugin update Apps Plugin synchronizes the list of the registered apps by downloading appropriate manifests from the S3 and storing them in memory. So the Marketplace shows renewed app listings and sysadmin can install a new app (or new version). It's worth mentioning here that Apps Plugin needs AWS credentials to download from S3 as well as to invoke lambda functions. Those credentials are read from the following environment variables:

`APPS_INVOKE_AWS_ACCESS_KEY`

`APPS_INVOKE_AWS_SECRET_KEY`

## Install

Installing is a process when a System Admin installs provisioned and already registered/published apps in their Mattermost installation. As mentioned above the list of the registered apps are in the memory of the Apps Plugin. Whenever the System Admin executes an `/install` slash command or selects **Install** in the Marketplace, appropriate permissions are requested and the app is installed. A bot and an OAuth app are created on installation, `OnInstall` call is sent to the app (relevant lambda function) as well.

![](install-mm-aws-app.png)

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
