---
title: "Corporate Proxy Server"
date: 2020-03-09T11:35:32
weight: 3
subsection: "Setup Push Notifications"
---

### How do I receive mobile push notification if my IT policy requires the use of a corporate proxy server?

When your IT policy requires a corporate proxy to scan and audit all outbound traffic the following options are available:

###### 1 - Deploy Mattermost with connection restricted post-proxy relay in DMZ or a trusted cloud environment

Some legacy corporate proxy configurations may be incompatible with the requirements of modern mobile architectures, such as the requirement of HTTP/2 requests from Apple to send push notifications to iOS devices.

In this case, a [post-proxy relay](https://docs.mattermost.com/overview/faq.html#what-are-pre-proxy-and-post-proxy-relays) can be deployed to take messages from the Mattermost server passing through your corporate IT proxy in the incompatible format, e.g. HTTP/1.1, transform it to HTTP/2 and relay it to its final destination, either to the [Apple Push Notification Service (APNS)](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html#//apple_ref/doc/uid/TP40008194-CH8-SW1) and [Google Fire Cloud Messaging (FCM)](https://firebase.google.com/docs/cloud-messaging) services. 

Ths **post-proxy relay** [can be configured using the Mattermost Push Proxy installation guide](https://developers.mattermost.com/contribute/mobile/push-notifications/service/) with connection restrictions to meet your custom security and compliance requirements.

In place of a DMZ you can also host in a trusted cloud environment such as AWS or Azure depending on your internal approvals and policies. 

![image](/img/mobile/post-proxy-relay.png)

###### 2 - Whitelist Mattermost push notification proxy to bypass your corporate proxy server

Depending on your internal IT policy and approved waivers/exceptions, you may choose to deploy the [Mattermost Push Proxy](https://developers.mattermost.com/contribute/mobile/push-notifications/service/) to connect directly to [Apple Push Notification Service (APNS)](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html#//apple_ref/doc/uid/TP40008194-CH8-SW1) without your corporate proxy.

You will need to [whitelist one subdomain and one port from Apple](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CommunicatingwithAPNs.html#//apple_ref/doc/uid/TP40008194-CH11-SW1) for this option:

 - Development server: `api.development.push.apple.com:443`
 - Production server: `api.push.apple.com:443`

###### 3 - Run App Store versions of the Mattermost mobile apps

You can use the mobile applications hosted by Mattermost in the [Apple App Store](https://apps.apple.com/ca/app/mattermost/id1257222717) or [Google Play Store](https://play.google.com/store/apps/details?id=com.mattermost.rn) and connect with [Mattermost Hosted Push Notification Service (HPNS)](https://docs.mattermost.com/mobile/mobile-hpns.html) through your corporate proxy.

The use of hosted applications by Mattermost [can be deployed with Enterprise Mobility Management solutions via AppConfig](https://docs.mattermost.com/mobile/mobile-appconfig.html) but do not support wrapping.