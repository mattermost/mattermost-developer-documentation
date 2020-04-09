---
title: "Best Practices"
subsection: Plugins (Beta)
weight: 90
---

See here for [server-specific best practices for plugins](/extend/plugins/server/best-practices/). Webapp-specific best practices are incoming.

## How can a plugin enable its configuration through the System Console?

Once a plugin is installed, Administrators have access to the plugin's configuration page in the __System Console > Plugins__ section. The configurable settings must first be defined in the plugin's manifest [setting schema](https://developers.mattermost.com/extend/plugins/manifest-reference/#settings_schema). The web app supports several basic pre-defined settings type, e.g. `bool` and `dropdown`, for which the corresponding UI components are provided in order to complete configuration in the System Console.

These settings are stored within the server configuration under [`Plugins`] indexed by plugin ids. The plugin's server code can access their current configuration calling the [`getConfig`](https://developers.mattermost.com/extend/plugins/server/reference/#API.GetConfig) API call and can also make changes as needed with [`saveConfig`](https://developers.mattermost.com/extend/plugins/server/reference/#API.SaveConfig).

## How can a plugin define its own setting type?

A plugin could define its own type of setting with a corresponding custom user interface that will be displayed in the System Console following the process below.  

1. Define a `type: custom` setting in the plugins manifest `settings_schema`

```diff
"settings_schema": {
    "settings": [{
        "key": "NormalSetting",
        "type": "text",
+    }, {
+        "key": "CustomSetting",
+        "type": "custom"
    }]
}
```

2. In the plugin's web app code, define a custom component to manage the plugin's custom setting and register it in the web app with [`registerAdminConsoleCustomSetting`](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerAdminConsoleCustomSetting). This component will be instantiated in the System Console with the following `props` passed in:

    - `id`: The setting `key` as defined in the plugin manifest within `settings_schema.settings`.
    - `label`: The text for the component label based on the setting's `displayName` defined in the manifest. 
    - `helpText`: The help text based on the setting's `helpText` defined in the manifest. 
    - `value`: The setting's current json value in the config at the time the component is loaded.
    - `disabled`: Boolean indicating if the setting is disabled by a parent component within the System Console.
    - `config`: The server configuration loaded by the web app.
    - `license`: The license information for the related Mattermost server.
    - `setByEnv`: Boolean that indicates if the setting is based on a server environment variable. 
    - `onChange`: Function that receives the setting id and current json value of the setting when it has been changed within the custom component. 
    - `setSaveNeeded`: Function that will prompt the System Console to enable the Save button in the plugin settings screen. 
    - `registerSaveAction`: Registers the given function to be executed when the setting is saved. This is registered when the custom component is mounted.
    - `unRegisterSaveAction`: On unmount of the custom component, unRegisterSaveAction will remove the registered function executed on save of the custom component.

3. On initialization of the custom component, the current value of the custom setting is passed in the `props.value` in a json format as read from the config. This value can be processed as necessary to display in your custom UI and ready to be modified by the end user. In the example below, it processes the initial `props.value` and sets it in a local state for the component to use as needed:

```
constructor(props) {
        super(props);

        this.state = {
            attributes: this.initAttributes(props.value),
        }
    }
```


4. When a user makes a change in the UI, the `OnChange` handler sends back the current value of the setting as a json. Additionally, `setSaveNeeded` should be called to enable the `Save` button in order for the changes to be saved.

```
handleChange = () => {
    ...

    this.props.onChange(this.props.id,  Array.from(this.state.attributes.values()));
    this.props.setSaveNeeded()
};
```

5. Once the user saves the changes, any handler that was registered with `registerSaveAction` will be executed to perform any additional custom actions the plugin may require, such as calling an additional endpoint within the plugin. 

For examples of custom settings see: Demo Plugin [`CustomSetting`](https://github.com/mattermost/mattermost-plugin-demo/blob/master/webapp/src/components/admin_settings/custom_setting.jsx) and Custom Attributes Plugin [implementation](https://github.com/mattermost/mattermost-plugin-custom-attributes/pull/18).

## How can I review the entire code base of a plugin?

Carry out the following steps:

1. Take a backup of project directory
2. Create a dummy-master branch with no code:

   ```
   git checkout --orphan dummy-master
   git rm -rf
   git push origin dummy-master
   ```

3. Create a dummy-review branch from dummy-master:

   ```
   git checkout -b dummy-review
   git add
   git commit -m "Full checkin"
   git push origin dummy-review
   ```

4. Create a PR from dummy-review -> dummy-master

5. Code review on the resulting PR
