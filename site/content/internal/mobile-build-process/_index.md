---
title: Mobile Build Process
heading: "The Mattermost Mobile Build Process"
description: "Learn what there is to know about the mobile build process for Mattermost's applications."
date: 2019-03-14T09:05:00-05:00
weight: 31
---

Steps to cut the mobile build:

1. Set the proper [version number](/internal/mobile-build-process/bump-version-number/) if needed.
{{%note "Version number" %}}Normally the version number will be set after a release, but sometimes is needed when cutting a dot release.{{%/note%}}

2. Set the proper [build number](/internal/mobile-build-process/bump-build-number/) if needed.
{{%note "Build number" %}}The build number has to be incremented each time for builds that are going to be published to the stores.{{%/note%}}

3. Login to jenkins

4. Execute the task for ``Build with Parameters`` in ``mattermost-mobile-prod-release`` and set the ``BRANCH_NAME`` to 
``release-X.X`` (replace the X's with the release version).

5. Execute the task for ``Build with Parameters`` in ``mattermost-mobile-beta-release`` and set the ``BRANCH_NAME`` to 
``release-X.X`` (replace the X's with the release version).

{{% note "Build queue" %}}
**Execute one build at a time**. Do **not** execute builds in parallel as we currently have only one build machine.
{{%/note%}}
