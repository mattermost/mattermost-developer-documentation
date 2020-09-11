---
title: "Setup and Run Android E2E"
date: 2020-09-01T09:00:00-00:00
weight: 3
subsection: Mobile End-to-End Testing
---

#### Local setup
1. Install latest SDK
```
sdkmanager "system-images;android-30;google_apis;x86"
sdkmanager --licenses
```
2. Create the emulator using `npm run e2e:android-create-emulator` from within the `/detox` folder. Android testing requires an emulator named `detox_emu_api_30` and the script helps to create it automatically.

#### Test run in debug mode
This is the typical flow for local development and test writing:
1. Open a terminal window and run `make run-android` from the root folder.
2. Open a second terminal window and:
  - Run `npm i` from the root folder.
  - Build the app together with the androidTest using `npm run e2e:android-build` from within the `/detox` folder.
  - Run the test using `npm run e2e:android-test` from within the `/detox` folder.

#### Test run in release mode
This is the typical flow for CI test run:
1. Build a release app by running `npm run e2e:android-build-release` from within the `/detox` folder.
2. Run a test using `npm run e2e:android-test-release` from within the `/detox` folder.
