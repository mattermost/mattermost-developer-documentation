---
title: "End-to-End Testing"
date: "2018-03-19T12:01:23-04:00"
subsection: Web App
weight: 6
---

This page describes how to run End-to-End (E2E) testing and to build tests for a section or page of the Mattermost web application.  Under the hood, we are using [Cypress](https://www.cypress.io/) which is "fast, easy and reliable testing for anything that runs in a browser."

Not familiar with Cypress? Here is some documentation that will help you get started:

  - [Developer Guide](https://docs.cypress.io/guides/overview/why-cypress.html#In-a-nutshell)
  - [API Reference](https://docs.cypress.io/api/api/table-of-contents.html)

## What requires an E2E Test?

1. Test cases defined in help-wanted E2E issues - see [link](https://github.com/mattermost/mattermost-webapp/pull/5857/files) which opens a private channel using keyboard navigation with Ctrl/Cmd+K, arrow and enter keys.
2. New features or stories - see [link](https://github.com/mattermost/mattermost-webapp/pull/4243/files) for `Mark As Unread` feature.
3. Bug fixes - see [link](https://github.com/mattermost/mattermost-webapp/pull/5908/files#diff-dcfea130d9ceb044f5959134a2d220d9R56-R84) that fixes mention highlight to self.
4. Test cases from TM4J - see [link](https://github.com/mattermost/mattermost-webapp/pull/5850/files) which adds automated tests for `Guest Accounts`. 
