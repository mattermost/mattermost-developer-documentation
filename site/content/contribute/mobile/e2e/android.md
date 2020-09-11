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
2. Create the emulator by `npm run e2e:android-create-emulator` at `/detox` folder. Android test requires emulator with the name of `detox_emu_api_30` and the script helps create it automatically.

#### Test run in debug mode
This is the typical flow for local development and test writing:
1. On first terminal, `make run-android` at the root folder.
2. On second terminal,
  - `npm i`
  - Build the app together with the androidTest by `npm run e2e:android-build` at `/detox` folder
  - Run the test by `npm run e2e:android-test` at `/detox` folder

#### Test run in release mode
This is the typical flow for CI test run.
1. Build release app by `npm run e2e:android-build-release` at the `/detox` folder.
2. Run test by `npm run e2e:android-test-release` at `/detox` folder.
