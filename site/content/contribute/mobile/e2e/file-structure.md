---
title: "Folder and File Structure"
date: 2020-09-02T09:00:00-00:00
weight: 4
subsection: Mobile End-to-End Testing
---

The folder structure is mostly based on the [Detox scaffold](https://github.com/wix/Detox/blob/master/docs/Guide.Jest.md) which was created on initial run.  Folders and files are:
```
|-- detox
  |-- e2e
    |-- support
    |-- test
    |-- config.json
    |-- environment.js
    |-- init.js
  |-- .babelrc
  |-- .detoxrc.json
  |-- package-lock.json
  |-- package.json
```

1. `/detox/e2e/support` or [Support Files](https://github.com/wix/Detox/blob/master/docs/Guide.Jest.md#2-set-up-test-code-scaffolds-building_construction)
    - The support folder is a place to put reusable behaviour such as Server API and UI commands or global overrides that are wished to be applied and available to all of test files.
2. `/detox/e2e/test` or [Test Files](https://github.com/wix/Detox/blob/master/docs/APIRef.TestLifecycle.md)
    - To start writing tests,
        - simply create a new file (e.g. `login.e2e.js`) within `/detox/e2e/test` folder
    - Subfolder naming convention depends on test grouping, which is usually based on the general functional area (e.g. `/detox/e2e/test/messaging/` for "Messaging").
    - Test cases that require an enterprise license should fall under `/detox/e2e/test/enterprise/`. This is to easily identify license requirements, both during local development and production testing for enterprise features.
3. `/detox/.detoxrc.json` for Detox [configuration](https://github.com/wix/Detox/blob/master/docs/APIRef.Configuration.md).
4. `/detox/package.json` for all dependencies related to Detox end-to-end testing.