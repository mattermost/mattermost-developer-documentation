---
title: "Automated Testing"
heading: "Testing the Desktop App"
description: "A guide to writing automated tests for the Desktop App"
date: 2019-01-22T00:00:00-05:00
weight: 4
---

For most changes to the Desktop App, we should consider writing an automated test to ensure that the change or fix is maintained in the codebase. 
Depending on the nature of the change, we can write a unit test or an E2E (end-to-end, or integration) test.

## Unit Tests

We use the `jest` test runner to run unit tests in the Desktop App.
You can run the following command to run the tests:

    npm run test:unit

Unit tests are usually written for parts of the `common` and `main` modules, and usually cover individual functions or classes.
We should endaevor to write our code for easy testibility, and any new features or bug fixes should likely have an associated unit test if possible.

In order to ensure that most of the app is covered, we try to maintain 70% coverage of the `common` and `main` modules.
You can view a coverage map by running this command:

    npm run test:coverage

## E2E Tests

We use a combination of two technologies to facilitate E2E testing in the Desktop App:
- **Playwright:** A testing framework similar to Cypress or Selenium that acts as a Chromium driver for testing. It's used to simulate interactions with the various web environments that make up the Desktop App, including the top bar (servers and tabs) and the individual Mattermost views.
- **RobotJS:** A multi-platform OS level automation framework written in NodeJS, used for simulating arbitrary keyboard and mouse inputs. It's generally used to mock actions involving keyboard shortcuts and the Electron menu, as those are not web environments.

To build the app and run the E2E tests, you can run the following command:

    npm run test:e2e

You can also run this command to build the tests without rebuilding the app with this command:

    npm run test:e2e:nobuild

E2E tests are usually written to cover parts of the `renderer` module and should generally cover complete workflows, such as creating/editing a server.
You will generally need a combination of both Playwright and RobotJS APIs to test most workflows.

#### Notes

There are many interactions (ie. things that integrate with the operating system), such as notifications, that cannot be adequately testing using the automation frameworks we have.
If this is the case, we will generally create a script to test in Rainforest, our crowd-sourced QA platform to perform these tests manually.

