---
title: "Web App Workflow"
heading: "Mattermost Web App Workflow"
description: "See what a general workflow for a Mattermost developer working on the mattermost-webapp repository looks like."
date: 2017-08-20T11:35:32-04:00
weight: 3
---

If you haven't [set up your developer environment](https://developers.mattermost.com/contribute/webapp/developer-setup/), please do so before continuing with this section.

### Workflow ###

Here's a general workflow for a Mattermost developer working on the [mattermost-webapp](https://github.com/mattermost/mattermost-webapp) repository:

1. Review the repository structure to familiarize yourself with the project
    * [./components/](https://github.com/mattermost/mattermost-webapp/tree/master/components) holds all the [React](https://facebook.github.io/react/) UI components and views
    * [./actions/](https://github.com/mattermost/mattermost-webapp/tree/master/actions) holds all [Flux actions](https://facebook.github.io/flux/docs/in-depth-overview.html#content) where the majority of the logic of the webapp takes place
    * [./stores/](https://github.com/mattermost/mattermost-webapp/tree/master/stores) holds the stores responsible for storing and providing the views with data
    * [./i18n/](https://github.com/mattermost/mattermost-webapp/tree/master/i18n) holds the localization files for the client
    * [./utils/](https://github.com/mattermost/mattermost-webapp/tree/master/utils) holds all widely-used utilities
    * [./tests/](https://github.com/mattermost/mattermost-webapp/tree/master/tests) holds all the client unit tests
2. On your fork, create a feature branch for your changes. Name it `MM-$NUMBER_$DESCRIPTION` where `$NUMBER` is the [Jira](https://mattermost.atlassian.net) ticket number you are working on and `$DESCRIPTION` is a short description of your changes. Example branch names are `MM-18150_plugin-panic-log` and `MM-22037_uppercase-email`.
3. Make the code changes required to complete your ticket, making sure to write or modify unit tests where appropriate. Use `make test` to run the unit tests.
4. To test your changes, run `make run` from the root directory of the server repository. This will start up the server and a watcher process that will build any changes to the client as you make them. To get changes to the server it must be restarted with `make restart-server`. Your server will be running at `http://localhost:8065`.
5. If you added or changed any strings you will need to run `make i18n-extract`to generate the new/updated strings.
6. Once everything works to meet the ticket requirements, stop Mattermost by running `make stop` in the server repository, then run `make check-style` to check your syntax and `make test` to run the tests.
7. Commit your changes, push your branch and [create a pull request](https://developers.mattermost.com/blog/submitting-great-prs/).
8. Respond to feedback on your pull request and make changes as necessary by committing to your branch and pushing it. You might need to [rebase your changes](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) if another pull request creates conflicts.
9. That's it! Rejoice that you've helped make Mattermost better.

### Useful mattermost commands ###

During development you may want to reset the database and generate random data for testing your changes. For this purpose, Mattermost has the following commands in the mattermost CLI:

Install the server with `go install ./cmd/mattermost` in the server repository.

You can reset your database to the initial state using:
```
mattermost reset
```

After that, you can generate random data to populate the Mattermost database using:
```
mattermost sampledata
```
