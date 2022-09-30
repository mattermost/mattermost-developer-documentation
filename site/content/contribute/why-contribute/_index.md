---
title: "Why you might contribute"
heading: "Why you might contribute"
weight: 1
---

## You’ve found a bug

1. If the bug fix that you’re proposing would be larger than 20 lines of code, [create a GitHub issue](https://github.com/mattermost/mattermost-server/issues).

    - You can speed up the process by asking about the issue in the  [Contributors](https://community.mattermost.com/core/channels/tickets) or  [Developers](https://community.mattermost.com/core/channels/developers) channels on the Mattermost Community Server.
    - [Here’s a good example of a contribution](https://github.com/mattermost/mattermost-mobile/pull/364/commits/7a97451b62fee4022edac4c0395ad0a5cbf1bb66) that is small enough to not need a ticket while still being incredibly helpful.
2. If you’ve volunteered to take the ticket once it's active, or if your fix is too small to warrant the ticket, fork the applicable repository, and start making your changes.
3. Create a PR on the `master` branch of the applicable repository. If there is an associated [Jira](https://mattermost.atlassian.net/issues/?jql=) or GitHub issue, your PR should begin with the issue ID (e.g.  `[MM-394]` or  `[GH-394]`). Our GitHub PR template will walk you through the creation of your PR.
4. If you’re a community contributor, the team at Mattermost will handle most of the review process for you. You can wait for a reviewer to be assigned and for them to review your work. Generally the process works like you’d expect: they’ll make suggestions, you’ll implement them, and together you'll discuss changes in PR comments. If you’re having trouble getting a reviewer to be assigned to your PR, take a look at GitHub’s suggested reviewers and reach out to them in the [Community workspace](http://community.mattermost.com).
5. Here is an overview of how our review process works. If you’re a core contributor, you can manage the process yourself.

    a. Start by adding the  `1: UX Review`,  `2: Dev Review`, and  `3: QA Review`  labels, as well as whichever are applicable from [the list of labels]({{< ref "/contribute/more-info/getting-started/labels" >}}).
    b. Add a milestone or a cherry-picking label if the PR needs it. Most don’t and will simply ship once merged, but if there are upcoming milestones, some reviewers are going to prioritize reviews attached to those milestones. Note that adding a milestone is mandatory for bug fixes that must be cherry-picked.
    c. Likely you know whose code you’re changing, so assign the appropriate PM or Designer first for a UX review. When in doubt, somebody is better than anybody, as they can always reassign. Once they give the OK, remove the `1: UX Review` label.
    d. Request two core committers to review — one with experience solving that particular or in that particular language, and another with expertise in the domain of your changes. Don’t request the same people over and over again unless they’re the only people with the necessary expertise. Once they give the OK, remove the `2: Dev Review` label.
    e. Request a QA tester from the team that owns the code that you’re changing. They’ll decide the necessary scope of testing. Make sure you’ve defined what the expected results are so they know when their tests are successful. Once they give the OK, remove the `3: QA Review` label. The QA tester may add the `QA Review Done` label as well.
        **Tip:** We recommend that you generally avoid doing QA testing yourself, unless it’s obvious that it’s not necessary. The best way to help Mattermost QA is to clearly explain your changes and expected outcomes in the PR.
    f. Once all outstanding requests are completed and all involved have approved of the PR, add the `4: Reviews Complete` if it hasn’t been already, merge the PR into `master`, and delete the old branch. If your pull request depends on other pull requests, consider assigning the  `Do Not Merge/Awaiting PR`  label to avoid merging prematurely.
    g. If this is a cherry-picked PR, the automation should handle everything from here on out. If the automated cherry-pick fails, you will need to cherry-pick the PR manually. Cherry-pick the master commit back to the appropriate releases. If the release branches have not been cut yet, leave the labels as-is and cherry-pick once the branch has been cut. The release manager will remind you to finish your cherry-pick. Set the  `CherryPick/Done`  label when you’re done with this process.
    8. Update the appropriate Jira ticket so everybody knows where the project stands. Resolve the ticket for QA from “Ready for QA” button with QA test steps, or with “No Testing Required” if no QA testing is needed.
    9. If you need to test your changes on a test server, you can add the appropriate label to the PR and wait 3-5 minutes for the server to be created (see [the labels page]({{< ref "/contribute/more-info/getting-started/labels.md)" >}}). A bot will send you your link and credentials in the form of a comment on the PR. Remove the label when you’re done to destroy the test server.
6. Once you address suggestions a reviewer has made, re-request a review from them. Their initial review was technically completed, so it’s no longer in their queue until you re-request.

    1. Give reviewers time — they may have long queues and different schedules. If you’ve been assigned a reviewer but haven’t heard from them in 5 business days, politely mention them in a PR comment.
7. Mattermost has a system to categorize the inactivity of contributions. Invalid PRs don’t need to go through this cycle at the Community Coordinator’s discretion.

    1. After 10 days of inactivity, a contribution becomes stale, and a bot will add the  `lifecycle/1:stale`  label to the PR. It’s on the Community Coordinator to nudge the right people to get a stale PR active again, even if that means clarifying requests so the contributor has more information to go off of.
    2. After 20 days of inactivity, a contribution becomes inactive, and a bot will add the `lifecycle/2:inactive` label to the PR. The Community Coordinator warns everybody involved how much time they have before the contribution is closed and again tries to reach out to the blocking party to help. They’re also going to make sure that it’s not the reviewers taking the PR to this point — contributions should only ever be inactive because of no response from the contributor.
        1. When contributions are inactive but for good reason (for example, when the team is actively discussing a major design decision but they haven’t decided on anything yet), `lifecycle/frozen` would be a better label.
        2. Inactive contributions are eligible to be picked up by another community member.
    3. After 30 days of inactivity, a contribution becomes orphaned, and they’ll add the `lifecycle/3:orphaned` label to the now-closed PR. The associated `Help Wanted` ticket is given back its `Up For Grabs` status so others can pick up on the issue.

## Subsection 2 — You want to help with content

1. Good content is just as important as good code! If you notice and fix a content error in the documentation or in another open source article describing Mattermost, we consider you to be a valued member of our contributor community just like if you had added a feature to the core code.
2. If you see a problem with Mattermost [developer](https://developers.mattermost.com/) or [product](https://docs.mattermost.com/) documentation, you have a few options:

    1. If you have time to fix the mistake and it only affects a single page, navigate to the applicable page and click “Edit in GitHub” at the top right.  It’ll walk you through the process of creating a fork so that you can then follow the steps under section 1, subsection 1 of this guide, “You’ve found a bug”.
    2. If you don’t have time to fix the mistake, copy the file path you’re on and create a GitHub issue about the problem you found. Make sure to include the file path and fill out the issue template completely to maximize clarity.
    3. If you’re not up for creating a GitHub issue right now, that’s alright too! In the bottom right corner of every docs page is the question “Did you find what you were looking for?” Use this to quickly provide direct feedback about any page you’re viewing.
    4. If you want to fix a larger problem that affects multiple pages or the structure of the docs, you should first report it as an issue on the appropriate GitHub repo, and follow the steps under section 1, subsection 1 of this guide, “You’ve found a bug”. The developer and product docs repositories contain instructions on how to build and modify the sites locally so you can test larger changes more efficiently.
    5. The best place to discuss problems with us is in the [Documentation Working Group channel](https://community.mattermost.com/core/channels/dwg-documentation-working-group) where you can ping our technical writers with the group `@docsteam`.
3. If you’d like to contribute to our blog, website, or social media, you also have a few options:
    1. You can get paid to write technical content for developers through the Mattermost [community writing program](https://mattermost.com/blog/blog-announcing-community-writing-program/).
    2. If you see a problem with any webpages, blog posts, or other content on [Mattermost.com](https://mattermost.com), you can notify us via [the Content channel](https://community.mattermost.com/core/channels/mattermost-blog).
    3. Share your contributor or user experience! Mention us when you promote work you do in our community and we’ll amplify the message through Mattermost social media profiles.
    4. Want to lead a social community? We can provide advice and resources to help you in the [Community channel](https://community.mattermost.com/core/channels/community-team).

## Subsection 3 — You’d like to make something more inclusive or accessible

1. Accessibility is one of the most overlooked yet most important features of modern software development, and we’re eager to improve on the accessibility of the features in our open source project and its documentation.
2. Problems with the accessibility or the inclusivity of both features in the codebase and pieces of content describing Mattermost are bugs, so we treat them as such in our development process. See subsections 1 and 2 for the description on how you can submit your contribution.
3. When you contribute a change that incorporates an adjustment based on the principles of accessibility and inclusivity, please use this guide to back you up in the PR, ticket, or post.

## Subsection 4 — You have a feature idea

1. Thank you for your enthusiasm! You can act on feature ideas in a few ways:

    1. Take a look at our [product roadmap](https://mattermost.com/roadmap/). There’s a chance we might already be building the thing you want.
    2. [Provide input on features](https://portal.productboard.com/mattermost/33-what-matters-to-you/tabs/117-potential-future-offerings) we’re considering to let us know what matters the most to you.
    3. [Participate in a survey](https://portal.productboard.com/mattermost/33-what-matters-to-you/tabs/115-help-us-learn-more-through-surveys) to help us better understand how to meet the needs of our users.
    4. Discuss your idea with our community in the [Feature Proposals channel](https://community.mattermost.com/core/channels/feature-ideas).
    5. Build an app! Mattermost has a rich framework full of tools to help you add the features you want that don’t quite work as core additions to Mattermost.
        1. [Webhooks]({{< ref "/integrate/webhooks" >}}) are the easiest type of app to create and enable you to integrate with the vast majority of modern web tools.
        2. [Slash commands]({{< ref "/integrate/slash-commands" >}}) are apps that respond to triggers sent as messages inside Mattermost.
        3. More complicated Apps can be built as standard HTTP services in any programming language using a robust API. [Get started here]({{< ref "/integrate/apps" >}}).
        4. If you’re willing to deal with more complex development overhead, [plugins]({{< ref "/integrate/plugins" >}}) enable you to alter every component of the Mattermost experience.

## Subsection 5 — You’re looking to practice your skills or give back to the community

We love developers who are passionate about open-source. If you’re looking to tackle an interesting problem, we’ve got you covered! Feel free to check out [the help wanted tickets on GitHub](https://github.com/search?utf8=%E2%9C%93&q=is%3Aopen+archived%3Afalse+org%3Amattermost+label%3A%22Help+Wanted%22++label%3A%22Up+For+Grabs%22). To take one on, just comment on the issue and follow the process outlined in [article 1, subsection 1](#subsection-1--youve-found-a-bug) of this guide.

## Subsection 6 — You can help with translation

1. We’re honored that you’d like to help people use Mattermost in their native language, so we treat all translators as full-fledged contributors alongside engineers and authors.
2. Each localization community is going to have specific guidelines on how to maintain Mattermost’s distinctive voice across language barriers. Read these guides thoroughly before starting to translate:

    1. [German](https://gist.github.com/der-test/6e04bff8a173e053811cb93e08838ca2)
    2. [French](https://github.com/wget/mattermost-localization-french-translation-rules)
    3. [Dutch](https://github.com/ctlaltdieliet/mattermost-localization-dutch-translation-rules)
3. The first step for new translators is to join [the translation server](http://translate.mattermost.com/) and [the localization community channel](https://community.mattermost.com/core/channels/localization).
    1. If your language already exists on the translation server, you can start making translations or translation suggestions immediately *there on the translation server*. Don’t try to do this manually through GitHub.
    2. If your language is absent from the translation server, ask on the localization community channel for it to be added.
4. Each language in whole is assigned one quality level, and with each release cycle, it can be upgraded or downgraded if necessary.
    1. Official — 100% of the language’s translations are verified both by a Mattermost functionality expert and by a expert speaker of the target language. The language has at least one official reviewer who updates all of the strings that have changed in the English source text, and they have successfully kept all of the translated strings updated since the last release cycle. The language has been in use for at least three full release cycles.
    2. Beta — At least 90% of the language’s translations are verified by at least one Mattermost functionality expert who is fluent in the target language. If a language is at risk for ongoing maintenance, _____ can raise the threshold closer to 100%. Up to 10% of the translations may not be synced with the latest English source text.
    3. Alpha — The language does not meet the qualifications for the Beta level.
5. Every Monday, PRs gets opened for all updates. These PRs will be checked for unexpected character insertions and security problems. Reviewers should always “merge commit” or “rebase and merge” into the PR, but never, ever “squash and commit”. at 22:00 GMT that day, the PRs are approved and merged into the proper repos.
6. Every contribution will be written with the ICU syntax. Please read [this guide](https://formatjs.io/docs/core-concepts/icu-syntax/) so you can get familiar with how it works, and focus especially on how plural terms are handled since that topic comes up quite often.
7. Don’t hesitate to use tools like the [Online ICU Message Editor](https://format-message.github.io/icu-message-format-for-translators/editor.html), which can help you see how your string will look in context.
8. If you’re not sure how to translate a technical term, you can search for it elsewhere in your language on the translation server, check [how Microsoft has translated it](https://www.microsoft.com/en-us/language/Search), and ask in the localization channel.

## Subsection 7 — You want to help test new features

1. The QA team keeps all contributions up to Mattermost’s high standards. That big responsibility earns QA reviewers the same status as all other contributors.
2. If you’d like to earn some prizes, join our weekly bug bashes run from the [QA Contributors channel](https://community.mattermost.com/core/channels/qa-contributors).
3. Standalone [exploratory testing](https://github.com/mattermost/quality-assurance/issues/2) is highly encouraged too! Remember to report your findings in the [QA Contributors channel](https://community.mattermost.com/core/channels/qa-contributors).
