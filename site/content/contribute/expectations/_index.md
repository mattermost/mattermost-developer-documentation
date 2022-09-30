---
title: "Contributor expectations"
heading: "Contributor expectations"
description: ""
date: "2022-10-01T12:00:00-00:00"
weight: 3
---

## Before contributing

1. If you’re working on code or documentation, sign the [Contributor License Agreement](https://mattermost.com/mattermost-contributor-agreement/) so you can be added to the Mattermost [Approved Contributor List](https://docs.google.com/spreadsheets/d/1NTCeG-iL_VS9bFqtmHSfwETo5f-8MQ7oMDE5IUYJi_Y/pubhtml?gid=0&single=true). If you’ve included your mailing address in the signed agreement, you might receive a [Limited Edition Mattermost Mug](https://forum.mattermost.com/t/limited-edition-mattermost-mugs/143) as a thank you gift after your first pull request is merged.
2. For features that don’t belong as part of a core Mattermost repository:
    1. You could [create an app]({{< ref "/integrate/apps/" >}}), which connects to Mattermost’s functionality while being hosted elsewhere.
    2. External applications that don’t rely on customizing the Mattermost user experience can reach the data they need through [incoming]({{< ref "/integrate/webhooks/incoming" >}}) and [outgoing]({{< ref "/integrate/webhooks/outgoing" >}}) webhooks or [the API](https://api.mattermost.com/).
    3. External functionality activated from within Mattermost might work best as a [slash command]({{< ref "/integrate/slash-commands/" >}}).
    4. [Plugins]({{< ref "/integrate/plugins/" >}}) enable you to modify the fabric of the Mattermost UI/UX completely but come with the highest level of development overhead and must be written in Go and React.
    5. If you need to take Mattermost with you into another app, perhaps you’re looking for [the embed guide]({{< ref "/integrate/customization/embedding/" >}}).
3. Read the Markdown files in the root of the repo you’re working in to learn about processes unique to that repo.
4. Figure out which repo you need to be working in. With content, you should be able to click the Edit in GitHub button on the published page to find the right repo, but with code it can be somewhat more difficult. You might even have to contribute to multiple repos, likely starting in the server repo. Here are the core repos:
    - [Server]({{< ref "/contribute/more-info/server/" >}}) - Highly-scalable Mattermost installation written in Go
    - [Web App]({{< ref "/contribute/more-info/webapp/" >}}) - JavaScript client app built on React and Redux
    - [Mobile Apps]({{< ref "/contribute/more-info/mobile/" >}}) - JavaScript client apps for Android and iOS built on React Native
    - [Desktop App]({{< ref "/contribute/more-info/desktop/" >}}) - An Electron wrapper around the web app project that runs on Windows, Linux, and macOS
    - [Core Plugins]({{< ref "/contribute/more-info/plugins/" >}}) - A core set of officially-maintained plugins that provide a variety of improvements to Mattermost.
    - Core Integrations - Major Mattermost features including [Focalboard]({{< ref "/contribute/more-info/focalboard/" >}}) and [Playbooks](https://github.com/mattermost/mattermost-plugin-playbooks).

## Subsection 2 — During the contribution process

1. Check in regularly with your PR — it’d be unfortunate if your hard work was shelved because of a lost notification.
2. Thoroughly document what you’re doing. This way, future contributors will be easily able to pick up on your work (including yourself). This is especially helpful if you need to step back from a PR — in that case, just tell your supervisor how the next contributor can find your documentation.
3. PRs should represent projects, both in code and in content. Keep unrelated tasks to different PRs.
4. Make your PR titles and commit messages descriptive! If you make reviewer’s lives easier by briefly describing the project in the PR title and in your commit messages, you’ll likely get faster responses, less clarifying questions, and better advice.

## Subsection 3 — While writing code

1. Always thoroughly test your contributions! Mattermost is a complex web of programs, so even insignificant changes have the potential to break big features. Here’s our guide on end-to-end testing.
2. Detail exactly what should happen when others test your contributions.
3. Adjust the documentation to match any changes to documented functionality. Reviewers should never pass a change that outdates documentation without the accompanying fix.
4. If your PR adds a new plugin API method or hook, please add an example to the [Plugin Starter Template](https://github.com/mattermost/mattermost-plugin-starter-template).
5. If your code adds a new user interface string, include it in the proper localization file, either for [the server repo](https://github.com/mattermost/mattermost-server/blob/master/i18n/en.json), [the webapp repo](https://github.com/mattermost/mattermost-webapp/blob/master/i18n/en.json), or [the mobile repo](https://github.com/mattermost/mattermost-mobile/blob/master/assets/base/i18n/en.json). In the webapp repository, run `make i18n-extract` to update the list of strings.

## Subsection 4 — While writing content

1. Respect the time and intelligence of your audience.
    1. Be clear and concise without being blunt or curt.
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
