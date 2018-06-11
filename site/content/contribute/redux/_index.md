---
title: "Mattermost Redux"
date: "2018-05-19T12:01:23-04:00"
section: "contribute"
---

# Mattermost Redux

The mattermost-redux library is the driver powering both the web app and React Native mobile apps. It does all the heavy lifting for logic, web utilties and application state. By separating out all of this logic in its own repository, we hope to minimize the amount of duplicated code between both of our apps, as well as any third party projects that wish to use similar functionality.

## Repository

https://github.com/mattermost/mattermost-redux

## Channel

https://pre-release.mattermost.com/core/channels/redux

## Help Wanted

[Find help wanted tickets here.](https://github.com/mattermost/mattermost-server/issues?q=is%3Aopen+is%3Aissue+label%3ARedux+label%3A%22Up+For+Grabs%22)

## Background reading

### Redux

Redux is a framework for storing and manipulating the data used for an application. It relies on having a single, read-only store of data that can only be changed by emitting "actions" that cause pure state changes. Because there's a single source for all data within the app, it is easy to keep the entire interface in sync with the data, and having the data be read-only makes it simple for components to know when to re-render in a performant way.

If you'd like to know more, check out these links:

* http://redux.js.org/
* https://www.youtube.com/playlist?list=PLoYCgNOIyGADILc3iUJzygCqC8Tt3bRXt

### Other important libraries

* [The Thunk middleware for Redux](https://github.com/gaearon/redux-thunk) is used to allow for asynchronous actions which are not supported by vanilla Redux. Thunk is used extensively when writing Redux actions in mattermost-redux, however it is fairly simple to grasp.
* [Reselect](https://github.com/reactjs/reselect) is a library for creating "selectors" which are helper functions to compute data from the Redux store in an efficient manner. You're most likely to need to use Reselect if you're adding new data to the Redux store. More information on how we use Reselect is available in the section on [selectors](/contribute/redux/selectors).
* [React Redux](https://github.com/reactjs/react-redux) is used to allow React components to more easily connect to the store in a React-friendly manner. More information on how we use React Redux is available in the section on [using Redux with React](/contribute/redux/react-redux).