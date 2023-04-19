---
title: "Settings Window"
heading: "Settings Window"
description: "The settings window module"
date: 2018-01-02T10:36:34-05:00
weight: 2
aliases:
  - /contribute/desktop/architecture/app/settings-window
---

This window is created when the user opens Preferences from the File menu. It contains an interface where the user can change settings specific to the Desktop App client, and do not affect their Mattermost servers. This window is a child window of the Main Window, and will close/hide when the Main Window is closed/hidden. 

This window is managed by the `SettingsWindow` module located at [main/windows/settingsWindow](https://github.com/mattermost/desktop/blob/master/src/main/windows/settingsWindow.ts).

#### Screenshot:
![Settings Window screenshot](settings-window.png)

#### Hooks:
- `show()`: Shows the Settings Window if it exists, and will create it if does not. When the window is closed, the `BrowserWindow` object is dereferenced;
- `get()`: Retrieves the Settings Window `BrowserWindow` object if it exists, and returns `undefined` if it does not.