---
title: "Web App Workflow"
heading: "Mattermost Web App Workflow"
description: "See what a general workflow for a Mattermost developer working on the mattermost-webapp repository looks like."
date: 2017-08-20T11:35:32-04:00
weight: 3
---

If you haven't [set up your developer environment](https://developers.mattermost.com/contribute/webapp/developer-setup/), please do so before continuing with this section.

### Workflow

Here's a general workflow for a Mattermost developer working on the [mattermost-webapp](https://github.com/mattermost/mattermost-webapp) repository:

1. Review the repository structure to familiarize yourself with the project.
    * [./actions/](https://github.com/mattermost/mattermost-webapp/tree/master/actions) contains [Redux](redux.js.org/) actions which make up much of the view logic for the web app.
    * [./components/](https://github.com/mattermost/mattermost-webapp/tree/master/components) contains [React](https://reactjs.org/) UI components and views.
    * [./e2e/](https://github.com/mattermost/mattermost-webapp/tree/master/e2e) contains end-to-end (E2E) tests writen using [Cypress](https://www.cypress.io/) and [Playwright](https://playwright.dev/).
    * [./i18n/](https://github.com/mattermost/mattermost-webapp/tree/master/i18n) contains the localization files for the web app. Generally, only `i18n/en.json` is modified directly from this repo while other languages' translation files are updated using [Weblate](https://translate.mattermost.com).
    * [./packages/](https://github.com/mattermost/mattermost-webapp/tree/master/packages) holds subpackages used by the web app and related packages. See the README.md there for more information about its contents.
    * [./packages/mattermost-redux](https://github.com/mattermost/mattermost-webapp/tree/master/packages/mattermost-redux) holds mattermost-redux, a package containing much of the shared business logic for the web app.
    * [./reducers/](https://github.com/mattermost/mattermost-webapp/tree/master/reducers) contains [Redux](https://redux.js.org/) reducers for view state.
    * [./selectors/](https://github.com/mattermost/mattermost-webapp/tree/master/selectors) contains [Redux](https://redux.js.org/) selectors for view state.
    * [./utils/](https://github.com/mattermost/mattermost-webapp/tree/master/utils) holds many widely-used utility functions.
2. On your fork, create a feature branch for your changes. Name it `MM-$NUMBER_$DESCRIPTION` where `$NUMBER` is the [Jira](https://mattermost.atlassian.net) ticket number you are working on and `$DESCRIPTION` is a short description of your changes. Example branch names are `MM-18150_plugin-panic-log` and `MM-22037_uppercase-email`. You can also use the name `GH-$NUMBER_$DESCRIPTION` for tickets come from [GitHub Issues in the server repo](https://github.com/mattermost/mattermost-server/issues).
3. Make the code changes required to complete your ticket, making sure to write or modify unit tests where appropriate. Use `make test` to run the unit tests.
4. To run your changes locally, you'll need to run both the client and server locally.
    
    The server and client can either be run together or separately as follows:

    * You can run both together by using `make run` from the server directory. Both server and web app will be run together and can be stopped by using `make stop`. If you run into problems getting the server running this way, you may want to consider running them separately in case the output from one is hiding errors from the other.
    * You can run the server independently by running `make run-server` from its directory and, using another terminal, you can run the web app by running `make run` from the web app directory. Each can be stopped by running `make stop-server` or `make stop` from their respective directories.

    Once you've done either of those, your server will be available at `http://localhost:8065` by default. Changes to the web app will be built automatically, but changes to the server will only be applied if you restart the server by running `make restart-server` from the server directory.
5. If you added or changed any strings you will need to run `make i18n-extract` to update `i18n/en.json`. Remember to double check that any newly added strings have the correct values in case they weren't detected correctly.
6. Before submitting a PR, make sure to check your coding style and run the automated tests on your changes. This can be done by using `make check-style` to check the code style, `make check-types` to run the type checker, and `make test` to run the unit tests.
7. Commit your changes, push your branch and [create a pull request](https://developers.mattermost.com/blog/submitting-great-prs/).
8. Respond to feedback on your pull request and make changes as necessary by committing to your branch and pushing it. Your branch should be kept roughly up to date by [merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging#_basic_merging) master into it periodically. This can either be done using [`git merge`](https://git-scm.com/docs/git-merge) or, as long as there are no conflicts, by commenting `/update-branch` on the PR.
9. That's it! Rejoice that you've helped make Mattermost better.

### Useful Mattermost Commands

During development you may want to reset the database and generate random data for testing your changes. See [the corresponding section of the server developer workflow](https://developers.mattermost.com/contribute/server/developer-workflow/#useful-mattermost-commands) for how to do that.
