---
title: "Setup and Run iOS E2E"
date: 2020-09-01T09:00:00-00:00
weight: 4
subsection: Mobile End-to-End Testing
---

#### Local setup
1. Install [applesimutils](https://github.com/wix/AppleSimulatorUtils)
```
brew tap wix/brew
brew install applesimutils
```
2. Set XCode's build location so that the built app, especially debug, is expected at project's location instead at the Library's folder which is unique/hashed.
- Open XCode, then go to "XCode > Preferences > Locations"
- Under "Derived Data", click "Advanced..."
- Select "Custom" and set to "Relative to Workspace", then set Products as "Build/Products".
- Click "Done" to take effect the changes.

#### Test run in debug mode
This is the typical flow for local development and test writing.
1. On first terminal, `make run` or `make run-ios` at the root folder.
2. On second terminal, `npm i` then `npm run e2e:ios-test` at `/detox` folder.

#### Test run in release mode
This is the typical flow for CI test run.
1. Build release app by `make ios-sim-x86_64` at the root folder or `npm run e2e:ios-build-release` at the `/detox` folder.
2. Run test by `npm run e2e:ios-test-release` at `/detox` folder.
