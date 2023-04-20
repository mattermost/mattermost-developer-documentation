---
title: "Application"
heading: "Application"
description: "Describes the application instance and properties modules"
date: 2023-04-03T00:00:00-05:00
weight: 2
aliases:
  - /contribute/desktop/architecture/main/application
---

**Application instance** refers to a set of modules managing the Electron instance, such as event handling when the application quits, crashes, or when a second instance is launched. We also handle instance inputs such as CLI arguments, or when the application is opened with a specific link (deep-linking).

**Application properties** refer to modules that manage the identity of the application, such as its version, its name and AppID (for Windows), as well as managing automatic updates for Windows/Linux users.