1. Install and configure Docker CE:

    ```sh
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $(whoami)
    docker login
    ```

    If you prefer to perform these steps manually:
    * https://docs.docker.com/install/linux/docker-ce/centos/
    * https://docs.docker.com/install/linux/linux-postinstall/

    **Note:** [MM-7971](https://github.com/mattermost/mattermost-server/pull/10872) introduced using [docker-compose](https://docs.docker.com/compose/) to manage containers. To preserve your data on upgrade, execute the following steps.

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

2. Install docker-compose

    ```sh
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    ```

3. Install Go (modify installation to latest Go version from <https://golang.org/dl/>):

    ```sh
    sudo yum group install "Development Tools"
    sudo yum install -y wget libpng12
    sudo rm -rf /usr/local/go
    wget https://dl.google.com/go/go$VERSION.$OS-$ARCH.tar.gz
    sudo tar -C /usr/local -xzf go$VERSION.$OS-$ARCH.tar.gz
    ```

4. Update your shell's initialization script (e.g. `.bashrc` or `.zshrc`) and add the following:

    ```sh
    export PATH=$PATH:/usr/local/go/bin
    ```

5. Edit `/etc/security/limits.conf` as an administrator (e.g. *sudo*) and add the following lines, replacing `{username}` with your username:

    ```sh
    {username}  soft  nofile  8096
    {username}  hard  nofile  8096
    ```

6. Log out and log back in to effect the changes above.

7. Fork https://github.com/mattermost/mattermost-server.

8. Clone the Mattermost source code from your fork:

    ```sh
    git clone https://github.com/YOUR_GITHUB_USERNAME/mattermost-server.git
    ```

9. Start the server and test your environment:

    ```sh
    cd mattermost-server
    make run-server
    curl http://localhost:8065/api/v4/system/ping
    make stop-server
    ```

    If successful, the `curl` step will return a JSON object:
    ```json
    {"AndroidLatestVersion":"","AndroidMinVersion":"","DesktopLatestVersion":"","DesktopMinVersion":"","IosLatestVersion":"","IosMinVersion":"","status":"OK"}
    ```

    **Note:** Browsing directly to http://localhost:8065/ will display `404 Not Found` until the web app is configured. See [Web App Developer Setup]({{< ref "/contribute/more-info/webapp/developer-setup" >}}) and [Mobile App Developer Setup]({{< ref "/contribute/more-info/mobile/developer-setup" >}}) for additional setup.

    The `stop-server` make target does not stop all the Docker containers started by `run-server`. To stop the running Docker containers:

    ```sh
    make stop-docker
    ```
