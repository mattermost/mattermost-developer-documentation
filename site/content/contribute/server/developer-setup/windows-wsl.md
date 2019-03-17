This is an unofficial guide. Community testing, feedback and improvements are welcome and greatly appreciated.

1. Install the Windows Subsystem for Linux: https://docs.microsoft.com/en-us/windows/wsl/install-win10

2. Install and setup Docker:

    * Install Docker for Windows: https://docs.docker.com/docker-for-windows/
    * Link Windows Subsystem for Linux to Docker for Windows: https://medium.com/@sebagomez/installing-the-docker-client-on-ubuntus-windows-subsystem-for-linux-612b392a44c4.
        * You should end up with the Docker client running on Linux (WSL) sending commands to your Docker Engine daemon installed on Windows.

3. Add `dockerhost` as an alias for `127.0.0.1` for use by various Mattermost build scripts:

    * Edit `C:\Windows\System32\drivers\etc\hosts` file as an administrator and add the following line:

        ```sh
        127.0.0.1     dockerhost
        ```

4. Install Go (using bash):

    ```sh
    sudo apt-get install -y build-essential
    wget https://storage.googleapis.com/golang/go1.12.linux-amd64.tar.gz
    sudo tar -C /usr/local -xzf go1.12.linux-amd64.tar.gz
    ```

5. Set up your Go workspace:
    1. In PowerShell ``mkdir d:\Projects\go``
    2. In bash ``ln -s "/mnt/d/Projects/go" /home/<Linux User>/go``

6. Update your shell's initialization script (e.g. `.bashrc` or `.zshrc`) and add the following:

    ```sh
    export GOPATH=$HOME/go
    export PATH=$PATH:$GOPATH/bin
    export PATH=$PATH:/usr/local/go/bin
    ulimit -n 8096
    ```

7. Reload your bash configuration to effect the changes above:

    ```sh
    source ~/.bashrc
    ```

8. Fork Mattermost server on GitHub from https://github.com/mattermost/mattermost-server.

9. Clone the Mattermost source code from your fork:

    ```sh
    export GITHUB_USERNAME=my_username
    mkdir -p $(go env GOPATH)/src/github.com/mattermost
    git clone https://github.com/$GITHUB_USERNAME/mattermost-server.git $(go env GOPATH)/src/github.com/mattermost/mattermost-server
    ```

10. Start the server and test your environment:

    ```sh
    cd $(go env GOPATH)/src/github.com/mattermost/mattermost-server
    make run-server
    curl http://localhost:8065/api/v4/system/ping
    make stop-server
    ```

    If successful, the `curl` step will return a JSON object containing `"status":"OK"`.

    **Note:** Browsing directly to http://localhost:8065/ will display a `404 Not Found` until the web app is configured. See [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for additional setup.

### Troubleshooting:
1. If you see an error like `the input device is not a TTY.  If you are using mintty, try prefixing the command with 'winpty'`.  Reinstall git for windows and make sure you choose `Use Windows' default console window` instead of `Use MinTTY`
2. The LDAP docker container is sometimes slow to start. If you see the following message, either increase the wait time in the make file or run `make run` twice in a row.

    ```
    Ldap test user test.one
    starting mattermost-openldap
    ldap_sasl_bind(SIMPLE): Can't contact LDAP server (-1)
    ldap_sasl_bind(SIMPLE): Can't contact LDAP server (-1)
    ldap_sasl_bind(SIMPLE): Can't contact LDAP server (-1)
    ldap_sasl_bind(SIMPLE): Can't contact LDAP server (-1)
    ldap_sasl_bind(SIMPLE): Can't contact LDAP server (-1)
    ldap_sasl_bind(SIMPLE): Can't contact LDAP server (-1)
    Makefile:102: recipe for target 'start-docker' failed
    ```
