---
title: "Hello World in Go"
heading: "Create a Hello World Mattermost app in Go"
description: "This quick start guide will walk you through the basics of creating a hello world Mattermost app in Go."
weight: 10
aliases:
  - /integrate/apps/quick-start-go/
---

This quick start guide will walk you through the basics of creating a hello world Mattermost app in Go. In this guide you will review an app that:

- Contains a `manifest.json`, declares itself an HTTP application that acts as a bot, and attaches to locations in the Mattermost interface.
- Attaches the form `send-modal` in its `bindings` to a button in the channel header, and the form `send` to a `/helloworld` command.
- Contains a `send` function that sends a parameterized message back to the user.
- Contains a `send-modal` function that forces displaying the `send` form as a modal.

## Prerequisites

Before you can start with your app, you first need to set up your environment by following the [developer setup guide]({{< ref "/integrate/apps/quickstart" >}}).

You also need at least `go1.16` installed. Please follow the [official guide](https://golang.org/doc/install) to install the latest version.

## Download and start the app

In the same [mattermost-app-examples repository](https://github.com/mattermost/mattermost-app-examples) you cloned via the [developer setup guide]({{< ref "/integrate/apps/quickstart" >}}) above, navigate to the [`golang/hello-world`](https://github.com/mattermost/mattermost-app-examples/tree/master/golang/hello-world) directory and start the Docker compose:

```sh
cd golang/hello-world
docker compose up
```

You'll see Docker install the Go modules and then the app will come online and print the following message:

```
Use '/apps install http http://mattermost-apps-golang-hello-world:4000/manifest.json' to install the app
```

## Install the app on Mattermost

Next, access your development Mattermost server at [http://localhost:8065](http://localhost:8065) and use the `/apps install http http://mattermost-apps-golang-hello-world:4000/manifest.json` slash command to install the hello world app. Select `Agree to grant the app access to APIs and Locations` and click `Submit` to finish the installation.

## Use the app

Select the "Hello World" channel header button in Mattermost, which brings up a modal:

![image](modal.png)

Type `testing` and select **Submit**, you should see:

![image](submit.png)

You can also use the `/helloworld send` command by typing `/helloworld send --message Hi!`. This posts the message to the Mattermost channel that you're currently in:

![image](command.png)

## Review the app

To understand the app, examine the following elements:

### Manifest

The app must provide a manifest, which declares app metadata. In this example, the following permissions are requested via the `/manifest.json` endpoint:

- Create posts as a bot.
- Render icons in the channel header that will communicate with your app when clicked.
- Create slash commands.

### Bindings and locations

Locations are named elements in the Mattermost user interface. Bindings specify how an app's calls should be displayed and invoked from these locations.

The app creates a channel header button, and adds a `/helloworld send` slash command.

### Functions and forms

Functions handle user events and webhooks. The Hello World app exposes two functions:

- `/send` that services the command and modal.
- `/send-modal` that forces the modal to be displayed.

The functions use a simple form with one text field named `message`, the form submits to `/send`.

### Assets

Apps may include static assets. Only one asset is used in this example for the two bindings, `icon.png`. Static assets must be served under the `static` path.

## Uninstall the app

Once you're done with the app, you can uninstall it via the `/apps uninstall hello-world` slash command. Alternatively, you can use `/apps debug clean` to remove all data for all installed apps.

To stop and clean up the app from Docker after you're done, use the following command in the `golang/hello-world` directory:

```sh
docker compose down
```

## Conclusion

You now know how to create a Mattermost app in Go. If you have questions about building apps or want to show off what you're building, join us on the [Integrations & Apps channel in the Mattermost Community server](https://community.mattermost.com/core/channels/integrations)!
