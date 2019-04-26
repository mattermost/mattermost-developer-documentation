---
title: "Code Review"
date: 2018-03-06T00:00:00-04:00
weight: 5
subsection: Getting Started
---

All changes to the product must be reviewed.

* User experience changes must be reviewed by a [product manager](/contribute/getting-started/core-committers/#product-managers).
* Code changes must be reviewed by at least two [core committers](/contribute/getting-started/core-committers/#core-committers).
* Documentation changes must be reviewed by a [product manager](/contribute/getting-started/core-committers/#product-managers).
  * Product managers may ask for reviews from [core committers](/contribute/getting-started/core-committers/#core-committers) and [QA testers](/contribute/getting-started/core-committers/#qa-testers) as required.
* Any change may be verified by a [QA tester](/contribute/getting-started/core-committers/#qa-testers) as required.

If you are a community member seeking a review
----------------------------------------------

1. Submit your pull request.
    * Follow the [contribution checklist](https://developers.mattermost.com/contribute/getting-started/contribution-checklist/).
2. Wait for a reviewer to be assigned.
    * Product managers are on the lookout for new pull requests, and usually handle this for you automatically.
    * If you have been working alongside a core committer, feel free to ping them directly.
    * When in doubt, ask for help in the [Developers](https://community.mattermost.com/core/channels/developers) channel on our community server.
3. Wait for a review.
    * The ticket author, a core committer, or a product manager will assign reviewers and label your pull request appropriately.
    * Expect some interaction with at least one reviewer within 5 business days.
    * Keep in mind that core committers are geographically distributed around the world and likely in a different time zone than your own.
    * Please ping [Jason Blais](/contribute/getting-started/core-committers/#jason.blais) or [Hanzei](/contribute/getting-started/core-committers/#hanzei) after 5 business days if no interaction has occurred.
4. Make any necessary changes.
    * If a reviewer requests changes, your pull request will disappear from their queue of reviews.
    * Once you've addressed the concerns, reach out with another mention.
5. Wait for your code to be merged.
    * Larger pull requests may require more time to review.
    * Once all reviewers have approved your changes, they will handle merging your code.

If you are a core committer seeking a review
--------------------------------------------

1. Submit your pull request.
    * Follow the [contribution checklist](https://developers.mattermost.com/contribute/getting-started/contribution-checklist/).
2. Assign a [product manager](/contribute/getting-started/core-committers/#product-managers) to your review and label your pull request with `1: PM Review`.
    * If your changes do not affect the user experience, you may skip this step.
    * Product managers ensure the changes meet [user experience guidelines](https://docs.mattermost.com/developer/fx-guidelines.html).
    * Wait for their review before continuing so as to avoid churn if changes are requested.
    * Note that product managers may assign core committers after completing their own review.
3. Assign two [core committers](/contribute/getting-started/core-committers/) to your review and label your pull request with `2: Dev Review`.
    * When picking your first core committer, consider someone with domain expertise relative to your changes. Sometimes GitHub will recommend a recent editor of the code, but often you must rely on your own intuition from past interactions.
    * When picking your second core committer, consider someone unrelated to your changes. A fresh and unbiased set of eyes can be invaluable, and exposing the team to new parts of the code helps spread out domain knowledge.
    * Don't be afraid to pick someone who gives "hard" reviews. Code review feedback is never a personal attack: it should "sharpen" the skills of both the author and the reviewers, not to mention improving the quality of the product.
    * If you are Mattermost staff, try to take into account the timeoff calendar.
    * Try to avoid assigning the same person to all of your reviews unless they are related.
    * When in doubt, ask for recommendations on our community server.
4. Optionally assign a [QA tester](/contribute/getting-started/core-committers/#qa-testers) and label your pull request with `QA Review`.
    * Not every pull request requires QA Review. Prioritize large features or material changes to the product for QA review.
    * Pull requests labelled with `QA Review` automatically notify the QA team at large.
    * Reviews by QA may occur at the same time as review by core committers.
5. Apply additional labels as necessary:
    * `CherryPick/Approved`: Apply this if the pull request is meant for a quality or patch release.
    * `Do Not Merge/Awaiting PR`: Apply this if the pull request depends on another (e.g. server changes)
    * `Setup Test Server`: Apply this to create a test server with your changes for review.
    * See [labels](/contribute/getting-started/labels) for more details.
6. Assign a milestone as necessary.
    * Most issues are targeted for an upcoming release, and should be assigned the corresponding milestone.
    * The milestone is mandatory for bug fixes that must be cherry-picked.
7. Wait for a review.
    * Expect some interaction with each of your reviewers within 2 business days.
    * There is no need to explicitly mention them on the pull request or to explicitly reach out on our community server.
    * Core committers and QA testers are expected to have the GitHub plugin installed to automate notifications and to trigger a daily review of their outstanding requested reviews.
8. Make any necessary changes.
    * If a reviewer requests changes, your pull request will disappear from their queue of reviews.
    * Once you've addressed the concerns, assign them as a reviewer again to put your pull request back in their queue.
9. Merge the pull request.
    * Only merge once all concerns have been addressed, any reviewing product manager has approved the changes, any reviewing QA tester has approved the changes, and at least two core committers have approved.
    * Remove the `1: PM Review`, `2: Dev Revew` and `QA Review` labels and assign the `3: Reviews Complete` label.
    * Merge your pull request and delete the branch if not from a fork.
    * Note that the last core committer to approve your changes may do this on your behalf.
    * If your pull request depends on other pull requests, consider assigning the `Do Not Merge/Awaiting PR` label.
10. Handle any cherry-picks.
    * Cherry-pick the commit from `master` to the affected releases.
    * Push your changes directly to the remote branch.
    * No new pull request is required unless there are substantial merge conflicts.
    * Remove the `CherryPick/Approved` label and apply the `CherryPick/Done` label.

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
    * If the code is experimental, they may need only a cursory glance and thumbs up to proceed with productizing their changes.
    * If the review is large or complex, additional time may be required to complete your review. Be upfront with the author.
    * If you are not comfortable reviewing the code, avoid "rubber stamping" the review. Be honest with the author and ask them to consider another core committer.
3. Never rush a review.
    * Take the time necessary to review the code thoroughly.
    * Don't be afraid to ask for changes repeatedly until all concerns are addressed.
    * Feel free to challenge assumptions and timelines. Rushing a change into a patch release may cause more harm than good.
4. Merge the pull request.
    * Remove the `1: PM Review` and `2: Dev Revew` labels and assign the `3: Reviews Complete` label.
    * Merge the pull request, and delete the branch if not from a fork.
    * Some changes are spread out across multiple pull requests that should be merged at the same time. Look out for the `Do Not Merge/Awaiting PR` label. When in doubt, leave the merging of the pull request to the author.
5. Handle any cherry-picks.
    * Typically, the author of the pull request should handle cherry-picks. Assume this is the case unless you are explicitly asked to help cherry-pick.
