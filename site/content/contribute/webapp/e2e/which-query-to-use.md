---
title: "Which query to use?"
date: 2018-12-04T11:35:32-04:00
weight: 5
subsection: End-to-End Testing
---

We love `testing-library` as it encourages to write maintainable tests, to develop with confidence and to ensure web application is accessible by default. Fortunately, there is `@testing-library/cypress` which provides simple and complete custom Cypress commands and utilities that encourage such good testing practices.

#### With that, which query should I use when writing Cypress tests?

There is a dedicated page from `testing-library` that helps answering the question. Read the said [article](https://testing-library.com/docs/guide-which-query/) to learn more. The following is a short summary of the recommended order of priority:

__Queries Accessible to Everyone__ queries that reflect the experience of visual/mouse users as well as those that use assistive technology
1. `cy.findByRole`
2. `cy.findByLabelText`
3. `cy.findByPlaceholderText`
4. `cy.findByText`
5. `cy.findByDisplayValue`

__Semantic Queries__ HTML5 and ARIA compliant selectors. Note that the user experience of interacting with these attributes varies greatly across browsers and assistive technology.

6. `cy.findByAltText`
7. `cy.findByTitle`

__Test IDs__

8. `cy.findByTestId`

__Base Queries__ are considered part of implementation detail and are discouraged to be used. You'll still find it in the codebase but it will be replaced soon. Therefore, please refrain from reusing the existing pattern. However, it's listed as an option when wanting to limit the scope of selection.

9. `cy.get('#elementId')`
10. `cy.get('.class-name')`

Acceptable usage:
```javascript
// limit the scope but chained with recommended query
cy.get('#elementId').should('be.visible').findByRole('button', {name: 'Save'}).click();

// limit the scope then use the recommended queries within the scope
cy.get('.class-name').should('be.visible').within(() => {
    cy.findByRole('input', {name: 'Position'}).type('Software Developer');
    cy.findByRole('button', {name: 'Save'}).click();
});
```

__Query Variants__

Note that `cy.findBy*` are shown but other variants are `cy.findAllBy*`, `cy.queryBy*`, and `cy.queryAllBy*`. See [Queries](https://testing-library.com/docs/dom-testing-library/api-queries) section from `testing-library`.

#### Which query should I not use?
`Xpath` such as descendant selector, e.g. `ul > li` and order selector, e.g. `ul > li:nth-child(2)`. If the element can only be queried with this approach, then you may modify the application codebase, improve and make it "accessible to everyone".

#### Do you still have problems knowing how to use Testing Library queries?

There is a very cool Chrome extension named [Testing Playground](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano/related), and it helps you find the best queries to select elements. It allows you to inspect the element hierarchies in the Chrome Developer Tools, and provides you with suggestions on how to select them, while encouraging good testing practices.

References:
- [Testing Library](https://testing-library.com/)
- [Cypress Testing Library](https://github.com/testing-library/cypress-testing-library#readme)
- [Which query should I use? (from Testing Library)](https://testing-library.com/docs/guide-which-query/)