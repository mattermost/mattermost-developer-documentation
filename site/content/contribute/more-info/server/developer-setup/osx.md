1. Install and configure Docker CE: https://docs.docker.com/desktop/install/mac-install/.

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
    If you don't migrate your data, the new, docker-compose-managed containers will start out empty. To remove the old containers -- destroying any existing data -- use `make clean-old-docker`.

2. Download and install homebrew: https://brew.sh/.

3. Install Go:
    ```sh
    brew install go
    ```

4. Update your shell's initialization script (e.g. `.bashrc` or `.zshrc`) and add the following:

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
    cd mattermost-server
    make run-server
    ```

    **Note:** If you see lot of `nc: bad address 'elasticsearch'` messages, eventually exiting with the message `Service elasticsearch:9200 did not start within 300 seconds. Aborting...`,  increase the memory available for the Docker Engine by going to [Docker's preferences -> Advanced](https://docs.docker.com/docker-for-mac/#advanced).

    **Note:** If you see an error which says `Failed to ping DB`, it's probably due to a conflict between the PostgreSQL service in Docker and the one which is running system-wide. You can stop the system-wide server temporarily by running `brew services stop postgres` in your terminal, then restart the Docker service.

8. Test your environment:

    ```sh
    curl http://localhost:8065/api/v4/system/ping
    make stop-server
    ```

    If successful, the `curl` step will return a JSON object:
    ```json
    {"AndroidLatestVersion":"","AndroidMinVersion":"","DesktopLatestVersion":"","DesktopMinVersion":"","IosLatestVersion":"","IosMinVersion":"","status":"OK"}
    ```

    **Note:** Browsing directly to http://localhost:8065/ will display a `404 Not Found` until the web app is configured. See [Web App Developer Setup]({{< ref "/contribute/more-info/webapp/developer-setup" >}}) and [Mobile App Developer Setup]({{< ref "/contribute/more-info/mobile/developer-setup" >}}) for additional setup.

    The `stop-server` make target does not stop all the docker containers started by `run-server`. To stop the running docker containers:

    ```sh
    make stop-docker
    ```
