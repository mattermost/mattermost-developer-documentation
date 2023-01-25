---
title: "Navigation"
heading: "Navigation"
description: "Explains how the Desktop App does navigation wrt. Mattermost"
date: 2023-01-24T00:00:00-05:00
weight: 1
aliases:
  - /contribute/desktop/architecture/navigation
---

Clicking on a routed link in Mattermost:
- Instead of calling `browserHistory.push`, we send a message with the route information up to the Desktop App
- The information is received at the method `WindowManager.handleBrowserHistoryPush`, where we:
	- Clean the path name by removing any part of the server's subpath pathname
	- Get the view matching the path name
		- eg. for server `http://server-1.com/mattermost`, if the pathname is `/mattermost/boards/board1`, we would get the Boards view matching the server.
	- If it's closed, we open it and load the corresponding URL
	- We then explicitly display the new view if it's not currently in focus
	- We then check if we're redirecting to the root of the application, since commonly the app will want to do that on login, causing an unnecessary refresh. If we're doing that, we stop the redirect
	- Otherwise, we send the pathname back to the view that it corresponds to and let the application continue on normally
- None of these links should ever trigger any navigation that needs to be handled by Electron itself, we handle it ourselves

Clicking on a link marked `target=_blank`
- This should normally trigger the `new-window` event on the webContents (represents a Chromium process)
- We listen for this in the `webContentEvents` module, where we attach a `setWindowOpenHandler` that allows us to `allow` or `deny` the opening of the window
- Our handler checks the following and will deny the opening of a new Electron for any of the following:
    - If the URL is malformed or invalid in some way (eg. some kind of injection or spoofing). Depending on the case, it will outright ignore it (if the URL could not be parsed) or it will open the user's default browser if it is somehow invalid in another way.
    - If the URL does not match an allowed protocol (allowed protocols include `http`, `https` and any other protocol that was explicitly allowed by the user). In this case, it will pop the dialog to ask the user if the protocol should be allowed, and if so will open the URL in the users default application that corresponds to that protocol.
    - If the URL does not match the root of a configured server, it will always try to open the link in the users default browser.
    - If the URL DOES match the root of a configured server, we still will deny the window opening for a few cases:
        - If the URL matches the public files route (`/api/v4/public/files/*`)
        - If the URL matches the image proxy route (`/api/v4/image/*`)
        - If the URL matches the help route (`/help/*`)
    - If the URL doesn't match any of the above route, but is still a valid configured server, we will generally treat is as the deep link cause and will instead attempt to show the correct tab and navigate to the corresponding URL within the app.
- There are two cases where we do allow the application to open a new window:
    - If the URL matches the `devtools:` protocol, so that we can open the Chrome Developer Tools
    - If the URL is a valid configured server URL that corresponds to the plugins route (`/plugins/*`). In these cases we allow a single popup per tab to be opened for certain plugins to do things like OAuth (eg. GitHub, JIRA)
- Any other case will be automatically denied for security reasons.

Clicking on any other link not marked `target=_blank`:
- By default, the Mattermost app marks any link external to its application as `target=_blank` so that the application doesn't try to open it in the same window.
- If we have any other in-product links that simply call `window.location.href` or are simple `<a href>` links, we will first emit the `will-navigate` event, which allows us to deny the navigation if necessary.
- In our app, we deny any sort of in-window navigation with the following exceptions:
    - If the link matches a pattern that we can confirm is within the app
    - If the link is a `mailto:` link (which always opens the default mail program)
    - If we are in the custom login flow

Custom Login flow:
- In order to facilitate logging into to the app using an external provider in the same way that one would in the browser, we add an exception to the navigation flow that bypasses the `will-navigate` check
- When a user clicks on a login link that redirects them to a matching URL scheme (listed here: https://github.com/mattermost/desktop/blob/master/src/common/utils/constants.ts#L48), we will activate the custom login flow
    - NOTE: the URL MUST still be internal to the application before we activate this flow, or any URL matching this pattern would allow the app to circumvent the navigation protection
- While the current window is in the custom login flow, all links that emit the `will-navigate` event will be allowed. Anything that opens a new window will still be restricted based on the rules for new windows
- We leave the custom login flow once the app has navigated back to an URL internal to the application

`did-start-navigation` also fires on every clicked route change
`will-navigate` will fire on any links that are not `target=_blank`