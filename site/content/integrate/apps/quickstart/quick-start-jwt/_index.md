---
title: "JWT in Go"
heading: "Use JWT in a Mattermost App in Go"
description: "This quick start guide will walk you through the basics of using JWT in a Mattermost App in Go."
weight: 10
---

This quick start guide will walk you through the basics of using [JSON Web Tokens (JWT)](https://jwt.io/) in a Mattermost App in Go. In this guide you will review an App that:

- Contains a `manifest.json`, declares itself an HTTP application that acts as a bot, uses JWT, and attaches to locations in the Mattermost interface.
- Attaches the `send` function to a `/hello-jwt` command and wraps it with a function to authenticate JWT.

## Prerequisites

Before you can start with your App, you first need to set up your environment by following the [developer setup guide]({{< ref "/integrate/apps/quickstart" >}}).

You also need Go v1.16 or later installed. Please follow the [official guide](https://golang.org/doc/install) to install the latest version.

## Download and start the App

In the same [mattermost-app-examples repository](https://github.com/mattermost/mattermost-app-examples) you cloned via the [developer setup guide]({{< ref "/integrate/apps/quickstart" >}}) above, navigate to the [`golang/jwt`](https://github.com/mattermost/mattermost-app-examples/tree/master/golang/jwt) directory and start the Docker container:

```sh
cd golang/jwt
docker compose up
```

You'll see Docker install the Go modules and then the App will come online and print the following message:

```
Use '/apps install http http://mattermost-apps-golang-jwt:8084/manifest.json' to install the app
Use "1234" as the app's JWT secret
```

## Install the App on Mattermost

Next, access your development Mattermost Server at [http://localhost:8065](http://localhost:8065) and use the `/apps install http http://mattermost-apps-golang-jwt:8084/manifest.json` slash command to install the JWT App. Select `Agree to grant the app access to APIs and Locations`, enter the JWT secret (1234), and click `Submit` to finish the installation.

## Use the App

You can now use the `/hello-jwt send` command. This will cause the App's bot user to direct message (DM) you a response:

![image](response.png)

## Review the App

To understand the App, examine the following elements:

### Manifest

The App must provide a manifest, which declares App metadata. In this example, the following permissions are requested via the `/manifest.json` endpoint:

- Create posts as a bot.
- Create slash commands.
- Use JWT.

### Bindings and locations

Locations are named elements in the Mattermost user interface. Bindings specify how an App's calls should be displayed and invoked from these locations.

The App creates a `/hello-jwt send` slash command that checks the validity of the JWT.

### Functions

Functions handle user events and webhooks. The JWT App relies on one main function:

- `send` that services the command and modal. This function is wrapped with `withJWT` that requires JWT, which calls `checkJWT` to verify the provided token.

### Assets

Apps may include static assets. Only one asset is used in this example for this App: `icon.png`. Static assets must be served under the `static` path.

## Uninstall the App

Once you're done with the App, you can uninstall it via the `/apps uninstall hello-jwt` slash command. Alternatively, you can use `/apps debug clean` to remove all data for all installed Apps.

To stop and clean up the App from Docker after you're done, use the following command in the `golang/jwt` directory:

```sh
docker compose down
```

## Conclusion

You now know how to create a Mattermost App in Go. If you have questions about building Apps or want to show off what you're building, join us on the [Integrations & Apps channel in the Mattermost Community server](https://community.mattermost.com/core/channels/integrations)!
