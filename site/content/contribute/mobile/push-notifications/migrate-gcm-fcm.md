---
title: "Migrate GCM to FCM"
date: 2015-05-20T11:35:32-04:00
weight: 4
subsection: "Setup Push Notifications"
---

As of April 10, 2018, Google has deprecated the [Google Cloud Messaging (GCM) service](https://developers.google.com/cloud-messaging/gcm). The GCM server and client APIs are deprecated and will be removed as of April 11, 2019. Migrate GCM apps to [Firebase Cloud Messaging (FCM)](http://firebase.google.com/docs/cloud-messaging/), which inherits the reliable and scalable GCM infrastructure, plus many new features.

The [Mattermost Push Notification Service](https://github.com/mattermost/mattermost-push-proxy/releases) version 5.8+ uses FCM to send Push notifications for Android.

1. [Upgrade your Mattermost Push Notification service](/contribute/mobile/push-notifications/service/#installing-upgrading) to [version 5.8 or above](https://github.com/mattermost/mattermost-push-proxy/releases)
2. Go to the [Firebase Console](https://console.firebase.google.com) and select the project you've created. Once in the dashboard, go to the project settings and select **CLOUD MESSAGING**.
![image](/img/mobile/firebase_settings.png)
![image](/img/mobile/firebase_cloud_messaging.png)
 
3. Look for the value of the **Server Key** and copy it.
![image](/img/mobile/firebase_server_key.png)

4. Open the **mattermost-push-proxy.json** file in the `mattermost-push-proxy/config` directory and replace the value for the "AndroidApiKey" setting with the **Server Key** you just copied.
![image](/img/mobile/proxy-config.png)

5. Restart your Mattermost Push Notification Service, and notifications should be sent using FCM.
   ```
   $ sudo service mattermost-push-proxy restart
    ```

6. Test push notifications are being delivered as expected.


### Troubleshooting

##### Cannot send push notifications through FCM, connection refused or timeout.

Make sure your firewall allows connections to the Firebase servers `fcm.googleapis.com/fcm` and `fcm-xmpp.googleapis.com` on ports:
```
80   TCP     HTTP client connection
443  TCP     HTTP client connection over SSL
5222 TCP     XMPP client connection  
5223 TCP     XMPP client connection over SSL  
```
