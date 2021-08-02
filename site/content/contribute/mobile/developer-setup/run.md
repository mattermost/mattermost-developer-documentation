---
title: Run the app
heading: "Running the Mattermost App"
description: "Mattermost provides a set of scripts to help you run the app for different platforms. Learn about them here."
date: 2018-05-20T11:35:32-04:00
weight: 2
---

We provide a set of scripts to help you run the app for the different platforms that are executed with `npm`:

* **npm start**: Start the React Native packager. The packager has to be running in order to build the JavaScript code that powers the app.
* **npm run android**: Compile and run the mobile app on Android.
* **npm run ios**: Compile and run the mobile app on iOS.

---
**Important:**

To speed up development, only compile and run the apps in the following cases:
- You have not deployed the app to a device or simulator with the `npm run <platform>` command.
- You have made changes in the native code.
- You have added a new library that has native code.

If none of the above cases apply, you could just simply start the React Native packager with `npm start` and launch the app you have already deployed to the device or simulator.

---

The above commands are shortcuts for the `react-native` CLI.  You can append `-- --help` to the above commands to see available options, for example:

```sh
$ npm run android -- --help
```

Make sure you are adding `--` before the options you want to include or run the `react-native` CLI directly:

```sh
$ npx react-native run-android --help
```

## Run on a Device

By default running the app will launch an Android emulator (if you created one) or an iOS simulator, but if you want to test the performance of the app or if you want to make a contribution it is always a good idea to run the app on an actual device.

This will let you ensure that the app is working correctly and in a performant way before submitting a pull request.

#### Run on Android Devices

To be able to run the app on an Android device you'll need to follow these steps:

##### 1. Enable debugging over USB

Most Android devices can only install and run apps downloaded from Google Play by default. In order to be able to install the Mattermost Mobile app in the device during development you will need to enable USB Debugging on your device in the **Developer options** menu by going to **Settings > About phone** and then tap the Build number row at the bottom seven times, then go back to **Settings > Developer options** and enable **USB debugging**.

##### 2. Plug in your device via USB

Plug in your Android device in any available USB port in your development machine (try to avoid hubs and plug it directly into your computer) and check that your device is properly connecting to ADB (Android Debug Bridge) by running `adb devices`.

```sh
$ adb devices
List of devices attached
42006fb3e4fb25b8    device
```

If you see **device** in the right column that means that the device is connected. You can have multiple devices attached and the app will be deployed to **all of them**.

##### 3. Compile and run

With your device connected to the USB port execute the following in your command prompt to install and launch the app on the device:

```sh
$ npm run android
```

---
**Note:**

If you don't see a green bar at the top loading the JavaScript code then it's possible that the device is not connected to the development server. See [Using adb reverse](http://reactnative.dev/docs/running-on-device.html#method-1-using-adb-reverse-recommended).

---

#### Run on iOS Devices

To be able to run the app on an iOS device you'll need to have [Xcode](https://developer.apple.com/xcode/) installed on a Mac computer and follow this steps:

##### 1. Get an Apple Developer Account

The apps that run on an iOS device must be signed. To sign it, you'll need a set of provisioning profiles. If you already have an Apple Developer account enrolled in the Apple Developer program you can skip this step. If you don't have an account yet you'll need to [create one](https://appleid.apple.com/account?appId=632&returnUrl=https%3A%2F%2Fdeveloper.apple.com%2Faccount%2F#!&page=create) and enroll in the [Apple Developer Program](https://developer.apple.com/programs/).

##### 2. Open the project in Xcode

Navigate to the `ios` folder in your `mattermost-mobile` project, then open the file `Mattermost.xcworkspace` in Xcode.

##### 3. Configure code signing and capabilities

Select the **Mattermost** project in the Xcode Project Navigator, then select the **Mattermost** target. Look for the **Signing & Capabilities** tab.

* Go to the **Signing** section and make sure your Apple developer account or team is selected under the Team dropdown and change the [Bundle Identifier](https://developer.apple.com/documentation/appstoreconnectapi/bundle_ids). Xcode will register your provisioning profiles in your account for the Bundle Identifier you've entered if it doesn't exist.
* Go to the **App Groups** section and change the [App Groups](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_security_application-groups?language=objc). Xcode will register your AppGroupId and update the provision profile.
* Go to the **iCloud** section and change the [Containers](https://developer.apple.com/documentation/bundleresources/entitlements/com_apple_developer_icloud-container-identifiers?language=objc). Xcode will register your iCloud container and update the provision profile.
* Go to the **Keychain Sharing** section and change the [Keychain Groups](https://developer.apple.com/documentation/bundleresources/entitlements/keychain-access-groups?language=objc). Xcode will register your Keychain access groups and update the provision profile.

---
**Important:**

**Repeat the steps for the `MattermostShare` and `NotificationService` targets.** Each target must use a **different** *Bundle Identifier*.

---

##### 4. Compile and run

Plug in your iOS device in any available USB port in your development computer.

If everything is set up correctly, your device will be listed as the build target in the Xcode toolbar, and it will also appear in the Devices Pane (⇧⌘2). You can press the **Build and run** button (⌘R) or select **Run** from the Product menu to run the app.

![image](/img/mobile/running_ios.png)

As an alternative you can select the targeted device by opening the **Product** menu in Xcode menu bar, then go to **Destination** and look for your device to select from the list.

---
**Note:**
If you run into any issues, please take a look at Apple's [Launching Your App on a Device](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4) documentation.

If the app fails to build, you can try the following before trying to build the app again:

- Go to the **Product** menu and select **Clean Build Folder**

---
