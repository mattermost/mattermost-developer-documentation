---
title: "Folder and File Structure"
date: 2018-12-04T11:35:32-04:00
weight: 2
subsection: End-to-End Testing
---

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
