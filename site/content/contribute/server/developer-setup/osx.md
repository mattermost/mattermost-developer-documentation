1. Install and configure Docker CE: https://docs.docker.com/docker-for-mac/.

2. Add `dockerhost` as an alias for `127.0.0.1` for use by various Mattermost build scripts:

   * Edit `/etc/hosts` file as an administrator (e.g. `sudo`) and add the following line:

        ```sh
        127.0.0.1    dockerhost
        ```

2. Download and install homebrew: https://brew.sh/.

3. Install Go:
    ```sh
    brew install go
    ```

4. Update your shell's initialization script (e.g. `.bashrc` or `.zshrc`) and add the following:

    ```sh
    export GOPATH=$HOME/go
    export PATH=$PATH:$GOPATH/bin
    ulimit -n 8096
    ```

5. Re-source your shell's initialization script to update `GOPATH` and `PATH` in your current shell:

    ```sh
    source $HOME/.bashrc
    ```

6. Fork https://github.com/mattermost/mattermost-server

7. Clone the Mattermost source code from your fork:

    ```sh
    export GITHUB_USERNAME=my_username
    mkdir -p $(go env GOPATH)/src/github.com/mattermost
    git clone https://github.com/$GITHUB_USERNAME/mattermost-server.git $(go env GOPATH)/src/github.com/mattermost/mattermost-server
    ```

8. Start the server and test your environment:

    ```sh
    cd $(go env GOPATH)/src/github.com/mattermost/mattermost-server
    make run-server
    curl http://localhost:8065/api/v4/system/ping
    make stop-server
    ```

    If successful, the `curl` step will return a JSON object:
    ```json
    {"AndroidLatestVersion":"","AndroidMinVersion":"","DesktopLatestVersion":"","DesktopMinVersion":"","IosLatestVersion":"","IosMinVersion":"","status":"OK"}
    ```

    **Note:** Browsing directly to http://localhost:8065/ will display a `404 Not Found` until the web app is configured. See [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for additional setup.
