---
title: "Code Review"
heading: "Code Review at Mattermost"
description: "All changes to the Mattermost product must be reviewed. Learn about how Mattermost reviews product updates."
date: 2018-03-06T00:00:00-04:00
weight: 5
---

All changes to the product must be reviewed.

* User experience changes must be reviewed by a [product manager](/contribute/getting-started/core-committers/#product-managers).
* Code changes must be reviewed by at least two [core committers](/contribute/getting-started/core-committers/#core-committers) and a [QA tester](/contribute/getting-started/core-committers/#qa-testers).
* Documentation changes must be reviewed by a [product manager](/contribute/getting-started/core-committers/#product-managers).
  * Product managers may ask for reviews from [core committers](/contribute/getting-started/core-committers/#core-committers) and [QA testers](/contribute/getting-started/core-committers/#qa-testers) as required.

If you are a community member seeking a review
----------------------------------------------

1. Submit your pull request.
    * Follow the [contribution checklist](https://developers.mattermost.com/contribute/getting-started/contribution-checklist/).
2. Wait for a reviewer to be assigned.
    * Product managers are on the lookout for new pull requests and usually handle this for you automatically.
    * If you have been working alongside a core committer, feel free to message them for help.
    * When in doubt, ask for help in the [Developers](https://community.mattermost.com/core/channels/developers) channel on our community server.
    * If you are still stuck, please message Jason Blais (@jasonblais on GitHub) or Jason Frerich (@jfrerich on GitHub).
3. [Wait for a review](#if-you-are-awaiting-a-review).
    * Expect some interaction with at least one reviewer within 5 business days (weekdays, Monday through Friday, excluding [statutory holidays](https://docs.mattermost.com/process/working-at-mattermost.html#holidays)).
    * Keep in mind that core committers are geographically distributed around the world and likely in a different time zone than your own.
    * If no interaction has occurred after 5 business days, please at-mention a reviewer with a comment on your PR.
4. Make any necessary changes.
    * If a reviewer requests changes, your pull request will disappear from their queue of reviews.
    * Once you've addressed the concerns, please at-mention the reviewer with a comment on your PR.
**Note:** Once a PR is submitted it's best practice to avoid rebasing on the base branch or force-pushing. Jesse, a developer at Mattermost, mentions this in his blog article [Submitting Great PRs](https://mattermost.com/blog/submitting-great-prs/). When the PR is merged, all the PR's commits are automatically squashed into one commit, so you don't need to worry about having multiple commits on the PR.
5. Wait for your code to be merged.
    * Larger pull requests may require more time to review.
    * Once all reviewers have approved your changes, they will handle merging your code.

If you are a core committer seeking a review
--------------------------------------------

1. Submit your pull request.
    * Follow the [contribution checklist](https://developers.mattermost.com/contribute/getting-started/contribution-checklist/).
2. Immediately add the `1: PM Review`, `2: Dev Review`, and `3: QA Review` labels.
    * Your pull request should not be merged until these labels are later removed in the review process.
3. Apply additional labels as necessary:
    * `CherryPick/Approved`: Apply this if the pull request is meant for a quality or patch release.
    * `Do Not Merge/Awaiting PR`: Apply this if the pull request depends on another (e.g. server changes)
    * `Setup Test Server`: Apply this to create a test server with your changes for review.
    * See [labels](/contribute/getting-started/labels/) for additional labels.
4. Assign a milestone as necessary.
    * Most issues are targeted for an upcoming release, and should be assigned the corresponding milestone.
    * The milestone is mandatory for bug fixes that must be cherry-picked.
5. Request a review from a [Product Manager](/contribute/getting-started/core-committers/#product-managers).
    * The choice of Product Manager is up to you.
        - In most cases, choose the Product Manager embedded with your team.
        - If your change primarily touches another team's codebase, consider their Product Manager.
        - If in doubt, assign any Product Manager and comment about the uncertainty. The Product Manager may reassign as appropriate.
    * [Wait](#if-you-are-awaiting-a-review) for their review to complete before continuing so as to avoid churn if changes are requested.
    * Remove the `1: PM Review` label only when their review is done and they accept the changes.
        - Product Managers ensure the changes meet [user experience guidelines](https://docs.mattermost.com/developer/fx-guidelines.html).
    * If your changes do not affect the user experience, you may remove `1: PM Review` immediately.
6. After PM review, request a review from two [core committers](/contribute/getting-started/core-committers/).
    * The choice of core committers is up to you.
        - When picking your first core committer, consider someone with domain expertise relative to your changes. Sometimes GitHub will recommend a recent editor of the code, but often you must rely on your own intuition from past interactions.
        - When picking your second core committer, consider someone from another team who may have expertise in the language you're using or the problem you're solving, even if they aren't intricately familiar with the codebase. This can provide a fresh set of eyes on the code to reveal blindspots that are not biased by hitting deadlines, and helps expose the team to new parts of the code to help spread out domain knowledge. This may not make sense for every pull request but is a practice to keep in mind.
        - Don't be afraid to pick someone who gives "hard" reviews. Code review feedback is never a personal attack: it should "sharpen" the skills of both the author and the reviewers, not to mention improving the quality of the product.
        - Try to avoid assigning the same person to all of your reviews unless they are related.
        - When in doubt, ask for recommendations on our community server.
    * [Wait](#if-you-are-awaiting-a-review) for their review to complete before continuing so as to avoid churn if changes are requested.
    * Remove the `2: Dev Review` label only when these reviews are done and they accept the changes.
7. After Dev review, assign a [QA tester](/contribute/getting-started/core-committers/#qa-testers).
    * Ensure that your PR includes test steps or expected results for QA reference if the QA Test Steps in the Jira ticket have not already been filled in.
    * The choice of QA tester is up to you.
        - In most cases, choose the QA tester embedded with your team.
        - If your change primarily touches another team's codebase, consider their QA tester.
        - If in doubt, assign any QA tester and comment about the uncertainty. The QA tester may reassign as appropriate.
    * [Wait](#if-you-are-awaiting-a-review) for their review to complete before continuing.
        - It is the QA tester's responsibility to determine the scope of required testing, if any.
    * Remove the `3: QA Review` label only when their review is done and they accept the changes.
    * In the rare event your changes do not require QA review, you may remove `3: QA Review` immediately.
        - Comment on the pull request clearly explaining the rationale.
8. Merge the pull request.
    * Do not merge until the labels `1: PM Review`, `2: Dev Review` and `3: QA Review` labels have been removed.
    * Add the `4: Reviews Complete` label if the last reviewer did not already add it.
    * Do not merge if there are outstanding changes requested.
    * Merge your pull request and delete the branch if not from a fork.
        - Note that any core committer is free to merge on your behalf.
        - If your pull request depends on other pull requests, consider assigning the `Do Not Merge/Awaiting PR` label.
9. Handle any cherry-picks.
    * There is an automated cherry-pick process. The author of the pull request should make sure the cherry-pick succeeds. Assume this is the case unless you are explicitly asked to help cherry-pick. Please [check here](https://developers.mattermost.com/contribute/getting-started/branching/#cherry-pick-process---developer) for details.
10. After a pull request is merged (and cherry-picked where needed), update the Jira ticket.
    * Resolve the ticket for QA from "Ready for QA" button with QA test steps (or "No Testing Required" if no QA testing is needed).
    * Update the release fix version.

If you are awaiting a review
----------------------------

1. Wait patiently for reviews to complete.
    * Expect some interaction with each of your reviewers within 2 business days.
    * There is no need to explicitly mention them on the pull request or to explicitly reach out on our community server.
    * Core committers and QA testers are expected to have the GitHub plugin installed to automate notifications and to trigger a daily review of their outstanding requested reviews.
2. Make any necessary changes.
    * If a reviewer requests changes, your pull request will disappear from their queue of reviews.
    * Once you've addressed the concerns, assign them as a reviewer again to put your pull request back in their queue.

If you are a core committer asked to give a review
--------------------------------------------------

1. Respond promptly to requested reviews.
    * Assume the requested review is urgent and blocking unless explicitly stated otherwise.
    * Try to interact with the author within 2 business days.
    * Configure the GitHub plugin to automate notifications.
    * Review your outstanding requested reviews daily to avoid blocking authors.
    * Prioritize earlier milestones when reviewing to help with the release process.
    * Responding quickly doesn't necessarily mean reviewing quickly! Just don't leave the author hanging.
2. Feel free to clarify expectations with the author.
    * If the PR adds a substantial feature, check that a feature flag is included. Please see [criteria here](https://developers.mattermost.com/contribute/server/feature-flags/#when-to-use).
    * If the code is experimental, they may need only a cursory glance and thumbs up to proceed with productizing their changes.
    * If the review is large or complex, additional time may be required to complete your review. Be upfront with the author.
    * If you are not comfortable reviewing the code, avoid "rubber stamping" the review. Be honest with the author and ask them to consider another core committer.
3. Never rush a review.
    * Take the time necessary to review the code thoroughly.
    * Don't be afraid to ask for changes repeatedly until all concerns are addressed.
    * Feel free to challenge assumptions and timelines. Rushing a change into a patch release may cause more harm than good.
4. Avoid leaving a review hanging.
    * Try to accept or reject the review instead of just leaving comments.
    * If you are the last developer to approve the changes, consider requesting a review from the appropriate QA tester to speed up the process.
5. Merge the pull request.
    * Do not merge until the labels `1: PM Review`, `2: Dev Review` and `3: QA Review` labels have been removed.
    * Add the `4: Reviews Complete` label if the last reviewer did not already add it.
    * Do not merge if there are outstanding changes requested.
    * Do not merge if there are any `Do Not Merge` labels applied.
        - When in doubt, leave the merging of the pull request to the author.
    * Merge the pull request, and delete the branch if not from a fork.
6. Handle any cherry-picks.
    * There is an automated cherry-pick process and the author of the pull request should make sure the cherry-pick succeeds. Assume this is the case unless you are explicitly asked to help cherry-pick.
