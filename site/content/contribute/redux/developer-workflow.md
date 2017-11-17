---
draft: true
title: "Developer Workflow"
date: 2017-08-20T11:35:32-04:00
weight: 3
subsection: "redux"
---

# Developer Workflow

The general workflow is pretty straight-forward: make your changes, write tests for them, submit a PR.

## Working with the Web App

If you're making changes in mattermost-redux for the benefit of the web app, you can run a watcher:

1. Set `export WEBAPP_DIR=/path/to/mattermost-webapp/` in your bash profile
2. Run `npm run dev:watch`

Any changes you make to mattermost-redux files will then automatically be dropped in the node_modules directory. If you're running the web app watcher, that will also see the changes and re-build automatically.

To build mattermost-redux into the web app node_modules without the watcher, run `npm run dev:watch`.

Once all your changes are complete, submit your pull request to the [mattermost-redux repository](https://github.com/mattermost/mattermost-redux). When that gets merged, submit a pull request containing your needed web app changes to the [mattermost-webapp repository](https://github.com/mattermost/mattermost-webapp), making sure to use `yarn` to point package.json to your mattermost-redux commit.
