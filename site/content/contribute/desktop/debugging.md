---
title: "Debugging"
heading: "Debugging at Mattermost"
description: "The electron app itself can be inspected using the developer tools, available from the View menu of Safari."
date: 2019-01-22T00:00:00-05:00
weight: 3
---

## Debugging in the Main Process

The simplest way to debug the main process is to simply insert logging statements wherever needed and have the application output logs of whatever is necessary.

If you'd like to make use of better debugging tools, you can make use of the Chrome Dev Tools or the debugger in VSCode by following the steps here: https://www.electronjs.org/docs/latest/tutorial/debugging-main-process

## Debugging in the Renderer Process

The renderer processes are controller by Chrome instances, so each of them will have their own Developer Tools instance.

You can access these instances by going to the View menu (under the 3-dot menu on Windows/Linux, and in the top bar on macOS) and selecting:
- **Developer Tools for Application Wrapper** for anything involving the top bar.
- **Developer Tools for Current Tab** for anything involving the Mattermost view or the preload script
    - *Note:* for this one you need to make sure you're currently on the tab you want to load the Developer Tools for. You can have instances of the tools open for tabs you aren't currently viewing, but to open them in the first place requires it to be opened.

There are other `BrowserViews` that are governed seperately from the main application wrapper, including:
- Dropdown Menu
    - You can open this one by adding a line in the `main/teamDropdownView.ts` file. In the constructor, at the end, add:
        ```js
        this.view.webContents.openDevTools({mode: 'detach'});
        ```
- Modals
    - You can open these by setting an environment variable when running the Desktop App called `MM_DEBUG_MODALS`.
        ```
        // macOS/Linux
        export MM_DEBUG_MODALS=1

        // Windows PowerShell
        $env:MM_DEBUG_MODALS = 1
        ```
- URL View
    - You can open this one by adding a line in the `main/viewManager.ts` file. In the function `showURLView`, at the end, add:
        ```js
        urlView.webContents.openDevTools({mode: 'detach'});
        ```
    - *Note:* This view is ephemeral based on whether a link is hovered with the mouse, so it might be best to use some logging instead here.

## Debugging the Mattermost Server/Webapp

Some issues are only reproducible on the Desktop App, though the code that is causing the issue may not live in the Desktop App.

Some ways of determining if this is true are as follows:
- Does the issue reproduce on the browser? Specifically Chrome?
- Does the issue surround a piece of code on the server/webapp that only applies to the Desktop App? You can check this by seeing if there is a call to `isDesktopApp` in the webapp.

