---
title: Quick Start (Hello, world!)
date: 2017-10-26T17:54:54-05:00
subsection: Web App Plugins
weight: -10
---

# Hello, world!

This tutorial will walk you through the basics of extending the Mattermost web app.

## Prerequisites

The Mattermost web app is built using [ReactJS](https://reactjs.org/) with [Redux](https://redux.js.org/) and the plugins will use the same, so it's a good idea to become familiar with those first. You're also going to need [npm](https://www.npmjs.com/get-npm).

Once you have npm installed, install the Mattermost Developer Kit (MDK) tool which will help you set up your workspace.

```
npm install -g mdk
```

You'll also need a Mattermost server to install and test the plugin. This server must have "Enable" and "EnableUploads" set to true in the "PluginSettings" section of its config file.

## Setting up the Workspace

To quickly set up a workspace, change into a directory where you want to store your plugins in development and run:

```
mdk init plugin --name helloworld --components ProfilePopover --skip-prompts
```

This will create your plugin workspace in a directory called `helloworld`.

In the future, you can run `mdk init plugin` to have prompts walk you through the setup.

## Building the Plugin

As you might have noticed with the command you ran above, this hello world example is going to override the ProfilePopover component of the Mattermost web app.

Open up the popover component file at `./helloworld/webapp/components/profile_popover/profile_popover.jsx`.

Scroll down to the `render` function and change it to this:

```
render() {
    const style = getStyle(this.props.theme);
    return (
        <div
            style={{...style.container, left: this.props.positionLeft, top: this.props.positionTop}}
        >
            {'Hello world!'}
        </div>
    );
}
```

Save the file, and then in the `./helloworld` directory run:

```
make build
```

This will drop a `helloworld.tar.gz` of your built plugin into `./hellworld/dist/`.

## Installing the Plugin

Open up Mattermost as a system administrator, navigate to **Plugins > Management** and upload the `helloworld.tar.gz` you generated above.

Click "Activate" under the plugin when it's done uploading.

Navigate to a regular Mattermost page and click on a user's name or profile picture.

You should see the normal popover replace with your blank one that states "Hello world!".
