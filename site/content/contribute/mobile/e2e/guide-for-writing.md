---
title: "Guide for Writing E2E"
date: 2020-09-01T09:00:00-00:00
weight: 5
subsection: Mobile End-to-End Testing
---

Before writing a script, ensure that it has a corresponding test case in Test Management for Jira (TM4J).

1. Create a test file based on [folder and file structure](/contribute/mobile/e2e/file-structure).
1. Include TM4J identification (ID) and title in the test description, following the format of `it('[tm4j_id] [title]')` or `it('[tm4j_id]_[step] [title]')` if the test case has multiple steps.
    ```javascript
    describe('Messaging', () => {
        it('MM-T109 User can\'t send the same message repeatedly', () => {
            // Test steps and assertion here
        }
    }
    ```

2. Target an element using available [matchers](https://github.com/wix/Detox/blob/master/docs/APIRef.Matchers.md#matchers). For best results, it is recommended to match elements by unique identifiers using `testID`. The identifier should follow the following format to avoid duplication:
    ```javascript
    <component>.<child>.<action or identifier>
    ```
3. Simulate user interaction using available [actions](https://github.com/wix/Detox/blob/master/docs/APIRef.ActionsOnElement.md).
4. Verify user interface (UI) expectation using [expect](https://github.com/wix/Detox/blob/master/docs/APIRef.Expect.md).
5. When using `action`, `match`, or another API specific to particular platform, verify that the equivalent logic is applied so that the API does not impact the other platform. Always run tests in both platforms.
6. See Detox [documentation](https://github.com/wix/Detox/tree/master/docs) for reference.
