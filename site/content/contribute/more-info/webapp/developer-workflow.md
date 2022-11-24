---
title: "Web app workflow"
heading: "Mattermost web app workflow"
description: "See what a general workflow for a Mattermost developer working on the mattermost-webapp repository looks like."
date: 2017-08-20T11:35:32-04:00
weight: 3
aliases:
  - /contribute/webapp/developer-workflow
---

If you haven't [set up your developer environment]({{< ref "/contribute/more-info/webapp/developer-setup" >}}), please do so before continuing with this section.

### Workflow

Here's a general workflow for a Mattermost developer working on the {{< newtabref href="https://github.com/mattermost/mattermost-webapp" title="mattermost-webapp" >}} repository:

1. Review the repository structure to familiarize yourself with the project.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/actions" title="./actions/" >}} contains {{< newtabref href="https://redux.js.org/" title="Redux" >}} actions which make up much of the view logic for the web app.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/components" title="./components/" >}} contains {{< newtabref href="https://reactjs.org/" title="React" >}} UI components and views.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/e2e" title="./e2e/" >}} contains end-to-end (E2E) tests writen using {{< newtabref href="https://www.cypress.io/" title="Cypress" >}} and {{< newtabref href="https://playwright.dev/" title="Playwright" >}}.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/i18n" title="./i18n/" >}} contains the localization files for the web app. Generally, only `i18n/en.json` is modified directly from this repo while other languages' translation files are updated using {{< newtabref href="https://translate.mattermost.com" title="Weblate" >}}.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/packages" title="./packages/" >}} holds subpackages used by the web app and related packages. See the README.md there for more information about its contents.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/packages/mattermost-redux" title="./packages/mattermost-redux" >}} holds mattermost-redux, a package containing much of the shared business logic for the web app.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/reducers" title="./reducers/" >}} contains {{< newtabref href="https://redux.js.org/" title="Redux" >}} reducers for view state.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/selectors" title="./selectors/" >}} contains {{< newtabref href="https://redux.js.org/" title="Redux" >}} selectors for view state.
    * {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/utils" title="./utils/" >}} holds many widely-used utility functions.
2. On your fork, create a feature branch for your changes. Name it `MM-$NUMBER_$DESCRIPTION` where `$NUMBER` is the {{< newtabref href="https://mattermost.atlassian.net" title="Jira" >}} ticket number you are working on and `$DESCRIPTION` is a short description of your changes. Example branch names are `MM-18150_plugin-panic-log` and `MM-22037_uppercase-email`. You can also use the name `GH-$NUMBER_$DESCRIPTION` for tickets come from {{< newtabref href="https://github.com/mattermost/mattermost-server/issues" title="GitHub Issues in the server repo" >}}.
3. Make the code changes required to complete your ticket, making sure to write or modify unit tests where appropriate. Use `make test` to run the unit tests.
4. To run your changes locally, you'll need to run both the client and server locally.
    
    The server and client can either be run together or separately as follows:

    * You can run both together by using `make run` from the server directory. Both server and web app will be run together and can be stopped by using `make stop`. If you run into problems getting the server running this way, you may want to consider running them separately in case the output from one is hiding errors from the other.
    * You can run the server independently by running `make run-server` from its directory and, using another terminal, you can run the web app by running `make run` from the web app directory. Each can be stopped by running `make stop-server` or `make stop` from their respective directories.

    Once you've done either of those, your server will be available at `http://localhost:8065` by default. Changes to the web app will be built automatically, but changes to the server will only be applied if you restart the server by running `make restart-server` from the server directory.
5. If you added or changed any strings you will need to run `make i18n-extract` to update `i18n/en.json`. Remember to double check that any newly added strings have the correct values in case they weren't detected correctly.
6. Before submitting a PR, make sure to check your coding style and run the automated tests on your changes. This can be done by using `make check-style` to check the code style, `make check-types` to run the type checker, and `make test` to run the unit tests.
7. Commit your changes, push your branch and {{< newtabref href="https://developers.mattermost.com/blog/submitting-great-prs/" title="create a pull request" >}}.
8. Respond to feedback on your pull request and make changes as necessary by committing to your branch and pushing it. Your branch should be kept roughly up to date by {{< newtabref href="https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merging" title="merging" >}} master into it periodically. This can either be done using {{< newtabref href="https://git-scm.com/docs/git-merge" title="`git merge`" >}} or, as long as there are no conflicts, by commenting `/update-branch` on the PR.
9. That's it! Rejoice that you've helped make Mattermost better.

### Useful Mattermost commands

During development you may want to reset the database and generate random data for testing your changes. See [the corresponding section of the server developer workflow]({{< ref "/contribute/more-info/server/developer-workflow#useful-mattermost-commands" >}}) for how to do that.
