---
title: "Setup and Run Android E2E"
heading: "Setup and Run Android E2E"
description: "Learn how to set up and run Android end-to-end (E2E) testing to ensure mobile apps operate as designed."
date: 2020-09-01T09:00:00-00:00
weight: 3
---

#### Local setup

1. Install the latest Android SDK.

   ```
   sdkmanager "system-images;android-30;google_apis;x86"
   sdkmanager --licenses
   ```
2. Create the emulator using `npm run e2e:android-create-emulator` from the `/detox` folder. Android testing requires an emulator named `detox_pixel_4_xl_api_30` and the script helps to create it automatically.

#### Test run in debug mode

This is the typical flow for local development and test writing:

1. Open a terminal window and run react-native packager by `npm install && npm start` from the root folder.
2. Open a second terminal window and:
  - Change directory to `/detox` folder.
  - Install npm packages by `npm install`.
  - Build the app together with the androidTest using `npm run e2e:android-build`.
  - Run the test using `npm run e2e:android-test`.

#### Test run in release mode

This is the typical flow for CI test run:

1. Build a release app by running `npm install && npm run e2e:android-build-release` from the `/detox` folder.
2. Run a test using `npm run e2e:android-test-release` from the `/detox` folder.
