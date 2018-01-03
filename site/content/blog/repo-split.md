---
draft: true
title: "Platform Repository Splitting"
date: 2017-09-04T11:09:47-04:00
categories:
  - "announcement"
tags:
  - "example"
---

A reminder that Mattermost will be separating the `/platform` repo into two repositories on September 6th:

* a new repository for webapp client code, hosted at github.com/mattermost/mattermost-webapp
* existing repository (`/platform`) renamed to `/mattermost-server`, containing the server code.

### Why the change?
Separates PRs for client and server with better naming conventions. This is similar to [React Native](https://github.com/mattermost/mattermost-mobile) and [Redux](https://github.com/mattermost/mattermost-redux) repositories and helps us:

* work on one part of the system (webapp/server) without worrying about the other.
* review PRs more easily as the webapp/server code is logically separated.

It's also the first step towards de-coupling UI versions from the server, similar to the React Native apps, and helps model the architecture we want to achieve for the server.

### How does this affect me?
Foremost, build process is not affected for most, with `make run` working as expected. Some webapp-related make commands will be removed from the server repo. Type `make help` to see the availalble commands. There may however be some canges to the build process, which we'll announce closer to September 6th.

Those running private forks would need to separate their server and webapp code after 4.2 is branched, and mimic what we'll do when we split the platform repo. A doc with tips and best practices will be prepared to help with the transition.

Finally, those with work-in-progress PRs on September 6th may need to re-submit their pull request after the separation. For instance, PRs changing the UI would need to be re-submitted to the new `mattermost-webapp` repository.

### Questions?
Respond to our [forum post](https://forum.mattermost.org/t/mattermost-separating-platform-into-two-repositories-on-september-6th/3708) or to our [post in the Developers channel](https://pre-release.mattermost.com/core/pl/e9d7rjq993yptryesd5ppe37sa).
