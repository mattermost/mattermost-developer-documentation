---
title: "Inactive Contributions"
date: 2017-08-20T12:33:36-04:00
weight: 1.5
subsection: Getting Started
---

This process describes how inactive contributions are managed at Mattermost, inspired by the [Kubernetes project](https://github.com/kubernetes/kubernetes):

1. After 10 days of inactivity, a contribution becomes stale.
 - If action is required from submitter, Community Coordinator asks if the team can help clarify previous feedback or provide guidance on next steps, and adds `lifecycle/1:stale` label to the contribution.
 - If action is required from reviewers, Community Coordinator asks reviewers to share feedback or help answer questions, and adds `lifecycle/1:stale` label to the contribution. The Coordinator will follow up with reviewers until a response is received.

2. After another 4 days of inactivity, a contribution becomes inactive.
 - Community Coordinator asks the submitter if the team can help with questions. They acknowledge that after another 30 days of inactivity the contribution will be closed. They also add a `lifecycle/2:inactive` label to the contribution.
 - Note: Contributions should never become orphaned because of reviewers. The Coordinator will be responsible for receiving a response from the reviewers during the stale period, which may be that the maintainers aren't able to accept the contribution in its current form.

3. After another 14 days of inactivity, a contribution becomes orphaned.
 - Community Coordinator notes that the contribution has been inactive for 60 days, thanks for the contribution and closes the contribution. They also add an `lifecycle/3:orphaned` label to the contribution, and adds an `Up For Grabs` label to the associated help wanted ticket, if appropriate.

Special notes:

1. If the contribution is inactive but shouldn't be closed, the Coordinator adds a `lifecycle/frozen` label to the contribution. An example of this is when a design decision is being discussed but no decision has been arrived at yet.
2. In some instances, a contribution may be taken over by another contributor or staff member if it has become inactive. This should only occur once the contribution is in a `lifecycle/2:inactive` or `lifecycle/3:orphaned` state.
