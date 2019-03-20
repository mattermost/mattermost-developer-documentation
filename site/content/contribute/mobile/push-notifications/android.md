---
title: "Android Push Notifications"
date: 2015-05-20T11:35:32-04:00
weight: 1
subsection: "Setup Push Notifications"
---

Push notifications on Android are managed and dispatched using [Firebase Cloud Messaging (FCM)](http://firebase.google.com/docs/cloud-messaging/)

- Create a Firebase project within the [Firebase Console](https://console.firebase.google.com).

- Click **Add Project**
![image](/img/mobile/firebase_console.png)

- Enter the project name, project ID and Country

- Click **CREATE PROJECT**

    ![image](/img/mobile/firebase_project.png)

Once the project is created you'll be redirected to the Firebase project
dashboard

![image](/img/mobile/firebase_dashboard.png)

- Click **Add Firebase to your Android App**
- Enter the package ID of your custom Mattermost app as the **Android package name**.
- Enter an **App nickname** so you can identify it with ease
- Click **REGISTER APP**
- Once the app has been registered, download the **google-services.json** file which will be used later

- Click **CONTINUE** and then **FINISH**
![image](/img/mobile/firebase_register_app.png)
![image](/img/mobile/firebase_google_services.png)
![image](/img/mobile/firebase_sdk.png)

Now that you have created the Firebase project and the app and
downloaded the *google-services.json* file, you need to make some
changes in the project.

- Replace `android/app/google-services.json` with the one you downloaded earlier
- Open `android/app/google-services.json`, find the project\_number and copy the value
- Open `android/app/src/main/AndroidManifest.xml` file, look for the line `<meta-data android:name="com.wix.reactnativenotifications.gcmSenderId" android:value="184930218130\"/>` and replace the value with the one that you copied in the previous step

**Leave the trailing \ intact**

At this point, you can build the Mattermost app for Android and setup the [Mattermost Push Notification Service](/contribute/mobile/push-notifications/service).

