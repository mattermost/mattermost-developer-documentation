---
title: Community Plugins in the Marketplace
subsection: Plugins (Beta)
weight: 60
---

Once your plugins has reached a certain level of quality, you might consider submitting it to the Plugin Marketplace. The Plugin Marketplace allows discovery, installation and updates of plugins directly within Mattermost. It is a great way to get feedback on your plugin and help make it more popular. Once your plugin is accepted to the Marketplace, Mattermost will also send you swag!

### Requirements for adding community plugin to the Marketplace
Every community plugin must fulfill the following checklist to be added to the Marketplace:

**Product Requirements (Checked by a Product Manager)**

1. The plugin is published under an Apache v2 compatible license (e.g. no GPL, APGL). A list of compatible licenses can be found [here](https://apache.org/legal/resolved.html#category-a).
2. The source code is available in a public git repository.
3. There is a public issue or bug tracker for the plugin, which is linked in the plugin documentation and linked via `support_url` in the manifest.
4. The plugin provides detailed usage documentation with at least one screenshot of the plugin in action, list of features and a development guide. This is typically a README file or a landing page on the web. The link to the documentation is set as `homepage_url` in the manifest. A great example is the [README of the GitHub plugin](https://github.com/mattermost/mattermost-plugin-github/blob/master/README.md).
5. For every release a changelog has to be publish. The link to it is noted via `release_notes_url` in the manifest.
6. The plugin has to be out of Beta and be released with at least v1.0.0.
7. All configuration has to be possible using the UI of Mattermost.
8. The plugin id defined in the manifest must not collide with the id of an existing plugin in the marketplace. It should follow [the naming convention](https://developers.mattermost.com/extend/plugins/manifest-reference/#id).

**Technical Requirements (Checked by a developers of the Toolkit or the Integrations team)**

1. The plugin works for 60k concurrent connections and in a high availability environment. (There are currently no tools available to verify this property. Hence, it is checked via code review by a developer)
2. The plugin logs important events on appropriate log levels to allow system admins to troubleshoot issues.

**Security Requirements (Checked by a member of the security team)**

1. The plugin does not expose a vulnerability.
2. The plugin does not include favor the author of the plugin or a third party excessively by e.g. including a bitcoin miner that mines on behalf of the author.
3. The plugins author must notify Mattermost about any vulnerabilities in the future.

**Functional Requirements (Checked by a and be avaiable  QA tester)**

1. The plugin works as expected with the latest version of Mattermost.
2. The plugin works as expected with the latest ESR version of Mattermost. This must not be checked if `min_server_version` is higher than the latest ESR version.

Given that plugins are currently in Beta and rapid development is still happening, breaking changes especially for the webapp can happen. It is expected from plugin authors to keep up with these changes and fix bugs that may occur. Breaking changes will be mentioned in the "Important Upgrades Notes" section of the [Mattermost Changelog](https://docs.mattermost.com/administration/changelog.html).

### Requirements for updating a community plugin to the Marketplace
On every update of a community plugin must still fulfill the following checklist to be added to the Marketplace. This is checked by the four reviewers in the same way as when the plugin was added. The code review and security review should be performed against the `diff` of the last version in the Marketplace and the new version.

The release also has to follow [semver](https://semver.org/). This specifically means for plugins:

* If the plugin exposes an API for inter plugin communication, breaking changes to the API require a major version bump.
* If an update requires manual migration actions from the administrator, a major version bump is required.

This is checked in dev review.

The new release must not change the plugin id defined in the manifest as this would require a reconfiguration of the plugin by a system admin.

### Process for adding community plugin to the Marketplace
There will be an owner for community plugins, that will guide you through the review process. Currently this is [hanzei](https://github.com/hanzei).

1. You open an issue on [The Plugin Marketplace Repository](https://github.com/hanzei/plugin-test/issues/new/choose) using a pre defined template for new plugins. The template contains the checklist above, so you can check the items. Please also points out which commit should be used for the review. You may cut an release candidate (RC) and for it the reviews.
2. The reviews are requested by the owner. This is done by cloning the following JIRA ticket for every reviewer, assigning it and mentioning the ticket on GitHub. The reviewers point out found issues on the bug tracker of the community plugin. Once all issues are resolved, they comment on the issue stating the positive review and mark the JIRA ticket as resolved.
    - [PM](https://mattermost.atlassian.net/browse/MM-22224)
    - [Dev](https://mattermost.atlassian.net/browse/MM-22221)
    - [Security](https://mattermost.atlassian.net/browse/MM-22225)
    - [QA](https://mattermost.atlassian.net/browse/MM-22223)
3. Once all items are checked and reviews made, the community repository is forked under the Mattermost GitHub organization as a private repository. This allows using the existing build tools for releasing new plugin versions. The fork is maintained by the owner.
4. `/mb cutPlugin --repo $REP --tag $TAG` is run to build, signs and uploads the approved commit of the plugin.
5. The owner opens a PR, which adds the plugin to `plugins.json` using `generator add $REP $TAG --community`. Only a functional review by one dev and one QA member is needed for this PR.
6. After the PR is merged, the plugin gets promoted across Mattermost social media and swag sent to the maintainer. If there are multiple maintainers, everyone gets swag.

### Process for updating community plugin to the Marketplace
The process is the same as for adding a community plugin besides a couple of differences:
- The following JIRA ticket is used instead
    - [PM](https://mattermost.atlassian.net/browse/MM-22228)
    - [Dev](https://mattermost.atlassian.net/browse/MM-22222)
    - [Security](https://mattermost.atlassian.net/browse/MM-22226)
    - [QA](https://mattermost.atlassian.net/browse/MM-22227)
- Swag is not sent again
- Promotion via social media happens only on outstanding updates.
- The master branch of the fork synced with the upstream community repository by running:

```sh
git fetch upstream
git checkout master
git --ff-only upstream/master
```

### Beta plugins
If a community plugin doesn’t not make it through the review process, it may still be added to the Marketplace and market as “Beta” via a label. The reviewers make a case by case decision if the quality of a plugin is sophisticated enough to be added to the Marketplace. Security and functional review and Item 1, 2, 3 and 5 from the [Product Requirements Checklist](#requirements-for-adding-community-plugin-to-the-marketplace) must be fulfilled for beta plugin.

Given that it must be made clear in the Marketplace UI that a plugin is in beta, all beta plugins must only be visible on Mattermost Servers that support labels, which is Mattermost v5.20.

### Take down Policy
If a S2 and above security issue or bug that prevents the usage of the plugin for many users is not fixed within 14 days, the plugin gets taken from the Marketplace. It may be resubmitted, once the issue is resolved. Mattermost reserved the right to take down plugins at any time if a fix for a security issue is not forthcoming or the issue is critical enough to justify an immediate takedown.
