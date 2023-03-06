---
title: "Developer setup"
heading: "Set up your development environment"
description: "Find out how to set up your development environment for building, running, and testing the Mattermost."
weight: 1
aliases:
  - /contribute/server/developer-setup
  - /contribute/more-info/server/developer-setup/
  - /contribute/more-info/webapp/developer-setup/
---

Set up your development environment for building, running, and testing the Mattermost.

{{<note "Warning" "icon-alert-outline">}}
During the move to the monorepo these instructions will be in flux. Follow https://github.com/mattermost/mattermost-server/issues/22420 for updates.
{{</note>}}

{{<note "Note:">}}
If you're developing plugins, see the plugin [developer setup]({{< ref "/integrate/plugins/developer-setup" >}}) documentation.
{{</note>}}

# Setup the Mattermost Server

1. Install [Docker](https://www.docker.com/)

2. Install [Go](https://go.dev/)

3. Increse the number of available file descriptors. Update your shell's initialization script (e.g. `.bashrc` or `.zshrc`) and add the following:

    ```sh
    ulimit -n 8096
    ```

5. Fork https://github.com/mattermost/mattermost-server

6. Clone the Mattermost source code from your fork:

    ```sh
    git clone https://github.com/YOUR_GITHUB_USERNAME/mattermost-server.git
    ```

7. Start the server:

    ```sh
    cd mattermost-server/server
    make run-server
    ```

8. Test your environment:

    ```sh
    curl http://localhost:8065/api/v4/system/ping
    ```

    If successful, the `curl` step will return a JSON object:
    ```json
    {"AndroidLatestVersion":"","AndroidMinVersion":"","DesktopLatestVersion":"","DesktopMinVersion":"","IosLatestVersion":"","IosMinVersion":"","status":"OK"}
    ```

9. Stop the server:

    ```sh
    make stop-server
    ```

    The `stop-server` make target does not stop all the docker containers started by `run-server`. To stop the running docker containers:

    ```sh
    make stop-docker
    ```

10. Set your options

    Some beahvours can be customized such as running the server in the foreground as described in the `config.mk` file. See that file for details.

# Setup the Mattermost webapp

1. Fork https://github.com/mattermost/mattermost-webapp

2. Clone the Mattermost source code from your fork:

    ```sh
    git clone https://github.com/YOUR_GITHUB_USERNAME/mattermost-webapp.git
    ```

3. Link the `client` directory in your server with the `dist` directory in your webapp:

    ```sh
    mkdir -p mattermost-webapp/dist
    cd mattermost-server
    ln -nfs ../mattermost-webapp/dist client
    cd ../mattermost-webapp
    ```

4. Install NVM and use it to install the required version of Node.js:

    - First, install {{< newtabref href="https://github.com/nvm-sh/nvm" title="NVM" >}} by following {{< newtabref href="https://github.com/nvm-sh/nvm#installing-and-updating" title="these instructions" >}}.

    - Then, use NVM to install the correct version of Node.js for the Mattermost web app:
        ```sh
        nvm install
        ```

5. If you don't have it already, install libpng:

6. Ensure the Mattermost server is running from the steps above.

7. Run the app:

    ```sh
    make run
    ```

8. Stop the app:

    ```sh
    make stop
    ```
