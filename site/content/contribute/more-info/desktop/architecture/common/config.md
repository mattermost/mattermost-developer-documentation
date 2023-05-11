---
title: "Configuration"
heading: "Configuration"
description: "Describes the configuration module"
date: 2023-04-03T00:00:00-05:00
weight: 1
aliases:
  - /contribute/desktop/architecture/common/config
---

The **configuration** module in the **Common** module is responsible for facilitating reading from and writing to external configuration sources. It also consolidates, verifies and upgrades configuration where applicable.

#### Files

We have a few different configuration files in the Desktop App, but the main one is `config.json`. Most of the user's configuration from the Settings Window is stored there, as well as any user-configured servers.

The application supports different configuration versions, and allows for them to be migrating to the version supported by the configuration module via the `upgradePreferences` module. When no configuration is found, the `defaultPreferences` object is copied over to the main configuration module.

We also support a build configuration, in which the packager of the application can pre-define servers and a few other configuration items.

#### Registry

We support reading from the Windows registry to allow system administrators to define Group Policy that will pre-define servers, and potentially disable user-defined servers and automatic updates as per administrator wishes.

Templates for these can be found under `resources\windows\gpo`.