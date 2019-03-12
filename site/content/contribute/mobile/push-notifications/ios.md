---
title: "iOS Push Notifications"
date: 2015-05-20T11:35:32-04:00
weight: 2
subsection: "Setup Push Notifications"
---

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

At this point, you can build the Mattermost app for iOS and use the above downloaded certificate to setup the [Mattermost Push Notification Service](/contribute/mobile/push-notifications/service).
