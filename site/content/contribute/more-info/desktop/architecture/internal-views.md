---
title: "Internal views"
heading: "Internal views"
description: "Outlines the renderer processes that are local to the Desktop App."
date: 2023-04-03T00:00:00-05:00
weight: 3
aliases:
  - /contribute/desktop/architecture/internal-views
---

Internal views are the renderer processes that make up the Desktop App's own user interface, distinct from the external Mattermost server views. These views load trusted application code and have full access to the `desktopAPI` module, allowing them to perform any action available through the IPC layer. All internal views are represented by singleton objects that reside in the `app` module and are responsible for managing their corresponding `BrowserWindow` or `WebContentsView` objects, initializing view-specific handlers, and exposing functionality that other modules may need to interact with.

For fundamental concepts about views, windows, and the manager architecture, see [View Concepts]({{< ref "/contribute/more-info/desktop/architecture/view-concepts" >}}).

## Main Window

The Main Window is the primary application window that serves as the container for most of the Desktop App's interface. This window is created using the `BaseWindow` class, which provides common window functionality, and is managed by the `MainWindow` module located at [app/mainWindow/mainWindow](https://github.com/mattermost/desktop/blob/master/src/app/mainWindow/mainWindow.ts).

![Main Window screenshot](main-window.png)

The Main Window serves as the primary container for the Desktop App interface. Most `WebContentsView` objects, including tab views for Mattermost servers, are rendered as children of this window's content view. The window's behavior affects all child views, and most application controls including the tray icon and taskbar or dock integration interact with this window.

The `MainWindow` class provides several key methods for managing the window. The `init()` method creates the underlying `BaseWindow` instance and sets up all necessary event listeners. The `get()` method returns the `BrowserWindow` object, which is directly exposed because many modules need to interact with the window directly. If `true` is passed to `get()`, it will call `init()` if the window doesn't exist, otherwise returning `undefined`. The `getBounds()` method returns the current size and position of the window, which is used for positioning child windows and views. The `focusThreeDotMenu()` method sends a message to focus the three-dot menu on Windows and Linux, triggered when the Alt key is pressed.

## Internal Views

Internal views are `WebContentsView` objects that are rendered on top of existing windows to add functionality to the Desktop App interface. These views augment the application by providing overlays, modals, and other UI elements that must be rendered above the external Mattermost server views.

### Loading Screen

![Loading Screen screenshot](loading-screen.png)

The Loading Screen is a `WebContentsView` that renders over external Mattermost views while they are loading content. This cosmetic view prevents users from seeing a blank white screen during the loading process. The view is ephemeral and should only be visible while the current external Mattermost view is loading.

The Loading Screen is managed by the `LoadingScreen` module located at [app/views/loadingScreen](https://github.com/mattermost/desktop/blob/master/src/app/views/loadingScreen.ts) and is created as part of each `BaseWindow` instance. The `show()` method displays the loading screen over any other views currently rendered in the Main Window and begins the loading animation. The `fade()` method starts the removal process by sending a signal to the renderer to fade the screen and stop the animation, then removes the view from the window once the fade completes. The `setBounds()` method is called when the Main Window resizes while the loading screen is visible, ensuring the view maintains the correct size. The `setDarkMode()` method updates the view when the application's dark mode setting changes to maintain a consistent color scheme. The `isHidden()` method provides a helper to check whether the view is currently hidden.

### Settings Modal

![Settings Window screenshot](settings-window.png)

The Settings Modal is created when the user opens **Preferences** from the **File** menu. It provides an interface for changing settings specific to the Desktop App client that do not affect Mattermost server configurations. The settings are displayed as a modal overlay within the main window, rendered as part of the main window's renderer process.

The settings interface is managed by the `SettingsModal` component located at [renderer/components/SettingsModal](https://github.com/mattermost/desktop/blob/master/src/renderer/components/SettingsModal/index.tsx). This component handles the display and management of all Desktop App settings, including server management, appearance preferences, and application behavior options.

### URL View

The URL View is a `WebContentsView` that displays link previews when users hover over links in Mattermost content. This view is ephemeral and appears temporarily to show information about the linked URL. The URL View is managed internally by the `BaseWindow` class and is created automatically for each window instance. It provides a way to preview external links without navigating away from the current view.