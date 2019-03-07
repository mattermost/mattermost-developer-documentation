---
title: "Setting up Environment Variables"
date: 2018-05-20T11:35:32-04:00
weight: 2
subsection: Build Your Own App
---

In order to use the **make build**, **make build-android** and/or **make build-ios** commands, you'll need to set a few environment variables. In this guide, we will explain them. In order to make fastlane work with these environment variables you have two options:

* Copy the file with your variables to `../mattermost-mobile/fastlane/.env` where `.env` is the file name.

or

* Create an .sh file with your variables (for example `my_env.sh`), and execute `source my_env.sh` in the terminal session where you will later execute the **make** commands

| Variable            | Description                                | Default    | Platform  |
|---------------------|--------------------------------------------|------------|-----------|
| COMMIT\_CHANGES\_TO\_GIT | Should the fastlane script ensure that there are no changes to git before building the app and that every change made during the build is committed back to git.<br>Valid values are: true, false | false | Android, iOS |
| BRANCH\_TO\_BUILD | Defines the git branch that is going to be used for generating the build. <br>**Make sure you set this value is set if to an existing branch**.| master | Android, iOS |
| GIT\_LOCAL\_BRANCH | Defines the local branch to be created from BRANCH\_TO\_BUILD to ensure the base branch does not get any new commits on it.<br>**Make sure a branch with this name does not yet exist in your local git**. |  | Android, iOS |
| RESET\_GIT\_BRANCH | Defines if once the build is done the branch should reset to the initial state before building and delete the branch created to build the app.<br>Valid values are: true, false | false | Android, iOS |
| VERSION\_NUMBER | Set the version of the app on build time if you want to use another one than the one set in the project. |  | Android, iOS |
| INCREMENT\_VERSION\_<br>NUMBER\_MESSAGE | Set the commit message when changing the app version number. | Bump app version number to | Android, iOS |
| INCREMENT\_BUILD\_NUMBER | Defines if the app build number should be incremented.<br>Valid values are: true, false | false | Android, iOS |
| BUILD\_NUMBER | Set the build number of the app on build time if you want to use another than the next number. |  | Android, iOS |
| INCREMENT\_BUILD\_<br>NUMBER\_MESSAGE | Set the commit message when changing the app build number. | Bump app build number to | Android, iOS |
| APP\_NAME | The name of the app as it is going to be shown in the device home screen. | Mattermost Beta | Android, iOS |
| REPLACE\_ASSETS | Replaces the icons of the app with the ones found under the folder *dist/assets/release/icons/* and the splash screen with the one found under the folder *dist/assets/release/splash\_screen/*. Valid values are: true, false | false | Android, iOS |
| MAIN\_APP\_IDENTIFIER | The bundle / package identifier for the app. | com.mattermost.rnbeta | Android, iOS |
| BUILD\_FOR\_RELEASE | Defines if the app should be built in release mode. Valid values are: true, false <br> **Make sure you set this value to true if you plan to submit this app to TestFlight, Google Play or distribute it in any other way**. | false | Android, iOS |
| SUBMIT\_ANDROID\_TO\_<br>GOOGLE\_PLAY | Should the app be submitted to the Play Store once it finishes to build, use along with **SUPPLY\_TRACK**. Valid values are: true, false | false | Android |
| SUPPLY\_TRACK | The track of the application to use when submitting the app to Google Play Store. Valid values are: alpha, beta, production <br> **We strongly recommend not submitting the app to to production, instead try any of the other tracks and then promote your app using the Google Play console**. | production | Android |
| SUPPLY\_PACKAGE\_NAME | The package Id of your application, make sure it matches **MAIN\_APP\_IDENTIFIER**. | com.mattermost.rnbeta | Android |
| SUPPLY\_JSON\_KEY | The path to the service account json file used to authenticate with Google. <br> See the [Supply documentation]( https://docs.fastlane.tools/actions/supply/#setup) to learn more. |  | Android |
| EXTENSION\_APP\_IDENTIFIER | The bundle identifier for the share extension. | com.mattermost.rnbeta.MattermostShare | iOS |
| FASTLANE\_TEAM\_ID | The ID of your Apple Developer Portal Team. |  | iOS |
| IOS\_ICLOUD\_CONTAINER | The iOS iCloud container identifier used to support iCloud storage. | iCloud.com.mattermost.rnbeta | iOS |
| IOS\_APP\_GROUP | The iOS App Group identifier used to share data between the app and the share extension. |  | iOS |
| SYNC\_PROVISIONING\_PROFILES | Should we run **match** to sync the provisioning profiles. Valid values are: true, false | false | iOS |
| MATCH\_USERNAME | Your Apple ID Username. |  | iOS |
| MATCH\_PASSWORD | Your Apple ID Password. |  | iOS |
| MATCH\_KEYCHAIN\_PASSWORD | Your Mac user password used to install the certificates in the build computer KeyChain. |  | iOS |
| MATCH\_GIT\_URL | URL to the git repo containing all the certificates. <br> **Make sure this git repo is set to private. Remember this repo will be used to sync the provisioning profiles and other certificates**.|  | iOS |
| MATCH\_APP\_IDENTIFIER | The Bundle Identifiers for the app (comma-separated). In our case refers to the identifiers of the app and the share extension | com.mattermost.rnbeta.MattermostShare,<br>com.mattermost.rnbeta | iOS |
| MATCH\_TYPE | Define the provisioning profile type to sync. Valid values are: appstore, adhoc, development, enterprise <br> **Make sure you set this value to the same type as the IOS\_BUILD\_EXPORT\_METHOD as you want to have the same provisioning profiles installed in the machine so they are found when signing the app**. | adhoc | iOS |
| SUBMIT\_IOS\_TO\_TESTFLIGHT | Submit the app to TestFlight once the build finishes. Valid values are: true, false | false | iOS |
| PILOT\_USERNAME | Your Apple ID Username used to deploy the app to TestFlight. |  | iOS |
| PILOT\_SKIP\_WAITING\_<br>FOR\_BUILD\_PROCESSING | Do not wait until TestFlight finishes processing the app.<br>Valid values are: true, false | true | iOS |
