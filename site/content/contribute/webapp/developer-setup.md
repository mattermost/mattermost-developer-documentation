---
title: "Developer Setup"
date: 2017-08-20T11:35:32-04:00
weight: 2
subsection: Web App
---

Set up your development environment for building, running, and testing the Mattermost web app.

#### Prerequisites

1. Set up your [development environment for the Mattermost server](/contribute/server/developer-setup). 

2. Install dependencies

 - On Mac, use [Homebrew](https://brew.sh/) to install Node.js v10 and libpng:
 
    ```sh
    brew install node@10 libpng
    ```

 - For other platforms, install Node.js v10 from https://www.npmjs.com/get-npm.

#### Setup

1. Go to https://github.com/mattermost/mattermost-webapp and create a fork.

2. Clone the fork next to your mattermost-server directory, replacing `{yourgithubusername}` with your GitHub username:

    ```sh
    git clone https://github.com/{yourgithubusername}/mattermost-webapp.git $(go env GOPATH)/go/src/mattermost/mattermost-webapp
    ```

3. Link your server with the webapp:

    ```sh
    ln -s $(go env GOPATH)/src/github.com/mattermost/mattermost-webapp/dist $(go env GOPATH)/src/github.com/mattermost/mattermost-server/client
    ```

4. Test your environment:

    ```sh
    cd $(go env GOPATH)/go/src/mattermost/mattermost-webapp
    make test
    ```
