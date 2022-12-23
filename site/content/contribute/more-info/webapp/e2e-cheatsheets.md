---
title: "End-to-End (E2E) cheatsheets"
date: 2020-12-11T00:00
weight: 7
aliases:
  - contribute/webapp/e2e-cheatsheets/
---

This page compiles all Cypress custom commands based on specific sections of the web app, as well as other general examples. The examples provided showcase the best and conventions on how to write great automated test scripts.
We encourage everyone to read this information, ask questions if something is not clear, and challenge the mentioned practices so that we can continuously refine and improve.

If you need to add more custom commands, add them to `/e2e/cypress/tests/support`, and check out the {{<newtabref href="https://docs.cypress.io/api/cypress-api/custom-commands.html" title="Cypress custom commands">}} documentation. For ease of use, in-code documentation functionality, and making custom commands more discoverable, add type definitions. See this example of a {{<newtabref href="https://github.com/mattermost/mattermost-webapp/blob/master/e2e/cypress/tests/support/api/user.d.ts" title="declaration file" >}} for reference on how to include and make type definitions.
_____
### General Queries with the Testing Library

The {{< newtabref href="https://testing-library.com/" title="Testing Library" >}} is used through the package `@testing-library/cypress`, and it provides simple and complete custom Cypress commands and utilities that encourage such good testing practices. To decide on the queries from the Testing Library you should be using while writing Cypress tests, check out this {{< newtabref href="https://testing-library.com/docs/guide-which-query/" title="article" >}} to learn more. For instance, you can select something with test ID using: `cy.findByTestId`. 

If you need more help, check out the {{< newtabref href="https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano/related" title="Testing Playground" >}} Chrome extension, which helps you find the best queries to select elements. It allows you to inspect the element hierarchies in Chrome Developer Tools, and provides you with suggestions on how to select them, while encouraging good testing practices.

The following is a short summary of the recommended order of priority for queries:

#### Queries Accessible to Everyone
These reflect the experience of visual/mouse users as well as those that use assistive technology. Examples include: `cy.findByRole`, `cy.findByLabelText`, `cy.findByPlaceholderText`, `cy.findByText`, and `cy.findByDisplayValue`.

#### Semantic Queries
These use HTML5 and ARIA–compliant selectors. Note that the user experience of interacting with these attributes varies greatly across browsers and assistive technology. Some examples include: `cy.findByAltText` and `cy.findByTitle`.

#### Base Queries
These are considered part of implementation details and are discouraged to be used. You will still find base queries in the codebase but it they will be replaced soon. Therefore, please refrain from reusing the existing base query patterns. However, you may want to use them only to limit the scope of selection. Examples include: `cy.get('#elementId')` and `cy.get('.class-name')`. Below is an acceptable use case of base queries:

```javascript
// limit the scope but chained with recommended query
cy.get('#elementId').should('be.visible').findByRole('button', {name: 'Save'}).click();

// limit the scope then use the recommended queries within the scope
cy.get('.class-name').should('be.visible').within(() => {
    cy.findByRole('input', {name: 'Position'}).type('Software Developer');
    cy.findByRole('button', {name: 'Save'}).click();
});
```

#### Query Variants

Note that `cy.findBy*` are shown but other variants are `cy.findAllBy*`, `cy.queryBy*`, and `cy.queryAllBy*`. See the {{< newtabref href="https://testing-library.com/docs/dom-testing-library/api-queries" title="Queries" >}} section from `testing-library`.

#### Off-limits Queries
Please do not use any `Xpath` selectors such as the descendant selector. Do not use the `ul > li` and order selectors either, like `ul > li:nth-child(2)`. If an element can only be queried with this approach, then you may modify the application codebase, improve it, and make it "accessible to everyone".
_____
### Settings Modal
![image](../../../../img/e2e/settings-modal.png)
_____
### Channel Menu
_____
### Product Menu


