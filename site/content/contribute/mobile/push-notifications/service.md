---
title: "Push Notification Service"
heading: "Installing the Mattermost Push Notification Service"
description: "This guide focuses on installing and configuring the push notification service for Mattermost apps."
date: 2015-05-20T11:35:32-04:00
weight: 3
---

## Install the Mattermost Push Notification Service

Now that the app can receive push notifications, we need to make sure that the Mattermost Push Notification Service is able to send the notification to the device. This guide will focus on installing and configuring the push notification service.

### Requirements

- A Linux box server with at least 1GB of memory.
- A copy of the [Mattermost Push Notification Service](https://github.com/mattermost/mattermost-push-proxy/releases).
- [Custom Android and/or iOS](/contribute/mobile/build-your-own/) Mattermost mobile apps.
- Private and public keys obtained from the [Apple Developer Program](https://developer.apple.com/account/ios/certificate/).
- A Firebase Cloud Messaging Server key obtained from the [Firebase Console](https://console.firebase.google.com).

## Installing and Upgrading

For the sake of making this guide simple we located the files at `/home/ubuntu/mattermost-push-proxy`. We've also elected to run the Push Notification Service as the `ubuntu` account for simplicity. We **recommend** setting up and running the service under a `mattermost-push-proxy` user account with limited permissions.

1. Download the Mattermost Push Notification Service (any version):

`wget https://github.com/mattermost/mattermost-push-proxy/releases/download/vX.X.X/mattermost-push-proxy-X.X.X.tar.gz`

In this command, `vX.X.X` refers to the release version you want to download. See [Mattermost Push Notification Service releases](https://github.com/mattermost/mattermost-push-proxy/releases).

2. If you're upgrading a previous version of the Mattermost Push Notification Service make sure to back up your `mattermost-push-proxy.json` file before continuing.

3. Unzip the downloaded Mattermost Push Notification Service using:
`tar -xvzf mattermost-push-proxy-X.X.X.tar.gz`

4. Configure the Mattermost Push Notification service by editing the `mattermost-push-proxy.json` file at `/home/ubuntu/mattermost-push-proxy/config`. Follow the steps in the [Android](#set-up-mattermost-push-notification-service-to-send-android-push-notifications)
    and [iOS](#set-up-mattermost-push-notification-service-to-send-ios-push-notifications) sections to replace the values in the config file.

5. Create a systemd unit file to manage the Mattermost Push Notification Services with systemd and log all output of the service to `/var/log/syslog` by running this command as root.
    ```bash
    echo "[Unit]
    Description=Mattermost Push Notification Service

    [Service]
    Type=oneshot
    ExecStart=/bin/sh -c '/home/ubuntu/mattermost-push-proxy/bin/mattermost-push-proxy | logger'
    WorkingDirectory=/home/ubuntu/mattermost-push-proxy

    [Install]
    WantedBy=multi-user.target" >> /etc/systemd/system/mattermost-push-proxy.service
    ```

   To route the traffic through a separate proxy server, add `Environment="HTTP_PROXY=<http://server>"` under the `[Service]` section of the file. If you have an HTTPS server, then use `HTTPS_PROXY`. If you set both then `HTTPS_PROXY` will take higher priority than `HTTP_PROXY`.

6. Start the service with `sudo systemctl start mattermost-push-proxy` or restart with `sudo systemctl restart mattermost-push-proxy`. Use `sudo systemctl enable mattermost-push-proxy` to have systemd start the service on boot.

### Set Up Mattermost Push Notification Service to Send Android Push Notifications

- Go to the [Firebase Console](https://console.firebase.google.com) and select the project you've created. Once in the dashboard, go to the project settings and select **CLOUD MESSAGING**.
![image](/img/mobile/firebase_settings.png)
![image](/img/mobile/firebase_cloud_messaging.png)

- Look for the value of the **Server key** and copy it.
![image](/img/mobile/firebase_server_key.png)

- Open the **mattermost-push-proxy.json** file in the `mattermost-push-proxy/config` directory and look for the  "AndroidApiKey" entry. Paste the **Server key** as its value.
  ```
  "AndroidApiKey": "your Server key"
  ```

### Set up Mattermost Push Notification Service to Send iOS Push Notifications

- Double click the **Push Notifications Certificate** which is generated and downloaded while [Setting up Push Notifications for iOS](/contribute/mobile/push-notifications/ios) to add it to your Keychain Access. It downloads by default as `aps.cer`.

- Open **Keychain Access**, select the **login** keychain and **My Certificates** from the side menu.
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

In the [mattermost-push-proxy project](https://github.com/mattermost/mattermost-push-proxy/tree/master/cmd/renew_apple_cert) there are some scripts to ease the process involved for updating the iOS notification certificates. Please check the README.md for further details.

### Configure the Mattermost Server to use the Mattermost Push Notification Service

- In your Mattermost instance, enable mobile push notifications.
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
**Note:**
Note that device IDs can change somewhat frequently, as they are tied to a device session. If you're having trouble, double-check the latest device IDs by re-running the above queries.

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

##### DeviceTokenNotForTopic

**For iOS / Apple Push Notifications**: If the logs are reflecting DeviceTokenNotForTopic (error 400) this may be because you're using an older / previous Device ID. Re-run the queries you need to get device IDs and test.

This could also be because you generated a certificate for the wrong bundle ID. The bundle ID used in `mattermost-push-proxy.json` should be the same one as the app and the for the same app it was generated for.

### Reporting issues

For issues with repro steps, please report to https://github.com/mattermost/mattermost-server/issues
