---
title: Quick Start (Hello, world!)
date: 2018-07-10T00:00:00-05:00
subsection: Web App Plugins
weight: -10
---

# Hello, world!

This tutorial will walk you through the basics of extending the Mattermost web app. 

Note that the steps below are intentionally very manual to explain all of the pieces fitting together. In practice, we recommend referencing [mattermost-plugin-sample](https://github.com/mattermost/mattermost-plugin-sample) for helpful build scripts. Also, the plugin API changed in Mattermost 5.2 once support for plugins stabilized and left beta. Consult the [migration](/extend/plugins/migration) document to upgrade your older plugin code.

## Prerequisites

Plugins, just like the Mattermost web app itself, are built using [ReactJS](https://reactjs.org/) with [Redux](https://redux.js.org/). Make sure to install [npm](https://www.npmjs.com/get-npm) to manage your JavaScript dependencies.

You'll also need a Mattermost server to install and test the plugin. This server must have [Enable](https://docs.mattermost.com/administration/config-settings.html#enable-plugins) set to true in the [PluginSettings](https://docs.mattermost.com/administration/config-settings.html#plugins-beta) section of its config file. If you want to upload plugins via the System Console or API, you'll also need to set [EnableUploads](https://docs.mattermost.com/administration/config-settings.html#enable-plugin-uploads) to true in the same section.

## Setting up the Workspace

Create a directory to act as your plugin workspace. With that directory, create and switch to a `webapp` directory:

```bash
mkdir webapp
cd webapp
```

Install the necessary NPM dependencies:

```bash
npm install --save-dev webpack webpack-cli babel-loader babel-core babel-preset-env babel-preset-react
npm install --save react
```

Configure Babel by creating a `.babelrc` file:

```json
{
  "presets": ["env", "react"]
}
```

Configure Webpack by creating a `webpack.config.js` file:

```js
var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        './src/index.jsx',
    ],
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
        ],
    },
    externals: {
        react: 'react',
    },
    output: {
        path: path.join(__dirname, '/dist'),
        publicPath: '/',
        filename: 'main.js'
    },
};
```

Observe that `react` is specified as an external library. This allows you to test your code locally (e.g. with [jest](https://jestjs.io/) and snapshots) but leverage the version of React shipped with Mattermost to avoid bloating your plugin.

Now create the entry point file and output directory:
```bash
mkdir src dist
touch src/index.js
```

Then populate `src/index.jsx` with the following:
```js
import React from 'react'

// Courtesy of https://feathericons.com/
const ApertureIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-3 -3 30 30" fill="white" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-aperture">
        <circle cx="12" cy="12" r="10" fill="none"/></circle>
        <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
        <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
        <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
        <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
        <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
        <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
    </svg>
);

class HelloWorldPlugin {
    initialize(registry, store) {
        registry.registerChannelHeaderButtonAction(
            // icon - JSX element to use as the button's icon
            <ApertureIcon />,
            // action - a function called when the button is clicked, passed the channel and channel member as arguments
            // null,
            () => { 
                alert("Hello World!"); 
            },
            // dropdown_text - string or JSX element shown for the dropdown button description
            "Hello World",
        );
    }
}

window.registerPlugin('helloworld', new HelloWorldPlugin());
```

Generate a minified bundle ready to install as a web app plugin:

```bash
./node_modules/.bin/webpack --mode=production
```

Now, we'll need to define the required manifest describing your plugin's entry point. Move up one directory into your plugin workspace:
```bash
cd ../
```

and create a file named `plugin.json` with the following contents:

```json
{
    "id": "helloworld",
    "name": "helloworld",
    "description": "",
    "webapp": {
        "bundle_path": "main.js"
    }
}
```

Bundle the manifest and entry point into a tar file:

```bash
mkdir -p helloworld
cp -r webapp/dist/main.js helloworld/
cp plugin.json helloworld/
tar -czvf helloworld.tar.gz helloworld
```

You should now have a file named `plugin.tar.gz` in your workspace. Congratulations! This is your first web app plugin!

## Installing the Plugin

Install the plugin in one of the following ways:

1) Through System Console UI:
 - Log in to Mattermost as a System Admin.
 - Navigate to **Plugins > Management** and upload the `plugin.tar.gz` you generated above.
 - Click "Activate" under the plugin after it has uploaded.

2) Through `config.json`:
 - Extract `plugin.tar.gz` to a folder with the same name as the plugin id you specified in ``plugin.json/plugin.yaml``, in this case `helloworld`.
 - Add the plugin to the directory set by **PluginSettings > Directory** in your ``config.json`` file. If none is set, defaults to `./plugins`. The directory should look something like
 
 ```
 mattermost/
    plugins/
        helloworld/
            webapp/
                dist/
                    main.js
 ```
 - Restart the Mattermost server.

Navigate to a regular Mattermost page and observe the new icon in the channel header. Shrink the window until it switches into mobile view, and open the channel menu to observe the dropdown text displayed. Click on either the text or the icon and observe the alert dialog.
