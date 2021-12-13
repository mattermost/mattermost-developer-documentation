---
title: "Desktop App"
heading: "Contribute to the Mattermost Desktop App"
description: "The Mattermost desktop app is an Electron wrapper around the web app project. It lives in the mattermost/desktop repository."
date: 2018-01-02T10:36:34-05:00
weight: 7
---

The Mattermost Desktop App is an [Electron](https://electronjs.org/) wrapper around the [web app](/contribute/webapp) project. It lives in the [mattermost/desktop](https://github.com/mattermost/desktop) repository. The desktop app runs on Windows, Linux, and macOS.

#### Electron
The Desktop App, like all Electron apps is broken into two pieces, the **main** process and the **renderer** process.

The **main** process is a NodeJS process that has access to operating system functions, and governs the creation and management of several renderer processes.  
The **renderer** processes are Chromium instances that perform different functions. In our app, each Mattermost server is its own renderer process.

![Process diagram](/contribute/desktop/process-diagram.png)

In order to facilitate communication between the two processes, there is a communication layer in which information can be sent between. We expose *ONLY* the communication API to the renderer process so that we don't allow any malicious server to wreak havoc on a user's computer.

You can read more about the Process Model [here](https://www.electronjs.org/docs/latest/tutorial/process-model).

#### Directory Structure
The directory structure is broken down into a few pieces to best organize the code:
- **docs:** holds documentation for working on the Desktop App
- **e2e:** holds the E2E tests
    - **modules:** holds the setup code for the E2E tests
    - **specs:** holds the E2E tests themselves
- **resources:** holds any assets, such as images or sound files that the Desktop App uses
- **scripts:** holds any automated scripts used for building or packaging the Desktop App
- **src:** holds the source code
    - **assets:** holds any assets, such as images or sound files that the Desktop App uses
    - **common:** holds common objects and utility functions that aren't specifically tied to Electron
    - **main:** holds the majority of the main process code, including setup for the Electron app
    - **renderer:** holds the web code for all of the main application wrapper, modals and server dropdown views that are used by the renderer process
    - **types:** holds common types for use between all of the individual modules

#### Repository

You can find the repository [here](https://github.com/mattermost/desktop).

#### Channel

You can find the channel [here](https://community.mattermost.com/core/channels/desktop-app).

#### Help Wanted

[Find help wanted tickets here.](https://mattermost.com/pl/help-wanted-desktop)
