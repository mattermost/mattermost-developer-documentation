---
title: "Mobile Apps Workflow"
date: 2018-05-20T11:35:32-04:00
weight: 3
subsection: Mobile
---

# Mobile Apps  Workflow

## Running and Building the Apps

Use the [Makefile commands](/contribute/mobile/makefile) to run and build the apps. See these instructions [for developing on a real device](/contribute/mobile/run-on-device).

## Adding New Dependencies to the Project

If you need to add a new dependency to the project, it is important to add them in the right way. Instructions for adding different types of dependencies are described below.

### JavaScript Only

If you need to add a new JavaScript dependency that is not related to React Native, **use npm, not yarn**. Be sure to save the exact version number to avoid conflicts in the future.

e.g. `npm add -E <package-name>`

### React Native

As with [JavaScript only](https://docs.mattermost.com/developer/mobile-developer-setup.html#javascript-only), **use npm** to add your dependency and include an exact version. Then link the library in React Native by running `react-native link <package-name>` in a terminal.

Be aware that we are using React Native Navigation. For Android, you might need to complete the linking process manually as the `react-native link` command won't do it for you.

To do this, after running the `react-native link` command, head to `<project-root>/android/app/src/main/java/com/mattermost/rnbeta/MainApplication.java` and initialize the react native library that you just added in the `createAdditionalReactPackages` method.

### Android

Usually the React Native libraries that you add to the project will take care of adding new dependencies to the project.

If you come across a case where adding new dependencies manually is needed, we recommend you first review your work to confirm the need. The Android documentation should then be followed to add the libraries.

### iOS

Sometimes you may need to add iOS specific dependencies that React Native cannot normally link. These will be in the form of Cocoapods.

To add them, edit the `Podfile` located in the `ios` directory, then from that directory run `pod install` to update the `Podfile.lock` file.

## Project Directory Structure

 ```sh
 .
 ├── android # Android specific code
 ├── app # React Native code
 │   ├── actions
 │   ├── components
 │   ├── constants
 │   ├── i18n
 │   ├── mattermost_managed
 │   ├── notification_preferences
 │   ├── push_notifications
 │   ├── reducers
 │   ├── screens
 │   ├── selectors
 │   ├── store
 │   ├── styles
 │   └── utils
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
 ├── fastlane
 ├── ios # iOS specific code
 ├── scripts
 └── test
```