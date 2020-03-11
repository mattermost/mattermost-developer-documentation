---
title: "VPN(CLOUD)"
date: 2018-06-05T16:08:19+02:00
subsection: internal
weight: 20
---

## Setup VPN access


1. Login to the [VPN server](https://vpn.cloud.mattermost.com) using your mattermost email and OneLogin password. Please select `connect` instead of `login` on the drop down menu. 
   * If login fails, ask Cloud team to check if your username is in the correct group
   
2. Please refresh the page if it says:  *Please click here to continue to download OpenVPN Connect.
You will be automatically connected after the installation has finished.*

3. Download the user-locked profile.
    <span style="display:block;text-align:center">![VPN HomePage](/img/vpn_cloud_1.png)</span>

4. Install a VPN client that supports DNS settings such as Visocity.

```bash
brew cask install viscosity
```

5. Open the Viscosity application or your preferred VPN client and go to settings/preferences.
   
6. Click + to import the profile you downloaded from the VPN server on the step 1
    <span style="display:block;text-align:center">![Viscosity Profile Add](/img/vpn_cloud_2.png)</span>

7. After your profile is imported, select to edit the entry, go to Networking tab and update the DNS settings. 
   * Select for the Mode to be `Split DNS`.  
   * As a Server IP put: `10.247.4.47` which is VPN's server IP.
   * In Domains put: `cloud.mattermost.com`, this will split traffic for those domains
    <span style="display:block;text-align:center">![Viscosity VPN CIDR](/img/vpn_cloud_3_new.png)</span>

8. After following these steps you should be able to connect to VPN and then to resolve private DNS entries.
