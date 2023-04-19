---
title: "Loading Screen"
heading: "Loading Screen"
description: "The loading screen module"
date: 2018-01-02T10:36:34-05:00
weight: 1
aliases:
  - /contribute/desktop/architecture/app/main-window/loading-screen
---

This is a `BrowserView` that renders over top of external Mattermost views that are loading. It is a cosmetic view that avoids the user having a white screen while the application is loading. The view is ephemeral should only be visible while the current external Mattermost view is loading.

This view is managed by the `LoadingScreen` module located at [main/views/loadingScreen](https://github.com/mattermost/desktop/blob/master/src/main/views/loadingScreen.ts). Its parent is the Main Window.

#### Screenshot:
![Loading Screen screenshot](loading-screen.png)

#### Hooks:
- `show()`: Displays the Loading Screen over top of any other `BrowserView` currently rendered in the Main Window and begins the animation.
- `fade()`: Starts the process of removing the Loading Screen. First a signal is sent to the renderer to fade the screen and stop the animation. When that finished, the view is removed from the window.
- `setBounds()`: Calls when the Main Window resizes while the Loading Screen is still visible and the view needs to change its size as well.
- `setDarkMode()`: Calls when the application's dark mode flag is changed, to ensure a consistent colour scheme.
- `isHidden()`: Helper method to check if the view is hidden or not.
