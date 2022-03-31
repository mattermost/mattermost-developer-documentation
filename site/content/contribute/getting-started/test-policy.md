---
title: "Test Policy"
heading: "Test Policy for Every Pull Request"
description: "Test Policy for Every Pull Request"
date: 2022-03-30T00:00:00+08:00
weight: 6
---

We write tests to be __confident__ that our product works as expected when used by our users. As developers, we write tests as a gift to future self or developer to be __confident__ that changes will not cause regression or unintended behavior.

We value test-writing as much as a feature or a bug fix, and it is integrated in our core development works. It is not an afterthought and definitely not a follow-up action.

This document was written to stress the importance of tests for every pull request being submitted. This is not to meet higher code coverage but rather to write effective and well-planned use cases depending on the changes being made.

This document aims to serve as the foundation of our test policy and will serve as a guide on why we don't merge code without tests. But of course, there's always an exception. If it is not possible for some reason, let the reviewers know by writing a description to open up a discussion and to fully understand the situation you are facing.

Test categories
---------------
1. __Unit test__ - verify that individual, isolated parts work as expected.
2. __Integration test__ - verify that several units work together in harmony.
3. __End-to-end test__ - exercises most of the parts of a large application.

Note: Wisdom and definition mostly taken from (a) https://martinfowler.com/testing/ and (b) https://kentcdodds.com/.

Not all test types are required in a single pull request. Only write whichever test types are most effective and appropriate.

In general, when to have these tests?
-------------------------------------
1. For all files written in the main language/s of the repo; could be Javascript/Typescript including JSX/TSX, Go, or both which are exported such as functions, modules or components being used in several places.
2. Unexported function or method, which has low or no test coverage from the parent exported function/method, that affects critical functionality or behavior of the application.
3. New features and bug fixes, most especially customer and community bugs.

And when is it fine not to have these tests?
--------------------------------------------
1. For implementation detail of standard library or external package that is implicitly covered by the standard library or external package itself.
2. May require external services running to effectively test the functionality, such as dependence on feature flags of https://split.io, OAuth with third-party providers like Google, etc.
3. Tests should be made at the most effective and lowest possible level but if it requires too much effort or complicated setup to accomplish at unit test level, it would be best to skip and assess feasibility on the next level such as integration or end-to-end testing.
4. Mocks and test helpers.
5. Types only.
6. Interfaces only or interfaces to other repos, such as with private Enterprise via “einterfaces”.
7. End-to-end tests codebase.
8. Automatically generated code for database migrations, store layers, etc.
9. External dependencies, modules, imports or vendors.
