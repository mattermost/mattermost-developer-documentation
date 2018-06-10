---
title: "Developer Setup"
date: 2017-08-20T11:35:32-04:00
weight: 2
subsection: Mattermost Redux
---

# Developer Setup

## Prerequisites
- Git

## Setup

1. Install [Node.js and npm](https://www.npmjs.com/get-npm).
2. Fork the repository at https://github.com/mattermost/mattermost-redux.
3. Clone your fork using the following command. If you have the [mattermost-webapp](/contribute/webapp) environment set up or are planning on setting it up, you would typically clone your copy to `$GOHOME/src/github.com/mattermost/mattermost-redux`.
    ```
    git clone https://github.com/<yourgithubusername>mattermost-redux
    ```

4. Run the tests to confirm everything is installed correctly. Doing this will also use npm to install any other required dependencies.
    ```
    cd mattermost-redux
    make test
    ```