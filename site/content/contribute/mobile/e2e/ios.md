---
title: "Setup and Run iOS E2E"
heading: "Setting up and Running iOS End-to-End Tests"
description: "Find out how to set up and run end-to-end testing with iOS and conduct a test run in debug mode and release mode."
date: 2020-09-01T09:00:00-00:00
weight: 4
---

#### Local setup

1. Install [applesimutils](https://github.com/wix/AppleSimulatorUtils):
   ```
   brew tap wix/brew
   brew install applesimutils
   ```
2. Set XCode's build location so that the built app, especially debug, is expected at the project's location instead of the Library's folder which is unique/hashed.
3. Open XCode, then go to **XCode > Preferences > Locations**.
4. Under **Derived Data**, click **Advanced...**.
5. Select **Custom > Relative to Workspace**, then set **Products** as **Build/Products**.
6. Click **Done** to save the changes.

#### Test run in debug mode

This is the typical flow for local development and test writing:

1. In one terminal window, run `npm run ios` from the root folder.
2. In another terminal window, run `npm i` then `npm run e2e:ios-test` from the `/detox` folder.

#### Test run in release mode

This is the typical flow for CI test run.

1. Build the release app by running `npm run build:ios-sim` from the root folder or `npm run e2e:ios-build-release` from within the `/detox` folder.
2. Run the test using `npm run e2e:ios-test-release` from the `/detox` folder.
