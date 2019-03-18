---
title: "Build the Android App"
date: 2018-05-20T11:35:32-04:00
weight: 4
subsection: Build Your Own App
---

To distribute your Android application via the Google Play Store, you'll need to generate a signed release APK as Android requires all apps to be digitally signed with a certificate before they can be installed.

#### Generating a Signing Key

To generate the signed key, use **keytool** which comes with the JDK required to develop the Android app.

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

**Once you publish the app on the Play Store, you will need to republish your app under a different package id (losing all downloads and ratings) if you change the signing key at any point.**

**Backup your keystore and don't forget the password.**


#### Building the App

Once all the previous steps are done, execute the following command from within the project's directory:

```sh
$ make build-android
```

This will start the build process following the environment variables you've set. Once it finishes, it will create an *.apk* file with the `APP_NAME` as the filename in the project's root directory. If you have not set Fastlane to submit the app to the Play Store, you can use this file to manually publish and distribute the app.
