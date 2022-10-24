---
title: "Developer setup"
heading: "Mattermost developer setup"
description: "Learn how to set up your Mattermost environment to develop and deploy plugins with our guide to developer setup."
date: 2020-07-11T23:00:00-04:00
weight: 20
aliases:
  - /extend/plugins/developer-setup/
---

Once you have your [server]({{< ref "/contribute/more-info/server/developer-setup" >}}) and [webapp]({{< ref "/contribute/more-info/webapp/developer-setup" >}}) set up, you can start developing on plugins.

{{<note "Note:">}}
Plugin development doesn't require a development build of Mattermost. Development builds of Mattermost are only required if you want to develop for Mattermost internally.
{{</note>}}

For developing on Mattermost-managed plugins, each plugin's setup instructions can be found in the plugin repository's README. Some plugins do not have external dependencies and require little to no setup, like the [Todo Plugin](https://github.com/mattermost/mattermost-plugin-todo) while others require an external service to be set up, like the [Jira Plugin](https://github.com/mattermost/mattermost-plugin-jira) and [GitHub Plugin](https://github.com/mattermost/mattermost-plugin-github).

## Set up your environment to deploy plugins

### Deploy with local mode

{{<note "Note:">}}
Deploying with local mode will only work for plugins that have been updated with the functionality from the [Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template).
{{</note>}}

If your Mattermost server is running locally, you can enable [local mode](https://docs.mattermost.com/manage/mmctl-command-line-tool.html#local-mode) and [plugin uploads](https://docs.mattermost.com/configure/configuration-settings.html#enable-plugin-uploads) to streamline deploying your plugin. Edit your server configuration as follows:

```json
{
    "ServiceSettings": {
        // ...
        "EnableLocalMode": true,
        "LocalModeSocketLocation": "/var/tmp/mattermost_local.socket"
    },
    "PluginSettings": {
        // ...
        "Enable": true,
        "EnableUploads": true
    }
}
```

and then deploy your plugin:

```shell
make deploy
```

You may also customize the Unix socket path:

```shell
export MM_LOCALSOCKETPATH=/var/tmp/alternate_local.socket
make deploy
```

### Deploy with authentication credentials

Alternatively, you can authenticate with the server's API with credentials:

```shell
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_USERNAME=admin
export MM_ADMIN_PASSWORD=password
make deploy
```

or with a [personal access token](https://docs.mattermost.com/developer/personal-access-tokens.html):

```shell
export MM_SERVICESETTINGS_SITEURL=http://localhost:8065
export MM_ADMIN_TOKEN=j44acwd8obn78cdcx7koid4jkr
make deploy
```
