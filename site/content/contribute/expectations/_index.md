---
title: "Contributor expectations"
heading: "Contributor expectations"
weight: 3
---

To contribute to Mattermost, you must sign the [Contributor License Agreement](https://mattermost.com/mattermost-contributor-agreement/). Doing so adds you to our list of [Mattermost Approved Contributors](https://docs.google.com/spreadsheets/d/1NTCeG-iL_VS9bFqtmHSfwETo5f-8MQ7oMDE5IUYJi_Y/pubhtml?gid=0&single=true). 

**Tip:** Love swag? If you choose to provide us with your mailing address in the signed agreement, you'll receive a [Limited Edition Mattermost Mug](https://forum.mattermost.com/t/limited-edition-mattermost-mugs/143) as a thank you gift after your first pull request is merged.

## Before contributing

There are many ways to contribute to Mattermost beyond a core Mattermost repository:
- You can [create an app integration]({{< ref "/integrate/apps/" >}}), which connects to Mattermost’s functionality that's hosted elsewhere.
- You can create lightweight external applications that don’t require customizations to the Mattermost user experience by using [incoming]({{< ref "/integrate/webhooks/incoming" >}}) and [outgoing]({{< ref "/integrate/webhooks/outgoing" >}}) webhooks, or by using [the Mattermost API](https://api.mattermost.com/).
- You can activate external functionality within Mattermost by creating custom [slash commands]({{< ref "/integrate/slash-commands/" >}}).
- You can extend, modify, and deeply integrate with the Mattermost server, its apps, and its UI/UX by using [plugins]({{< ref "/integrate/plugins/" >}}). However, please note that plugin development comes with the highest level of overhead and must be written in Go and React.
- You can use Mattermost from other applications, by [embedding and launching]({{< ref "/integrate/customization/embedding/" >}}) Mattermost within other applications and mobile apps.

To get started:

1. Identify which repository you need to work in (see point below), then review the README located within the root of the repository to learn more about getting started with your contribution and any processes that may be unique to that repository.
2. To contribute to documentation, you should be able to edit any page and get to the source file in the documentation repository by selecting the **Edit in Github** button in the top right of its respective published page. You can contribute to our [product](https://docs.mattermost.com/) and our [developer](https://developers.mattermost.com/) documentation. 

    These are the Mattermost Core repositories you can contribute to:
     - [Server]({{< ref "/contribute/more-info/server/" >}}): Highly-scalable Mattermost installation written in Go.
     - [Web App]({{< ref "/contribute/more-info/webapp/" >}}): JavaScript client app built on React and Redux.
     - [Mobile Apps]({{< ref "/contribute/more-info/mobile/" >}}): JavaScript client apps for Android and iOS built on React Native.
     - [Desktop App]({{< ref "/contribute/more-info/desktop/" >}}): An Electron wrapper around the web app project that runs on Windows, Linux, and macOS.
     - [Core Plugins]({{< ref "/contribute/more-info/plugins/" >}}): A core set of officially-maintained plugins that provide a variety of improvements to Mattermost.
     - [Boards]({{< ref "/contribute/more-info/focalboard/" >}}) and [Playbooks](https://github.com/mattermost/mattermost-plugin-playbooks) core integrations.

## During the contribution process

1. Check in regularly with your Pull Request (PR) to review and respond to feedback. 
2. Thoroughly document what you’re doing in your PR. This way, future contributors can pick up on your work (including you!). This is especially helpful if you need to step back from a PR.
3. Each PR should represent a single project, both in code and in content. Keep unrelated tasks to different PRs.
4. Make your PR titles and commit messages descriptive! Briefly describing the project in the PR title and in your commit messages often results in faster responses, less clarifying questions, and better feedback.

## Writing code

Thoroughly test your contributions! We recommend the following testing best practices for your contribution: 
1. Detail exactly what you expect to happen in the product when others test your contributions.
2. Identify updates to existing [product](https://docs.mattermost.com/), [developer](https://developers.mattermost.com/), and/or [API](https://api.mattermost.com/) documentation based on your contributions, and identify documentation gaps for new features or functionality. 

   **Note:** Contributors and reviewers are strongly encouraged to work with the Mattermost Technical Writing team via the [Documentation Working Group channel](https://community.mattermost.com/core/channels/dwg-documentation-working-group) on the Mattermost Community Server before approving community contributions. See the Mattermost Handbook for additional details on [engaging the Mattermost Technical Writing team](https://handbook.mattermost.com/operations/research-and-development/product/technical-writing-team-handbook/work-with-us#how-to-engage-with-us), and for [submitting documentation with your PR](https://handbook.mattermost.com/operations/research-and-development/product/technical-writing-team-handbook/writing-community-documentation#submit-documentation-with-your-pr).

3. If your PR adds a new plugin API method or hook, please add an example to the [Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template).
4. If your code adds a new user interface string, include it in the proper localization file, either for [the server repository](https://github.com/mattermost/mattermost-server/blob/master/i18n/en.json), [the webapp repository](https://github.com/mattermost/mattermost-webapp/blob/master/i18n/en.json), or [the mobile repository](https://github.com/mattermost/mattermost-mobile/blob/master/assets/base/i18n/en.json). 

{{<note "Note:">}}
When working within the webapp repository, additionally run `make i18n-extract` from a terminal to update the list of product strings with your changes.
{{</note>}}

# Writing content

Always consider who will consume your content, and write directly to your target audience.

Write clearly and be concise. Write informally, in the present tense, and address the reader directly. See our [voice, tone, and writing style guidelines](https://handbook.mattermost.com/operations/operations/company-processes/publishing/publishing-guidelines/voice-tone-and-writing-style-guidelines), and the [Mattermost Documentation Style Guide](https://handbook.mattermost.com/operations/operations/company-processes/publishing/publishing-guidelines/voice-tone-and-writing-style-guidelines/documentation-style-guide) for details on general writing principles, syntax used to format content, and common terms used to describe product functionality.
