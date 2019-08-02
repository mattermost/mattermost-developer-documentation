---
title: "Server Workflow"
date: 2017-08-20T11:35:32-04:00
weight: 3
subsection: Server
---

If you haven't [set up your developer environment](https://developers.mattermost.com/contribute/server/developer-setup/), please do so before continuing with this section.

Join the [Developers community channel](https://community.mattermost.com/core/channels/developers) to ask questions from community members and the Mattermost core team.

### Workflow

Here's a general workflow a Mattermost developer working on the [mattermost-server](https://github.com/mattermost/mattermost-server) repository:

1. Review the repository structure to familiarize yourself with the project
    * [./api4/](https://github.com/mattermost/mattermost-server/tree/master/api4) holds all API and application related code
    * [./model/](https://github.com/mattermost/mattermost-server/tree/master/model) holds all data model definitions and the Go driver
    * [./store/](https://github.com/mattermost/mattermost-server/tree/master/store) holds all database querying code
    * [./utils/](https://github.com/mattermost/mattermost-server/tree/master/utils) holds all utilities, such as the mail utility
    * [./i18n/](https://github.com/mattermost/mattermost-server/tree/master/i18n) holds all localization files for the server
2. On your fork, create a branch `MM-####` where #### is the ticket number if it is a [Jira](https://mattermost.atlassian.net) ticket, or `GH-####` if it is a GitHub Issue without a Jira ticket.
3. Make the code changes required to complete your ticket, making sure to write or modify unit tests where appropriate. Make sure to use [testify](https://github.com/stretchr/testify) for new tests.
4. To test your changes, run `make run-server` from the root directory of the server respository. This will start up the server at `http://localhost:8065`. To get changes to the server it must be restarted with `make restart-server`. If you want to test with the web app, you may also run `make run` which will start the server and a watcher for changes to the web app.
5. Once everything works to meet the ticket requirements, stop Mattermost by running `make stop` in the server repository, then run `make check-style` to check your syntax and `make test` to run the tests.
6. Commit your changes, push your branch and [create a pull request](https://docs.mattermost.com/developer/contribution-guide.html#preparing-a-pull-request).
7. Respond to feedback on your pull request and make changes as necessary by commiting to your branch and pushing it. You might need to [rebase your changes](https://git-scm.com/book/en/v2/Git-Branching-Rebasing) if another pull request creates conflicts.
8. That's it! Rejoice that you've helped make Mattermost better.

### Useful server Makefile commands

Some useful `make` commands:

* `make run` will run the server, symlink your mattermost-webapp folder and start a watcher for the web app
* `make stop` stops the server and the web app watcher
* `make run-server` will run only the server and not the client
* `make debug-server` will run the server in the `delve` debugger
* `make stop-server` stops only the server
* `make clean-docker` stops and removes your Docker images and is a good way to wipe your database
* `make clean` cleans your local environment of temporary files
* `make nuke` wipes your local environment back to a completely fresh start
* `make package` creates packages for distributing your builds and puts them in the `~/go/src/github.com/mattermost/mattermost-server/dist` directory. First you will need to run `make build` and `make build-client`.
* `make megacheck` runs the tool [megacheck](https://github.com/dominikh/go-tools/tree/master/cmd/megacheck) against the code base to find potential issues in the code. Please note the results are guidelines, and not mandatory in all cases. If in doubt, ask in the [Developers community channel](https://community.mattermost.com/core/channels/developers).

### Running only specific server unit tests

Since running every single unit test takes a lot of time while making changes, you can run a subset of the serverside unit tests by using the following:

```
go test -v -run='<test name or regex>' ./<package containing test>
```

For example, if you wanted to run `TestUpdatePost` in `app/post_test.go`, you would run the following:

```
go test -v -run='TestUpdatePost' ./app
```

### Useful mattermost commands

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

You can create an account using the following command:

```
mattermost user create --email user@example.com --username test1 --password mypassword
```

Optionally, you can make that account a System Admin with the following command:

```
mattermost user create --email user@example.com --username test1 --password mypassword --system_admin
```

### Testing email notifications

When Docker starts, the SMTP server is available on port 2500. Username and password are not required.

You can access Inbucket webmail on port 9000.

For additional information on configuring an SMTP email server, including troubleshooting steps, see [https://docs.mattermost.com/install/smtp-email-setup.html](https://docs.mattermost.com/install/smtp-email-setup.html).

### Testing with GitLab Omnibus

To test a locally compiled version of Mattermost with GitLab Omnibus, replace the following GitLab files:

* The compiled `mattermost` binary in `/opt/gitlab/embedded/bin/mattermost`
* The assets (templates, i18n, fonts, webapp) in `/opt/gitlab/embedded/service/mattermost`
