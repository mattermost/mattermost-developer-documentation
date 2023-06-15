---
title: "Developer setup"
heading: "Set up your development environment"
description: "Find out how to set up your development environment for building, running, and testing Mattermost."
weight: 1
aliases:
  - /contribute/server/developer-setup
  - /contribute/more-info/server/developer-setup/
  - /contribute/more-info/webapp/developer-setup/
---

Set up your development environment for building, running, and testing Mattermost.

{{<note "Note:">}}
If you're migrating from before the monorepo see the [migration notes]({{< ref "/contribute/monorepo-migration-notes" >}}).
{{</note>}}

{{<note "Note:">}}
If you're developing plugins, see the plugin [developer setup]({{< ref "/integrate/plugins/developer-setup" >}}) documentation.
{{</note>}}

# Setup the Mattermost Server

1. Install [Docker](https://www.docker.com/).

1. Install [Go](https://go.dev/).

1. Increase the number of available file descriptors. Update your shell's initialization script (e.g. `.bashrc` or `.zshrc`), and add the following:

    ```sh
    ulimit -n 8096
    ```
1. Install NVM and use it to install the required version of Node.js:

    - First, install {{< newtabref href="https://github.com/nvm-sh/nvm" title="NVM" >}} by following {{< newtabref href="https://github.com/nvm-sh/nvm#installing-and-updating" title="these instructions" >}}.

    - Then, use NVM to install the correct version of Node.js for the Mattermost web app:
        ```sh
        nvm install
        ```

1. If you don't have it already, install libpng with your preferred package manager.

1. Fork https://github.com/mattermost/mattermost.

1. Clone the Mattermost source code from your fork:

    ```sh
    git clone https://github.com/YOUR_GITHUB_USERNAME/mattermost-server.git
    ```

1. Start the server:

    ```sh
    cd server
    make run-server
    ```


1. Test your environment:

    ```sh
    curl http://localhost:8065/api/v4/system/ping
    ```

    If successful, the `curl` step will return a JSON object:
    ```json
    {"AndroidLatestVersion":"","AndroidMinVersion":"","DesktopLatestVersion":"","DesktopMinVersion":"","IosLatestVersion":"","IosMinVersion":"","status":"OK"}
    ```

1. Run the webapp and watch:

    ```sh
    make run
    ```

1. Stop the server:

    ```sh
    make stop-server
    ```

    The `stop-server` make target does not stop all the docker containers started by `run-server`. To stop the running docker containers:

    ```sh
    make stop-docker
    ```

1. Set your options:

    Some behaviors can be customized such as running the server in the foreground as described in the `config.mk` file in the server directory. See that file for details.
