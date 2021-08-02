---
title: Process to Include Plugin on Community
heading: "Process to Include Plugins on Community"
description: "Getting your project on the Community server is a great way to get valuable feedback from Mattermost users and staff."
date: 2018-10-01T00:00:00-05:00
weight: 50
---


Getting your plugin onto our Community server https://community.mattermost.com is a valuable source of feedback. Whether you are a [Core Committer](https://github.com/mattermost/mattermost-developer-documentation/blob/dae9ecb3b445111479acbaba9f382e9eb263bc52/contribute/getting-started/core-committers) or anyone from the community, we want you to get feedback to improve your plugin. 

However we must ensure that our Community server remains stable for everyone. This document outlines the process of getting your plugin onto the Community server and some of these steps are required to get your plugin into the [Plugin Marketplace](/extend/plugins/community-plugin-marketplace/). 

When you are ready to begin this process for your plugin, ask in the [Toolkit channel](https://community.mattermost.com/core/channels/developer-toolkit) on the Community server. The PM, or someone else from the integrations team will help you start the process.


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

- When you are ready for your plugin to start this process, post an introduction in the [Integrations and Apps channel](https://community.mattermost.com/core/channels/integrations) on the Community server. Here is [an example](https://community.mattermost.com/core/pl/6dci1ssexjrh9rmdzt4pdpb9zy).


### CI System Setup

Setting up the CI system for your plugin will allow continuous testing of your master branch and releases on our testing servers. Master branch testing is done on https://ci-extensions.azure.k8s.mattermost.com/ and release testing is done on https://ci-extensions-release.azure.k8s.mattermost.com/

In order to set this up, the plugin creator needs to provide a URL that hosts latest master build, which we can pull on a nightly basis. Once that exists you can make a request in the [Integrations and Apps](https://community.mattermost.com/core/channels/integrations) channel.


### Compatible Licence

Recommended Licences:

- Apache Licence 2.0
- MIT
- BSD 2-clause
- BSD 3-clause

[More info](https://www.apache.org/legal/resolved.html#category-a)


### Complete Code Review

A more thorough code review is performed before allowing a plugin on `ci-extensions-release`. This review works the same as the basic code review, but the developers performing the review will be more thorough. If the developer that performed the first review is available, they should be one of the reviewers. Another of the reviewers should focus their review on any security implications of the plugin.


### QA Pass

QA pass involves getting a member of our QA team to take a look and verify the functionality advertised by your plugin.

Steps involved:

- Ensure all setup documentation needed is clear and can be successfully followed.
- Dedicated instance or test account to access and test the third-party service, if applicable.
- Functional testing has been done to ensure the integration works as expected.
- For plugins owned by Mattermost, release testing is added to cover the main functionality of the plugin.


### PM/UX Review

A PM/UX pass involves getting PM support in ironing out any user experience or UI issues with the plugin.

Steps involved:

- Create a one paragraph summary of the integration.
- Document the main use cases in bullet form.
- Review the primary use cases and run through them to ensure they are complete, clear, and functional.
- Ensure there is documentation to support the plugin. This may include having sufficient helper text in the plugin.
- Consider if communication to other teams or users is required as part of the rollout to our Community server.
