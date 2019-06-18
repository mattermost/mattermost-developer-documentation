---
title: "Mattermost tick-tock Branching Strategy"
date: 2019-06-18T00:00:00-04:00
subsection: Getting Started
---

Mattermost uses a tick-tock release strategy where every other release is a "quality release" that only has bug fixes and no new features. 

The following diagram provides an overview of the branching strategy used to accomplish this. release-5.4 is a feature release and release-5.5 is a quality release. Note the "quality release" branch is based on the previous release branch.

![Branching Overview](/contribute/getting-started/branching-overview.png)


## Cherry Pick Process - Developer

When your PR is required on a release branch, you will follow the cherry picking process.

1. Make a PR to master like normal.
1. Add the appropriate milestone and the `CherryPick/Approved` label.
1. When your PR is approved it will be assigned back to you to perform the merge and any cherry picking necessary.
1. Merge the PR
1. Cherry pick the master commit back to the appropriate releases.
1. Set the `CherryPick/Done` label when completed.


## Cherry Pick Process - Reviewer

When reviewing a PR that needs to be cherry-picked if you are the second reviewer do not merge the PR. If the submitter is a core team member, you should set the `Reviews Complete` label and assign it to the submitter to cherry pick. If the submitter is a community member, not available to cherry pick their PR, or can not do it themselves you should follow the cherry pick process above.
