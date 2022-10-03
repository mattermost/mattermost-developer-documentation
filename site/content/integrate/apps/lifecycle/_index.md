---
title: "Lifecycle"
heading: "The App lifecycle"
description: "The App lifecycle"
weight: 20
aliases:
  - /integrate/apps/api/lifecycle/
mermaid: true
---

## Install an App

App installation refers to the process of a System Admin installing deployed apps within their Mattermost installation.
Whenever the System Admin executes an `/apps install` slash command, or selects **Install** in the Marketplace, appropriate permissions are requested and the App is installed.
During an App installation, both a bot and an OAuth app are created, and an `OnInstall` [callback]({{<ref "/integrate/apps/lifecycle/callbacks">}}) is sent to the App if it's defined in the manifest.

{{<mermaid>}}
sequenceDiagram
    actor System Admin
    System Admin->>Mattermost server: install app
    Mattermost server->>Apps framework: install app
    Apps framework->>App: request manifest
    App->>Apps framework: send manifest
    Apps framework->>System Admin: request permissions
    System Admin->>Apps framework: grant permissions
    Apps framework->>Mattermost server: create bot
    Apps framework->>Mattermost server: create OAuth app
    Apps framework->>Apps framework: enable app
    Apps framework->>App: call OnInstall if defined
{{</mermaid>}}

### `/apps install` parameters

The generic form of the `/apps install` command is:

```
/apps install <DeployMethod> <ManifestURL>
```

{{<note "AWS Lambda deployments:">}}
For AWS Lambda deployments, replace `ManifestURL` with `AppID` in the above command example. The `AppID` is defined in the App's [manifest]({{<ref "/integrate/apps/structure/manifest">}}).
{{</note>}}

The `DeployMethod` specifies how the App is deployed. The following values are supported:

- `http`
- `aws_lambda` (serverless)
- `open_faas` (serverless)

The `ManifestURL` is the URL to the App's [`manifest.json`]({{<ref "/integrate/apps/structure/manifest">}}) data.

For example, use the following command to install an App that was deployed via HTTP to `http://my-app:8000`:

```
/apps install http http://my-app:8000/manifest.json
```

## Uninstall an App

A System Admin can uninstall an App using the `/apps uninstall` slash command. During the uninstallation process, both the bot and the OAuth app are deleted, and an `OnUninstall` [callback]({{<ref "/integrate/apps/lifecycle/callbacks">}}) is sent to the App if it's defined in the manifest.

{{<mermaid>}}
sequenceDiagram
    actor System Admin
    System Admin->>Mattermost server: uninstall app
    Mattermost server->>Apps framework: uninstall app
    Apps framework->>App: call OnUninstall if defined
    Apps framework->>Apps framework: disable app
    Apps framework->>Mattermost server: delete bot
    Apps framework->>Mattermost server: delete OAuth app
{{</mermaid>}}

## `/apps uninstall` parameters

The generic form of the `/apps uninstall` command is:

```
/apps uninstall <AppID>
```

The `AppID` is defined in the App's manifest.

For example, use the following command to uninstall an App with an `AppID` of `my-app`:

```
/apps uninstall my-app
```

## Register an App

Registering an App in a Mattermost installation means the App is available in the product Marketplace, can be installed by the System Admin, and once installed, can be available to users.
When a new App is registered, or a new version of an existing App is registered, the `manifest.json` data from the App is updated, and a new App is added to the product Marketplace.

After registration, the Mattermost server synchronizes the list of the registered Apps by downloading appropriate manifests from the file store and storing them in memory. The product Marketplace shows updated App listings and the System Admin can install the App or new version of the App.

{{<note "AWS credentials">}}
The Apps Plugin needs AWS credentials to download from S3 and to invoke lambda functions. The credentials are read from the following environment variables:
- `APPS_INVOKE_AWS_ACCESS_KEY`
- `APPS_INVOKE_AWS_SECRET_KEY`
{{</note>}}
