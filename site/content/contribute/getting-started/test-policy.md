---
title: "Test Policy"
heading: "Test Policy for Every Pull Request"
description: "Test Policy for Every Pull Request"
date: 2022-03-30T00:00:00+08:00
weight: 6
---

We write tests to be __confident__ that our product works as expected when used by our customers. As developers, we write tests as a gift to our future selves or to be __confident__ that changes will not cause regressions or unintended behaviors.

We value test-writing as much as a feature or a bug fix, and it's integrated in our core development workflows. It's not an afterthought and definitely not a follow-up action.

This document was written to stress the importance of tests for every pull request being submitted. This is not to meet higher code coverage but rather to write effective and well-planned use cases depending on the changes being made.

This document aims to serve as the foundation of our test policy, and serves as a guide on why we don't merge code without tests. But of course, there's always an exception. If it isn't possible for some reason, let the reviewers know by writing a description to start a discussion and to fully understand the situation you are facing.

Test categories
---------------
1. __Unit test__ - verify that individual, isolated parts work as expected.
2. __Integration test__ - verify that several units work together in harmony.
3. __End-to-end test__ - exercises most of the parts of a large application.

Note: Wisdom and definition mostly taken from (a) https://martinfowler.com/testing/ and (b) https://kentcdodds.com/.

Not all test types are required in a single pull request. Only write whichever test types are most effective and appropriate.

In general, when to have these tests?
-------------------------------------
- For all files written in the main language/s of the repo; could be Javascript/Typescript including JSX/TSX, Go, or both which are exported such as functions, modules, or components being used in several places.
- Unexported functions or methods, which have low or no test coverage from the parent exported function/method, that affects critical functionality or behavior of the application.
- New features and bug fixes, especially customer and community bugs.

And when is it fine not to have these tests?
--------------------------------------------
- For implementation details for standard libraries or external packages that are implicitly covered by the standard library or external package itself.
- May require external services running to effectively test the functionality, such as dependencies on feature flags via https://split.io, OAuth with third-party providers like Google, etc.
- Tests should be made at the most effective and lowest possible level, but if it requires too much effort or complicated setup to accomplish at a unit test level, it would be best to skip and assess feasibility on the next level such as integration or end-to-end testing.
- Mocks and test helpers.
- Types only.
- Interfaces only or interfaces to other repos, such as with private Enterprise via “einterfaces”.
- End-to-end tests codebase.
- Automatically generated code for database migrations, store layers, etc.
- External dependencies, modules, imports, or vendors.
