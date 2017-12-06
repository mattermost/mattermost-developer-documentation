---
draft: true
title: "Contribution Guidelines"
date: 2017-08-20T12:33:36-04:00
weight: 1
subsection: Getting Started
---

# Contribution Guidelines

Thanks for your interest in contributing to Mattermost! To help with translations, [see the localization process](https://docs.mattermost.com/developer/localization.html). For code contributions, here's the process:

## Join our Mattermost Instance

Both the Mattermost community and core team work out of [https://pre-release.mattermost.com](https://pre-release.mattermost.com/signup_user_complete/?id=f1924a8db44ff3bb41c96424cdc20676). Some good channels to join:

* [Contributors](https://pre-release.mattermost.com/core/channels/tickets)
* [Developers](https://pre-release.mattermost.com/core/channels/developers)
* [Bugs](https://pre-release.mattermost.com/core/channels/bugs)
* [Native Mobile Apps](https://pre-release.mattermost.com/core/channels/native-mobile-apps)
* [Community Heartbeat](https://pre-release.mattermost.com/core/channels/community-heartbeat)

The pre-release Mattermost instance gets updated daily to latest master of both server and web app.

## Choose a Ticket

1. Choose a ticket from the help wanted GitHub issues for the project you want to contribute you to.
  * [Server Help Wanted](https://github.com/mattermost/mattermost-server/issues?q=is%3Aissue+is%3Aopen+%5BHelp+Wanted%5D+label%3AGo)
  * [Web App Help Wanted](https://github.com/mattermost/mattermost-server/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+%5BHelp+Wanted%5D+label%3AReactJS+)
  * [Mobile Help Wanted](https://github.com/mattermost/mattermost-mobile/issues?q=is%3Aopen+is%3Aissue+label%3A%22Help+Wanted%22)
  * [Desktop Help Wanted](https://github.com/mattermost/desktop/issues?q=is%3Aissue+is%3Aopen+label%3A%22Help+Wanted%22)
  * [Redux Help Wanted](https://github.com/mattermost/mattermost-redux/issues?utf8=%E2%9C%93&q=is%3Aissue+is%3Aopen+%5BHelp+Wanted%5D)
2. Before starting work on the ticket, comment to let people know you're working on it.
3. If you have questions, the best way is to join the [Developers](https://pre-release.mattermost.com/core/channels/developers) channel and post your question.

#### Contributing without a Ticket

It is fine to submit a pull request for a bug or an incremental improvement with less than 20 lines of code change without a Help Wanted ticket if the change to existing behavior is small. Some small examples include:

* [Fix a formatting error in help text](https://github.com/mattermost/mattermost-server/pull/5640)
* [Fix success typo in Makefile](https://github.com/mattermost/mattermost-server/pull/5809)
* [Fix broken Cancel button in Edit Webhooks screen](https://github.com/mattermost/mattermost-server/pull/5612)
* [Fix Android app crashing when saving user notification settings](https://github.com/mattermost/mattermost-mobile/pull/364)
* [Fix recent mentions search not working](https://github.com/mattermost/mattermost-server/pull/5878)

Core committers who review the PR are entitled to reject it if they feel it significantly changes behavior or user expectations, which requires a Help Wanted ticket opened by the core team. This helps ensure that everything going into the project aligns with a unified vision.

The best way to discuss opening a Help Wanted ticket with the core team is by [starting a conversation on the feature idea forum](https://www.mattermost.org/feature-ideas/). Alternatively, don't hesitate to come chat about it in the [Contributors]() or [Developers]() channels.

## Set up a Developer Environment

Once you have a ticket:

1. Set up your developer enivronment for the relevant project.
  * [Server Developer Setup](/contribute/server/developer-setup)
  * [Web App Developer Setup](/contribute/webapp/developer-setup)
  * [Mobile Developer Setup](/contribute/mobile/developer-setup)
  * [Redux Developer Setup](/contribute/redux/developer-setup)
  * [Desktop Developer Setup](/contribute/desktop/developer-setup)
2. Take a look at the developer workflow for the same project.
  * [Server Workflow](/contribute/server/developer-workflow)
  * [Web App Workflow](/contribute/webapp/developer-workflow)
  * [Mobile Workflow](/contribute/mobile/developer-workflow)
  * [Redux Workflow](/contribute/redux/developer-workflow)
  * [Desktop Workflow](/contribute/desktop/developer-workflow)

## Submit a Pull Request

Before submitting a pull request, check that:

1. You've signed the [Contributor License Agreement](http://www.mattermost.org/mattermost-contributor-agreement/), so you can be added to the Mattermost [Approved Contributor List](https://docs.google.com/spreadsheets/d/1NTCeG-iL_VS9bFqtmHSfwETo5f-8MQ7oMDE5IUYJi_Y/pubhtml?gid=0&single=true).
2. Your code follows the [Mattermost Style Guide](http://docs.mattermost.com/developer/style-guide.html).
3. Change is thoroughly tested, including appropriate unit tests, E2E tests and manual testing.
4. User interface strings are included in localization files, [server](https://github.com/mattermost/mattermost-server/blob/master/i18n/en.json) and [webapp](https://github.com/mattermost/mattermost-webapp/blob/master/i18n/en.json)).

When submitting a PR, check that:

1. PR is submitted against `master`.
2. PR title begins with the GitHub or Jira Ticket ID (e.g. `PLT-394` or `GH-394`).
3. PR summary template is filled out.

After submitting a PR, before it's merged:

1. Automated build process must pass.
  * If the build fails, check the error log to find the reason.
2. PM review must pass.
  * A product manager will review the pull request to make sure it:
      * Fits with our product roadmap
      * Works as expected
      * Meets [UX guidelines](https://docs.mattermost.com/developer/fx-guidelines.html)
  * The PM might come back with some bugs or UI improvements before the PR moves to dev review.
3. Dev review must pass.
  * Two core committers will review the PR and either give feedback or approve it.
  * Any comments will need to be addressed before the PR is ready to merge.

If you've included your mailing address in the signed [Contributor License Agreement](https://www.mattermost.org/mattermost-contributor-agreement/), you may receive a [Limited Edition Mattermost Mug](https://forum.mattermost.org/t/limited-edition-mattermost-mugs/143) as a thank you gift after your first pull request is merged.
