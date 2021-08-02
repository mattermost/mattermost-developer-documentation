---
title: "Folder Structure"
heading: "Folder Structure at Mattermost"
date: 2018-05-20T11:35:32-04:00
weight: 1
---

 ```sh
 .
 ├── .circleci # Circle CI workflow to build the apps
 ├── android # Android specific code
 ├── app # React Native code
 │   ├── actions
 │   ├── client
 │   ├── components
 │   ├── constants
 │   ├── i18n
 │   ├── mattermost_bucket
 │   ├── mattermost_managed
 │   ├── mm-redux # Redux implementation ported from the mattermost-redux library
 │   ├── notification_preferences
 │   ├── push_notifications
 │   ├── reducers
 │   ├── screens
 │   ├── selectors
 │   ├── store
 │   ├── styles
 │   ├── telemetry
 │   └── utils
 │   └── mattermost.js # Entry point
 ├── assets
 │   ├── base
 │   │   ├── i18n
 │   │   ├── images
 │   │   └── release
 │   └── fonts
 ├── coverage
 ├── dist
 │   └── assets
 │       ├── i18n
 │       ├── images
 │       └── release
 ├── docs
 ├── fastlane # Fastlane scripts to build the app
 ├── ios # iOS specific code
 ├── packager # React Native packager configuration
 ├── patches # Patches for various dependencies
 ├── scripts
 ├── share_extension # Android's share extension app
 └── test
```
