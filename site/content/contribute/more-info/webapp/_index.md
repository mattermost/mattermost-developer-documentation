---
title: "Web app"
heading: "Contribute to the Mattermost web app"
description: "The Mattermost web app is written in JavaScript using React and Redux and is powered by mattermost-redux."
date: "2018-03-19T12:01:23-04:00"
weight: 1
aliases:
  - /contribute/webapp
---

The Mattermost web app is written in JavaScript using {{< newtabref href="https://facebook.github.io/react/" title="React" >}} and {{< newtabref href="https://redux.js.org/" title="Redux" >}}.

It is powered by [mattermost-redux]({{< ref "/contribute/more-info/webapp/redux" >}}) which handles the majority of the logic, client-side storage and server communication.

Please note that issues associated with the Mattermost web app are found only in the {{< newtabref href="https://github.com/mattermost/mattermost-server" title="Mattermost Server repo" >}}
## Repository

https://github.com/mattermost/mattermost-webapp

## Help Wanted

{{< newtabref href="https://mattermost.com/pl/help-wanted-mattermost-webapp/" title="Find help wanted tickets here." >}}

## Folder Structure

The main directories are:

* `actions` - Redux action creators and other view logic
* `components` - React UI components
* `e2e` - End-to-end tests for the web app
* `i18n` - Localization files and utilities
* `packages` - Subpackages used by the web app and related projects, including {{< newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/packages/mattermost-redux" title="mattermost-redux" >}}
* `plugins` - Plugin utilities, documentation and components
* `reducers` - Web app specific Redux reducers
* `selectors` - Web app specific Redux selectors
* `tests` - Unit and component tests
* `utils` - General utilities and constants
