---
title: "Guide for Writing E2E Test"
date: 2018-12-04T11:35:32-04:00
weight: 4
subsection: End-to-End Testing
---

### Where should the new test go?

Inside `e2e/cypress/integration` is where all of the tests live. Cypress is configured to look for and run tests that match the pattern of `*_spec.js`, so if you are creating a new test make sure to name it something like `my_new_test_spec.js` to ensure that it gets picked up.

Inside the `integration` directory, there are subdirectories that roughly break up the tests by functional areas. If you see something that looks like it describes the functional area of your test, it should probably live inside that subdirectory. From there, look to see if there is already a `*_spec.js` file that may be similar to what you are testing, it can be very likely that you can add additional tests to a pre-existing file.

### Writing Specs

1. See [which-query-to-use](/contribute/webapp/e2e/which-query-to-use/) when selecting an element base on order of priority.
   - Use `camelCase` when assigning `data-testid` or element ID. Watch out for potential breaking changes in the snapshot of the unit testing.  Run `make test` to see if all are passing, and run `npm run updatesnapshot` or `npm run test -- -u` if necessary to update snapshot testing.
2. Add custom commands to `/e2e/cypress/support`. See Cypress documentation for more details about custom commands [[link](https://docs.cypress.io/api/cypress-api/custom-commands.html)].
   - For ease of use, in-code documentation and discoverability, custom commands should have type definition added. See [declaration file](https://github.com/mattermost/mattermost-webapp/blob/master/e2e/cypress/support/api/user.d.ts) for reference on how to include.
3. Organize `/e2e/cypress/integration` with a subfolder to group similar tests.
4. Each test should have a corresponding test case in Zephyr. Therefore, the `describe` block should correspond to folder name in Zephyr (e.g. "Incoming webhook"), and `it` block should contain `Zephyr test case number` as `Test Key` and test title (e.g. "MM-T623 Lock to this channel on webhook configuration works"). In the spec file, it should be written as:

    ```javascript
    describe('Incoming webhook', () => {
        it('MM-T623 Lock to this channel on webhook configuration works', () => {
            // Test steps and assertion here
        }
    }
    ```

    For those writing E2E from Help Wanted tickets with `Area/E2E Tests` label, the `Test Key` is available in the [GitHub issue itself](https://github.com/mattermost/mattermost-server/issues/18523).

    `Test Key` is used for mapping test cases per Release Testing specification. It will be used to measure coverage between manual and automated tests.

    In case the `Test Key` is not available, feel free to prompt the QA team who will either search for an existing Zephyr entry or if it's a new one, it will be created for you.

5. If a test is failing due to a known issue:
   1. Append the Jira issue key in the test title, following the format of ` -- KNOWN ISSUE: [Jira_key]`. For example:
        ```javascript
        describe('Upload Files', () => {
            it('MM-T2261 Upload SVG and post -- KNOWN ISSUE: MM-38982', () => {
                // Test steps and assertion here
            }
        }
        ```
   2. Move the test case into a separate `spec` file following the format of `<existing_spec_file_name_[1-9].js>`. For example,
     `accessibility_account_settings_spec_1.js` and demote the spec file (i.e remove `// Stage: @prod` from the spec file)

   3. If all the test cases are failing in a spec file, update each title as mentioned above and demote the spec file.

   4. Link the failed test case/s to Jira issue, `Go to Jira Bug > Click Zephyr Scale tab > Click 'add an existing one' link > Select test case/s > Click Add`

    
    Conversely, remove the Jira issue key if the issue has been resolved and the test is passing.

6. Add check if a certain test requires server license.
    ```javascript
    describe('Test description', () => {
       before(() => {
           // If the test requires a certain licensed feature
           cy.apiRequireLicenseForFeature('GuestAccounts');

           // If server has license in general
           cy.apiRequireLicense();
       }
    }
    ```

7. Run the test in isolation using a convenient custom command of `cy.apiInitSetup()`. This command creates a new team, channel, and user which can only be used by the spec file itself.

8. Refer to [this pull request](https://github.com/mattermost/mattermost-webapp/pull/5891/files) as a guide on how to write and submit an end-to-end testing PR.

### Adding Test Metadata on Spec Files

Test metadata is used to identify each spec file ahead of time before it is forwarded for Cypress run. Currently, supported test metadata are the following:

1. "Stage" - Indicates environment for testing, e.g. `@prod`, `@smoke`, `@pull_request`. "Stage" metadata is owned and controlled by QA team who carefully analyze stability of test and promote/demote into a certain stage. This is not required when submitting a spec file and it should be removed when adding new or modifying an existing spec file.
2. "Group" - Indicates test group or category, which is primarily based on functional areas and existing release testing groups, e.g. `@settings` for Settings, `@playbooks` for Playbooks, etc. This is required when submitting a spec file.
3. "Skip" - Is a way to skip a spec file depending on capability of test environment. This is required when submitting a spec file if a test has certain limitation or requirement. Capabilities could be as follows:
   - Per platform, e.g. `@darwin` for Mac, `@linux` for Linux flavor like Ubuntu, `@win32` for Windows, etc.
   - Per browser, e.g. `@electron`, `@chrome`, `@firefox`, `@edge`
   - Per headless or headed, e.g. `@headless` or `@headed`

A spec file can have zero or more metadata separated by space.
```
// Stage: @prod @smoke
// Group: @enterprise @saml
// Skip:  @headless @electron @firefox
```
