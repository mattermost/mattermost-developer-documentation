---
title: "Slash Commands"
section: internal
weight: 90
---

There are a couple of slash-commands available on GitHub. They are implemented via [Mattermod](https://github.com/mattermost/mattermost-mattermod) and are only available for members of the Mattermost organization. They only work on PRs.

The commands are:
- `/cherry-pick $BRANCH_NAME`, e.g. `/cherry-pick release-5.10`: Opens a PR to cherry pick a change into the branch `$BRANCH_NAME`.
- `/check-cla`: Checks if the PR contributor has signed the CLA.
- `/autoassign`: Automatically assigns reviewers to a PR.
