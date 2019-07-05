---
title: Plugins on Community Server
date: 2018-10-01T00:00:00-05:00
subsection: Plugins (Beta)
weight: 50
---


Getting your plugin onto community.mattermost.com is a valuable source of feedback. However we must ensure that our community server remains stable for everyone. This document outlines the process of getting your plugin onto the community server. In the future, some of these steps will be required to get your plugin into the integrations marketplace (TBD). When you are ready to have your plugin start this process, ask in the ~Toolkit channel on the community server.

## Checklist

### Deploying to ci-extensions
- [Basic Code Review](#basic-code-review) passed
- [CI system setup](#ci-system-setup) to build master
- Has a [compatible licence](#compatible-licence).

### Deploying to ci-extensions-release
- Complete code review by two core committers. One focused on security.
- [QA pass](#qa-pass)
- [PM/UX review](#pm-ux-review)
- Release created and [CI system setup](#ci-system-setup) to build releases

### Deploying to community.mattermost.com
- QA pass on ci-extensions-release of the release to deploy.


## Step Definitions

### Basic Code Review

Basic code review of an experimental plugin involves a quick review by a [core committer](/contribute/getting-started/core-committers/) to verify that the plugin does what it says it does and to provide any guidance and feedback. To make it easier to provide feedback, a PR can be made that contains all the code of the plugin that isn't the boilerplate from mattermost-plugin-starter-template.

### CI System Setup

Setting up the CI system for your plugin will allow continuous testing of your master branch and releases on our testing servers. Master branch testing is done on https://ci-extensions.azure.k8s.mattermost.com/ and release testing is done on https://ci-extensions-release.azure.k8s.mattermost.com/

In order to set this up, we will need a URL where we can on a nightly basis, pull the latest master build. Once that exists you can make a request in the [Toolkit](https://community.mattermost.com/core/channels/developer-toolkit) channel.

### Compatible Licence

Recommended Licences:

- Apache Licence 2.0
- MIT
- BSD 2-clause
- BSD 3-clause

[More info](https://www.apache.org/legal/resolved.html#category-a)

### Complete code review

A more through code review is performed before allowing a plugin on ci-extensions-release. This review works the same as the basic code review, but the developers performing the review will be more through. If the developer that performed the first review is available, they should be one of the reviewers. One of the reviewers should focus their review on the any security implications of the plugin.

### QA pass

QA pass involves getting a memeber of our QA team to take a look and verify the functionality advertised by your plugin.

### PM/UX Review

A PM/UX pass involves getting PM support in ironing out any user experience or UI issues with the plugin.
- Create a one paragraph summary of the integration
- Document the main use cases into bullet form
- Review the primary use cases and run through them to ensure they are complete, clear and functional.
- Ensure there is documentation to support the plugin (may include having sufficient helper text in the plugin)
- Consider if there are any communication to other teams or users required as part of the rollout to our community server

