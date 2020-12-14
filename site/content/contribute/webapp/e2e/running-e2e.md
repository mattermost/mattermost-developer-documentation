---
title: "How to Run E2E Tests"
date: 2018-12-04T11:35:32-04:00
weight: 3
subsection: End-to-End Testing
---

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

### In Continuous Integration Pipeline

We run all tests in our Continuous Integration (CI) pipeline. However, they are grouped according to test stability.
1. __Daily production tests against development branch (master)__ - Initiated on master branch by `node run_tests.js --stage='@prod'` in the command line. These are tests, known as production tests, which were selected and labeled with `@prod` [test metadata](/contribute/webapp/end-to-end-tests/#adding-test-metadata-on-spec-files). See <a target="_blank" href="https://community.mattermost.com/core/pl/i3kg97o1fir9pje7yi8wecd45r">link</a> for an example test run posted in our community channel.
2. __Daily production tests against release branch__ - Same as above except the test is initiated against the release branch. See <a target="_blank" href="https://community.mattermost.com/core/pl/mhtepy6p33gi9fp33fsek161qr">link</a> for an example test run.
3. __Daily unstable tests against development branch (master)__ - Initiated on the master branch by `node run_tests.js --stage='@prod' --invert` in the command line to run all except production tests. We call these unstable tests as they either consistently or intermittently fail due to automation bugs and not product bugs.
