---
title: "Sign Unsigned Builds"
date: 2018-05-20T11:35:32-04:00
weight: 4
subsection: Mobile Apps
---

Mattermost publishes an unsigned build of the mobile app in the [GitHub Releases](https://github.com/mattermost/mattermost-mobile/releases) page with every version that gets released.

These unsigned builds cannot be distributed and/or installed directly on devices until they are properly signed.

{{<note "Note">}}
Android and Apple require all apps to be digitally signed with a certificate before they can be installed.
{{</note>}}

To avoid the need of rebuilding the apps from scratch, you could just **sign** the unsigned builds published by Mattermost with your certificates and keys.

[Sign Unsigned Android](android) or [Sign Unsigned iOS](ios)
