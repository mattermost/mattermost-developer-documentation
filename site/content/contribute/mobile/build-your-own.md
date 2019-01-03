---
title: "Build Your Own App"
date: 2018-05-20T11:35:32-04:00
weight: 6
subsection: Mobile Apps
---

You can build the app from source and distribute it within your team or company either using the App Stores, Enterprise App Stores or EMM providers, or another way of your choosing.

We recommend using the **make build**\* commands in conjunction with [Fastlane](https://docs.fastlane.tools/#choose-your-installation-method). With Fastlane, you can also configure the app using environment
variables.

### Build Preparations

First of all, ensure that the following remains exactly the same as in the original [mattermost-mobile](https://github.com/mattermost/mattermost-mobile) repo:

- The package ID for the Android app and the Bundle Identifier for the iOS app remain the same as the one in the original mattermost-mobile repo, com.mattermost.rnbeta.
- Android-specific source files remain under `android/app/src/main/java/com/mattermost/rnbeta`
- Your [environment variables](https://github.com/mattermost/mattermost-mobile/blob/master/fastlane/env_vars_example) are set according to your needs

#### Setting up Environment Variables

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
| MATCH\_GIT\_URL | URL to the git repo containing all the certificates. <br> **Make sure this git repo is set to private. Remember this repo will be used to sync the provisioning profiles and other certificates**.|  | iOS |
| MATCH\_APP\_IDENTIFIER | The Bundle Identifiers for the app (comma-separated). In our case refers to the identifiers of the app and the share extension | com.mattermost.rnbeta.MattermostShare,<br>com.mattermost.rnbeta | iOS |
| MATCH\_TYPE | Define the provisioning profile type to sync. Valid values are: appstore, adhoc, development, enterprise <br> **Make sure you set this value to the same type as the IOS\_BUILD\_EXPORT\_METHOD as you want to have the same provisioning profiles installed in the machine so they are found when signing the app**. | adhoc | iOS |
| SUBMIT\_IOS\_TO\_TESTFLIGHT | Submit the app to TestFlight once the build finishes. Valid values are: true, false | false | iOS |
| PILOT\_USERNAME | Your Apple ID Username used to deploy the app to TestFlight. |  | iOS |
| PILOT\_SKIP\_WAITING\_<br>FOR\_BUILD\_PROCESSING | Do not wait until TestFlight finishes processing the app.<br>Valid values are: true, false | true | iOS |


### Build the Android App

Android requires that all apps be digitally signed with a certificate before they can be installed, so to distribute your Android application via the Google Play Store, you'll need to generate a signed release APK.

#### Generating a Signing Key

To generate the signed key, we'll be using **keytool** which comes with the JDK required to develop for Android.

```sh
$ keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

The above command prompts you for passwords for the keystore and key (make sure you use the same password for both), and asks you to provide the Distinguished Name fields for your key. It then generates the keystore as a file called my-release-key.keystore.

The keystore contains a single key, valid for 10000 days. The alias is a name that you will use later when signing your app, so remember to take a note of the alias.

**Remember to keep your keystore file private and never commit it to version control.**

#### Setting up Gradle Variables

- Place the *my-release-key.keystore* file under a directory that you can access. It can be in your home directory or even under *android/app* in the project folder so long as it is not checked in.
- Edit the file \~/.gradle/gradle.properties, or create it if one does not exist, and add the following:

    ```sh
    MATTERMOST_RELEASE_STORE_FILE=/full/path/to/directory/containing/my-release-key.keystore
    MATTERMOST_RELEASE_KEY_ALIAS=my-key-alias
    MATTERMOST_RELEASE_PASSWORD=*****
    ```

**Replace `/full/path/to/directory/containing/my-release-key.keystore` with the full path to the actual keystore file and `\********` with the actual keystore password.**

**Once you publish the app on the Play Store, you will need to republish your app under a different package id (losing all downloads and ratings) if you change the signing key at any point, so backup your keystore and don't forget the password.**


#### Building the App

Once all the previous steps are done, execute the following command from within the project's directory:

```sh
$ make build-android
```

This will start the build process following the environment variables you've set. Once it finishes, it will create an *.apk* file with the `APP_NAME` as the filename in the project's root directory. If you have not set Fastlane to submit the app to the Play Store, you can use this file to manually publish and distribute the app.

### Build the iOS App

Apple requires that all apps be digitally signed with a certificate before they can be installed, so to distribute your iOS application via Apple App Store, you'll need to generate a signed release IPA. The process is the same as any other native iOS app, but in our case we've created a set of scripts in conjunction with Fastlane to make this process easier than the standard manual process.

We make use of [Match](https://docs.fastlane.tools/actions/match/) to sync your provisioning profiles (the profiles will be created for you if needed), then use [Gym](https://docs.fastlane.tools/actions/gym/) to build and sign the app, and then optionally use [Pilot](https://docs.fastlane.tools/actions/pilot/) to submit the app to TestFlight in order for you to promote the app to the App Store.

#### Building the App

Once all the previous steps are done, you can run the following command from within the project's directory

```sh
$ make build-ios
```

This will start the build process following the environment variables you've set. Once it finishes, it will create an *.ipa* file with the `APP_NAME` as the filename in the project's root directory. If you have not set Fastlane to submit the app to TestFlight, you can use this file to manually publish and distribute the app.

### Build both platforms in sequence

Once all the previous steps are done, you can choose to build the Android and iOS apps in sequence with just one command, to do so run the following command from within the project's directory

```sh
$ make build
```

This will start the build process following the environment variables you've set, first by building the Android app and then the iOS app. Once it finishes, it will create an *.apk* and an *.ipa* file with the `APP_NAME` as the filename in the project's root directory. If you have not set Fastlane to submit the app to the Google Play Store and/or TestFlight, you can use this file to manually publish and distribute the app.


## Push Notifications with Your Own Build

When building a custom version of the Mattermost mobile app, you will also need to host your own [Mattermost Push Proxy Server](https://github.com/mattermost/mattermost-push-proxy) and make a few modifications to your Mattermost mobile app to be able to get push notifications.

### Set Up Android to Receive Push Notifications

Push notifications on Android are managed and dispatched using [Google's GCM service](https://developers.google.com/cloud-messaging/gcm) (now integrated into Firebase).

- Create a Firebase project within the [Firebase Console](https://console.firebase.google.com).

- Click **Add Project**
![image](/img/firebase_console.png)

- Enter the project name, project ID and Country

- Click **CREATE PROJECT**

    ![image](/img/firebase_project.png)

Once the project is created you'll be redirected to the Firebase project
dashboard

![image](/img/firebase_dashboard.png)

- Click **Add Firebase to your Android App**
- Enter the package ID of your custom Mattermost app as the **Android package name**.
- Enter an **App nickname** so you can identify it with ease
- Click **REGISTER APP**
- Once the app has been registered, download the **google-services.json** file which will be used later

- Click **CONTINUE** and then **FINISH**
![image](/img/firebase_register_app.png)
![image](/img/firebase_google_services.png)
![image](/img/firebase_sdk.png)

Now that you have created the Firebase project and the app and
downloaded the *google-services.json* file, you need to make some
changes in the project.

- Replace `android/app/google-services.json` with the one you downloaded earlier
- Open `android/app/google-services.json`, find the project\_number and copy the value
- Open `android/app/src/main/AndroidManifest.xml` file, look for the line `<meta-data android:name="com.wix.reactnativenotifications.gcmSenderId" android:value="184930218130\"/>` and replace the value with the one that you copied in the previous step

**Leave the trailing \ intact**

At this point, you can build the Mattermost app for Android.

### Set Up Mattermost Push Proxy Server to Send Android Push Notifications

Now that the app can receive push notifications, we need to make sure that the Push Proxy server is able to send the notification to the device. If you haven't installed the Mattermost Push Proxy Server, you should now do so by following the documentation in the [Mattermost Push Proxy Server repository](https://github.com/mattermost/mattermost-push-proxy/blob/master/README.md) and the documentation about [Hosted Push Notification Service](https://docs.mattermost.com/mobile/mobile-hpns.html). This guide will focus on the changes needed to configure the push proxy.

- Go to the [Firebase Console](https://console.firebase.google.com) and select the project you've created. Once in the dashboard, go to the project settings and select **CLOUD MESSAGING**.
![image](/img/firebase_settings.png)
![image](/img/firebase_cloud_messaging.png)

- Look for the value of the **Legacy Server Key** and copy it.
![image](/img/farebase_server_key.png)

- Open the **mattermost-push-proxy.json** file in the `mattermost-push-proxy/config` directory and paste the value for the "AndroidApiKey" setting
![image](/img/proxy-config.png)

- Finally restart your Mattermost Push Proxy server and your app should start receiving push notifications.

### Set Up iOS to Receive Push Notifications

Push notifications on iOS are managed and dispatched using [Apple's Push Notification Service](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html). You must have a **Paid Apple Developer account** to create certificates needed to send notifications using this service.

- Generate a Certificate from Keychain Access
    - Launch the **Keychain Access application** in your Mac and select **KeyChain Access -\Certificate Assistant -\Request a Certificate From a Certificate Authority...**
        ![image](/img/ios_keychain_request_certificate.png)

    - Enter your email address in **User Email Address** and check the **"Save to disk"** option, then click **Continue**
        ![image](/img/ios_keychain_create_cert_request.png)

    - Save the certificate request
        ![image](/img/ios_keychain_save_cert_request.png)

- Log in to [Apple developer account](https://developer.apple.com/account) and click **Certificates, Identifiers and Profiles**
![image](/img/ios\_account.png)

- Select iOS from the dropdown
![image](/img/ios\_type.png)

- Select App IDs from the side menu and look for the Bundle Identifier you are using for the Mattermost app
![image](/img/ios\_appid.png)

- Select the App ID and click **Edit**
![image](/img/ios\_edit\_appid.png)

- Scroll down to the **Push Notification** Section and click Create a **Production SSL Certificate**
![image](/img/ios\_create\_push\_certificate.png)

- In the **About Creating a Certificate Signing Request (CSR)** screen click Continue /img/ios\_csr.png)

- Choose the certificate request file created using the Keychain access in the previous section and click **Continue**
![image](/img/ios\_upload\_csr.png)

- Download the Certificate and click **Done** to finish the process

### Set up Mattermost Push Proxy Server to Send iOS Push Notifications

Now that the app is capable of receiving push notifications we need to make sure that the Push Proxy server is able to send the notification tothe device. If you haven't installed the Mattermost Push Proxy Server at this point you can do so by following the documentation on the [Mattermost Push Proxy Server repo](https://github.com/mattermost/mattermost-push-proxy/blob/master/README.md) and the documentation about [Hosted Push Notification Service](https://docs.mattermost.com/mobile/mobile-hpns.html). This guide will only focus on the changes needed in the **mattermost-push-proxy.json** file which is the configuration file for the push proxy.

- Double click the **Distribution Certificate** generated in the previous step to add it to your Keychain Access. Go to **Keychain Access**, select the **login** keychain and **My Certificates** from the side menu.
![image](/img/ios_keychain_select.png)

- Find the certificate you imported and then right click to **export** it as a **.p12** file
![image](/img/ios\_keychain\_export.png)

- Enter a name for the filename and click **Save**
![image](/img/ios\_keychain\_export\_save.png)

- Leave the **password** blank and then click **OK**
![image](/img/ios\_keychain\_export\_password.png)

- Convert the downloaded certificate to **.pem**
    ```sh
    \$ openssl x509 -in aps.cer -inform DER -out aps_production.pem
    ```
- Extract the private key from the certificate you exported ..
    ```sh
    \$ openssl pkcs12 -in Certificates.p12 -out aps_production_priv.pem -nodes -clcerts -passin pass:
    ```

- Verify the certificate works with apple
    ```sh
    \$ openssl s_client -connect gateway.push.apple.com:2195 -cert aps_production.pem -key aps_production_priv.pem
    ```

- Copy the private key file `aps_production_priv.pem` into your `mattermost-push-proxy/config` directory

- Open the **mattermost-push-proxy.json** file under the `mattermost-push-proxy/config` directory and add the path to the private key file as the value for **"ApplePushCertPrivate"** and the value for **"ApplePushTopic"** with your *Bundle Identifier*

    ![image](/img/proxy-config.png)

- Finally, restart your Mattermost Push Proxy server, and your app should start receiving push notifications.

Overriding Assets & White Labeling
----------------------------------

We've made it easy to white label the mobile app and to replace override the assets used, however, you have to Build Your Own App from Source\_.

If you look at the [Project Directory Structure](/contribute/mobile/developer-workflow/#project-directory-structure), you'll see that there is an assets folder containing a base folder with assets provided by Mattermost. These include localization files, images and a release folder that optionally contains the icons and the splash screen of the app when building in release mode.

To replace these with your own assets, create a sub-directory called `override` in the `assets` folder. Using the same directory structure and file names as in the `base` directory, you can add assets to the override folder to be used instead.

### Localization Strings

To replace some or all of the strings in the app in any supported language, create a new json file for each locale you wish to support in `assets/override/i18n`. Any strings that you provide will be used instead of the ones located in `assets/base/i18n`, but any that you don't provide will fall back to the base ones.

### Images

To replace an image, copy the image to `assets/override/images/` with the same location and file name as in the `base` folder.

**Make sure the images have the same height, width and DPI as the images that you are overriding.**

### App Splash Screen and Launch Icons

In the `assets` directory you will find a folder named `assets/base/release` which contains an `icons` folder and a `splash_screen` folder under each platform directory.

Copy the full `release` directory under `assets/override/release` and then replace each image with the same name. Make sure you replace all the icon images for the platform you are building for the app - the same applies to the splash screen.

The Splash Screen's background color is white by default and the image is centered. If you need to change the color or the layout to improve the experience of your new splash screen make sure that you also override the file `launch_screen.xml` for Android and `LaunchScreen.xib` for iOS. Both can found under`assets/base/release/splash\_screen/\<platform\>`.

**Make sure the images have the same height, width and DPI as the images that you are overriding.**

### Configuration

The config.json file handles custom configuration for the app for settings that cannot be controlled by the Mattermost server. Like with localization strings, create a `config.json` file under `assets/override` and just include the keys and values that you wish to change.

For example, if you want the app to automatically provide a server URL and skip the screen to input it, you would add the following to `assets/override/config.json`:
```json
{
  "DefaultServerUrl": "http://192.168.0.13:8065",
  "AutoSelectServerUrl": true
}
```

The above key/value pairs are taken from the original `config.json` file and since we don’t need to change anything else, we only included these two settings.
