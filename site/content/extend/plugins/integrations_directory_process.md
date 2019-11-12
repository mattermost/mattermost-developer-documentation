---
title: Listing on integrations.mattermost.com
date: 2018-10-01T00:00:00-05:00
subsection: Plugins (Beta)
weight: 50
---


This document outlines the process of getting your plugin onto the [Integrations Directory](https://integrations.mattermost.com).  




## Checklist


## Submit for Review
When you are ready to have your plugin start this process, ask in the ~Toolkit channel on the community server. The PM, or someone else from the integrations team will help you start the process.


## Step Definitions

### Basic Code Review

Basic code review of an experimental plugin involves a quick review by a [core committer](/contribute/getting-started/core-committers/) to verify that the plugin does what it says it does and to provide any guidance and feedback. To make it easier to provide feedback, a PR can be made that contains all the code of the plugin that isn't the boilerplate from mattermost-plugin-starter-template.

- When you are ready for your plugin to start this process:


### CI System Setup

Setting up the CI system for your plugin will allow continuous testing of your master branch and releases on our testing servers. Master branch testing is done on https://ci-extensions.azure.k8s.mattermost.com/ and release testing is done on https://ci-extensions-release.azure.k8s.mattermost.com/

In order to set this up, we will need a URL where we can on a nightly basis, pull the latest master build. Once that exists you can make a request in the [Integrations and Apps](https://community.mattermost.com/core/channels/integrations) channel.


### Complete code review

A more through code review is performed before allowing a plugin on ci-extensions-release. This review works the same as the basic code review, but the developers performing the review will be more through. If the developer that performed the first review is available, they should be one of the reviewers. One of the reviewers should focus their review on the any security implications of the plugin.


### PM/UX Review

A PM/UX pass involves getting PM support in ironing out any user experience or UI issues with the plugin.

Steps involved:
- Create a one paragraph summary of the integration
- Document the main use cases into bullet form
- Review the primary use cases and run through them to ensure they are complete, clear and functional.
- Ensure there is documentation to support the plugin (may include having sufficient helper text in the plugin)
- Consider if there are any communication to other teams or users required as part of the rollout to our community server

