---
title: "Slash Commands"
section: internal
weight: 90
---

There are a couple of slash-commands avaible on GitHub. They are implemented via [Mattermod](https://github.com/mattermost/mattermost-mattermod) and are only avaible for members of the Mattermost organisation. They only work on PR's.

The commands are:
- `/cherry-pick $BRANCH_NAME`, e.g. `/cherry-pick release-5.10`: Opens a PR to cherry pick a change into the branch `$BRANCH_NAME`.
- `/check-cla`: Checks if the PR contributor has signed the cla.
- `/autoassign`: Automaticaly assigns reviewers to a PR.
