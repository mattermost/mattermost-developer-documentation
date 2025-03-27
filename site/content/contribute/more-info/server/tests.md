---
title: "Tests"
heading: "Server test guidelines"
description: "Guidelines to write golang server tests"
date: 2025-02-05T18:00:00-04:00
weight: 2
aliases:
  - /contribute/server/tests
---

## Handling Flaky Tests

A flaky test is one that exhibits both passing and failing results when run multiple times without any code changes. When our automation detects a flaky test on your PR:

1. **Check if the Test is Newly Introduced**
   - Review your PR changes to determine if the flaky test was introduced by your changes
   - If the test is new, fix the flakiness in your PR before merging

2. **For Existing Flaky Tests**
   - Create a JIRA ticket titled "Flaky Test: {TestName}", e.g. "Flaky Test: TestGetMattermostLog"
   - Copy the test failure message into the JIRA ticket description
   - Add the `flaky-test` and `triage-global` labels
   - Create a PR to skip the test by adding:
     ```go
     t.Skip("https://mattermost.atlassian.net/browse/MM-XXXXX")
     ```
     where MM-XXXXX is your JIRA ticket number
   - Link the JIRA ticket in the skip message for tracking

This process helps us track and systematically address flaky tests while preventing them from blocking development work.
