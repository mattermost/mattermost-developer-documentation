---
title: "Configuration"
heading: "Configuration"
description: "Describes the configuration module"
date: 2023-04-03T00:00:00-05:00
weight: 1
aliases:
  - /contribute/desktop/architecture/main/config
---

The **configuration** module exists here to provide an entry-point for Electron to initialize the configuration (ie. read from disk) and update other parts of the application via IPC when the configuration changes. It will also act on certain user configured items when the application starts (eg. whether hardware acceleration is turned on)