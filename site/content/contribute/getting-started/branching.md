---
title: "Mattermost Cherry-Pick process"
heading: "Mattermost Cherry-Pick Process"
description: "What the branching strategy and cherry-pick process looks like."
date: 2019-06-18T00:00:00-04:00
weight: 20
---

The self-managed releases are now cut based off of the Mattermost Cloud release tags (e.g Mattermost Server v6.3 release was based off of ``cloud-2021-12-08-1`` Cloud release tag) in the server, webapp, enterprise, and api-reference repos. See [the Handbook release process](https://handbook.mattermost.com/operations/research-and-development/product/release-process/release-overview#cloud-release-branch-processes) for more details.

## Cherry-pick process - Developer

When your PR is required on a release branch (e.g. for a dot release or to fix a regression for an upcoming release), you will follow the cherry-picking process.

1. Make a PR to 'master' like normal.
1. Add the appropriate milestone and the `CherryPick/Approved` label.
1. When your PR is approved, it will be assigned back to you to perform the merge and any cherry picking if necessary.
1. Merge the PR.
1. An automated cherry-pick process will try to cherry-pick the PR. If the automatic process succeeds, a new PR pointing to the correct release branch will open with all the appropriate labels. If there are no additional changes from the original PR for the cherry-pick, it can be merged without further review.
1. If the automated cherry-pick fails, the developer will need to cherry-pick the PR manually. Cherry-pick the master commit back to the appropriate releases. If the release branches have not been cut yet, leave the labels as-is and cherry-pick once the branch has been cut. The release manager will remind you to finish your cherry-pick.
1. Set the `CherryPick/Done` label when completed.

* If the cherry-pick fails, the developer needs to apply the cherry-pick manually.
* Cherry-pick the commit from `master` to the affected releases. See the steps below:
1. Run the checks for lint and tests.
1. Push your changes directly to the remote branch if the check style and tests passed.
1. No new pull request is required unless there are substantial merge conflicts.
1. Remove the `CherryPick/Approved` label and apply the `CherryPick/Done` label.

Note:
  - If the PR needs to go to other release branches, you can run the command `/cherry-pick release-x.yz` in the PR comments and it will try to cherry-pick it to the branch you specified.

## Cherry pick process - Reviewer

If you are the second reviewer reviewing a PR that needs to be cherry-picked, do not merge the PR. If the submitter is a core team member, you should set the `Reviews Complete` label and assign it to the submitter to cherry-pick. If the submitter is a community member who is not available to cherry-pick their PR or can not do it themselves, you should follow the cherry-pick process above.
