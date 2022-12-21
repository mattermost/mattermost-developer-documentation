---
title: "End-to-End tests"
heading: "End-to-End tests for the Mattermost Webapp"
description: "This page describes how to run End-to-End (E2E) testing and to build tests for a section or page of the Mattermost web application."
date: "2018-03-19T12:01:23-04:00"
subsection: Web App
weight: 6
aliases:
  - /contribute/webapp/end-to-end-tests/
  - /contribute/webapp/e2e
---

End-to-end tests for the Mattermost webapp use {{<newtabref href="https://www.cypress.io/" title="Cypress">}} and {{<newtabref href="" title="Playwright">}}. If you're not familiar with Cypress, check out the Cypress {{<newtabref href="https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell" title="Developer Guide">}} and {{<newtabref href="https://docs.cypress.io/api/api/table-of-contents.html" title="API Reference">}}. Feel free to join the {{< newtabref href="https://community.mattermost.com/core/channels/ui-test-automation" title="UI Test Automation" >}} Mattermost channel and collaborate with us!
> *Note*: Playwright is a new framework getting added to Mattermost repositories for test automation (and is currently being used for visual tests). Documentation about Playwright is in development, so all other content about E2E testing will be related to Cypress.

### What requires an E2E test?

* Test cases that are defined in {{<newtabref href="https://github.com/mattermost/mattermost-server/issues?q=label%3A%22Area%2FE2E+Tests%22+label%3A%22Up+For+Grabs%22+is%3Aopen+is%3Aissue+" title="help-wanted E2E issues">}}.
  * Look for {{<newtabref href="https://github.com/mattermost/mattermost-server/issues?q=is%3Aissue+is%3Aopen+e2e" title="issues in the mattermost-server">}} repository that have the `Up For Grabs` label and either the `Area/E2E Tests` label or something related to E2E in the issue title.
  * Once you find an issue you would like to work on (for example, {{<newtabref href="https://github.com/mattermost/mattermost-server/issues/18184" title=`Write Webapp E2E with Cypress: "MM-T642 Attachment does not collapse" #18184`>}}), comment on the issue to claim it. This linked issue will also be referred to in other examples on writing an E2E test.
  * Each issue is filled with specific test steps and verifications that need to be accomplished as a minimum requirement.  Additional steps and assertions for robust test implementation are very welcome. The contents of an E2E issue follow this general format:
    * **Steps**: What the code in the test should do and/or emulate.
    * **Expected**: What the results of the test should be.
    * **Test Folder**: Where the file that holds the test code should be located.
    * **Test code arrangement**: Starter code for the test.
    * **Notes**: comments on what to add and not to add to the test file, plus resources for contributions, asking questions, etc.
  * Another example to check out is this issue ({{<newtabref href="https://github.com/mattermost/mattermost-server/issues/14078" title=`Cypress test: "CTRL/CMD+K - Open private channel using arrow keys and Enter" #14078`>}}) and the pull request (PR) made for the issue ({{<newtabref href="https://github.com/mattermost/mattermost-webapp/pull/5857" title=`[MM-23358] Cypress test for "CTRL/CMD+K - Open private channel using arrow keys and Enter" #5857 `>}}) which deals with opening a private channel through keyboard navigation using the <kbd><kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>K</kbd></kbd>, <kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd><kbd>←</kbd></kbd> and <kbd>Enter</kbd> keys. On PRs in GitHub, to view the code added and changed, navigate to the `Files Changed` tab.
  <br><br/>

* New features and stories - For example, check out {{<newtabref href="https://github.com/mattermost/mattermost-webapp/pull/4243" title="MM-19922 Add E2E tests for Mark as Unread #4243">}} which contains E2E tests for the `Mark As Unread` feature. 

* Bug fixes - For example, see {{<newtabref href="https://github.com/mattermost/mattermost-webapp/pull/5908" title="MM-26751: Fix highlighting of at-mentions of self #5908">}}, which fixes a highlighting issue and adds a related test.

* Test cases from {{<newtabref href="https://support.smartbear.com/zephyr-scale-cloud/docs/" title="Zephyr">}} - For example, see {{<newtabref href="https://github.com/mattermost/mattermost-webapp/pull/5850" title="Added Cypress tests MM-T1410, MM-T1415 and MM-T1419 #5850">}} which adds automated tests for `Guest Accounts`. 

### File Structure for E2E Testing
The file structure is mostly based on the {{<newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Folder-Structure" title="Cypress scaffold">}}. Here is an overview of some important folders and files:

```
|-- e2e
  |-- cypress
    |-- tests
      |-- fixtures
      |-- integration
      |-- plugins
      |-- support
      |-- utils
    |-- cypress.config.ts
    |-- package.json
```

* `/e2e/cypress/tests/fixtures` or {{<newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Fixture-Files" title="Fixture Files">}}:
    - Fixtures are used as external pieces of static data that can be used by tests.
    - Typically used with the `cy.fixture()` command and most often when stubbing network requests.
* `/e2e/cypress/tests/integration` or {{<newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Test-files" title="Test Files">}}:
    - Subfolder naming convention depends on test grouping, which is usually based on the general functional area (e.g. `/e2e/cypress/tests/integration/messaging/` for "Messaging").
* `/e2e/cypress/tests/plugins` or {{<newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Plugins-file" title="Plugin Files">}}:
    - A convenience mechanism that automatically includes plugins before running every single `spec` file.
* `/e2e/cypress/tests/support` or {{<newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Support-file" title="Support Files">}}:
    - A support file is a place for reusable behaviour such as custom commands or global overrides that are available and can be applied to all `spec` files.
* `/e2e/cypress/tests/utils`: this folder contains common utility functions.
* `/e2e/cypress/cypress.config.ts`: this file is for Cypress {{<newtabref href="https://docs.cypress.io/guides/references/configuration.html#Options" title="configuration">}}.
* `/e2e/cypress/package.json`: this file is for all the dependencies related to Cypress end-to-end testing.

### Writing End-to-End Tests

#### Where should a new test go?
You will need to either add the new test to an existing `spec` file, or create a new file. Sometimes, you will be informed (for example through issue descriptions) of the specific folder the test file should go in, or the actual test file being amended. As aforementioned, the `e2e/cypress/tests/integration` folder is where all of the tests live, with subdirectories that roughly divide the tests by functional areas. Cypress is configured to look for and run tests that match the pattern of `*_spec.ts`, so a good new test file name for an issue like {{<newtabref href="https://github.com/mattermost/mattermost-server/issues/18184" title=`Write Webapp E2E with Cypress: "MM-T642 Attachment does not collapse" #18184`>}} would be `attachment_does_not_collapse_spec.ts`, to ensure that it gets picked up.
> *Note*: There may be some JavaScript `spec` files, but new tests should be written in TypeScript - if you are adding a test to an existing `spec` file, convert that file to TypeScript if necessary.

If you don't know where a test should go, first check the names of the subdirectories, and select a folder that describes the functional area of the test best. From there, look to see if there is already a `spec` file that may be similar to what you are testing; if there is one, it would be possible to add the test to the pre-existing file.

#### Test metadata on spec files
Test metadata is used to identify each `spec` file before it is forwarded for a Cypress run, and the metadata is located at the start of a `spec` file. Currently, supported test metadata fields include the following:

* "Stage" - Indicates the environment for testing; valid values for this include `@prod`, `@smoke`, `@pull_request`. "Stage" metadata in `spec` files are owned and controlled by the Quality Assurance (QA) team who carefully analyze the stability of tests and promote/demote them into certain stages. This is not required when submitting a `spec` file and it should be removed when modifying an existing `spec` file.

* "Group" - Indicates test group or category, which is primarily based on functional areas and existing release testing groups. Valid values for this include: `@settings` for Settings, `@playbooks` for Playbooks, etc. This is required when submitting a `spec` file.

* "Skip" - This is a way to skip running a `spec` file depending on the capabilities of the test environment. This is required when submitting a `spec` file if there is a test that has certain limitations or requirements. Forms of capabilities include:
  - Platform-related: valid values include - `@darwin` for Mac, `@linux` for Linux flavors like Ubuntu, `@win32` for Windows, etc.
  - Browser-related: valid values include - `@electron`, `@chrome`, `@firefox`, `@edge`, etc.
  - User interface-related: valid values include `@headless` or `@headed`.

A spec file can have zero or more metadata values separated by spaces (for example, `// Stage: @prod @smoke`). A more full example of what metadata would look like at the start of a file (for example, `attachment_does_not_collapse_spec.ts`) would be:

```
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @incoming_webhook
```

The metadata is part of a comment block that also includes information on copyright and license, and a section to explain how to tag comments in your code appropriately.

#### Setting up test code

Underneath the comment header, we can add the starter code as defined from the "Test code arrangement" part of the issue. Each test (no matter the situation you're writing a test for) should have a corresponding test case in Zephyr. Therefore, the `describe` block encompassing the test code should correspond to folder name in Zephyr (e.g. "Incoming webhook"), and the `it` block should contain `Zephyr test case number` as `Test Key`, and then the test title. For {{<newtabref href="https://github.com/mattermost/mattermost-server/issues/18184" title=`Write Webapp E2E with Cypress: "MM-T642 Attachment does not collapse" #18184`>}}, in the spec file made for it (`attachment_does_not_collapse_spec.ts`), the starter code would be:
  ```javascript
  describe('Integrations/Incoming Webhook', () => {
    it('MM-T642 Attachment does not collapse', () => {
      // Put test steps and assertions here
    });
  });
  ```
For those writing E2E from Help Wanted tickets with `Area/E2E Tests` label, the `Test Key` is available in the Github issue itself. The `Test Key` is used for mapping test cases per Release Testing specification. It will be used to measure coverage between manual and automated tests. In case the `Test Key` is not available, feel free to prompt the QA team who will either search for an existing Zephyr entry or if it's a new one, it will be created for you.

#### Using Cypress Hooks

Before writing the main body of the test in the `it` block, it can help to write some setup code for test isolation using {{<newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests#Hooks" title="hooks">}}. In a `before()` hook, you can run tests in isolation using the custom command `cy.apiInitSetup()`. This command creates a new team, channel, and user which can only be used by the spec file itself. For `attachment_does_not_collapse_spec.ts` for example:
  ```javascript
  let incomingWebhook;
  let testChannel;

  before(() => {
    // # Create and visit new channel and create incoming webhook
    cy.apiInitSetup().then(({team, channel}) => {
      testChannel = channel;

      const newIncomingHook = {
        channel_id: channel.id,
        channel_locked: true,
        description: 'Incoming webhook - attachment does not collapse',
        display_name: 'attachment-does-not-collapse',
      };

      cy.apiCreateWebhook(newIncomingHook).then((hook) => {
        incomingWebhook = hook;
      });

      cy.visit(`/${team.name}/channels/${channel.name}`);
      });
  });
  ```
The `before()` hook is also a good place to add checks if a test requires a certain kind of server license. If test(s) require a certain licensed feature, use the function `cy.apiRequireLicenseForFeature('<feature name>')`. To check if the server has a license in general, use `cy.apiRequireLicense()`. For more information on custom commands, check out: 

#### Submitting your pull request (PR)

Refer to {{< newtabref href="https://github.com/mattermost/mattermost-webapp/pull/5891/files" title="this pull request" >}} as a guide on how to write and submit an end-to-end testing PR.

#### Troubleshooting
##### Test(s) failing due to a known issue
If test(s) are failing due to another known issue, follow these steps to amend your test:
1. Append the Jira issue key in the test title, following the format of ` -- KNOWN ISSUE: [Jira_key]`. For example:
    ```javascript
    describe('Upload Files', () => {
      it('MM-T2261 Upload SVG and post -- KNOWN ISSUE: MM-38982', () => {
        // Test steps and assertion here
      }
    }
    ```
2. Move the test case into a separate `spec` file following the format of `<existing_spec_file_name_[1-9].js>`. For example:
     `accessibility_account_settings_spec_1.js` and demote the spec file (i.e. remove `// Stage: @prod` from the spec file)
3. If all the test cases are failing in a spec file, update each title as mentioned above and demote the spec file.
4. Link the failed test case(s) to the Jira issue (the known issue). In the Jira bug, select the **Zephyr Scale** tab. Select the **add an existing one** link, then select test case(s), and finally select **Add**.
5. Conversely, remove the Jira issue key if the issue has been resolved and the test is passing.

##### Cypress failed to start after running `npm run cypress:run`
In this problem, either the command line exits immediately without running any test or it logs out like the following with the error message:
```sh
✖  Verifying Cypress can run /Users/user/Library/Caches/Cypress/3.1.3/Cypress.app
   → Cypress Version: 3.1.3
Cypress failed to start.

This is usually caused by a missing library or dependency.
```
The solution to this problem is to clear node options by initiating `unset NODE_OPTIONS` in the command line. Running `npm run cypress:run` should then proceed with Cypress testing.

##### Running any Cypress spec gives `ENOSPC`

This error may occur in Ubuntu when running any Cypress spec:

```
code: 'ENOSPC',
errno: 'ENOSPC',
```
The solution to this problem is to run the following command: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p`. 


