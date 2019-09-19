---
title: "Slash Commands"
weight: 30
subsection: Getting Started
---

There are a couple of slash-commands available on GitHub which are implemented via [Mattermod](https://github.com/mattermost/mattermost-mattermod). They only work on PRs.

The commands are:

- `/cherry-pick $BRANCH_NAME`, e.g. `/cherry-pick release-5.10`: Opens a PR to cherry pick a change into the branch `$BRANCH_NAME`. This command only works for members of the Mattermost organization.
- `/check-cla`: Checks if the PR contributor has signed the CLA.
- `/autoassign`: Automatically assigns reviewers to a PR.
