---
title: Example Plugins
date: 2017-10-26T17:54:54-05:00
subsection: Plugins (Beta)
weight: 40
---

# Example Plugins

## Server "Hello, world!"

To get started extending server-side functionality with plugins, take a look at our [server "Hello, world!" tutorial](../server/hello-world).

## Web App "Hello, world!"

To get started extending browser-side functionality with plugins, take a look at our [web app "Hello, world!" tutorial](../webapp/hello-world).

## JIRA

The [JIRA plugin for Mattermost](https://github.com/mattermost/mattermost-plugin-jira) creates a webhook that your JIRA server can use to post messages to Mattermost when issues are created:

<img src="/img/extend/jira-plugin-screenshot.png" width="667" height="394" />

Topics demonstrated:

* Uses a custom HTTP handler to integrate with external systems.
* Defines a settings schema, allowing system administrators to configure the plugin via system console UI.
* Implements tests using the [plugin/plugintest](https://godoc.org/github.com/mattermost/mattermost-server/plugin/plugintest) package.
* Compiles and publishes releases for multiple platforms using Travis-CI.

## LDAP plugin to pull additional user attributes

This plugin is pre-packaged and can be used by Enterprise customers to pull additional user attributes.

**This endpoint only requires a valid session and no other permissions. Only non-confidential AD/LDAP fields should be exposed.**

1. Configure the LdapServer, LdapPort, BaseDN, BindUsername, BindPassword, UserFilter and IdAttribute fields under LdapSettings in config.json. 
  - When using SAML SSO, the IdAttribute must be the email field in LDAP that is mapped to the user in SAML.

2. Add the plugin configuration under PluginSettings.Plugins in config.json. The list under “Attributes” will specify which AD/LDAP attributes the API endpoint pulls.

```
"PluginSettings": {
    “Enable”: true,
    "Plugins": {
        "ldapextras": {
            "Enabled": true,
            "Attributes": ["attribute1", "attribute2"]
        }
    }
}
```

3. Restart the Mattermost server.
4. To confirm the plugin works, perform an HTTP GET against your-mattermost-url.com/plugins/ldapextras/users/{user_id}/attributes which will return a JSON object with attribute names as keys with the appropriate values.
