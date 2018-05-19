---
title: "Server Workflow"
date: 2017-08-20T11:35:32-04:00
weight: 3
subsection: Server
---

# Server Workflow

If you haven't [set up your developer environment](https://docs.mattermost.com/developer/dev-setup.html), please do so before continuing with this section.

Come [join our "Contributors" community channel](https://pre-release.mattermost.com/core/channels/tickets) on our daily build server, where you can discuss questions with community members and the Mattermost core team. Join our ["Developers" channel](https://pre-release.mattermost.com/core/channels/developers) for technical discussions and our ["Integrations" channel](https://pre-release.mattermost.com/core/channels/integrations) for all integrations and plugins discussions.

### Workflow ###

Here's a general workflow a Mattermost developer working on the [mattermost-server](https://github.com/mattermost/mattermost-server) repository:

1. Take a look at the [Repository structure](https://docs.mattermost.com/developer/developer-flow.html#repository-structure) to find out where to look for what you're working on.
2. On your fork, create a branch `MM-####` where #### is the ticket number if it is a [Jira](https://mattermost.atlassian.net) ticket, or `GH-####` if it is a GitHub Issue without a Jira ticket.
3. Make the code changes required to complete your ticket, making sure to write or modify unit tests where appropriate.
4. To test your changes, run `make run` from the root directory of the server respository. This will start up the server and a watcher process that will build any changes to the client as you make them. To get changes to the server it must be restarted with `make restart-server`. Your server will be running at `http://localhost:8065`.
5. Once everything works to meet the ticket requirements, stop Mattermost by running `make stop` in the server repository, then run `make check-style` to check your syntax and `make test` to run the tests.
6. Commit your changes, push your branch and [create a pull request](https://docs.mattermost.com/developer/contribution-guide.html#preparing-a-pull-request).
7. Respond to feedback on your pull request and make changes as necessary by commiting to your branch and pushing it. You might need to [rebase your changes](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) if another pull request creates conflicts.
8. That's it! Rejoice that you've helped make Mattermost better.

### Useful server Makefile commands ###

Some other `make` commands that might be useful in addition to the ones mentioned above:

* `make run-server` will run only the server and not the client
* `make clean-docker` stops and removes your Docker images and is a good way to wipe your database
* `make run-fullmap` will run the server and build the client with the full source map for easier debugging
* `make clean` cleans your local environment of temporary files
* `make nuke` wipes your local environment back to a completely fresh start

### Running only specific server unit tests ###

Since running every single unit test takes a lot of time while making changes, you can run a subset of the serverside unit tests by using the following:
```
go test -v -run='<test name or regex>' ./<package containing test>
```
For example, if you wanted to run `TestPostUpdate` in `api/post_test.go`, you would run the following:
```
go test -v -run='TestPostUpdate' ./api
```

### Useful platform commands ###

During development you may want to reset the database and generate random data for testing your changes. For this purpose, Mattermost has the following commands in the platform CLI:

You can reset your database to the initial state using:
```
platform reset
```

After that, you can generate random data to populate the Mattermost database using:
```
platform sampledata
```

### Repository structure ###

For server work, you'll be working in the [server repository](https://github.com/mattermost/mattermost-server).
 * [./api/](https://github.com/mattermost/mattermost-server/tree/master/api) holds all API and application related code
 * [./model/](https://github.com/mattermost/mattermost-server/tree/master/model) holds all data model definitions and the Go driver
 * [./store/](https://github.com/mattermost/mattermost-server/tree/master/store) holds all database querying code
 * [./utils/](https://github.com/mattermost/mattermost-server/tree/master/utils) holds all utilities, such as the mail utility
 * [./i18n/](https://github.com/mattermost/mattermost-server/tree/master/i18n) holds all localization files for the server
 
