---
title: Proper Configuration
subsection: Web App Plugins
weight: 0
---

### Developing in the plugin's webapp folder

In order for your IDE to know the root directory of the plugin's webapp code, it is advantageous to open the IDE in the webapp folder itself when working on the webapp portion of the plugin. This way, the IDE is aware of files such as `webpack.config.js` and `tsconfig.json`.

### Using the Mattermost server's SiteURL in your webapp plugin

In order to make sure your plugin has full compatibility with your Mattermost server, you should use the server's configured SiteURL in each API call you send to the server from the webapp. Here's an [example](https://github.com/mattermost/mattermost-plugin-jira/blob/19a9c2442817132b4eee5c77e259b80a40188a6a/webapp/src/selectors/index.js#L13-L26) of how to compute the SiteURL:

```js
export const getPluginServerRoute = (state) => {
    const config = getConfig(state);

    let basePath = '';
    if (config && config.SiteURL) {
        basePath = new URL(config.SiteURL).pathname;

        if (basePath && basePath[basePath.length - 1] === '/') {
            basePath = basePath.substr(0, basePath.length - 1);
        }
    }

    return basePath + '/plugins/' + PluginId;
};
```

### Including the server's CSRF token in your webapp plugin's requests

The Mattermost server can be configured to require a CSRF token to be present in HTTP requests sent from the webapp. In order to include the token in each request, you can use the `mattermost-redux` library's `Client4.getOptions` function to add the token to your `fetch` request.

```js
const response = await fetch(url, Client4.getOptions(options));
```
