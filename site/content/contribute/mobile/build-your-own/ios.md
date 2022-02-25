---
title: "Build the iOS App"
heading: "Building an iOS Mattermost App"
description: "At times, you may want to build your own Mattermost mobile app. This page guides you through that process."
date: 2018-05-20T11:35:32-04:00
weight: 2
---

At times, you may want to build your own Mattermost mobile app. The most common use cases are:

* To white label the Mattermost mobile app.
* To use your own deployment of the Mattermost Push Notification Service (always required if you are building your own version of the mobile app).

# Build Preparations

### 1. Prerequisites

The Mattermost mobile app for iOS needs to be built on a macOS computer with Xcode and the Xcode command line tools installed.

```sh
$ xcode-select --install
```

### 2. Bundle ID and entitlements

* Follow the steps 1, 2, and 3 for [Run on iOS Devices](/contribute/mobile/developer-setup/run/#run-on-ios-devices) in the Developer Setup.
* After configuring the app in the previous step, **ensure** the bundle ID for each target of the mobile app remains the same as the one in the original [mattermost-mobile GitHub repository](https://github.com/mattermost/mattermost-mobile) (`com.mattermost.rnbeta`, `com.mattermost.rnbeta.MattermostShare`, and `com.mattermost.rnbeta.NotificationService`).

### 3. Code signing

Apple requires all apps to be digitally signed with a certificate before they can be installed.

The build script will make use of [Match](https://docs.fastlane.tools/actions/match/) to sync your provisioning profiles (the profiles will be created for you if needed). The provisioning profiles will be created based on the environment variables.

### 4. Configure Environment Variables

To make it easier to customize your build, we've defined a few environment variables that are going to be used by Fastlane during the build process.

| Variable            | Description                                | Default    | Required  |
|---------------------|--------------------------------------------|------------|-----------|
| `COMMIT_CHANGES_TO_GIT` | Should the fastlane script ensure that there are no changes to Git before building the app and that every change made during the build is committed back to Git.<br><br>Valid values are: `true`, `false` | `false` | No |
| `BRANCH_TO_BUILD` | Defines the Git branch that is going to be used for generating the build. <br><br>**Make sure that, if this value is set, the branch it is set to exists**.| `$GIT_BRANCH` | No |
| `GIT_LOCAL_BRANCH` | Defines the local branch to be created from BRANCH\_TO\_BUILD to ensure the base branch does not get any new commits on it.<br><br>**Make sure a branch with this name does not yet exist in your local git**. | build | No |
| `RESET_GIT_BRANCH` | Defines if, once the build is done, the branch should be reset to the initial state before building and whether to also delete the branch created to build the app. <br><br>Valid values are: `true`, `false` | `false` | No |
| `VERSION_NUMBER` | Set the version of the app at build time to a specific value, rather than using the one set in the project. |  | No |
| `INCREMENT_VERSION_<br>NUMBER_MESSAGE` | Set the commit message when changing the app version number. | Bump app version number to | No |
| `INCREMENT_BUILD_NUMBER` | Defines if the app build number should be incremented.<br><br>Valid values are: `true`, `false` | `false` | No |
| `BUILD_NUMBER` | Set the build number of the app at build time to a specific value, rather than incrementing the last build number. |  | No |
| `INCREMENT_BUILD_<br>NUMBER_MESSAGE` | Set the commit message when changing the app build number. | Bump app build number to | No |
| `APP_NAME` | The name of the app as it is going to be shown in the device home screen. | Mattermost Beta | Yes |
| `APP_SCHEME` | The URL naming scheme for the app as used in direct deep links to app content from outside the app. | mattermost | No |
| `REPLACE_ASSETS` | Override the assets as described in [White Labeling](contribute/mobile/build-your-own/white-label/).<br><br>Valid values are: `true`, `false` | `false` | No |
| `MAIN_APP_IDENTIFIER` | The bundle identifier for the app. | | Yes |
| `BUILD_FOR_RELEASE` | Defines if the app should be built in release mode. <br><br>Valid values are: `true`, `false` <br><br>**Make sure you set this value to true if you plan to submit this app to TestFlight, the Apple App Store or distribute it in any other way**. | `false` | Yes |
| `NOTIFICATION_SERVICE_IDENTIFIER` | The bundle identifier for the notification service extension. |  | Yes |
| `EXTENSION_APP_IDENTIFIER` | The bundle identifier for the share extension. |  | Yes |
| `FASTLANE_TEAM_ID` | The ID of your Apple Developer Portal Team. |  | Yes |
| `IOS_ICLOUD_CONTAINER` | The iOS iCloud container identifier used to support iCloud storage. | | Yes |
| `IOS_APP_GROUP` | The iOS App Group identifier used to share data between the app and the share extension. |  | Yes |
| `SYNC_PROVISIONING_PROFILES` | Should we run **match** to sync the provisioning profiles. **Note**: Not syncing the provisioning profiles, will cause the singing to fail. Valid values are: `true`, `false` | `false` | Yes |
| `MATCH_USERNAME` | Your Apple ID Username. |  | Yes |
| `MATCH_PASSWORD` | Your Apple ID Password. |  | Yes |
| `MATCH_KEYCHAIN_PASSWORD` | Your Mac user password used to install the certificates in the build computer KeyChain. |  | No |
| `MATCH_GIT_URL` | URL to the Git repo containing all the certificates. <br><br> **Make sure this Git repo is set to private. Remember this repo will be used to sync the provisioning profiles and other certificates**.|  | Yes |
| `MATCH_APP_IDENTIFIER` | The Bundle Identifiers for the app (comma-separated).<br><br>**List the identifiers for each target of the app**. | for example:<br>`com.mattermost.rnbeta`, <br>`com.mattermost.rnbeta.MattermostShare`, <br>`com.mattermost.rnbeta.NotificationService` | Yes |
| `MATCH_TYPE` | Define the provisioning profile type to sync. Valid values are: `appstore`, `adhoc`, `development`, `enterprise` <br><br>**Make sure you set this value to the same type as the `IOS_BUILD_EXPORT_METHOD` as you want to have the same provisioning profiles installed in the machine so they are found when signing the app**. | `adhoc` | Yes |
| `SUBMIT_IOS_TO_TESTFLIGHT` | Submit the app to TestFlight once the build finishes. Valid values are: `true`, `false` | `false` | No |
| `PILOT_USERNAME` | Your Apple ID Username used to deploy the app to TestFlight. |  | No |
| `PILOT_SKIP_WAITING_<br>FOR_BUILD_PROCESSING` | Do not wait until TestFlight finishes processing the app.<br><br>Valid values are: `true`, `false` | `true` | No |

---
**Note:**

To configure your variables create the file `./mattermost-mobile/fastlane/.env` where `.env` is the filename. You can find the sample file `env_vars_example` [here](https://github.com/mattermost/mattermost-mobile/blob/master/fastlane/env_vars_example).

---

## Building the App

Once all the previous steps are complete, execute the following command from within the project's directory:

```sh
$ npm run build:ios
```

This will start the build process following the environment variables you've set. Once it finishes, it will create an `.ipa` file with the `APP_NAME` as the filename in the project's root directory. If you have not set Fastlane to submit the app to TestFlight, you can use this file to manually publish and distribute the app.
