---
title: "Basic Code Structure"
date: 2020-12-11T00:00
weight: 1
subsection: Cypress cheatsheet
---

```javascript
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// **********************************************************************
// - Use [#] in comment to indicate a test step (e.g. # Go to a page)
// - Use [*] in comment to indicate an assertion (e.g. * Check the title)
// - Query an element with @testing-library/cypress as much as possible
// **********************************************************************

// Group: @change_group

describe('Change to Functional Group', () => {
    before(() => {
        // Add hard requirement to immediately fail and throw a descriptive error if not met
        // cy.shouldNotRunOnCloudEdition();

        // Add license requirement
        // cy.apiRequireLicense();

        // Init basic setup for test isolation
        cy.apiInitSetup({loginAfter: true}).then(({team, channel, user}) => {
            // Assign return values to variable/s
            // Visit a channel
            // Do other setup per test data precondition
        });
    });

    // Add a title of "[Zephyr_id] - [Zephyr title]" for test case with single step,
    // or "[Zephyr_id]_[step_number] - [Zephyr title]" for test case with multiple steps
    it('[Zephyr_id] - [Zephyr title]', () => {
        // Test steps and assertion here
    });
});
```

##### Group
- Groups are used in order to filter spec files to run group-specific tests
- Run `META=Group npm run uniq-meta` to see a list of existing values
- Possible values:
  - functional group (required), e.g. `@account_setting`
  - specific server requirement, e.g. `@not_cloud`, `@te_only`
- The word should be named after a functional group related to test case(s)

##### Hard requirement
- Possible values:
  - `cy.shouldNotRunOnCloudEdition()`
  - `cy.shouldRunOnTeamEdition()`
  - `cy.shouldHavePluginUploadEnabled()`
  - `cy.shouldHaveElasticsearchDisabled()`
  - `cy.requireWebhookServer()`
  - `cy.requireStorybookServer()`

##### License requirement
- Possible values:
  - `cy.apiRequireLicense()`
  - `cy.apiRequireLicenseForFeature('Feature')` where `Feature` is "LDAP", "Guest Accounts", etc.

##### Init basic setup for test isolation
- Make use of InitSetup as much as possible to help run tests in isolation.
- It is recommended to log in as a new user and visit the generated team and/or channel.
- Avoid the use of `sysadmin` user or default `ad-1` team.
