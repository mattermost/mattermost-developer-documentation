---
subsection: "Set up Push Notifications"
date: 2015-05-20T11:35:32-04:00
weight: 3
subsection: Mobile Apps
---

When building a custom version of the Mattermost mobile app, you will also need to host your own [Mattermost Push Notification Service](https://github.com/mattermost/mattermost-push-proxy/releases) and make a few modifications to your Mattermost mobile app to be able to get push notifications.

1. Setup the custom mobile apps to receive push notifications
    - [Android](/contribute/mobile/push-notifications/android)
    - [iOS](/contribute/mobile/push-notifications/ios)
2. [Setup the Mattermost Push Notification Service](/contribute/mobile/push-notifications/service)

{{% note "Migration" %}}
As of April 10, 2018, Google has deprecated the [Google Cloud Messaging (GCM) service](https://developers.google.com/cloud-messaging/gcm). The GCM server and client APIs are deprecated and will be removed as of April 11, 2019. **If you are running the Mattermost Push Notification Service v5.4 or earlier**, you must [migrate to Firebase Cloud Messaging (FCM)](/contribute/mobile/push-notifications/migrate-gcm-fcm)
{{% /note %}}
