---
title: "Contributor expectations"
heading: "Contributor expectations"
description: ""
date: "2022-10-01T12:00:00-00:00"
weight: 3
---

## Before contributing

1. If you’re working on code or documentation, you must sign the [Contributor License Agreement](https://mattermost.com/mattermost-contributor-agreement/). This adds you our list of [Mattermost Approved Contributors](https://docs.google.com/spreadsheets/d/1NTCeG-iL_VS9bFqtmHSfwETo5f-8MQ7oMDE5IUYJi_Y/pubhtml?gid=0&single=true). When you provide your mailing address in the signed agreement, you'll receive a [Limited Edition Mattermost Mug](https://forum.mattermost.com/t/limited-edition-mattermost-mugs/143) as a thank you gift after your first pull request is merged.
2. There are many ways to contribute to Mattermost beyond a core Mattermost repository:
    a. You can [create an app integration]({{< ref "/integrate/apps/" >}}), which connects to Mattermost’s functionality that's hosted elsewhere.
    b. Lightweight external applications that don’t require customizations to the Mattermost user experience, can be integrated by creating [incoming]({{< ref "/integrate/webhooks/incoming" >}}) and [outgoing]({{< ref "/integrate/webhooks/outgoing" >}}) webhooks or by using [the Mattermost API](https://api.mattermost.com/).
    c. You can activate external functionality within Mattermost by creating custom [slash commands]({{< ref "/integrate/slash-commands/" >}}).
    4. You can extend, modify, and deeply integrate with the Mattermost server, its apps, and its UI/UX by using [plugins]({{< ref "/integrate/plugins/" >}}). However please note that plugin development comes with the highest level of overhead and must be written in Go and React.
    5. If you need to take Mattermost with you into another app, perhaps you’re looking for [the embed guide]({{< ref "/integrate/customization/embedding/" >}}).
3. Identify which repository you need to work in, then review the README located within the root of the repository to learn more about getting started with your contribution and any processes that may be unique to that repo.
4. To contribute to documentation, you should be able to edit any page and get to the source file in the documentation repository by selecting the "Edit in Github" button in the top right of its respective published page. You can contribute to our [product](https://docs.mattermost.com/) and our [developer](https://developers.mattermost.com/) documentation. 

These are the Mattermost Core repos you can contribute to:
    - [Server]({{< ref "/contribute/more-info/server/" >}}): Highly-scalable Mattermost installation written in Go.
    - [Web App]({{< ref "/contribute/more-info/webapp/" >}}): JavaScript client app built on React and Redux.
    - [Mobile Apps]({{< ref "/contribute/more-info/mobile/" >}}): JavaScript client apps for Android and iOS built on React Native.
    - [Desktop App]({{< ref "/contribute/more-info/desktop/" >}}): An Electron wrapper around the web app project that runs on Windows, Linux, and macOS.
    - [Core Plugins]({{< ref "/contribute/more-info/plugins/" >}}): A core set of officially-maintained plugins that provide a variety of improvements to Mattermost.
    - Core Integrations: Mattermost product verticals including [Boards]({{< ref "/contribute/more-info/focalboard/" >}}) and [Playbooks](https://github.com/mattermost/mattermost-plugin-playbooks).

## During the contribution process

1. Check in regularly with your Pull Request (PR) to review and respond to feedback. 
2. Thoroughly document what you’re doing in your PR. This way, future contributors can pick up on your work (including you!). This is especially helpful if you need to step back from a PR.
3. Each PR should represent a single project, both in code and in content. Keep unrelated tasks to different PRs.
4. Make your PR titles and commit messages descriptive! Briefly describing the project in the PR title and in your commit messages often results in faster responses, less clarifying questions, and better feedback.

## Writing code

Thoroughly test your contributions! We recommend the following testing best practices for your contribution: 
1. Detail exactly what you expect to happen in the product when others test your contributions.
2. Identify updates to existing [product](https://docs.mattermost.com/), [developer](https://developers.mattermost.com/), and/or [API](https://api.mattermost.com/) documentation based on your contributions, and identify documentation gaps for new features or functionality. 

**Note:** Contributors and reviewers are strongly encouraged to work with the Mattermost Technical Writing team via the [Documentation Working Group channel](https://community.mattermost.com/core/channels/dwg-documentation-working-group) on the Mattermost Community Server prior to approving community contributions that don't include recommended documentation updates or a link to a documentation update PR. 

See the Mattermost Handbook for additional details on [engaging the Mattermost Technical Writing team](https://handbook.mattermost.com/operations/research-and-development/product/technical-writing-team-handbook/work-with-us#how-to-engage-with-us), and for [submitting documentation with your PR](https://handbook.mattermost.com/operations/research-and-development/product/technical-writing-team-handbook/writing-community-documentation#submit-documentation-with-your-pr).
4. If your PR adds a new plugin API method or hook, please add an example to the [Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template).
5. If your code adds a new user interface string, include it in the proper localization file, either for [the server repo](https://github.com/mattermost/mattermost-server/blob/master/i18n/en.json), [the webapp repo](https://github.com/mattermost/mattermost-webapp/blob/master/i18n/en.json), or [the mobile repo](https://github.com/mattermost/mattermost-mobile/blob/master/assets/base/i18n/en.json). 

**Note:** When working within the webapp repository, additionally run `make i18n-extract` from a terminal to update the list of product strings with your changes.

## Writing content

1. Always consider who will consume your content, and write directly to your target audience.
    Write clearly and be concise. Write informally, in the present tense, and address the reader directly. See our [voice, tone, and writing style guidelines](https://handbook.mattermost.com/operations/operations/company-processes/publishing/publishing-guidelines/voice-tone-and-writing-style-guidelines), and the [Mattermost Documentation Style Guide])https://handbook.mattermost.com/operations/operations/company-processes/publishing/publishing-guidelines/voice-tone-and-writing-style-guidelines/documentation-style-guide) for details on general writing principles, syntax used to format content, and common terms used to describe product functionality.
    2. Prefer proper or common nouns first, [then gender-neutral pronouns](https://apastyle.apa.org/style-grammar-guidelines/grammar/singular-they).
    3. Give each page a general summary at the top, right under the first heading.
    4. Treat every page like page one. It’s more likely that your audience found the content through a Google search than by flipping through the content repository where you’re writing.
    5. Prefer short, single-point paragraphs. If they’re small enough once condensed and logically fit together, it might make sense to turn them into a bulleted list. Readers are going to skim your content, so organize your presentation to accommodate them.
    6. Use technical terms where it’s warranted, as long as its still simple to understand for those who don’t already know the jargon.
    7. Avoid cliches, especially those that don’t mean anything significant.
    8. Don’t make assumptions about what readers find “easy” or “simple”.
    9. Let the product speak for itself — avoid directly praising Mattermost.
    10. Write for an international audience.
2. Use tone, word choice, and grammar appropriate for the situation.
    1. Use the active voice.
    2. Negative sentences work best when used sparingly.
    3. Prefer the second-person (”you”) to the first (”I” and “we”).
    4. Use words for “zero” through “nine” and digits for 10 and up. [There are plenty of exceptions to this, though.](https://apastyle.apa.org/style-grammar-guidelines/numbers/numerals)
    5. Use the Oxford comma (that’s the last comma before the conjunction in a list of at least three things).
    6. Use sentence case everywhere.
    7. Present the company, the staff, the community, and the product as friendly for developers, IT folks, and operations specialists.
    8. American English is the standard here.
    9. Be consistent within a single document or group of related documents.
    10. Keep content modular. If document A and document B share content, it’s probably best to transfer what they both share to a new document that both A and B link to.
3. Here are a few specific situations we’ve decided on here at Mattermost:
    1. Prefer “can” and “might” to “may”.
    2. Use “emojis” as the plural of “emoji”.
    3. The phrases “log in”, “set up”, and “sign up” (with spaces) are verbs — the noun and adjective forms are “login”, “setup”, and “sign-up”.
    4. “Single sign-on” is abbreviated to “SSO” whenever possible.
