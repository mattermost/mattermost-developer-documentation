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

 - Prefer to use [NVM](https://github.com/nvm-sh/nvm) to manage different versions of Node on a given machine? Ensure you're running Node v10.15.3+ and npm v6.4.1+ to [avoid compatability-related Jest test failures](/contribute/webapp/unit-testing/#4-getting-jest-assertion-failures-at-lines-containing-expect-tobecalledwith-expect-tohavebeennthcalledwith-or-expect-tohavebeencalledtimes-when-running-make-test).

3. Fork https://github.com/mattermost/mattermost-webapp

4. Clone the Mattermost source code from your fork next to your mattermost-server directory:

    ```sh
    export GITHUB_USERNAME=my_username
    mkdir -p $(go env GOPATH)/src/github.com/mattermost
    git clone https://github.com/$GITHUB_USERNAME/mattermost-webapp.git $(go env GOPATH)/src/github.com/mattermost/mattermost-webapp
    ```

5. Link the `client` directory in your server with the `dist` directory in your webapp:

    ```sh
    ln -nfs $(go env GOPATH)/src/github.com/mattermost/mattermost-webapp/dist $(go env GOPATH)/src/github.com/mattermost/mattermost-server/client
    ```

6. Test your environment:

    ```sh
    cd $(go env GOPATH)/src/github.com/mattermost/mattermost-webapp
    make test
    ```

7. (Optional) Enable live reload functionality to refresh the webapp as you edit the source code. First, install and enable live reload script injection extension for your web browser ([Chrome](https://chrome.google.com/webstore/detail/remotelivereload/jlppknnillhjgiengoigajegdpieppei/related?hl=en) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/livereload-web-extension/)), then run (before running webpack):

    ```sh
    export MM_LIVE_RELOAD=true
    ```    
