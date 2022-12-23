---
title: "Redux"
heading: "Mattermost-Redux"
description: "mattermost-redux is a library that contains logic for loading and working with data from the Mattermost server."
date: "2020-04-01T12:00:00-04:00"
weight: 8
aliases:
  - /contribute/webapp/redux
---

{{<newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/packages/mattermost-redux" title="mattermost-redux" >}} is a library that contains logic for loading and working with data from the Mattermost server. It's currently used primarily by the Mattermost web app and by some plugins, and it was previously used by the Mattermost mobile app. You can access the repository {{<newtabref href="https://github.com/mattermost/mattermost-webapp/tree/master/packages/mattermost-redux" title="here">}}, and discuss mattermost-redux in this {{<newtabref href="https://community.mattermost.com/core/channels/redux" title="Mattermost community channel">}}.

{{<note "Note:">}}
As part of our current effort to turn {{< newtabref href="https://github.com/mattermost/mattermost-webapp" title="the mattermost-webapp repository" >}} into a monorepo, we are also re-evaluating the purpose of mattermost-redux and how we can better expose its functionality for use in third party integrations. The structure of the library and what it exposes for integrations may change over time because of this.
{{</note>}}

### Folder structure

The `mattermost-redux` project consists of the following folders:

- `src` contains all the source code that is compiled and shipped with the library.
    - `src/actions` contains the Redux actions used by the library. Most of the logic that uses the stored data and contacts the server is located here.
    - `src/client` contains the JavaScript drivers to communicate with the Mattermost server via HTTP and WebSockets.
    - `src/reducers` contains the Redux reducers that handle actions and use them to update the stored data.
    - `src/selectors` contains the selectors used to compute data from the store or to just access it more easily.
    - `src/store` contains the setup code for the Redux store that can be extended by applications that use this library.
    - `src/utils` contains utility functions.
- `test` contains unit testing utilities. Actual unit tests are located in the same folder of the file being tested. For more information on unit and E2E tests concerning Redux, check out [Redux Unit and E2E Testing]({{<relref "/contribute/more-info/webapp/redux/testing.md">}}).
