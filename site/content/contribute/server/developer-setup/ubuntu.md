1. Install and configure Docker CE:

    ```sh
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $(whoami)
    docker login
    ```

    If you prefer to perform these steps manually:
    * https://docs.docker.com/install/linux/docker-ce/ubuntu/
    * https://docs.docker.com/install/linux/linux-postinstall/


    **Note:** If upgrading from an existing installation to the [docker-compose](https://docs.docker.com/compose/) method of managing containers, remove the old containers using `make clean-old-docker`.
    
    Alternatively, migration of database container data requires some manual steps
    ```
    #mysql
    mysqldump -h 127.0.0.1 --column-statistics=0 -u mmuser -p mattermost_test > mm_mysql_backup.sql
    mysql -u mmuser -p -h 127.0.0.1 mattermost_test < mm_mysql_backup.sql

    #postgres
    pg_dump -U mmuser -W -d mattermost_test -h 127.0.0.1 > mm_psql.bak
    psql -U mmuser -W -h 127.0.0.1 -f mm_psql.bak mattermost_test
    ```
    

3. Install Go:

    ```sh
    sudo apt-get install -y build-essential
    wget https://storage.googleapis.com/golang/go1.12.linux-amd64.tar.gz
    sudo tar -C /usr/local -xzf go1.12.linux-amd64.tar.gz
    ```

4. Update your shell's initialization script (e.g. `.bashrc` or `.zshrc`) and add the following:

    ```sh
    export GOPATH=$HOME/go
    export PATH=$PATH:$GOPATH/bin
    export PATH=$PATH:/usr/local/go/bin
    ```

5. Edit `/etc/security/limits.conf` as an administrator (e.g. `sudo`) and add the following lines, replacing `{username}` with your username:

    ```sh
    {username}  soft  nofile  8096
    {username}  hard  nofile  8096
    ```

6. Logout and login to effect the changes above.

7. Fork https://github.com/mattermost/mattermost-server

8. Clone the Mattermost source code from your fork:

    ```sh
    export GITHUB_USERNAME=my_username
    mkdir -p $(go env GOPATH)/src/github.com/mattermost
    git clone https://github.com/$GITHUB_USERNAME/mattermost-server.git $(go env GOPATH)/src/github.com/mattermost/mattermost-server
    ```

9. Start the server and test your environment:

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
