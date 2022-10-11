---
title: "Contribute to the Marketplace"
heading: "Contribute to the Marketplace"
description: "If you’ve built an integration, playbook, or tool which supports Mattermost, you may want to consider contributing it to the community via the Mattermost Web Marketplace."
weight: 100
aliases: 
  - /extend/plugins/community-plugin-marketplace/s
---

The {{<newtabref title="Mattermost Web Marketplace" href="https://mattermost.com/marketplace/">}} supports discovery, installation, and updates of extensions of the Mattermost platform. If you have built a plugin, app, playbook, integration, or tool that helps other users get more from Mattermost, the web Marketplace is a great way to get feedback on your contribution and help make it more popular. Once your submission is accepted to the Web Marketplace, Mattermost will also send you swag!

All contributions are eligible to be added to our web marketplace at mattermost.com/marketplace after a review from our team. Apps and plugins that have been thoroughly reviewed by Mattermost will be eligible for our in-product marketplace as well with some additional requirements. Our in-product Marketplace enables customers to install and manage their apps and plugins from directly within the product.

## Types of integrations to submit to the web marketplace

- [Apps]({{<ref "/integrate/apps">}})
- [Plugins]({{<ref "/integrate/plugins">}})
- [Webhook]({{<ref "/integrate/webhooks">}}) configuration
- Playbook templates
- Utility tools, such as importers, command line interfaces, and scripts

## How to submit your contribution for consideration for the web marketplace

Please fill out the information in {{<newtabref title="this form" href="https://forms.gle/PE8kmfSuneP9GWnq8">}} to be reviewed by a member of the Mattermost team.

Every contribution will go through the following checklist before being added to the web marketplace at mattermost.com/marketplace:

1. There is a link to the contribution so we can test it out.
2. There is documentation to support people installing, configuring, and using the contribution. We also recommend including screenshots to give users a better understanding of the workflow and user experience.
3. There is a public issue or bug tracker for users to report bugs or issues they encounter.

We will also reach out to you to learn more about the integration, your experience developing with Mattermost, and to coordinate postings for social media.

## How to submit your contribution for consideration for the in-product marketplace

There are additional functional, technical, and security requirements for apps and plugins to be considered for the in-product marketplace. You can check off these items when you submit your contributions by opening an [issue in our in-product marketplace repository](https://github.com/mattermost/mattermost-marketplace/issues/new?assignees=hanzei&labels=Plugin%2FNew&template=add_plugin.md&title=Add+%24REPOSITORY_NAME+to+Marketplace).

### Technical requirements

1. The plugin or app works for 60,000 concurrent connections and within a High Availability deployment. **Note:** There are currently no publicly-available tools available to verify these properties. As such, they are checked during code review by a developer.
2. The plugin or app logs important events on appropriate log levels to allow System Admins to troubleshoot issues.

### Security requirements

1. Security reviews do not reveal any exploitable vulnerabilities.
2. An email address or a username on the [Community Server](https://community.mattermost.com) is provided to be used to report vulnerabilities in the future.

### Functional requirements

1. The app or plugin must set a `min_server_version` in the manifest.
2. The app or plugin must work on all Mattermost versions greater than or equal to the `min_server_version`.

Please note that Mattermost reserves the right to reject any plugin submission from the Marketplace.

## Security issues

Any security issues found in contributions in the web and in-product marketplace should be reported by email to `responsibledisclosure@mattermost.com`, or sent directly to a member of the [Security team](https://handbook.mattermost.com/operations/security#where-to-find-us) on the [Community Server](https://community.mattermost.com/).

## Takedown policy

If a medium or greater security issue or bug that prevents the usage of the contribution for many users is not fixed within 14 days, the integration will be removed from the Marketplace. It may be resubmitted once the issue is resolved. Mattermost reserves the right to take down contributions at any time if a fix for a security issue is not forthcoming, or the issue is critical enough to justify an immediate takedown.s
