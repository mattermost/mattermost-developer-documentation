---
title: "iOS Push Notifications"
heading: "iOS Push Notifications on Mattermost"
description: "Push notifications on iOS are managed and dispatched using Apple’s Push Notification Service. Learn how to use this service with Mattermost."
date: 2015-05-20T11:35:32-04:00
weight: 2
---

Push notifications on iOS are managed and dispatched using [Apple's Push Notification Service](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html). You must have a **Paid Apple Developer account** to create certificates needed to send notifications using this service.

- Generate a Certificate from Keychain Access
    - Launch the **Keychain Access application** in your Mac and select **KeyChain Access -\Certificate Assistant -\Request a Certificate From a Certificate Authority...**
        ![image](/img/mobile/ios_keychain_request_certificate.png)

    - Enter your email address in **User Email Address** and check the **"Save to disk"** option, then click **Continue**
        ![image](/img/mobile/ios_keychain_create_cert_request.png)

    - Save the certificate request
        ![image](/img/mobile/ios_keychain_save_cert_request.png)

- Log in to [Apple developer account](https://developer.apple.com/account) and click **Certificates, Identifiers and Profiles**
![image](/img/mobile/ios_account.png)

- Select the plus icon to create a new certificate
![image](/img/mobile/ios_new_certificate.png)

- Select a new "Apple Push Notifications service SSL (Sandbox & Production)"
![image](/img/mobile/apns.png)

- Choose the App ID you're generating a certificate for. Use the regular App ID for the Mattermost app, **not** for the `.NotificationService`, etc.
![image](/img/mobile/choose_app_id.png)

- Choose the certificate request file created using the Keychain access in the previous section and select **Continue**.
![image](/img/mobile/ios_upload_csr.png)

- Download the Certificate and click **Done** to finish the process

At this point, you can build the Mattermost app for iOS and use the above downloaded certificate to setup the [Mattermost Push Notification Service](/contribute/mobile/push-notifications/service/).
