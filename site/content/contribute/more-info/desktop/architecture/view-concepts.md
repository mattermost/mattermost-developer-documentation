---
title: "View concepts"
heading: "View concepts"
description: "Fundamental concepts and shared infrastructure for views in the Desktop App."
date: 2024-01-01T00:00:00-00:00
weight: 2
aliases:
  - /contribute/desktop/architecture/view-concepts
---

The Desktop App's view system is built on several fundamental concepts and shared infrastructure components that enable both internal application views and external Mattermost server views to function consistently. Understanding these core concepts is essential for working with either type of view.

## BaseWindow

The `BaseWindow` class located at [app/windows/baseWindow](https://github.com/mattermost/desktop/blob/master/src/app/windows/baseWindow.ts) serves as a wrapper around Electron's `BrowserWindow` that provides common functionality shared by all windows in the Desktop App. This abstraction layer ensures consistent behavior across the main window and all popout windows while encapsulating platform-specific configurations and common window management tasks.

The `BaseWindow` class is responsible for initializing windows with standardized options including minimum size constraints, title bar styling, and web preferences. It manages the loading screen that appears while content is loading, handles the URL view that displays link previews when hovering over links, and coordinates theme management registration for all child views. The class also implements retry logic for IPC communication to ensure messages reach the renderer process even if the window isn't immediately ready, and handles keyboard input events such as the Alt key press for focusing the three-dot menu on Windows and Linux platforms.

When a window is created, the `BaseWindow` constructor sets up event listeners for window lifecycle events including close, blur, unresponsive states, and fullscreen transitions. It also initializes a context menu and configures the window to prevent it from opening child windows, maintaining security boundaries. The class provides methods for showing and fading the loading screen, displaying URL previews, and sending messages to the renderer process with automatic retry handling.

## WebContentsView and BrowserWindow

The Desktop App uses two primary Electron objects for rendering content: `BrowserWindow` and `WebContentsView`. A `BrowserWindow` represents a complete window with its own frame, title bar, and system integration. Each `BrowserWindow` contains a main `WebContents` object that loads the initial page, and can have multiple `WebContentsView` objects added as children to its content view.

`WebContentsView` is the modern Electron API that replaced the deprecated `BrowserView`. These views are lightweight rendering surfaces that can be added as children to a `BrowserWindow`'s content view, allowing multiple web views to be layered within a single window. Each `WebContentsView` has its own `WebContents` object that can load URLs independently, making them ideal for displaying multiple Mattermost server views within the main window or for overlay views like loading screens.

The distinction between these two types is important: `BrowserWindow` objects represent top-level windows that users can move, resize, and interact with as separate application windows, while `WebContentsView` objects are embedded rendering surfaces that exist within a parent window's content area.

## Manager Architecture

The view system is built on an event-driven manager architecture where specialized manager classes coordinate through direct method calls and event listeners. Managers act as factories for objects with unique UUIDs and emit events when objects are added, edited, or deleted. This pattern ensures loose coupling between components while maintaining consistency across the system.

Managers are organized into two categories based on their dependencies. Managers in the `common` module, such as `ServerManager` and `ViewManager`, contain no Electron-specific code and can be tested in isolation. Managers in the `app` module, such as `WebContentsManager`, `TabManager`, and `PopoutManager`, handle Electron-specific functionality like creating `WebContentsView` instances and managing `BrowserWindow` objects.

The event-driven nature of this architecture means that when one manager performs an action, it emits events that other managers listen to and respond to accordingly. For example, when a server is removed, the `ServerManager` emits a `SERVER_REMOVED` event, which the `ViewManager` listens to and uses to automatically clean up all associated views. This pattern ensures that the system maintains consistency without requiring direct dependencies between managers.

## View Lifecycle

Views progress through a well-defined lifecycle from creation to removal, regardless of whether they are internal application views or external Mattermost server views. The lifecycle begins when a view is created, either programmatically or in response to user action. During creation, the view is assigned a unique identifier, associated with its parent or server, and stored in the appropriate manager's internal data structure.

Once created, views enter an initialization phase where their underlying Electron components are set up. For views that load web content, this involves creating `WebContentsView` instances, attaching event listeners for navigation and input handling, and beginning to load the target URL. During this phase, loading screens may be displayed to provide visual feedback to the user.

As views become active and load content, they enter a running state where they respond to user interactions and update their display based on content changes. Views may update their titles, handle navigation events, and communicate with other parts of the application through IPC channels. Throughout this phase, views maintain their state and handle events from their underlying web content.

When a view is removed, either through user action or system cleanup, it enters a teardown phase. Event listeners are removed, the underlying Electron components are destroyed, and the view is removed from its parent window or closed if it's a standalone window. The removal process ensures that all resources are properly cleaned up and that the system remains in a consistent state.

## IPC Communication

Inter-process communication (IPC) is the mechanism by which views communicate with the main process and with each other. The Desktop App uses Electron's IPC system with custom channels defined in `common/communication.ts` to enable secure, structured communication between the renderer processes and the main process.

Views that load trusted scripts, such as internal application views, are given full access to the `desktopAPI` module, allowing them to perform actions through the IPC layer. Views that load untrusted content from Mattermost servers have restricted access and can only communicate through specific, controlled channels that maintain security boundaries.

The IPC system supports both synchronous and asynchronous communication patterns. Synchronous IPC is used for operations that need immediate results, while asynchronous IPC is used for operations that may take time or need to coordinate with other parts of the system. The communication channels are typed and validated to ensure that only expected data structures are passed between processes.

## Security and Sandboxing

The view system implements security boundaries between different types of views. Internal views that load trusted application code have full access to Electron and Node.js APIs through the IPC layer. External views that load content from Mattermost servers are sandboxed and have restricted access, preventing malicious server content from affecting the user's system.

This security model ensures that while external views can display and interact with Mattermost server content, they cannot access file system operations, system APIs, or other sensitive functionality without explicit permission through controlled IPC channels. The sandboxing is enforced at the Electron level through web preferences and preload scripts that control which APIs are exposed to the renderer process.

