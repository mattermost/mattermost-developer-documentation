---
title: Release Tagging Process
heading: "Release Tagging Process at Mattermost"
description: "Read about the Mattermost release tagging process under our mobile build process."
date: 2019-05-23T16:02:00-05:00
weight: 32
---

1. Head to the [Github releases](https://github.com/mattermost/mattermost-mobile/releases) page.
2. Copy the description of the previous release to your clipboard then click on the `Draft a new release` button.
3. On the new release page:
    1. Paste the copied description into the description text area.
    2. Set the tag version to `vX.Y.Z` where `X.Y.Z` is the release version (i.e., `v1.19.0` or `v1.19.1`).
    3. Click on the `Target:master` button and select the appropriate release branch (i.e., `release-1.19` for `v1.19.X`).
    4. For the release title enter `Mobile Version X.Y.Z` (i.e., `Mobile Version 1.19.1`).
    5. Preview the description to make sure it displays correctly.
    6. Finally, press the `Publish release` button.
4. Notify Eric Sethna in the [Release Discussion channel](https://community.mattermost.com/core/channels/release-discussion) that the mobile apps are ready to be deployed to the stores.
