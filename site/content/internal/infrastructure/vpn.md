---
title: "VPN"
date: 2018-05-28T16:08:19+02:00
subsection: internal
weight: 20
---

# Setup VPN access

VPN Server: https://vpn2.mattermost.com

* Access the Onelogin link sent in the invitation email

* Select in the two-factor auth `OneLogin Protect` or `Yubikey` (if you have an yubikey device)

    **iOS**: https://itunes.apple.com/us/app/onelogin-protect/id509252983?mt=8

    **Android**: https://play.google.com/store/apps/details?id=com.onelogin.newotp&hl=en

* Configure your two-factor

* Access the vpn server to download the client (if you dont have) and the config file (Used Locked profile)
    - Select `Login` and type your email and password (the same you used in the Onelogin)
    <span style="display:block;text-align:center">![VPN HomePage](/img/vpn_1.png)</span>
    - Download the client for your OS
    - Download the User locked profile
    <span style="display:block;text-align:center">![VPN HomePage 2](/img/vpn_2.png)</span>

* Install the GUI client

* Import the config file to the OpenVpn client
<span style="display:block;text-align:center">![VPN Clinet](/img/vpn_3.png)</span>

* Connect to the VPN

* Alternatively, install and connect using the CLI client

```bash
brew install openvpn
sudo openvpn --config client.opvn --auth-retry interact
```
