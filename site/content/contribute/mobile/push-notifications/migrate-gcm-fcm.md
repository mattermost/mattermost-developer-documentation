---
title: "Migrate Android from GCM to FCM"
date: 2015-05-20T11:35:32-04:00
weight: 4
subsection: "Setup Push Notifications"
---

As of April 10, 2018, Google has deprecated the [GCM service](https://developers.google.com/cloud-messaging/gcm). The GCM server and client APIs are deprecated and will be removed as soon as April 11, 2019. Migrate GCM apps to [Firebase Cloud Messaging (FCM)](http://firebase.google.com/docs/cloud-messaging/), which inherits the reliable and scalable GCM infrastructure.

The [Mattermost Push Notification Service](https://github.com/mattermost/mattermost-push-proxy/releases) version 5.8+ uses FCM to send Push notifications for Android.

- Update your Mattermost Push Notification service to 5.8 or above.
- Go to the [Firebase Console](https://console.firebase.google.com) and select the project you've created. Once in the dashboard, go to the project settings and select **CLOUD MESSAGING**.
![image](/img/mobile/firebase_settings.png)
![image](/img/mobile/firebase_cloud_messaging.png)
 
- Look for the value of the **Server Key** and copy it.
![image](/img/mobile/firebase_server_key.png)

- Open the **mattermost-push-proxy.json** file in the `mattermost-push-proxy/config` directory and replace the value for the "AndroidApiKey" setting with the **Server Key** you just copied.
![image](/img/mobile/proxy-config.png)

- Restart your Mattermost Push Notification Service, and notifications should be sent using FCM.
