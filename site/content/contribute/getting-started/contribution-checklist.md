---
title: "Contribution Checklist"
date: 2017-08-20T12:33:36-04:00
weight: 1
subsection: Getting Started
---

Thanks for your interest in contributing to Mattermost! Come [join our "Contributors" community channel](https://community.mattermost.com/core/channels/tickets) on our daily build server, where you can discuss questions with community members and the Mattermost core team.

To help with translations, [see the localization process](https://docs.mattermost.com/developer/localization.html).

Follow this checklist for submitting a pull request (PR):

1. You've signed the [Contributor License Agreement](http://www.mattermost.org/mattermost-contributor-agreement/), so you can be added to the Mattermost [Approved Contributor List](https://docs.google.com/spreadsheets/d/1NTCeG-iL_VS9bFqtmHSfwETo5f-8MQ7oMDE5IUYJi_Y/pubhtml?gid=0&single=true).
 - If you've included your mailing address in the signed [Contributor License Agreement](https://www.mattermost.org/mattermost-contributor-agreement/), you may receive a [Limited Edition Mattermost Mug](https://forum.mattermost.org/t/limited-edition-mattermost-mugs/143) as a thank you gift after your first pull request is merged.
2. Your ticket is a help wanted GitHub issue for one of the Mattermost project you're contributing to.
    - If not, follow the process [here](/contribute/contributions-without-ticket).
3. Your code follows the [Mattermost Style Guide](http://docs.mattermost.com/developer/style-guide.html).
4. Code thoroughly tested, including appropriate unit tests, [end-to-end tests for webapp](/contribute/webapp/end-to-end-tests/) and manual testing.
5. If applicable, user interface strings are included in localization files:
    - [../mattermost-server../en.json](https://github.com/mattermost/mattermost-server/blob/master/i18n/en.json)
    - [../mattermost-webapp../en.json](https://github.com/mattermost/mattermost-webapp/blob/master/i18n/en.json)
    - [../mattermost-mobile../en.json](https://github.com/mattermost/mattermost-mobile/blob/master/assets/base/i18n/en.json)
6. PR is submitted against `master` branch.
7. PR title begins with the JIRA or GitHub Ticket ID (e.g. `MM-394` or `GH-394`) and summary template is filled out.
8. Once submitted, the automated build process must pass for the PR.
9. If your PR adds or changes a RESTful API endpoint, please update the [API documentation](https://github.com/mattermost/mattermost-api-reference).
10. If you PR adds a new plugin API method or hook, please add an example to the [Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-sample).

That's all! If you have any feedback about this checklist, let us know in the [Contributors channel](https://community.mattermost.com/core/channels/tickets).

To learn about the review process for each project, read the `CONTRIBUTING.md` file of that GitHub repository.
