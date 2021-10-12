---
title: "OSX Development Environment Setup"
heading: "How to Set Up Mattermost in Mac OS X"
description: "Read about how to set up your developer environment in Mattermost using a Mac OS X."
---

1. Install and configure Docker CE: https://docs.docker.com/docker-for-mac/.

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
    If you don't migrate your data, the new, docker-compose-managed containers will start out empty. To remove the old containers -- destroying any existing data -- use `make clean-old-docker`.


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
    git clone https://github.com/YOUR_GITHUB_USERNAME/mattermost-server.git
    ```

8. Start the server:

    ```sh
    cd mattermost-server
    make run-server
    ```

    **Note:** If you see lot of `nc: bad address 'elasticsearch'` messages, eventually exiting with the message `Service elasticsearch:9200 did not start within 300 seconds. Aborting...`,  increase the memory available for the Docker Engine by going to [Docker's preferences -> Advanced](https://docs.docker.com/docker-for-mac/#advanced).
    If you see an error which says `Failed to ping DB`, it is probably due to a conflict between the postgres service in docker and the one which is running system wide. One solution to fix this is to stop the system wide server temporarily by running `brew services stop postgres` in your terminal. You can then restart the docker service.

9. Test your environment:

    ```sh
    curl http://localhost:8065/api/v4/system/ping
    make stop-server
    ```

    If successful, the `curl` step will return a JSON object:
    ```json
    {"AndroidLatestVersion":"","AndroidMinVersion":"","DesktopLatestVersion":"","DesktopMinVersion":"","IosLatestVersion":"","IosMinVersion":"","status":"OK"}
    ```

    **Note:** Browsing directly to http://localhost:8065/ will display a `404 Not Found` until the web app is configured. See [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for additional setup.

    The `stop-server` make target does not stop all the docker containers started by `run-server`. To stop the running docker containers:

    ```sh
    make stop-docker
    ```
