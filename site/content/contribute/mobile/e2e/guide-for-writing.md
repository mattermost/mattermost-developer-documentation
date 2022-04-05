---
title: "Guide for Writing E2E"
heading: "Guide for Writing E2E Tests at Mattermost"
description: "Interested in writing an end-to-end testing script? Follow this guide to learn what needs to be done."
date: 2020-09-01T09:00:00-00:00
weight: 5
---

Before writing a script, ensure that it has a corresponding test case in Zephyr. All test cases may be found in this [link](https://mattermost.atlassian.net/projects/MM?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/design?projectId=10302). If test case is not available, feel free to prompt the QA team who will either search from an existing Zephyr entry or if it's a new one, it will be created for you.

1. Create a test file based on [folder and file structure](/contribute/mobile/e2e/file-structure/).
2. Include Zephyr identification (ID) and title in the test description, following the format of `it('[Zephyr_id] [title]')` or `it('[Zephyr_id]_[step] [title]')` if the test case has multiple steps.

   For test case "[MM-T109 RN apps: User can't send the same message repeatedly](https://mattermost.atlassian.net/projects/MM?selectedItem=com.atlassian.plugins.atlassian-connect-plugin%3Acom.kanoah.test-manager__main-project-page#!/testCase/MM-T109)", it should be:
    ```javascript
    describe('Messaging', () => {
        it('MM-T109 User can\'t send the same message repeatedly', () => {
            // Test steps and assertion here
        }
    }
    ```
    `Zephyr ID` is used for mapping test cases per Release Testing specification. It will be used to measure coverage between manual and automated tests.

3. If a test is failing due to a known issue:
   1. Append the Jira issue key in the test title, following the format of ` -- KNOWN ISSUE: [Jira_key]`. For example:
        ```javascript
        describe('Upload Files', () => {
            it('MM-T2261 Upload SVG and post -- KNOWN ISSUE: MM-38982', () => {
                // Test steps and assertion here
            }
        }
        ```
   2. Move the test case into a separate `spec` file following the format of `<existing_spec_file_name_[1-9].js>`. For example:
     `accessibility_account_settings_spec_1.js` and demote the spec file (i.e. remove `// Stage: @prod` from the spec file)

   3. If all the test cases are failing in a spec file, update each title as mentioned above and demote the spec file.

   4. Link the failed test cases to the Jira issue. In the Jira bug, select the **Zephyr Scale** tab. Select the **add an existing one** link, then select test cases, and select **Add**.

    Conversely, remove the Jira issue key if the issue has been resolved and the test is passing.
4. Target an element using available [matchers](https://github.com/wix/Detox/blob/master/docs/APIRef.Matchers.md#matchers). For best results, it is recommended to match elements by unique identifiers using `testID`. The identifier should follow the following format to avoid duplication.
    ```
    <location>.<modifier>.<element>.<identifier>
    ```

    Where:
    - `location` - can be parent component,  main section or UI screen.
    - `modifier` - adds meaning to the `element`.
    - `element` - common terms like `button`, `text_input`, `image`, and the like.
    - `identifier` - could be unique ID of a post, channel, team or user, or number to represent order.

    Notes: Not all fields are required. When assigning a `testID`, carefully inspect the actual render structure and pick up the minimum fields combination to create a unique value.

    Example:
    - `send.button`
    - `post.<post-id>`
5. Prefix each comment line with appropriate indicator. Each line in a multi-line comment should be prefixed accordingly. Separate and group test step comments and assertion comments for better readability.
    - `#` indicates a test step (e.g. `// # Go to a screen`)
    - `*` indicates an assertion (e.g. `// * Check the title`)
6. Simulate user interaction using available [actions](https://github.com/wix/Detox/blob/master/docs/APIRef.ActionsOnElement.md).
7. Verify user interface (UI) expectation using [expect](https://github.com/wix/Detox/blob/master/docs/APIRef.Expect.md).
8. When using `action`, `match`, or another API specific to particular platform, verify that the equivalent logic is applied so that the API does not impact the other platform. Always run tests in both platforms.
9. See Detox [documentation](https://github.com/wix/Detox/tree/master/docs) for reference.
