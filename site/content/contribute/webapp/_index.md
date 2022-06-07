---
title: "Web App"
heading: "Contribute to the Mattermost Web App"
description: "The Mattermost web app is written in JavaScript using React and Redux and is powered by mattermost-redux."
date: "2018-03-19T12:01:23-04:00"
weight: 3
---

The Mattermost web app is written in JavaScript using [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/).

It is powered by [mattermost-redux](/contribute/redux/) which handles the majority of the logic, client-side storage and server communication.

## Repository

https://github.com/mattermost/mattermost-webapp

## Help Wanted

[Find help wanted tickets here.](https://mattermost.com/pl/help-wanted-mattermost-webapp/)

## Folder Structure

The main directories are:

* `actions` - Redux action creators and other view logic
* `components` - React UI components
* `e2e` - End-to-end tests for the web app
* `i18n` - Localization files and utilities
* `packages` - Subpackages used by the web app and related projects, including [mattermost-redux](https://github.com/mattermost/mattermost-webapp/tree/master/packages/mattermost-redux)
* `plugins` - Plugin utilities, documentation and components
* `reducers` - Web app specific Redux reducers
* `selectors` - Web app specific Redux selectors
* `tests` - Unit and component tests
* `utils` - General utilities and constants
