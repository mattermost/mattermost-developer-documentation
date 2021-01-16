---
title: "Windows with WSL Development Environment Setup"
description: "Read about how to set up your developer environment in Mattermost using the Windows Subsystem for Linux."
---

This is an unofficial guide. Community testing, feedback, and improvements are welcome and greatly appreciated.

1. Install the Windows Subsystem for Linux: https://docs.microsoft.com/en-us/windows/wsl/install-win10.

      **Note:** Docker for Windows expects path to have the format `/c/foo/bar`, but WSL uses `/mnt/c/foo/bar` instead.
      
      Run `winver` and check which version of Windows you have. If you are using `1803` or higher, then you need to create a file `/etc/wsl.conf` with the following content to make sure your drives are mounted at the root rather than inside `/mnt`:
      
       [automount]
       root = /
       
      If you are using an older version than `1803`, you need to create custom bind points:
      
       sudo mkdir /c
       sudo mount --bind /mnt/c /c

      For more on how to properly set up Docker for Windows and WSL see [here](https://web.archive.org/web/20200402131133/https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly).

2. Install and set up Docker:

    * Install Docker for Windows: https://docs.docker.com/docker-for-windows/.
    * Link Windows Subsystem for Linux to Docker for Windows: https://medium.com/@sebagomez/installing-the-docker-client-on-ubuntus-windows-subsystem-for-linux-612b392a44c4.
        * You should end up with the Docker client running on Linux (WSL) sending commands to your Docker Engine daemon installed on Windows.
    * Go to **Docker Desktop > Settings > Resources > File Sharing** and make sure you check the drives where you are going to run `mattermost-server` from.

    **Note:** [MM-9791](https://github.com/mattermost/mattermost-server/pull/10872) introduced using [docker-compose](https://docs.docker.com/compose/) to manage containers. To preserve your data on upgrade, execute the following steps.

    First, backup from any existing containers:
    ```sh
    mysqldump -h 127.0.0.1 --column-statistics=0 -u mmuser -p mattermost_test > mm_mysql_backup.sql
    pg_dump -U mmuser -W -d mattermost_test -h 127.0.0.1 > mm_postgres_backup.bak
    ```
    Then after upgrading and starting the new docker-compose managed containers, restore the data:
    ```sh
    mysql -u mmuser -p -h 127.0.0.1 mattermost_test < mm_mysql_backup.sql
    psql -U mmuser -W -h 127.0.0.1 -f mm_postgres_backup.bak mattermost_test
    ```
    If you don't migrate your data, the new, docker-compose-managed containers will start out empty. To remove the old containers and destroy any existing data use `make clean-old-docker`.

3. Install docker-compose (using bash)

    ```sh
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

3. Install Go using bash (modify installation to latest Go version from https://golang.org/dl/):

    ```sh
    sudo apt-get install -y build-essential
    sudo rm -rf /usr/local/go
    wget https://dl.google.com/go/go$VERSION.$OS-$ARCH.tar.gz
    sudo tar -C /usr/local -xzf go$VERSION.$OS-$ARCH.tar.gz
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
    git clone https://github.com/YOUR_GITHUB_USERNAME/mattermost-server.git
    ```

10. Start the server and test your environment:

    ```sh
    cd mattermost-server
    make run-server
    curl http://localhost:8065/api/v4/system/ping
    make stop-server
    ```

    If successful, the `curl` step will return a JSON object containing `"status":"OK"`.

    **Note:** Browsing directly to http://localhost:8065/ will display `404 Not Found` until the web app is configured. See [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for additional setup.

    The `stop-server` make target does not stop all the Docker containers started by `run-server`. To stop the running Docker containers:

    ```sh
    make stop-docker
    ```

### Troubleshooting:

1. If you see an error like `the input device is not a TTY.  If you are using mintty, try prefixing the command with 'winpty'`, then reinstall Git for Windows and make sure you choose **Use Windows' default console window** instead of **Use MinTTY**.

2. The LDAP Docker container is sometimes slow to start. If you see the following message, either increase the wait time in the make file or run `make run` twice in a row.

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
3. If you see an error like `nc: bad address 'postgres'` when running `make run-server`and PostgreSQL's container just keeps restarting, check its logs in Docker Desktop. You should see something like:

    ```
    LOG: input in flex scanner failed at file "/etc/postgresql/postgresql.conf" line 1
    FATAL: configuration file "/etc/postgresql/postgresql.conf" contains errors
    ```
    
    If that's the case, `postgresql.conf` is probably a directory rather than a file, which means the volume wasn't mounted properly, so you are most likely missing some of the configuration changes from step 1 (Linux Subsystem Installation).
    
4. If you see an error like `ERROR: for mattermost-postgres. Cannot create container for service postgres: status code not OK but 500: {"Message":"Unhandled exception: Drive has not been shared"}`, make sure you enabled file sharing for the drive that contains the `mattermost-server` project. 
