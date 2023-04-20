---
title: "App/Renderer"
heading: "App and Renderer Modules"
description: "The App module contains the code that creates and manages the user-facing views of the application, and any other modules that pertain to the view state of the application."
date: 2018-01-02T10:36:34-05:00
weight: 3
aliases:
  - /contribute/desktop/architecture/app
---

The **app** (or application) module is responsible for handling the Main module side of the applications view state. This module includes controllers for the various **BrowserWindows** and **BrowserViews** that make up the application, modules for facilitating communication between the main and renderer process, and management modules for general view state.

The **renderer** module contains a set of React components, styles and other front-end specific code that will be executed in an Electron renderer process (effectively a Chrome tab).

### Internal Views

There are several renderer processes that make up the internal interface of the Desktop App. These are all represented by singleton objects that reside in the Main Module. These classes are in charge of holding the corresponding `BrowserWindow` or `BrowserView` object, initializing any handlers specific to that view, and exposing any special functionality that other modules may need to either read or affect the view.

As all of these views only load trusted scripts in the renderer process, all of these views are given full access to the `desktopAPI` module, allowing them to perform basically any action that we allow for in the Desktop App via the IPC layer.

### External Views

To provide access to different servers, we create a series of `BrowserView` objects that directly render on top of the Main Window, and load the Mattermost Web App directly from the server they correspond to. We wrap these `BrowserView` objects into a `MattermostView` that manages the loading of the view, and handles events such as navigation and notifications.

These views are also contained within and managed by the `viewManager` class. The class is responsible for adding and removing the views from the Main Window when the user needs them, and handling IPC calls from the renderer processes and passing them to the child objects.