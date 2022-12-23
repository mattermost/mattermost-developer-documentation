---
title: "Test guidelines"
heading: "Test guidelines"
description: "Test guidelines"
date: 2022-03-30T00:00:00+08:00
weight: 6
aliases:
  - /contribute/getting-started/test-guideline
---

At Mattermost, we write tests to be __confident__ that our product works as expected when used by our customers. As developers, we write tests as a gift to our future selves or to be __confident__ that changes will not cause regressions or unintended behaviors. We value test-writing as much as a feature or a bug fix, and it's integrated in our core development workflows. It's not an afterthought and definitely not a follow-up action.

This page stresses the importance of tests, including for every pull request being submitted. It is the foundation of our test guidelines, and serves as a reference on why we do not merge code without tests. This is not to meet higher code coverage but rather to write effective and well-planned use cases depending on the changes being made. But of course, there's always an exception. If it isn't possible to make a test for some reason, let the reviewers know by writing a description to start a discussion and to fully understand the situation you are facing.

Test categories
---------------
Not all test types are required in a single pull request. Only write whichever test types are most effective and appropriate.
1. __Unit tests__ - Unit tests verify that individual, isolated parts work as expected.
2. __Integration tests__ - Integration tests verify that several units work together in harmony.
3. __End-to-End (E2E) tests__ - End-to-End tests exercise most of the parts of a large application.

{{<note "Note:">}}
Wisdom and definitions mostly taken from {{<newtabref title="Martin Fowler's Software Testing Guide" href="https://martinfowler.com/testing/">}} and {{<newtabref title="Kent C. Dodds's personal site" href="https://kentcdodds.com/">}}.
{{</note>}}

In general, when are tests necessary?
-------------------------------------
- For all files written in the main language(s) of the repository; this could be JavaScript/Typescript and JSX/TSX files, Go files, or both which are exported such as functions, modules, or components used in various places. 
- Un-exported functions or methods, which have low or no test coverage from the parent exported function/method, that affect critical functionality or behavior of the application.
- New features and bug fixes, especially those originating from customer and community bugs.

When is it fine not to have tests?
--------------------------------------------
- For implementation details of standard libraries or external packages that are implicitly covered by the standard library or external package itself.
- Where the situation may require external services running to effectively test the functionality, such as dependencies on feature flags via {{<newtabref title="Split" href="https://split.io">}}, OAuth with third-party providers like Google, etc.
- Tests should be made at the most effective and lowest possible level, but if it requires too much effort or complicated setup to accomplish at a unit test level, it would be best to skip and assess feasibility on the next level such as integration or end-to-end testing.
- Mocks and test helpers.
- Types only.
- Interfaces only or interfaces to other repositories, such as with private Enterprise via “einterfaces”.
- End-to-end tests codebase.
- Automatically generated code for database migrations, store layers, etc.
- External dependencies, modules, imports, or vendors.

How to run and write tests
------------------
### Unit tests

#### Server
For writing and running unit tests in general, see the [Server workflow]({{<ref "/contribute/more-info/server/developer-workflow">}}) page. If you have written a new endpoint or changed an endpoint for the Mattermost REST API, check out the [REST API]({{<ref "/contribute/more-info/server/rest-api">}}) page.

#### Web App
For writing and running unit tests in general, see the [Unit tests]({{<ref "contribute/more-info/webapp/unit-testing">}}) page.

### Integration tests

### End-to-End (E2E) tests

#### Web App
For writing and running E2E tests in general, see the [End-to-End tests]({{<ref "contribute/more-info/webapp/e2e-testing/">}}) section, and the [Cypress cheatsheet]() section. For writing and running E2E (and unit) tests for Redux components, see the [Redux]({{<ref "/contribute/more-info/webapp/redux/">}}) section.
 
- **Writing tests for the Mattermost mobile applications**: see the [Mobile end-to-end tests]({{<ref "contribute/more-info/mobile/e2e/">}}) section, which has sub-pages for both the iOS and Android versions
 
- **Writing tests for the Mattermost desktop application**: see [Automated tests]({{<ref "/contribute/more-info/desktop/testing">}})
 
- **Writing tests for Focalboard**:
 
- **Writing tests for Mattermost "Apps"**:
