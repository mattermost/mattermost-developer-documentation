---
title: "External views"
heading: "External views"
description: "Outlines the renderer processes that represent external Mattermost servers, and the modules that manage them."
date: 2023-04-03T00:00:00-05:00
weight: 4
aliases:
  - /contribute/desktop/architecture/external-views
---

External views are the renderer processes that display content from Mattermost servers. The Desktop App implements a dynamic multi-view architecture that allows users to organize their Mattermost workspace through multiple views, each representing an interactive web view that can display any part of the Mattermost Web App. Views can be displayed as tabs within the main window or as separate popout windows, providing a flexible workspace where views can be freely created, removed, and organized according to user needs.

For fundamental concepts about views, windows, and the manager architecture, see [View Concepts]({{< ref "/contribute/more-info/desktop/architecture/view-concepts" >}}).

## Core Concepts

The external view architecture is built around four fundamental concepts: servers, views, tabs, and windows. A **Server** represents a configured Mattermost server identified by a name and URL. A **View** is an object representing an interactive web view that can display the whole or part of the Mattermost Web App. A **Tab** is a view attached to the Main Desktop App window, always fully unlocked and similar to a browser tab. A **Window** is a view attached to its own `BrowserWindow` instance, which can be customized more heavily to suit specific needs.

## Manager System

The external view system uses a series of specialized managers that coordinate through direct method calls and event listeners. The `ServerManager` and `ViewManager` reside in the `common` module and contain no Electron-specific code, making them testable in isolation. The `WebContentsManager`, `TabManager`, and `PopoutManager` live in the `app` module and handle Electron-specific functionality such as creating `WebContentsView` instances and managing `BrowserWindow` objects.

## ViewManager

The `ViewManager` located at [common/views/viewManager](https://github.com/mattermost/desktop/blob/master/src/common/views/viewManager.ts) is the central manager for all external views. It maintains a map of all views keyed by their unique UUIDs and emits events when views are created, updated, or removed. The manager listens to `SERVER_ADDED` events from the `ServerManager` and automatically creates a single primary tab view for each server when the application starts.

When a view is created through `ViewManager.createView()`, the manager first checks if the view limit has been reached. If the limit is exceeded, view creation fails and the user is notified. Otherwise, a new `MattermostView` object is instantiated with a unique UUID, associated with its server, and stored in the manager's internal map. The manager then emits a `VIEW_CREATED` event that other managers listen to.

The primary view is designated when a tab view is first created for a server. If no primary view exists for a server when a new tab is created, that tab automatically becomes the primary view. The primary view cannot be closed while other views exist for that server, ensuring users always have a way to interact with each configured server. The primary view serves as the initial entry point for each server and is responsible for handling login, logout, and displaying unread message indicators.

When a view's title needs to be updated, the `ViewManager.updateViewTitle()` method is called, which parses the title from the loaded content and emits `VIEW_TITLE_UPDATED` events that UI components listen to for display updates. When a view is removed, the `ViewManager.removeView()` method first checks if the view being removed is a primary view, and if so, designates another tab view as the new primary view if one exists. The removal process emits a `VIEW_REMOVED` event, which triggers cleanup in the appropriate manager.

## TabManager

The `TabManager` located at [app/tabs/tabManager.ts](https://github.com/mattermost/desktop/blob/master/src/app/tabs/tabManager.ts) manages all tab views, which are rendered within the Main Window as `WebContentsView` objects added as children of the Main Window's content view. The manager maintains tab order per server and tracks the currently active tab for each server.

When a `VIEW_CREATED` event is emitted for a tab view, the `TabManager` coordinates with the `WebContentsManager` to create a `MattermostWebContentsView` instance and attach it to the Main Window's content view. When a user switches between tabs, the manager hides the previously visible tab's `WebContentsView` and shows the newly selected tab's view, ensuring only one tab is visible at a time within the Main Window.

The tab manager ensures that at least one tab always remains open for each server. When a user attempts to close the last remaining tab for a server, the operation is prevented. Tab order is maintained separately for each server, allowing users to organize their workspace differently across multiple servers. The tab order can be updated through IPC calls from the renderer process, and these updates are persisted in the application state.

## PopoutManager

The `PopoutManager` located at [app/windows/popoutManager.ts](https://github.com/mattermost/desktop/blob/master/src/app/windows/popoutManager.ts) handles the creation and lifecycle of popout windows, which are rendered as separate `BrowserWindow` instances. These windows can be moved, resized, and positioned independently of the Main Window.

When a `VIEW_CREATED` event is emitted for a window view, the `PopoutManager` creates a new `BaseWindow` instance with positioning logic that offsets the new window from the Main Window's position. For windows with the `isRHS` property set, the window is positioned on the right-hand side of the Main Window with a default width and matching height. The manager then coordinates with the `WebContentsManager` to create a `MattermostWebContentsView` instance and add it to the window's content view.

When a popout window is requested, either through user action or programmatic request from the web app via the `OPEN_POPOUT` IPC channel, the `PopoutManager` first checks if a window with the same path already exists for that server. If an existing window is found, it is shown and focused rather than creating a duplicate. This deduplication prevents multiple windows from displaying the same content.

Popout windows support parent-child relationships with tab views. When a popout window is created from a tab view, the window view stores a reference to its parent view ID. This relationship enables bidirectional communication between the parent and child views through IPC channels. When a popout window is closed, it notifies its parent view through the `POPOUT_CLOSED` event, allowing the parent to update its state accordingly.

## WebContentsManager

The `WebContentsManager` located at [app/views/webContentsManager.ts](https://github.com/mattermost/desktop/blob/master/src/app/views/webContentsManager.ts) creates and manages `WebContentsView` instances for external views. When a view needs to be created, the manager creates a `MattermostWebContentsView` instance with the appropriate web preferences and associates it with the view's parent window.

As views load content from their Mattermost servers, the `WebContentsManager` attaches common event listeners to the `WebContents` object for navigation, input handling, and other web-related state updates. The manager maintains a map of all active `WebContentsView` instances and provides methods for retrieving views by their ID or by their `WebContents` ID, which is useful for routing IPC messages.

When a view is removed, the `WebContentsManager` coordinates with the `TabManager` or `PopoutManager` to destroy the associated `WebContentsView` instance and remove it from the Main Window or close the popout window. The manager also provides functionality for clearing cache and reloading views when needed.

## Inter-View Communication

The multi-view architecture supports communication between views through Electron's IPC system. Parent views can send messages to their child popout windows using the `SEND_TO_POPOUT` channel, and popout windows can send messages back to their parents using the `SEND_TO_PARENT` channel. These communication channels are defined in `common/communication.ts` and are handled by the `PopoutManager` to route messages to the correct `WebContentsView` instances.

This communication mechanism enables features such as synchronizing state between a parent tab and its popout windows, or allowing popout windows to request actions from their parent views when they encounter navigation restrictions.

## Navigation Behavior

The Desktop App implements strict navigation rules to ensure secure and predictable behavior across views. Internal navigation within a server remains within the same view to preserve the user's workflow. When encountering cross-server navigation or deep-linking into the application, the system determines the appropriate view to use based on the current state.

If only one tab is open for the target server, the system navigates to the corresponding URL in that open tab. If multiple tabs are open for the server, the system opens a new tab and loads the requested URL there. This behavior ensures that navigation requests are handled in a predictable manner while maintaining the user's workspace organization.

Popout windows behave similarly to tabs for navigation purposes. In cases where a popout window has a parent-child relationship and the popout is not allowed to navigate to a particular URL, the navigation request is passed to the parent view for handling. All popout windows are treated as untrusted remote code, just like tabs, and are subject to the same security restrictions.

## View Type Conversion

Views can be converted between tab and window types through the `ViewManager.updateViewType()` method. When a view's type changes, the `ViewManager` first emits a `VIEW_TYPE_REMOVED` event with the old type, then updates the view's type property, and finally emits a `VIEW_TYPE_ADDED` event with the new type. The `TabManager` and `PopoutManager` listen to these events and handle the transition by either removing the view from the Main Window and creating a popout window, or closing the popout window and adding the view back to the Main Window as a tab.

## Server State and View Management

The `ServerManager` tracks whether each server is logged in or not, and this state affects view behavior throughout the application. When a server's login state changes to logged out, all non-primary views for that server are disabled, preventing user interaction while maintaining the view structure. The primary view remains enabled and is responsible for handling the login flow. When a server is logged out, all popout windows associated with that server are automatically closed, as they cannot function without an authenticated session.

## MattermostView

The `MattermostView` class located at [common/views/MattermostView.ts](https://github.com/mattermost/desktop/blob/master/src/common/views/MattermostView.ts) provides the data model for external views. Each view instance contains properties such as a unique ID, server ID, view type (tab or window), title information, and optional properties for parent view relationships and popout-specific configuration.

The class handles URL construction for loading content from Mattermost servers. The `getLoadingURL()` method constructs the appropriate URL based on the server's base URL and any initial path specified for the view. It handles server subpaths and ensures that the constructed URL is valid and internal to the server, falling back to the server's base URL if the path is invalid or external.
