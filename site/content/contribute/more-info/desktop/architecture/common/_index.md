---
title: "Common"
heading: "Common Module"
description: "The Common module handles the users configuration, data validation and various other self-contained modules and utilities for the application."
date: 2018-01-02T10:36:34-05:00
weight: 1
aliases:
  - /contribute/desktop/architecture/common
---

The **common** module is responsible for two main areas of the application: **data management** and **developer utility**.

The **data management** section refers to the user's configuration of the application, namely which servers have been configured and other options pertaining directly to the Desktop App. It is only responsible for the storage and modification of these settings, not the effects of these settings. We create modules here responsible for reading the configuration from disk or other source, and providing it to other modules. A separate module to store server information exists to allow these objects to exist once, and only once and be stored in a centralized place.

**Developer utility** refers to any utility functions, constants, logging, data validation, or other non-specific functionality that may be used in multiple parts of the application, or does not directly refer to Electron or any other view-state framework.