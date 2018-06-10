---
title: "Web App"
date: "2018-07-19T12:01:23-04:00"
section: "contribute"
---

# Web App

The Mattermost web app is written in JavaScript using [React](https://facebook.github.io/react/) and [Redux](http://redux.js.org/).

It is powered by [mattermost-redux](/contribute/redux) which handles the majority of the logic, client-side storage and server communication.

## Repository

https://github.com/mattermost/mattermost-webapp

## Help Wanted

[Find help wanted tickets here.](https://github.com/mattermost/mattermost-server/issues?q=is%3Aopen+is%3Aissue+label%3AReactJS+label%3A%22Up+For+Grabs%22)

## Folder Structure

The main directories are:

* `actions` - Redux action creators and other logic actions
* `components` - React UI components
* `i18n` - Localization files and utilities
* `plugins` - Plugin utilities, documentation and components
* `reducers` - Web app specific Redux reducers
* `selectors` - Web app specific Redux selectors
* `tests` - Unit and component tests
* `utils` - General utilities and constants