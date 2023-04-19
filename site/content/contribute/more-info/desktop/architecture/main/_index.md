---
title: "Main"
heading: "Main Module"
description: "The Main module is entry-point of the app that sets up the core of the application and handles various systems that the application can use."
date: 2018-01-02T10:36:34-05:00
weight: 2
aliases:
  - /contribute/desktop/architecture/main
---

### Electron
An Electron application consists of two pieces: the **main** process and the **renderer** process.

- The **main** process is a NodeJS process that has access to operating system functions, and governs the creation and management of several renderer processes.
    - The **Common** and **Main** modules run entirely within the main process. Most of the **App** module does as well, with the exception of the **Preload Scripts** that run in a seperate window context in the **renderer** process. 
- The **renderer** processes are Chromium instances that perform different functions. In our app, each Mattermost server is its own renderer process.
    - The **Renderer** module contains the code that will run in the renderer process.

![Process diagram](process-diagram.png)

In order to facilitate communication between the two processes, there's a communication layer in which information can be sent between. We expose *ONLY* the communication API to the renderer process so that we don't allow any malicious server to wreak havoc on a user's computer. 

This API is controlled using the **Preload Scripts**, where we utilize the [contextBridge](https://www.electronjs.org/docs/latest/api/context-bridge) module to expose select functionality to the front-end application.

You can read more about the Process Model {{< newtabref href="https://www.electronjs.org/docs/latest/tutorial/process-model" title="here" >}}.

#### Chromium Engine
Electron builds in some of the features of Chromium into its framework, so that we can take advantage of all the security and session features built in. It also provides hooks into the engine to allow us to manage its features ourselves.

The **Session** module controls many of these features, including downloads and notifications, allowing us to customize how we handle both of those events.

The **Security** module controls how we approach authentication and navigation, as we want to be able to handle how the user is able to login and navigate the app. This module also makes sure that malicious remote servers should not be able to take advantage of the user, or the user's machine.