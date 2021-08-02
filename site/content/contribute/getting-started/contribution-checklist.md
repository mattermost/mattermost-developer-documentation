---
title: "Contribution Checklist"
heading: "Mattermost Contribution Checklist"
description: "Join our Contributors community channel where you can discuss questions with community members and the Mattermost core team."
date: 2017-08-20T12:33:36-04:00
weight: 1
---

Thanks for your interest in contributing to Mattermost! Come join our [Contributors community channel](https://community.mattermost.com/core/channels/tickets) on the community server, where you can discuss questions with community members and the Mattermost core team.

To help with translations, [see the localization process](https://docs.mattermost.com/developer/localization.html).

Follow this checklist for submitting a pull request (PR):

1. You've signed the [Contributor License Agreement](http://www.mattermost.org/mattermost-contributor-agreement/), so you can be added to the Mattermost [Approved Contributor List](https://docs.google.com/spreadsheets/d/1NTCeG-iL_VS9bFqtmHSfwETo5f-8MQ7oMDE5IUYJi_Y/pubhtml?gid=0&single=true).
 - If you've included your mailing address in the signed [Contributor License Agreement](https://www.mattermost.org/mattermost-contributor-agreement/), you may receive a [Limited Edition Mattermost Mug](https://forum.mattermost.org/t/limited-edition-mattermost-mugs/143) as a thank you gift after your first pull request is merged.
2. Your ticket is a Help Wanted GitHub issue for the Mattermost project you're contributing to.
    - If not, follow the process [here](/contribute/getting-started/contributions-without-ticket/).
3. Your code is thoroughly tested, including appropriate unit tests, [end-to-end tests for webapp](/contribute/webapp/end-to-end-tests/), and manual testing.
4. If applicable, user interface strings are included in localization files:
    - [../mattermost-server../en.json](https://github.com/mattermost/mattermost-server/blob/master/i18n/en.json)
    - [../mattermost-webapp../en.json](https://github.com/mattermost/mattermost-webapp/blob/master/i18n/en.json)
    - [../mattermost-mobile../en.json](https://github.com/mattermost/mattermost-mobile/blob/master/assets/base/i18n/en.json)

    4.1 In the webapp repository run `make i18n-extract` to generate the new/updated strings.
5. The PR is submitted against the Mattermost `master` branch from your fork.
6. The PR title begins with the Jira or GitHub Ticket ID (e.g. `[MM-394]` or `[GH-394]`) and summary template is filled out.
7. If your PR adds or changes a RESTful API endpoint, please update the [API documentation](https://github.com/mattermost/mattermost-api-reference).
8. If your PR adds a new plugin API method or hook, please add an example to the [Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template).
9. If QA review is applicable, your PR includes test steps or expected results.
10. If the PR adds a substantial feature, a feature flag is included. Please see [criteria here](https://developers.mattermost.com/contribute/server/feature-flags/#when-to-use).
11. Your PR includes basic documentation about the change/addition you're submitting. View our [guidelines](https://handbook.mattermost.com/operations/operations/publishing/publishing-guidelines/voice-tone-and-writing-style-guidelines/submitting-documentation-with-your-pr) for more information about submitting documentation and the review process.

Once submitted, the automated build process must pass in order for the PR to be accepted. Any errors or failures need to be addressed in order for the PR to be accepted. Next, the PR goes through [code review](https://developers.mattermost.com/contribute/getting-started/code-review/). To learn about the review process for each project, read the `CONTRIBUTING.md` file of that GitHub repository. 

That's all! If you have any feedback about this checklist, let us know in the [Contributors channel](https://community.mattermost.com/core/channels/tickets).
