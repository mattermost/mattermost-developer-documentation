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
    actor Sysadmin
    Sysadmin->>Mattermost Server: install app
    Mattermost Server->>Apps Plugin: install app
    Apps Plugin->>App: request manifest
    App->>Apps Plugin: send manifest
    Apps Plugin->>Sysadmin: request permissions
    Sysadmin->>Apps Plugin: grant permissions
    Apps Plugin->>Mattermost Server: create bot
    Apps Plugin->>Mattermost Server: create OAuth app
    Apps Plugin->>Apps Plugin: enable app
    Apps Plugin->>App: call OnInstall if defined
{{</mermaid>}}

### `/apps install` parameters

The generic form of the `/apps install` command is:

```
/apps install <DeployMethod> <ManifestURL>
```

The `DeployMethod` specifies how the App is deployed. The following values are supported:

- `http`
- `aws_lambda` (serverless)
- `open_faas` (serverless)

The `ManifestURL` is the URL to the App's `manifest.json` data.

For example, use the following command to install an App that uses HTTP and deploy it to `http://my-app:8000`:

```
/apps install http http://my-app:8000/manifest.json
```

## Uninstall an App

A System Admin can uninstall an App using the `/apps uninstall` slash command. During the uninstallation process, both the bot and the OAuth app are deleted, and an `OnUninstall` [callback]({{<ref "/integrate/apps/lifecycle/callbacks">}}) is sent to the App if it's defined in the manifest. User data is not deleted.

{{<mermaid>}}
sequenceDiagram
    actor Sysadmin
    Sysadmin->>Mattermost Server: uninstall app
    Mattermost Server->>Apps Plugin: uninstall app
    Apps Plugin->>App: call OnUninstall if defined
    Apps Plugin->>Apps Plugin: disable app
    Apps Plugin->>Mattermost Server: delete bot
    Apps Plugin->>Mattermost Server: delete OAuth app
{{</mermaid>}}

## `/apps uninstall` parameters

The generic form of the `/apps uninstall` command is:

```
/apps uninstall <AppName>
```

The `AppName` is the value of `AppID` in the App's manifest.

For example, use the following command to uninstall an App with an `AppID` of `my-app`:

```
/apps uninstall my-app
```

## Register an App

Registering an App in a Mattermost installation means the App is available in the product Marketplace, can be installed by the System Admin, and once installed, can be available to users.
When a new App is registered or a new version of an existing App is registered, the `manifest.json` data from the App updated and a new App is added in the Marketplace listing.
Later, the plugin is installed in the appropriate installations, using feature flags if necessary.

After registration, the Apps Plugin synchronizes the list of the registered Apps by downloading appropriate manifests from the S3 bucket and storing them in memory. The Marketplace shows renewed App listings and the System Admin can install a new App (or new version).
Note that the Apps Plugin needs AWS credentials to download from S3 and to invoke lambda functions. Those credentials are read from the following environment variables:

- `APPS_INVOKE_AWS_ACCESS_KEY`
- `APPS_INVOKE_AWS_SECRET_KEY`
