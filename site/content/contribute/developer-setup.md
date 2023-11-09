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

# Prerequisites for WSL Development Environment

1. [Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install) by running the following command as an administrator in PowerShell: `wsl --install`
2. [Install Docker Desktop for Windows](https://learn.microsoft.com/en-us/windows/wsl/tutorials/wsl-containers#install-docker-desktop) on your Windows machine. Alternatively, you can also [install](https://docs.docker.com/engine/install/) docker engine directly on your linux distribution.
3. Perform the rest of the operations (except Docker installation) within the WSL environment and not in Windows.

# Setup the Mattermost Server

1. Install `make`.
    - On Ubuntu, you can install `build essential` tools which will also take care of installing the `make`:

   ```sh
   sudo apt install build-essential
   ```

1. Install [Docker](https://www.docker.com/).

1. Install [Go](https://go.dev/).

1. Increase the number of available file descriptors. Update your shell's initialization script (e.g. `.bashrc` or `.zshrc`), and add the following:

    ```sh
    ulimit -n 8096
    ```
    
1. If you don't have it already, install libpng with your preferred package manager.

    - If you are on ARM based Mac, you'll need to install [Rosetta](https://support.apple.com/en-in/HT211861) to make `libpng` work. Rosetta can be installed by the following command-

        ```sh
        softwareupdate --install-rosetta
        ```

1. Fork https://github.com/mattermost/mattermost.

1. Clone the Mattermost source code from your fork:

    ```sh
    git clone https://github.com/YOUR_GITHUB_USERNAME/mattermost.git
    ```
    
1. Install NVM and use it to install the required version of Node.js:

    - First, install {{< newtabref href="https://github.com/nvm-sh/nvm" title="NVM" >}} by following {{< newtabref href="https://github.com/nvm-sh/nvm#installing-and-updating" title="these instructions" >}}.

    - Then, use NVM to install the correct version of Node.js for the Mattermost web app (this should be run within the `webapp` directory):
        ```sh
        nvm install
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
