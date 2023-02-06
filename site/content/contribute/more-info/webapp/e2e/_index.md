---
title: "End-to-End tests"
heading: "End-to-End tests in Mattermost"
description: "This page describes how to run End-to-End (E2E) testing and to build tests for a section or page of the Mattermost web application."
date: "2018-03-19T12:01:23-04:00"
subsection: Web App
weight: 6
aliases:
  - /contribute/webapp/end-to-end-tests/
  - /contribute/webapp/e2e
---

This page describes the steps to run the End-to-End (E2E) tests and to build tests for a section or page of the Mattermost web application. Under the hood, we are using {{< newtabref href="https://www.cypress.io/" title="Cypress" >}} which is "fast, easy and reliable testing for anything that runs in a browser."

Not familiar with Cypress? Here is some documentation that will help you get started:

  - {{< newtabref href="https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell" title="Developer Guide" >}}
  - {{< newtabref href="https://docs.cypress.io/api/api/table-of-contents.html" title="API Reference" >}}

## What requires an E2E test?

1. Test cases defined in help-wanted E2E issues - for example, see {{< newtabref href="https://github.com/mattermost/mattermost-webapp/pull/5857/files" title="link" >}} that opens a private channel using keyboard navigation with <kbd><kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>K</kbd></kbd>, <kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd><kbd>←</kbd></kbd> and <kbd>Enter</kbd> keys.
2. New features or stories - for example, see {{< newtabref href="https://github.com/mattermost/mattermost-webapp/pull/4243/files" title="link" >}} for `Mark As Unread` feature.
3. Bug fixes - for example, see {{< newtabref href="https://github.com/mattermost/mattermost-webapp/pull/5908/files#diff-dcfea130d9ceb044f5959134a2d220d9R56-R84" title="link" >}} that fixes mention highlight to self.
4. Test cases from Zephyr - for example, see {{< newtabref href="https://github.com/mattermost/mattermost-webapp/pull/5850/files" title="link" >}} which adds automated tests for `Guest Accounts`. 
