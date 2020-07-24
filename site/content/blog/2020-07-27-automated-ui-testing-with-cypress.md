---
title: "Automated UI Testing With Cypress"
slug: automated-ui-testing-with-cypress
date: 2020-07-27
categories:
    - "testing"
    - "ui automation"
author: Saturnino Abril
github: saturninoabril
community: saturnino.abril
toc: true
canonicalUrl: https://mattermost.com/blog/automated-ui-testing-with-cypress/
---

It's been more than a year and a half since we started using Cypress for our automated functional testing and it has been worth the investment. It has now become an essential part of our process to automate regression testing to ship new releases faster, with increased quality.

It’s fun and easy to get started with Cypress but as we added more scripts with the varying requirements, we faced several setbacks and hurdles, such as flaky tests, which slow down our efforts in automating test cases. This resulted in a shift in our focus and time maintaining the test scripts itself, so we decided to reevaluate the strategy and came up with the guidelines and best practices which are what I’m going to share with you in this blog.

Here at Mattermost, we have many types and stages of testing such as unit, integration, load, performance, and end-to-end (E2E) for UI functional, REST API, and system. But for the purpose of this article, I will focus only on E2E, specifically User Interface (UI) and functional testing, which typically run the entire application, both server and web application, with the test script written in Cypress that interacts like a typical user would.

#### E2E Test Setup
Before we dive into the guidelines and best practices, first let’s take a look at our E2E Test setup. The illustration below shows the overall test setup.

![test environment image](/blog/2020-07-27-automated-ui-testing-with-cypress/test_environment_setup.png)

Mattermost server and web application, which we'll refer to as "server", is spun up with all the required services such as PostgreSQL, Elasticsearch, SAML/Okta, OpenLDAP, Minio, Webhook server, Plugin Marketplace and Email server. Once the server is ready, Cypress will interact with it as a user and initiate actions and verify results. In some cases, it directly accesses the services to set up or verify information. There is also a separate static website generated from Storybook that is used to check the functionality of a component from the web application.

#### Typical Test Execution Life Cycle

![test execution life cycle image](/blog/2020-07-27-automated-ui-testing-with-cypress/test_execution_life_cycle.png)

The illustration above shows the test execution life cycle of our E2E tests. It starts with the initial setup where the test environment preparation happens such as spinning the test server. Then, testing each test file until all are completed. Finally, it consolidates each individual report and artifact, saves into AWS S3 and ReportPortal dashboard, and publishes a test summary to our community channel.

#### General Tips
Now that we have an idea on how we set up and execute E2E tests with Cypress, let me share some of the guidelines and best practices we learned and formulated towards happy path for developers and contributors, including test scripts as they develop features and fix bugs, and for quality assurance (QA) team to easily capture regressions during nightly build and release testing. 

##### 1. Reset before test
This is true both for server and user settings. In the past, we used to prepare test requirements in the test file only. During that time, changes in settings are easy to track and have minimal UI effect. However, it didn’t work well as we developed features and added more and more, and we were bitten many times by it. With that, we made sure in the “global before hook” that the server and user, specifically sysadmin, are in a predetermined state before testing.

##### 2. Isolate test
When using known test data like users, teams and channels, test cases are making changes to those test data and it is fine. However, it caused a lot of pain to prepare the state for the next test, so we decided to prevent sharing test data per test file by using a convenient custom command: cy.apiInitSetup. Such command automatically creates test data with the typical use of:

```javascript
cy.apiInitSetup({loginAfter: true}).then(({team}) => {
    cy.visit(`/${team.name}/channels/town-square`);
});
```

##### 3. Organize custom commands
Cypress custom commands are beneficial for automating a workflow that is repeated in tests over and over again. You may use it to override or extend the behaviour of built-in commands or to create a new one and take advantage of Cypress internals it comes with. However, it can get easily out of control, hard to discover, and hard to avoid adding similar or duplicate commands. As of this writing, we have almost 200 commands and the following guidelines helped us level up organizing properly:
- Standard naming convention - by adding prefix to denote something. Ex. `cy.apiLogin(user)` means user login is done directly via REST API, or `cy.uiChangeMessageDisplaySetting(display)` means changing message display setting is done via UI workflow.
- Make it discoverable thru autocompletion and intellisense - by adding type definitions for each custom commands with comments for in-code documentation.
- Do specific things as the name suggests.
- Organize by folder and file - especially with the bulk of API commands where we structured based on how the API reference is set up.

##### 4. Be explicit in the test block
Classic examples are user login or URL redirection which were previously done in places like custom commands or helper functions located in a separate file. Instead, such actions should be done explicitly in the test block itself. This is to easily follow the workflow and to avoid surprises on why a page suddenly redirected into an unexpected URL or a client session has been removed or replaced by another user.

##### 5. Avoid dependency of test block from another test block
In cases where a test file has several test blocks, each test block or `it()` should be independent from each other. Appending exclusivity (`.only()`) or inclusivity (`.skip`) should work normally and should not rely on state generated from other tests. It will make individual test verification faster and deterministic. Cypress has a section that explains it in detail.

##### 6. Avoid nested blocks
This is specifically about the `describe` block which is used for grouping tests. It’s good to arrange this way when your tests run in a happy path where all the tests are passing. Even with a failing test, it might still be good to arrange this way when all of the nested blocks don’t have any hook, as it may run the tests and execute continuously from start to finish. On the other hand, the nightmare happens when some or all of the nested blocks have hooks and the assertion fails on it. The effect to succeeding tests is either automatically skipped or may fail due to an unexpected state. It’s a trade-off between readability and organization against maintainability and a chance to run each test as much as possible.

##### 7. Avoid unnecessary waiting
Cypress has a section that explains it in detail and lists workarounds when you find yourself needing it. Explicit wait makes the test flaky or longer than usual. On top of what was explained, we’re using cypress-wait-until under the hood that makes it easier to wait for a certain subject. You’ll find custom commands like `cy.uiWaitUntilMessagePostedIncludes` which is sometimes used to wait for a system message to get posted before making an assertion. 

##### 8. Add comments for each action and verification
During pull request (PR) review, test script is normally reviewed by technical (developer) and non-technical (QA analyst) staff. Though the code is readable and comprehensible, the convention for adding comments helps everyone align on what is going on in the test script. The non-technical staff could easily verify whether the written test script corresponds to the actual test case without trying to get around within the code itself.

##### 9. Selectively run tests based on metadata
There are cases where we don’t need to run the entire test suite. Test environment, browser or release version might not be supported by a certain test case. Unfortunately, Cypress doesn’t have this capability. With that, we implemented a node script so we can run tests selectively. Once the test “metadata”, as we call it, is set up, simply initiating `node run_tests.js --stage='@prod' --group='@accessibility` will run production tests for accessibility groups.

For sure, there are lots of best practices out there which are not mentioned here but I hope it helps anyone reading this, especially for those who want to get started with Cypress or set up an Automated UI Testing in general.

#### Conclusion
The setbacks and hurdles we experienced are not necessarily limitations in the Cypress test framework, but manageable through organization and best practices. We are glad to have it as part of our Automated UI testing and very much thankful to Cypress for creating a tool that helps make writing E2E enjoyable.

Finally, I’d like to thank all the contributors who shaped and helped set up our E2E and put us where we are today.

__All-time E2E contributors (as of this writing):__
Saturnino Abril (160), Joseph Baylon (68), Rohitesh Gupta (49), Bob Lubecker (32), Daniel Espino García (24), Harrison Healey (14), Martin Kraft (11), Md Zubair Ahmed (11), Vladimir Lebedev (11), Hossein Ahmadian-Yazdi (10), Farhan Munshi (7), sij507 (7), Sudheer (7), Abraham Arias (6), Jesse Hallam (6), Abdulrahman (Abdu) Assabri (5), Alejandro García Montoro (5), Devin Binnie (5), Eli Yukelzon (5), Guillermo Vayá (5), Scott Bishel (5), Prapti (4), Adzim Zul Fahmi (3), Allen Lai (3), Arjun Lather (3), Brad Coughlin (3), Claudio Costa (3), Marc Argent (3), Mario de Frutos Dieguez (3), Romain Maneschi (3), Sapna Sivakumar (3), Tsilavina Razafinirina (3), Valentijn Nieman (3), VishalSwarnkar (3), Anindita Basu (2), Asaad Mahmood (2), Ben Schumacher (2), catalintomai (2), Clare So (2), Cooper Trowbridge (2), Courtney Pattison (2), d28park (2), Jesús Espino (2), Jonathan Rigsby (2), kosgrz (2), lawikip (2), oliverJurgen (2), Soo Hwan Kim (2), VolatianaYuliana (2), Agniva De Sarker (1), Andre Vasconcelos (1), bnoggle (1), Brad Angelcyk (1), cdncat (1), Christopher Poile (1), Clément Collin (1), composednitin (1), David Janda (1), Donald Feury (1), Hyeseong Kim (1), Jorde G (1), Kelvin Tan YB (1), m3phistopheles (1), Maria A Nunez (1), Matthew Shirley (1), Md_ZubairAhmed (1), metanerd (1), Miguel Alatzar (1), NiroshaV (1), Patrick Kang (1), Pradeep Murugesan (1), Rob Stringer (1), Sam Wolfs (1), Shota Gvinepadze (1), sourabkumarkeshri (1), syuo7 (1), Takatoshi Iwasa (1), Tomas Hnat (1), Walmyr (1), 興怡 (1)
