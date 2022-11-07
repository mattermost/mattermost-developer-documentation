---
title: "Contribute to the Marketplace"
heading: "Contribute to the Marketplace"
description: "If you’ve built an integration, playbook, or tool which extends Mattermost functionality, consider sharing it with the community on the Mattermost Web Marketplace."
weight: 100
aliases: 
  - /extend/plugins/community-plugin-marketplace/s
---

The {{<newtabref title="Mattermost Web Marketplace" href="https://mattermost.com/marketplace/">}} supports discovery, installation, and updates of extensions of the Mattermost platform. If you have built a plugin, app, playbook, integration, or tool that helps other users get more from Mattermost, the web Marketplace is a great way to get feedback on your contribution and help make it more popular. Once your submission is accepted to the Web Marketplace, Mattermost will also send you swag!

All contributions are eligible following a review from our team. Apps and plugins that have been thoroughly reviewed by Mattermost will be eligible for our in-product marketplace as well with some additional requirements. Our in-product Marketplace enables customers to install and manage their apps and plugins directly within the product.

## Types of integrations to submit to the web Marketplace

- [Apps]({{<ref "/integrate/apps">}})
- [Plugins]({{<ref "/integrate/plugins">}})
- [Webhook]({{<ref "/integrate/webhooks">}}) configuration
- Playbook templates
- Utility tools, such as importers, command line interfaces, and scripts

## Submit your contribution for the Web Marketplace

Please fill out the information in {{<newtabref title="this form" href="https://forms.gle/PE8kmfSuneP9GWnq8">}} to be reviewed by a member of the Mattermost team.

Every contribution goes through the following checklist before being added to the Web Marketplace at {{<newtabref title="mattermost.com/marketplace" href="https://mattermost.com/marketplace">}}:

1. There is a link to the contribution so we can test it out.
2. There is documentation to support people installing, configuring, and using the contribution. We also recommend including screenshots to give users a better understanding of the workflow and user experience.
3. There is a public issue or bug tracker for users to report bugs or issues they encounter.

We will also reach out to you to learn more about the integration, your experience developing with Mattermost, and to coordinate postings for social media.

## Submit your contribution for the in-product marketplace

There are additional functional, technical, and security requirements for apps and plugins to be considered for the in-product marketplace. These requirements are documented in the {{<newtabref title="mattermost-marketplace issue template" href="https://github.com/mattermost/mattermost-marketplace/blob/master/.github/ISSUE_TEMPLATE/add_plugin.md">}}. You can check off these items when you submit your contributions by opening an {{<newtabref title="issue in our in-product marketplace repository" href="https://github.com/mattermost/mattermost-marketplace/issues/new?assignees=hanzei&labels=Plugin%2FNew&template=add_plugin.md&title=Add+%24REPOSITORY_NAME+to+Marketplace">}}.

{{<note "Note:">}}
Mattermost reserves the right to reject any plugin submission from the Marketplace.
{{</note>}}

## Security issues

Any security issues found in contributions in the Web and in-product marketplace should be reported by email to `responsibledisclosure@mattermost.com`, or sent directly to a member of the [Security team](https://handbook.mattermost.com/operations/security#where-to-find-us) on the [Community Server](https://community.mattermost.com/).

## Takedown policy

If an integration available through the Marketplace contains a medium or greater security issue or bug that blocks or prevents usage for users isn't fixed within 14 days of being acknowledged, that integration will be removed from the Marketplace, and may be resubmitted to the Marketplace once the issue is resolved. Mattermost reserves the right to take down contributions at any time if a fix for a security issue is not forthcoming, or the issue is critical enough to justify an immediate takedown.
