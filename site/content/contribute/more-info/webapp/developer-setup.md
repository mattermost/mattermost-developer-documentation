---
title: "Developer setup"
description: "Find out how to configure your development environment to build, run, and test the Mattermost web app."
date: 2017-08-20T11:35:32-04:00
weight: 2
aliases:
  - /contribute/webapp/developer-setup
---

Set up your development environment for building, running, and testing the Mattermost web app.

1. Set up your [development environment for the Mattermost server]({{< ref "/contribute/more-info/server/developer-setup" >}}).

2. Fork `https://github.com/mattermost/mattermost-webapp`

3. Clone the Mattermost source code from your fork next to your mattermost-server directory:

    ```sh
    git clone https://github.com/$GITHUB_USERNAME/mattermost-webapp.git
    ```

4. Link the `client` directory in your server with the `dist` directory in your webapp:

    ```sh
    mkdir -p mattermost-webapp/dist
    cd mattermost-server
    ln -nfs ../mattermost-webapp/dist client
    cd ../mattermost-webapp
    ```

5. Install NVM and use it to install the required version of Node.js:

    - First, install [NVM](https://github.com/nvm-sh/nvm) by following [these instructions](https://github.com/nvm-sh/nvm#installing-and-updating).

    - Then, use NVM to install the correct version of Node.js for the Mattermost web app:
        ```sh
        nvm install
        ```

6. If you don't have it already, install libpng:

    - On Mac, use [Homebrew](https://brew.sh/) to install it:

        ```sh
        brew install libpng
        ```

    - On Linux-based operating systems, use your preferred package manager to install it.

7. Ensure that the mattermost server [is running]({{< ref "/contribute/more-info/server/developer-setup" >}}). If it's not, open a new terminal session, navigate into the `mattermost-server` directory, and start the server:

    ```sh
    cd mattermost-server
    make run-server
    ```

8. Test your environment:

    ```sh
    cd mattermost-webapp
    make test
    ```

9. When tests pass, run the app:

    ```sh
    make run
    ```

    Refreshing http://localhost:8065 should now load the UI.

    If you would like the webapp to automatically refresh as you edit the source code you can install and enable the live reload script injection extension for your web browser [![Chrome](https://img.shields.io/badge/Chrome-navy?\&style=plastic\&logo=googlechrome\&logoColor=4285F4)](https://chrome.google.com/webstore/detail/remotelivereload/jlppknnillhjgiengoigajegdpieppei/related?hl=en) | [![Firefox](https://img.shields.io/badge/Firefox-navy?\&style=plastic\&logo=firefoxbrowser\&logoColor=FF7139)](https://addons.mozilla.org/en-US/firefox/addon/livereload-web-extension/). Then, before running webpack run:

    ```sh
    export MM_LIVE_RELOAD=true
    ```
