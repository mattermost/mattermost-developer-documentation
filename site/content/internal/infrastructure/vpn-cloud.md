---
title: "VPN(CLOUD)"
date: 2018-06-05T16:08:19+02:00
subsection: internal
weight: 20
---

## Setup VPN access

VPN Server: https://vpn.cloud.mattermost.com

* Login to the VPN server using OneLogin credentials.

* Download the user-locked profile.
    <span style="display:block;text-align:center">![VPN HomePage](/img/vpn_cloud_1.png)</span>

* Install a VPN client that supports DNS settings such as Visocity.

```bash
brew cask install viscosity
```

* Open the Viscosity application or your preferred VPN client and go to settings.

* Click + to import the profile you downloaded from the VPN server
    <span style="display:block;text-align:center">![Viscosity Profile Add](/img/vpn_cloud_2.png)</span>

* After your profile is imported, go to Networking and update the DNS settings. The Server IP is the VPN server IP.
    <span style="display:block;text-align:center">![Viscosity Profile Add](/img/vpn_cloud_3.png)</span>

* After following these steps you should be able to resolve private DNS entries.
