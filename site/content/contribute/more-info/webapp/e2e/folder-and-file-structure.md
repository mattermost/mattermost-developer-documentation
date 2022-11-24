---
title: "Folder and file structure"
date: 2018-12-04T11:35:32-04:00
weight: 2
aliases:
  - /contribute/webapp/e2e/folder-and-file-structure
---

The folder structure is mostly based on the {{< newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Folder-Structure" title="Cypress scaffold" >}} which was created on initial run.  Folders and files are:
```
|-- e2e
  |-- cypress
    |-- tests
      |-- fixtures
      |-- integration
      |-- plugins
      |-- support
      |-- utils
    |-- cypress.json
    |-- package-lock.json
    |-- package.json
```

1. `/e2e/cypress/tests/fixtures` or {{< newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Fixture-Files" title="Fixture Files" >}}:
    - Fixtures are used as external pieces of static data that can be used by tests.
    - Typically used with the `cy.fixture()` command and most often when stubbing network requests.
2. `/e2e/cypress/tests/integration` or {{< newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Test-files" title="Test Files" >}}
    - To start writing tests,
        - Simply create a new file (e.g. `login_spec.js`) within `/e2e/cypress/tests/integration` folder and;
        - Refresh tests list in the Cypress Test Runner and a new file should appear in the list.
    - Subfolder naming convention depends on test grouping, which is usually based on the general functional area (e.g. `/e2e/cypress/tests/integration/messaging/` for "Messaging").
3. `/e2e/cypress/tests/plugins` or {{< newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Plugins-file" title="Plugin Files" >}}
    - A convenience mechanism that automatically includes the plugins before running every single spec file.
4. `/e2e/cypress/tests/support` or {{< newtabref href="https://docs.cypress.io/guides/core-concepts/writing-and-organizing-tests.html#Support-file" title="Support Files" >}}
    - A support file is a place for reusable behaviour such as Custom Commands or global overrides that are available and can be applied to all spec files.
5. `/e2e/cypress/tests/utils` for common utility functions.
6. `/e2e/cypress/cypress.json` for Cypress {{< newtabref href="https://docs.cypress.io/guides/references/configuration.html#Options" title="configuration" >}}.
7. `/e2e/cypress/package.json` for all dependencies related to Cypress end-to-end testing.
