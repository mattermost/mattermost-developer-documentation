---
title: "Labels"
date: 2018-03-06T00:00:00-04:00
weight: 5
subsection: Getting Started
---

We leverage [GitHub labels](https://help.github.com/en/articles/about-labels) to track the details and lifecycle of issues and pull requests.

# Issue Labels
* `Area/<name>`: Involves changes to the named area (APIv4, Add E2E Tests, Plugins, etc.)
* `Difficulty/1:easy`: Easy ticket.
* `Difficulty/2:medium`: Medium ticket.
* `Difficulty/3:hard`: Hard ticket.
* `First Good Issue`: Suitable for first-time contributors.
* `Framework/<name>`: Requires using the named framework (ReactJS, Redux, etc.)
* `Help Wanted`: Community help wanted.
* `Language/<name>`: Requires writing in the named language (Go, JavaScript, etc.)
* `Localization`: Relates to translating the user interface.
* `Move to Feature Ideas forum`: Marked for relocation to the feature ideas forum.
* `Move to Troubleshooting`: Marked for relocation to the troubleshooting section of the documentation.
* `PR Submitted`: A pull request has been opened for this issue.
* `Repository/<name>`: Requires changes in the named respository.
* `Up for Grabs`: Ready for help from the community. Removed when someone volunteers.

# Pull Request Labels

* `1: PM Review`: Requires review by a [product manager](/contribute/getting-started/core-committers/#product-managers).
* `2: Dev Review`: Requires review by a [core commiter](/contribute/getting-started/core-committers/#core-committers).
* `3: Reviews Complete`: All reviewers have approved the pull request.
* `Awaiting Submitter Action`: Blocked on the author.
* `Changelog/Done`: Required changelog entry has been written.
* `Changelog/Not Needed`: Does not require a changelog entry.
* `CherryPick/Approved`: Meant for the quality or patch release tracked in the milestone.
* `CherryPick/Candidate`: A candidate for a quality or patch release, but not yet approved.
* `CherryPick/Done`: Successfully cherry-picked to the quality or patch release tracked in the milestone.
* `Do Not Merge`: Should not be merged until this label is removed.
* `Do Not Merge/Awaiting PR`: Awaiting another pull request before merging (e.g. server changes).
* `Do Not Merge/Awaiting Loadtest`: Must be loadtested before it can be merged.
* `Do Not Merge/Awaiting Next Release`: To be merged with the next release (e.g. API documentation updates).
* `Docs/Done`: Required documentation has been written.
* `Docs/Needed`: Requires documentation.
* `Docs/Not Needed`: Does not require documentation.
* `Hackfest`: Related to a Mattermost hackathon.
* `Hacktoberfest`: Related to [Hacktoberfest](https://hacktoberfest.digitalocean.com/).
* `Lifecycle/1:stale`: Inactive for 14 days.
* `Lifecycle/2:inactive`: Inactive for 28 days.
* `Lifecycle/3:orphaned`: Inactive for 58 days, and may be closed.
* `Lifecycle/frozen`: Ignores the normal lifecycle flow.
* `Loadtest`: Triggers an automatic load test.
* `Major Change`: The pull request is a major feature or affects large areas of the code base (e.g. [moving channel store and actions to Redux](https://github.com/mattermost/platform/pull/6235)).
* `Need submitted action to join approved contributor list`
* `QA Review`: Requires review by a [QA tester](/contribute/getting-started/core-committers/#qa-testers).
* `Setup Test Server`: Triggers the creation of a test server.
* `Setup Upgrade Test Server`: Triggers the creation a test server and performs an upgrade.
* `Tests/Done`: Required tests have been written.
* `Tests/Not Needed`: Does not require tests.
* `Work in Progress`: Not yet ready for review.
