---
title: "Developer Setup"
description: "Find out how to configure your development environment to build, run, and test the Mattermost web app."
date: 2017-08-20T11:35:32-04:00
weight: 2
---

Set up your development environment for building, running, and testing the Mattermost web app.

1. Set up your [development environment for the Mattermost server](/contribute/server/developer-setup/).

2. Install Node.js 16:

    - If you use [NVM](https://github.com/nvm-sh/nvm), use that to install Node 16.

    - On Mac, use [Homebrew](https://brew.sh/) to install it:

        ```sh
        brew install node@16
        ```

    - For other platforms, install it from https://www.npmjs.com/get-npm.

3. If necessary, install libpng:

    - On Mac, use [Homebrew](https://brew.sh/) to install it:

        ```sh
        brew install libpng
        ```

    - On Linux-based operating systems, use your preferred package manager to install it.

4. Fork https://github.com/mattermost/mattermost-webapp

5. Clone the Mattermost source code from your fork next to your mattermost-server directory:

    ```sh
    git clone https://github.com/$GITHUB_USERNAME/mattermost-webapp.git
    ```

6. Link the `client` directory in your server with the `dist` directory in your webapp:

    ```sh
    mkdir -p mattermost-webapp/dist
    cd mattermost-server
    ln -nfs ../mattermost-webapp/dist client
    cd ..
    ```

7. Test your environment:

    ```sh
    cd mattermost-webapp
    make test
    ```

8. When tests pass, run the app:

     ```sh
    make run
    ```

    Refreshing http://localhost:8065 should now load the UI.

    If you would like the webapp to automatically refresh as you edit the source code you can install and enable the live reload script injection extension for your web browser ([Chrome](https://chrome.google.com/webstore/detail/remotelivereload/jlppknnillhjgiengoigajegdpieppei/related?hl=en) | [Firefox](https://addons.mozilla.org/en-US/firefox/addon/livereload-web-extension/)). Then, before running webpack run:

    ```sh
    export MM_LIVE_RELOAD=true
    ```
