---
title: "Developer Setup"
date: 2017-08-20T11:35:32-04:00
weight: 2
subsection: Web App
---

Set up your development environment for building, running, and testing the Mattermost web app.

1. Set up your [development environment for the Mattermost server](/contribute/server/developer-setup).

2. Install dependencies

 - On Mac, use [Homebrew](https://brew.sh/) to install Node.js v10 and libpng:

        ```sh
        brew install node@10 libpng
        ```

 - For other platforms, install Node.js v10 from https://www.npmjs.com/get-npm.

3. Fork https://github.com/mattermost/mattermost-webapp

5. Clone the Mattermost source code from your fork next to your mattermost-server directory:

    ```sh
    export GITHUB_USERNAME=my_username
    mkdir -p $(go env GOPATH)/src/github.com/mattermost
    git clone https://github.com/$GITHUB_USERNAME/mattermost-webapp.git $(go env GOPATH)/src/mattermost/mattermost-webapp
    ```

6. Link the `client` directory in your server with the `dist` directory in your webapp:

    ```sh
    ln -nfs $(go env GOPATH)/src/github.com/mattermost/mattermost-webapp/dist $(go env GOPATH)/src/github.com/mattermost/mattermost-server/client
    ```

7. Test your environment:

    ```sh
    cd $(go env GOPATH)/src/mattermost/mattermost-webapp
    make test
    ```
