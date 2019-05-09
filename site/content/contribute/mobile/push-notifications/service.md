---
title: "Push Notification Service"
date: 2015-05-20T11:35:32-04:00
weight: 3
subsection: "Setup Push Notifications"
---

### Install the Mattermost Push Notification Service

Now that the app can receive push notifications, we need to make sure that the Mattermost Push Notification Service is able to send the notification to the device. This guide will focus on installing and configuring the push notification service.

###### Requirements

- A linux box server with at least 1GB of memory.
- A copy of the [Mattermost Push Notification Service](https://github.com/mattermost/mattermost-push-proxy/releases).
- [Custom Android and/or iOS](/contribute/mobile/build-your-own) Mattermost mobile apps.
- Private and public keys obtained from the [Apple Developer Program](https://developer.apple.com/account/ios/certificate/).
- A Firebase Cloud Messaging Server key obtained from the [Firebase Console](https://console.firebase.google.com).

###### Installing & Upgrading {#installing-upgrading}

For the sake of making this guide simple we located the files at `/home/ubuntu/mattermost-push-proxy`. We've also elected to run the Push Notification Service as the `ubuntu` account for simplicity. We **recommend** setting up
and running the service under a `mattermost-push-proxy` user account with limited permissions.

1. Download the Mattermost Push Notification Service (any version):
`wget https://github.com/mattermost/mattermost-push-proxy/releases/download/vX.X.X/mattermost-push-proxy-X.X.X.tar.gz`

    in the previous command `vX.X.X` refers to the release version you want to download, see [Mattermost Push Notification Service releases](https://github.com/mattermost/mattermost-push-proxy/releases).

2. If you are upgrading a previous version of the Mattermost Push Notification Service make sure to backup your `mattermost-push-proxy.json` file before continuing.

3. Unzip the downloaded Mattermost Push Notification Service by typing:
`tar -xvzf mattermost-push-proxy-X.X.X.tar.gz` 

4. Configure the Mattermost Push Notification service by editing the `mattermost-push-proxy.json` file at `/home/ubuntu/mattermost-push-proxy/config`. Follow the steps in the [Android](#set-up-mattermost-push-notification-service-to-send-android-push-notifications)
    and [iOS](#set-up-mattermost-push-notification-service-to-send-ios-push-notifications) sections to replace the values in the config file.

5. Setup the Mattermost Push Notification Services to use the Upstart daemon which handles supervision of the Push Service process
    * `sudo touch /etc/init/mattermost-push-proxy.conf`
    * `sudo vi /etc/init/mattermost-push-proxy.conf`
    * Copy the following lines into `/etc/init/mattermost-push-proxy.conf`


    ```bash
    start on runlevel [2345]
    stop on runlevel [016]
    respawn
    chdir /home/ubuntu/mattermost-push-proxy
    setuid ubuntu
    console log
    exec bin/mattermost-push-proxy | logger
    ```

6. Start the process with `sudo start mattermost-push-proxy` or if the process is already running with `sudo restart mattermost-push-proxy`.


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


### Test the Mattermost Push Notification Service
* Verify that the server is functioning normally and test the push notification using curl:
 `curl http://127.0.0.1:8066/api/v1/send_push -X POST -H "Content-Type: application/json" -d '{"type": "message", "message": "test", "badge": 1, "platform": "PLATFORM", "server_id": "MATTERMOST_DIAG_ID", "device_id": "DEVICE_ID", "channel_id": "CHANNEL_ID"}'`

    * Replace `MATTERMOST_DIAG_ID` with the value found by running the SQL query:
    ```sql
    SELECT * FROM Systems WHERE Name = 'DiagnosticId';
    ```
    * Replace `DEVICE_ID` with your device ID, which can be found using (where `your_email@example.com` is the email address of the user you are logged in as):
    ```sql
    SELECT
       Email, DeviceId
    FROM
       Sessions,
       Users
    WHERE
       Sessions.UserId = Users.Id
          AND DeviceId != ''
          AND Email = 'your_email@example.com';
    ```
    * Replace `CHANNEL_ID` with the Town Square channel ID, which can be found using:
    ```sql
    SELECT Id FROM Channels WHERE DisplayName = 'Town Square';
    ```
    
    {{% note "Migration" %}}
    Remove the `apple:`, `apple_rn`, `android:` or `android_rn:` prefix from your device ID before replacing `DEVICE_ID`. Use that prefix as the `PLATFORM` (make sure to remove the ":").
    {{% /note %}}

* You can also verify push notifications are working by opening your Mattermost site and mentioning a user who has push notifications enabled in **Account Settings > Notifications > Mobile Push Notifications**.

To view the log file, use:

```bash
$ sudo tail -n 1000 /var/log/upstart/mattermost-push-proxy.log
```

### Troubleshooting

##### High Sierra Apple Developer Keys Steps - follow these instructions if you run into an error like below:
```
2018/04/13 12:39:24 CRIT Failed to load the apple pem cert err=failed to parse PKCS1 private key for type=apple_rn
panic: Failed to load the apple pem cert err=failed to parse PKCS1 private key for type=apple_rn
```

1. Follow the directions at [developer.apple.com](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/DistributingEnterpriseProgramApps/DistributingEnterpriseProgramApps.html#//apple_ref/doc/uid/TP40012582-CH33-SW4) to generate an Apple Push Notification service SSL Certificate, this should give you an `aps_production.cer`
2. Convert the certificate format to .pem:
  - `openssl x509 -in aps.cer -inform DER -out aps_production.pem`
3. Double click `aps_production.cer` to install it into the keychain tool
4. Right click the private cert in keychain access and export to .p12
5. Extract the private key from the certificate into an intermediate state:
  - `openssl pkcs12 -in Certificates.p12 -out intermediate.pem -nodes -clcerts`
6. Generate an intermediate RSA private key
  - `openssl rsa -in intermediate.pem -out intermediate_rsa_priv.pem`
7. Remove the private key information from intermediate.pem
  - `sed -i '/^-----BEGIN PRIVATE KEY-----$/,$d' intermediate.pem`
8. Combine intermediate.pem and intermediate_rsa_priv.pem to create a valid bundle
  - `cat intermediate.pem intermediate_rsa_priv.pem >> aps_production_priv.pem && rm intermediate.pem intermediate_rsa_priv.pem`
6. Verifying the certificate works with apple:
  - `openssl s_client -connect gateway.push.apple.com:2195 -cert aps_production.pem -key aps_production_priv.pem`

### Reporting issues 

For issues with repro steps, please report to https://github.com/mattermost/mattermost-server/issues
