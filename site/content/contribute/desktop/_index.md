---
title: "Desktop App"
heading: "Contribute to the Mattermost Desktop App"
description: "The Mattermost desktop app is an Electron wrapper around the web app project. It lives in the mattermost/desktop repository."
date: 2018-01-02T10:36:34-05:00
weight: 7
---

The Mattermost Desktop App is an [Electron](https://electronjs.org/) wrapper around the [web app](/contribute/webapp) project. It lives in the [mattermost/desktop](https://github.com/mattermost/desktop) repository. The desktop app runs on Windows, Linux, and macOS.

#### Electron
The Desktop App, like all Electron apps, is broken into two pieces: the **main** process and the **renderer** process.

The **main** process is a NodeJS process that has access to operating system functions, and governs the creation and management of several renderer processes.  
The **renderer** processes are Chromium instances that perform different functions. In our app, each Mattermost server is its own renderer process.

![Process diagram](/contribute/desktop/process-diagram.png)

In order to facilitate communication between the two processes, there's a communication layer in which information can be sent between. We expose *ONLY* the communication API to the renderer process so that we don't allow any malicious server to wreak havoc on a user's computer.

You can read more about the Process Model [here](https://www.electronjs.org/docs/latest/tutorial/process-model).

#### Directory Structure
The directory structure is broken down into a few pieces to best organize the code:

```
Mattermost Desktop
├── docs/ - Documentation for working on the Desktop App
├── e2e/ - E2E tests
│   ├── modules/ - Setup code for the E2E tests
│   └── specs/ - E2E tests themselves
├── resources/ - Assets such as images or sound files that the Desktop App uses
├── scripts/ - Automated scripts used for building or packaging the Desktop App
└── src/ - Application source code
    ├── assets/ - Assets such as images or sound files that the Desktop App uses
    ├── common/ - Common objects and utility functions that aren't specifically tied to Electron
    ├── main/ - The majority of the main process code, including setup for the Electron app
    ├── renderer/ - The web code for all of the main application wrapper, modals. and server dropdown views that are used by the renderer process
    └── types/ - Common types for use between all of the individual modules
```

## Desktop App Contributor Resources
 - [GitHub Repository](https://github.com/mattermost/desktop) - Get the code, report issues, or submit PRs.
 - [Help Wanted](https://mattermost.com/pl/help-wanted-desktop) - This is a good place to start if you're looking for a way to contribute code. Many issues are labeled by difficulty level to make it easier to find ways to get involved.
 - [Developer Setup](/contribute/desktop/developer-setup) - Setup your development environment to start work on the desktop app.
 - [Build and CLI Commands](/contribute/desktop/build-commands) - Useful commands to help build, debug, test, and modify the desktop app on your local machine.
 - [Debugging](/contribute/desktop/debugging) - Identify issues in the desktop app and debug the rendering process.
 - [Dependencies](/contribute/desktop/dependencies) - Information about including dependencies in the desktop app.
 - [Style and Code Quality](/contribute/desktop/style-and-code-quality) - Information about linting, type checking, and submitting great PRs
 - [Automated Testing](/contribute/desktop/testing) - Find out how we incorporate unit and end-to-end testing into the desktop app development process.
 - [Packaging for Release](/contribute/desktop/packaging-and-releasing) - Build and package the app into a distributable version.
 - [General Contributor Guidelines](/contribute/getting-started/) - Everything you need to know about contributing code to Mattermost.


## Where to Get Help

If you have any questions related to development of the Desktop App, you can ask us in the [Developers: Desktop App](https://community.mattermost.com/core/channels/desktop-app) channel on our [community Mattermost](https://docs.mattermost.com/guides/community-chat.html). If you need help deploying, administering, or using Mattermost, refer to our [Get Help guide](https://docs.mattermost.com/guides/get-help.html) to find all of the resources that are availalbe to support your journey.
