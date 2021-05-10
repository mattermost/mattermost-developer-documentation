---
title: "End-to-End Testing"
heading: "End-to-end Testing in Mattermost"
description: "This page describes how to run End-to-End (E2E) testing and to build tests for a section or page of the Mattermost web application."
date: 2018-12-04T11:35:32-04:00
weight: 6
---

This page describes how to run End-to-End (E2E) testing and to build tests for a section or page of the Mattermost web application.  Under the hood, we are using [Cypress](https://www.cypress.io/) which is "fast, easy and reliable testing for anything that runs in a browser."

Not familiar with Cypress? Here is some documentation that will help you get started:

  - [Developer Guide](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)
  - [API Reference](https://docs.cypress.io/api/api/table-of-contents.html)

## Quick Overview on How to Run E2E Testing

### On Your Local Development Machine

1.  Launch a local Mattermost instance by running `make run` in the `mattermost-server` directory. Confirm that the Mattermost instance has started successfully.
    - Run `make test-data` to preload your server instance with initial seed data.
    - Each test case should handle the required system or user settings, but in case you encounter an unexpected error while testing, you may want to run the server with default config based on `mattermost-server/config/default.json`.
    - In another terminal, in the `mattermost-webapp` directory, run `npm run storybook`. This is required for the Cypress tests which run against the Storybook widgets to pass.
2.  Change directory to `mattermost-webapp/e2e`, and install npm dependencies by running `npm i`.
    - Initiate `npm run cypress:run` in the command line to start full E2E testing. This excludes the specs in the `/cypress/integration/enterprise` folder as they require an Enterprise license to run successfully.
    - Initiate `npm run cypress:open` in the command line to start partial testing depending on which spec is selected via Cypress's desktop app.
    - Initiate via node CLI to selectively run specs based on test metadata, e.g. `node run_tests.js --group='@accessibility'` which will run all specs with `@accessibility` metadata.
3.  Tests are executed according to your selection and will display whether the tests passed or failed.

### Environment Variables

We use several environment variables for Cypress testing in order to:
- Easily change when running in CI.
- Cater to different values across developer machines.

Environment variables are [defined in cypress.json](https://github.com/mattermost/mattermost-webapp/blob/master/e2e/cypress.json) under the `env` key. In most cases you don't need to change the values, because it makes use of the default local developer setup. If you do need to make changes, the easiest method is to override by exporting `CYPRESS_*`, where `*` is the key of the variable, for example: `CYPRESS_adminUsername`. See [Cypress documentation](https://docs.cypress.io/guides/guides/environment-variables.html#Setting) for details.

| Variable            | Description                                |
|---------------------|--------------------------------------------|
| CYPRESS\_adminUsername | Admin's username for the test server.<br><br>Default: `sysadmin` when server is seeded by `make test-data`. |
| CYPRESS\_adminPassword | Admin's password for the test server.<br><br>Default: `Sys@dmin-sample1` when server is seeded by `make test-data`. |
| CYPRESS\_dbClient | The database of the test server. It should match the server config `SqlSettings.DriverName`.<br><br>Default: `postgres` <br>Valid values: `postgres` or `mysql` |
| CYPRESS\_dbConnection | The database connection string of the test server. It should match the server config `SqlSettings.DataSource`.<br><br> Default: `"postgres://mmuser:mostest@localhost/mattermost_test?sslmode=disable\u0026connect_timeout=10"` |
| CYPRESS\_enableVisualTest | Use for visual regression testing.<br><br>Default: `false`<br>Valid values: `true` or `false` |
| CYPRESS\_ldapServer | Host of LDAP server.<br><br>Default: `localhost` |
| CYPRESS\_ldapPort | Port of LDAP server.<br><br>Default: `389` |
| CYPRESS\_runLDAPSync | Option to run LDAP sync.<br><br>Default: `true`<br>Valid values: `true` or `false` |
| CYPRESS\_resetBeforeTest | When set to `true`, it deletes all teams and their channels where `sysadmin` is a member except `eligendi` team and its channels.<br><br>Default: `false`<br>Valid values: `true` or `false` |
| CYPRESS\_storybookUrl | Host for common components or widget testing. <br><br> Default: `http://localhost:6006/` when initiated `npm run storybook` from the root folder. |
| CYPRESS\_webhookBaseUrl | A server used for testing webhook integration.<br><br>Default: `http://localhost:3000` when initiated `npm run start:webhook`. |

### In Continuous Integration Pipeline

We run all tests in our Continuous Integration (CI) pipeline. However, they are grouped according to test stability.
1. __Daily production tests against development branch (master)__ - Initiated on master branch by `node run_tests.js --stage='@prod'` in the command line. These are tests, known as production tests, which were selected and labeled with `@prod` [test metadata](/contribute/webapp/end-to-end-tests/#adding-test-metadata-on-spec-files). See <a target="_blank" href="https://community.mattermost.com/core/pl/i3kg97o1fir9pje7yi8wecd45r">link</a> for an example test run posted in our community channel.
2. __Daily production tests against release branch__ - Same as above except the test is initiated against the release branch. See <a target="_blank" href="https://community.mattermost.com/core/pl/mhtepy6p33gi9fp33fsek161qr">link</a> for an example test run.
3. __Daily unstable tests against development branch (master)__ - Initiated on the master branch by `node run_tests.js --stage='@prod' --invert` in the command line to run all except production tests. We call these unstable tests as they either consistently or intermittently fail due to automation bugs and not product bugs.

## Folder and File Structures

The folder structure is mostly based on the [Cypress scaffold](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Folder-Structure) which was created on initial run.  Folders and files are:
```
|-- e2e
  |-- cypress
    |-- fixtures
    |-- integration
    |-- plugins
    |-- support
    |-- utils
  |-- cypress.json
  |-- package-lock.json
  |-- package.json
```

1. `/e2e/cypress/fixtures` or [Fixture Files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Fixture-Files):
    - Fixtures are used as external pieces of static data that can be used by tests.
    - Typically used with the `cy.fixture()` command and most often when stubbing Network Requests.
2. `/e2e/cypress/integration` or [Test Files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Test-files)
    - To start writing tests,
        - simply create a new file (e.g. `login_spec.js`) within `/e2e/cypress/integration` folder and;
        - refresh tests list in the Cypress Test Runner and a new file should have appeared in the list.
    - Subfolder naming convention depends on test grouping, which is usually based on the general functional area (e.g. `/e2e/cypress/integration/messaging/` for "Messaging").
    - Test cases that require an enterprise license should fall under `/e2e/cypress/integration/enterprise/`. This is to easily identify license requirements, both during local development and production testing for enterprise features.
3. `/e2e/cypress/plugins` or [Plugin Files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Plugin-files)
    - A convenience mechanism that automatically include the plugins before running every single spec file.
4. `/e2e/cypress/support` or [Support Files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Support-file)
    - The support file is a place to put reusable behaviour such as Custom Commands or global overrides that are wished to be applied and available to all of spec files.
5. `/e2e/cypress/utils` for common utility functions.
6. `/e2e/cypress.json` for Cypress [configuration](https://docs.cypress.io/guides/references/configuration.html#Options).
7. `/e2e/package.json` for all dependencies related to Cypress end-to-end testing.

## What requires an E2E Test?

1. Test cases defined in help-wanted E2E issues - see [link](https://github.com/mattermost/mattermost-webapp/pull/5857/files) which opens a private channel using keyboard navigation with Ctrl/Cmd+K, arrow and enter keys.
2. New features or stories - see [link](https://github.com/mattermost/mattermost-webapp/pull/4243/files) for `Mark As Unread` feature.
3. Bug fixes - see [link](https://github.com/mattermost/mattermost-webapp/pull/5908/files#diff-dcfea130d9ceb044f5959134a2d220d9R56-R84) that fixes mention highlight to self.
4. Test cases from TM4J - see [link](https://github.com/mattermost/mattermost-webapp/pull/5850/files) which adds automated tests for `Guest Accounts`. 

## Interested in Contributing to E2E Testing through Help Wanted Tickets

1. All help wanted tickets are under [server repository's GitHub issues](https://github.com/mattermost/mattermost-server/issues?q=label%3A%22Area%2FE2E+Tests%22+label%3A%22Up+For+Grabs%22+is%3Aopen+is%3Aissue+). Look for issues with `Area/E2E Tests` and `Up For Grabs` labels, and comment to let everyone know you're working on it.
2. Each ticket is filled up with specific test steps and verifications that need to be accomplished as a minimum requirement.  Additional steps and assertions for robust test implementation are much welcome.
3. Join our channel at [UI Test Automation](https://community.mattermost.com/core/channels/ui-test-automation) and talk to us as fellow contributors, and collaborate and learn with one another.

## Guide for Writing E2E Testing

### Where should the new test go?

Inside `e2e/cypress/integration` is where all of the tests live. Cypress is configured to look for and run tests that match the pattern of `*_spec.js`, so if you are creating a new test make sure to name it something like `my_new_test_spec.js` to ensure that it gets picked up.

Inside of the `integration` directory, there are additional directories that break up the tests roughly by functional areas. If you see something that looks like it describes the functional area of your test, it should probably live inside that directory. From there, look to see if there is already a `*_spec.js` file that may be similar to what you are testing, it can be very likely that you can add additional tests to a pre-existing file.

### Writing Specs

1. The [recommended practice](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements) of Cypress is to use `data-*` attribute to provide context to selectors, but we prefer to use element ID instead.
   - If element ID is not present in the webapp, you may add it in `camelCase` form with human readable name (e.g. `<div id='sidebarTitle'>`). Watch out for potential breaking changes in the snapshot of the unit testing.  Run `make test` to see if all are passing, and run `npm run updatesnapshot` or `npm run test -- -u` if necessary to update snapshot testing.
2. Add custom commands to `/e2e/cypress/support`. See Cypress documentation for more details about custom commands [[link](https://docs.cypress.io/api/cypress-api/custom-commands.html)].
   - For ease of use, in-code documentation and discoverability, custom commands should have type definition added. See [declaration file](https://github.com/mattermost/mattermost-webapp/blob/master/e2e/cypress/support/api/user.d.ts) for reference on how to include.
3. Organize `/e2e/cypress/integration` with a subfolder to group similar tests.
4. Each test should have a corresponding test case in Test Management for Jira (TM4J). Therefore, the `describe` block should correspond to folder name in TM4J (e.g. "Incoming webhook"), and `it` block should contain `TM4J number` as `Test Key` and test title (e.g. "MM-T623 Lock to this channel on webhook configuration works").  In the spec file, it should be written as:

    ```javascript
    describe('Incoming webhook', () => {
        it('MM-T623 Lock to this channel on webhook configuration works', () => {
            // Test steps and assertion here
        }
    }
    ```

    For those writing E2E from help-wanted tickets with `Area/E2E Tests` label, the `Test Key` is available in the [GitHub issue itself](https://github.com/mattermost/mattermost-server/issues/10574).

    `Test Key` is used for mapping test cases per Release Testing specification. It will be used to measure coverage between manual and automated tests.

    In case the `Test Key` is not available, feel free to prompt the QA team who will either search from an existing TM4J entry or if it's a new one, it will be created for you.

5. Add check if a certain test requires server license.
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

6. Run test in isolation using a convenient custom command of `cy.apiInitSetup()`. This command creates a new team, channel, and user which can be used by the spec file itself only.

7. Refer to [this pull request](https://github.com/mattermost/mattermost-webapp/pull/5891/files) as a guide on how to write and submit an end-to-end testing PR.

### Adding Test Metadata on Spec Files

Test metadata is used to identify each spec file ahead of time before it is forwarded for Cypress run. Currently, supported test metadata are the following:
1. "Stage" - indicates environment for testing, e.g. `@prod`, `@smoke`, `@pull_request`. "Stage" metadata is owned and controlled by QA team who carefully analyze stability of test and promote/demote into a certain stage. This is not required when submitting a spec file.
2. "Group" - indicates test group or category, which is primarily based on functional areas and existing release testing groups, e.g. `@account_settings` for Account Settings, `@messaging` for Messaging, etc. This is required when submitting a spec file.
3. "Skip" - is a way to skip a spec file depending on capability of test environment. This is required when submitting a spec file if a test has certain limitation or requirement. Capabilities could be as follows:
   - Per platform, e.g. `@darwin` for Mac, `@linux` for Linux flavor like Ubuntu, `@win32` for Windows, etc.
   - Per browser, e.g. `@electron`, `@chrome`, `@firefox`, `@edge`
   - Per headless or headed, e.g. `@headless` or `@headed`

A spec file can have zero or more metadata separated by space.
```
// Stage: @prod @smoke
// Group: @enterprise @saml
// Skip:  @headless @electron @firefox
```


## Troubleshooting

### Cypress Failed To Start After Running 'npm run cypress:run'

Either the command line exits immediately without running any test or it logs out like the following.

##### Error message
```sh
✖  Verifying Cypress can run /Users/user/Library/Caches/Cypress/3.1.3/Cypress.app
   → Cypress Version: 3.1.3
Cypress failed to start.

This is usually caused by a missing library or dependency.
```

##### Solution
Clear node options by initiating `unset NODE_OPTIONS` in the command line. Running `npm run cypress:run` should proceed with Cypress testing.


##### Error message
This error may occur in Ubuntu when running any Cypress spec.

```
code: 'ENOSPC',
errno: 'ENOSPC',
```
##### Solution
Run the following command

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
