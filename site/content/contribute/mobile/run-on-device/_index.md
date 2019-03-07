---
title: "Run on a Device"
date: 2018-05-20T11:35:32-04:00
weight: 4
subsection: Mobile Apps
---

If you want to test the app or if you want to make a contribution it is always a good idea to run the app on an actual device. This will let you ensure that the app is working correctly and in a performant way before making a pull request.

### Running on Android Devices

#### Enable Debugging over USB

Most Android devices can only install and run apps downloaded from Google Play. By default, in order to be able to install our app in the device during development you will need to enable USB Debugging on your device in the "Developer options" menu by going to **Settings -\> About phone** and then tap the Build number row at the bottom seven times, then go back to **Settings -> Developer options** and enable "USB debugging".

#### Plug in Your Device via USB

Plug in your Android device in any available USB port in your development machine (try to avoid hubs and plug it directly into your computer) and check that your device is properly connecting to ADB (Android Debug Bridge) by running **adb devices**.

```sh
$ adb devices
List of devices attached
42006fb3e4fb25b8    device
```

If you see **device** in the right column that means that the device is connected. You must have **only one device connected** at a time.

#### Run the App

With your device connected to the USB port execute the following in your command prompt to install and launch the app on the device:

```sh
$ make run-android
```

If you get a "bridge configuration isn't available" error. See [Using adb reverse](http://facebook.github.io/react-native/docs/running-on-device.html#method-1-using-adb-reverse-recommended).

You can also run a **Release** build of the app in your device by setting the *VARIANT* environment variable to "release" like:

```sh
$ VARIANT=release make run-android
```

**If you already have a Debug app install in your phone, you need to uninstall it first because the Debug and Release variants aren't compatible. If it is installed, you will get an error saying `INSTALL_FAILED_UPDATE_INCOMPATIBLE`.**

Also remember running the app in Release mode will be more performant than in debug mode but you cannot test new changes without recompiling the app.

### Running on iOS Devices

#### Plug in Your Device via USB

Plug in your iOS device in any available USB port in your development machine (try to avoid hubs and plug it directly into your computer). Navigate to the ios folder in your `mattermost-mobile` project, then open the file **Mattermost.xcworkspace** in XCode.

If this is your first time running an app on your iOS device, you may need to register your device for development. To do so, open the **Product** menu in XCode menu bar, then go to **Destination** and look for your device to select from the list.

#### Configure Code signing

Register for an [Apple developer account](https://developer.apple.com/) if you don't have one yet.

Select the **Mattermost** project in the Xcode Project Navigator, then select the **Mattermost** target. Look for the "General" tab. Go to the "Signing" section and make sure your Apple developer account or team is selected under the Team dropdown. Then make sure to change the *Bundle Identifier* in the "Identity" section that will be used for your own custom build. XCode will then register your provisioning profiles in your account for the Bundle Identifier you've entered.

![image](/img/mobile/code_signing.png)

Repeat the steps for the **MattermostTests** target in the project and the **MattermostShare** target.

**The `MattermostShare` target must use different *Bundle Identifier*
than the other two targets.**

#### Configure App Groups

Select the **Mattermost** project in the Xcode Project Navigator, then select the **Mattermost** target. Look for the "Capabilities" tab. Expand the **App Groups** capability and then enter the name for your app group, remember that it has to include the "group." prefix.

Repeat the process for the **MattermostShare** target and use the same app group defined in the **Mattermost** target. App Groups are used to share data between the main app and the app extension.

![image](/img/mobile/app_groups.png)

Finally, you'll need to set the same app group in your config.json under the assets folder. Refer to Overriding Assets & White Labeling\_ section for further instructions.

#### Configure iCloud container identifier

Select the **Mattermost** project in the Xcode Project Navigator, then select the **Mattermost** target. Look for the "Capabilities" tab. Expand the **iCloud** capability, select the option to *Specify custom containers* and then add and enable your own.

![image](/img/mobile/ios_icloud.png)

#### Build and Run the App

If everything is set up correctly, your device will be listed as the build target in the Xcode toolbar, and it will also appear in the Devices Pane (⇧⌘2). You can press the **Build and run** button (⌘R) or select the **Run** from the Product menu to run the app.

![image](/img/mobile/running_ios.png)

If you run into any issues, please take a look at Apple's [Launching Your App on a
Device](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html#//apple_ref/doc/uid/TP40012582-CH27-SW4) documentation.

If the app fails to build, you can try either of the following options before trying to build the app again:

- Go to the **Product** menu and select **Clean**
- Go to the **Product** menu, hold down the Option key, and select **Clean Build Folder…**
