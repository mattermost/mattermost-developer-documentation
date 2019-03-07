---
title: "Setup Push Notification Service"
date: 2015-05-20T11:35:32-04:00
weight: 3
subsection: "Setup Push Notifications"
---

### Install the Mattermost Push Notification Service

##### Requirements

- A linux box server with at least 1GB of memory.
- A copy of the [Mattermost Push Notification Service](https://github.com/mattermost/mattermost-push-proxy/releases).
- [Custom Android and/or iOS](/contribute/mobile/build-your-own) Mattermost mobile apps.
- Private and public keys obtained from the [Apple Developer Program](https://developer.apple.com/account/ios/certificate/).
- A Firebase Cloud Messaging Server key obtained from the [Firebase Console](https://console.firebase.google.com).
- Configure the Mattermost server to use the Mattermost Push Notification Service you are configuring and deploying.


Now that the app can receive push notifications, we need to make sure that the Mattermost Push Notification Service is able to send the notification to the device. This guide will focus on the changes needed to configure the push notification service.


### Set Up Mattermost Push Notification Service to Send Android Push Notifications

- Go to the [Firebase Console](https://console.firebase.google.com) and select the project you've created. Once in the dashboard, go to the project settings and select **CLOUD MESSAGING**.
![image](/img/mobile/firebase_settings.png)
![image](/img/mobile/firebase_cloud_messaging.png)

- Look for the value of the **Server Key** and copy it.
![image](/img/mobile/firebase_server_key.png)

- Open the **mattermost-push-proxy.json** file in the `mattermost-push-proxy/config` directory and paste the value for the "AndroidApiKey" setting
![image](/img/mobile/proxy-config.png)


### Set up Mattermost Push Notification Service to Send iOS Push Notifications

- Double click the **Distribution Certificate** generated while [Setup Push Notifications for iOS](/contribute/mobile/push-notifications/ios) to add it to your Keychain Access. Go to **Keychain Access**, select the **login** keychain and **My Certificates** from the side menu.
![image](/img/mobile/ios_keychain_select.png)

- Find the certificate you imported and then right click to **export** it as a **.p12** file
![image](/img/mobile/ios_keychain_export.png)

- Enter a name for the filename and click **Save**
![image](/img/mobile/ios_keychain_export_save.png)

- Leave the **password** blank and then click **OK**
![image](/img/mobile/ios_keychain_export_password.png)

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

    ![image](/img/mobile/proxy-config.png)


### Configure the Mattermost Server to use the Mattermost Push Notification Service

- In you Mattermost instance, enable mobile push notifications.
    * Go to **System Console > Notifications > Mobile Push**.
    * Under **Send Push Notifications**, select **Manually enter Push Notification Service location**.
    * Enter the location of your Mattermost Push Notification Service in the **Push Notification Server** field.

![image](/img/mobile/manual_mpns.png)

- (Optional) Customize mobile push notification contents.
    * Go to **System Console > Notifications > Mobile Push**.
    * Select an option for **Push Notification Contents** to specify what type of information to include in the push notifications.
    * Most deployments choose to include the full message snippet in push notifications unless they have policies against it to protect confidential information.

![image](/img/mobile/push_contents.png)

- Finally, start your Mattermost Push Notification Service, and your app should start receiving push notifications.
