---
title: Listing on integrations.mattermost.com
date: 2018-10-01T00:00:00-05:00
subsection: Plugins (Beta)
weight: 50
---


This document outlines the process of getting your plugin onto the [Integrations Directory](https://integrations.mattermost.com).  

When submitting an Integration, keep the following in mind:
- An Integration Directory Listing can be as simple as a blog post with instructions on how to configure an integration manually, a script, a plugin for another platform that connects with Mattermost, or a native Mattermost plugin.  
- Mattermost staff will review your plugin for functionality and clarity. If the description of your plugin is not clear, we will help by submitting a Pull Request with some suggestions.
- If possible, please enable the "Issues" tab in Github so users can contribute and collaborate on the integration.
- Please be responsive to our questions or suggestions, we curate the integrations directory for Mattermost admins to easily find useful integrations and will work with you to make sure your listing is accurate.
- Mattermost may not have the software available to test an integration, in which case we could do a review over a screenshare to verify functionality.
- Your submission doesn't guarantee it will be accepted to the integrations directory.


## Checklist

- Host your code in a repository (Github, Gitlab, etc.) that Mattermost staff can collaborate with you on
- Your submission should comply with Mattermost Branding Guidelines https://www.mattermost.org/brand-guidelines/
- Your submission should contain a license file compatible with Apache 2.0. Find a list of compatible licenses here: https://apache.org/legal/resolved.html#category-a


## Submit for Review

When you are ready to have your plugin/integration start this process, please submit this form: https://spinpunch.wufoo.com/forms/mattermost-integrations-and-installers/

### What will happen after submission:

#### PM/UX Review

A PM/UX pass involves a Product Manager reviewing and helping to smooth out any user experience issues with the plugin.

Steps involved:
- Review or Create a one paragraph summary of the integration
- Document the main use cases into bullet form
- Review the primary use cases and run through them to ensure they are complete, clear and functional.
- Ensure there is documentation to support the plugin (may include having sufficient helper text in the plugin)
- Review any high level dependencies or security concerns

#### Development: Basic Code Review

Basic code review of an experimental plugin involves a quick review by a [core committer](/contribute/getting-started/core-committers/) to verify that the plugin does what it says it does and to provide any guidance and feedback. To make it easier to provide feedback, a PR can be made that contains all the code of the plugin that isn't the boilerplate from mattermost-plugin-starter-template. We will be in contact with you if we cannot list your integration for some reason.

#### Development: Second Review

If changes are requested by Mattermost Development Teams, your code can be re-submitted for re-review anytime. 


#### Listing Published

Mattermost will announce the new listing via Twitter after it is published.  
