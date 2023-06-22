---
title: "Web app"
heading: "Contribute to the Mattermost web app"
description: "The Mattermost web app is written in JavaScript using React and Redux."
date: "2018-03-19T12:01:23-04:00"
weight: 1
aliases:
  - /contribute/webapp
---

The Mattermost web app is written in JavaScript using {{< newtabref href="https://facebook.github.io/react/" title="React" >}} and {{< newtabref href="https://redux.js.org/" title="Redux" >}}.

## Repository

It is located in the `webapp` directory of the {{< newtabref href="https://github.com/mattermost/mattermost" title="main Mattermost repository" >}}.

https://github.com/mattermost/mattermost/tree/master/webapp

## Help Wanted

{{< newtabref href="https://mattermost.com/pl/help-wanted-mattermost-webapp/" title="Find help wanted tickets here" >}}.

## Package structure

The web app is set up as a monorepo which has the code broken up into multiple packages. The main packages in the web app are:

* `boards` - The Boards section of the app. It was previously located at https://github.com/mattermost/focalboard/.
* `channels` - The main web app which contains Channels, the System Console, login/signup pages, and most of the core infrastructure for the app. It was previously located at https://github.com/mattermost/mattermost-webapp/.
* `platform` - Packages used by the web app and related projects
    * `client` - The JavaScript client for Mattermost's REST API, available on NPM as {{< newtabref href="https://www.npmjs.com/package/@mattermost/client" title="@mattermost/client" >}}
    * `components` - A work-in-progress package containing UI components designed to be used by different parts of Mattermost
    * `types` - The TypeScript types used by Mattermost, available on NPM as {{< newtabref href="https://www.npmjs.com/package/@mattermost/types" title="@mattermost/types" >}}
* `playbooks` - The Playbooks section of the app. It was previously located at https://github.com/mattermost/mattermost-plugin-playbooks/.

