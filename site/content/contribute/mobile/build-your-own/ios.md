---
title: "Build the iOS App"
date: 2018-05-20T11:35:32-04:00
weight: 4
subsection: Build Your Own App
---

Apple requires that all apps be digitally signed with a certificate before they can be installed, so to distribute your iOS application via Apple App Store, you'll need to generate a signed release IPA. The process is the same as any other native iOS app, but in our case we've created a set of scripts in conjunction with Fastlane to make this process easier than the standard manual process.

We make use of [Match](https://docs.fastlane.tools/actions/match/) to sync your provisioning profiles (the profiles will be created for you if needed), then use [Gym](https://docs.fastlane.tools/actions/gym/) to build and sign the app, and then optionally use [Pilot](https://docs.fastlane.tools/actions/pilot/) to submit the app to TestFlight in order for you to promote the app to the App Store.

#### Building the App

Once all the previous steps are done, you can run the following command from within the project's directory

```sh
$ make build-ios
```

This will start the build process following the environment variables you've set. Once it finishes, it will create an *.ipa* file with the `APP_NAME` as the filename in the project's root directory. If you have not set Fastlane to submit the app to TestFlight, you can use this file to manually publish and distribute the app.
