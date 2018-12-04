---
title: "End-to-End Testing"
date: 2018-12-04T11:35:32-04:00
weight: 6
subsection: Web App
---

# End-to-End Testing

This page describes how to run End-to-End (E2E) testing and build tests for a section or page of the Mattermost web application.  Under the hood, we are using [Cypress](https://www.cypress.io/) which is "fast, easy and reliable testing for anything that runs in a browser."

Not familiar with Cypress? Here are the documentations that will help you get started.

    - [Developer Guide](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell), and
    - [API Reference](https://docs.cypress.io/api/api/table-of-contents.html).

## Quick Overview on How to Run E2E Testing

1.  Run a local server instance by initiating `make run` to the mattermost-server folder. Confirm that the instance has started successfully.
   - Run `make test-data` to preload your server instance with initial seed data.  Generated data like users are typically used for logging, etc.
   - Each test case should handle the required system or account settings but in case you encountered some unexpected error while testing, you may want to run the server with default config based on `mattermost-server/config/default.json`).
2.  Change directory to mattermost-webapp and initiate `npm run cypress:run` in the command line. This will start full E2E testing. To run partial testing, you may initiate `npm run cypress:open` in the command line which will open its desktop app.  From there, you may select particular test you would like to run.
3.  Tests are executed according to your selection and will display whether the tests passed or failed.

## Folder Structures

The folder structure is based from [Cypress scaffold](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Folder-Structure) which was created on initial run.  Folders are:
```
|-- cypress
  |-- fixtures
  |-- integration
  |-- support
```

- `/cypress/fixtures` or [Fixture Files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Fixture-Files):
    1.  Fixtures are used as external pieces of static data that can be used by tests.
    2.  Typically use with the `cy.fixture()` command and most often when stubbing Network Requests.
- `/cypress/integration` or [Test Files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Test-files)
    1.  To start writing tests,
        - simply create a new file (e.g. `login_spec.js`) within `cypress/integration` folder and;
        - refresh tests list in the Cypress Test Runner and new file should have appeared in the list.
- `/cypress/support` or [Support Files](https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Support-file)
    1.  The support file is a place to put reusable behavior such as Custom Commands or global overrides that wants to be applied and available to all of spec files.

## What requires an E2E Test?

1. All test cases defined in the Release Checklist
2. New feature or story
3. Bug fixes
4. Cases that are not covered by unit or integration tests

## Interested in Contributing to E2E Testing through Help Wanted Tickets

1. All help wanted tickets are under [server repository's GitHub issues](https://github.com/mattermost/mattermost-server/issues?q=is%3Aissue+is%3Aopen+label%3A%22Up+For+Grabs%22), which will have label related to end-to-end testing.  Comment to let everyone know you're working on it.
2. Each ticket is filled up with specific test steps and assertions that need to accomplish as a minimum requirement.  Additional steps and assertions for robusts test implementation are very much welcome.
3. Join our channel at [UI Test Automation](https://community.mattermost.com/core/channels/ui-test-automation) and talk to us as fellow contributors, collaborate and learn with each other.

## Guide in Writing E2E Testing

1. The [recommended practice](https://docs.cypress.io/guides/references/best-practices.html#Selecting-Elements) of Cypress is to use `data-*` attribute to provide context to selectors, but we prefer to use element ID instead of it.
   - If element ID is not present in the webapp, you may add it in `camelCase` form with human readable name (e.g. `<div id='sidebarTitle'>`). Watch out for potential breaking change the snapshot of unit testing.  Run `make test` to see if all are passing, and run `npm run updatesnapshot` or `npm run test -- -u`, if necessary to update snapshot testing.
2. Add commands or shortcuts to `cypress/support/commands.js` (e.g. `toAccountSettingsModal`) that makes it easier to access a page, section, modal and etc. by simply using it like `cy.toAccountSettingsModal('user-1')`.
3. Organize `cypress/integration` with a subfolder to group similar tests.
4. Refer to [this pull request](https://github.com/mattermost/mattermost-webapp/pull/2058/files#diff-c42a18e742b351c0ade058ed0c4b5c5eR10) as a guide on how to write and submit an end-to-end testing PR.
