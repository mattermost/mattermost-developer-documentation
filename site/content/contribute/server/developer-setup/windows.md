1. Install and setup Docker.

    * If you are using Windows 10 Pro or Enterprise, you can use Docker for Windows: https://docs.docker.com/docker-for-windows/
    * For other Windows versions, or if you prefer to use VirtualBox, use Docker Toolbox: https://docs.docker.com/toolbox/toolbox_install_windows/


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
    
3. Download and install Go from https://golang.org/dl/

4. Fork https://github.com/mattermost/mattermost-server

5. Clone the Mattermost source code from your fork:

    ```sh
    cd ~/go
    mkdir -p src/github.com/mattermost
    cd src/github.com/mattermost
    git clone https://github.com/{yourgithubusername}/mattermost-server.git
    cd mattermost-server
    git config core.eol lf
    git config core.autocrlf input
    git reset --hard HEAD
    ```

6. Install and setup babun from http://babun.github.io/

7. Setup the following environment variables (change the paths accordingly):

    ```sh
    export PATH="/c/Program Files/go/bin":$PATH
    export PATH="/c/Program Files/nodejs":$PATH
    export PATH="/c/Program Files/Git/bin":$PATH
    export GOROOT="c:\\Program Files\\go"
    export GOPATH="c:\\User\\{user-name}\\go"
    export PATH="/c/Program Files/Docker Toolbox":$PATH # change the path accordingly if you are using Docker for Windows
    eval $(docker-machine env default) # skip this line if you are using Docker for Windows
    ```

8. Start the server and test your environment:

    ```sh
    cd $(go env GOPATH)/src/github.com/mattermost/mattermost-server
    make run-server
    curl http://localhost:8065/api/v4/system/ping
    make stop-server
    ```

    If successful, the `curl` step will return a JSON object containing `"status":"OK"`.

    **Note:** Browsing directly to http://localhost:8065/ will display a `404 Not Found` until the web app is configured. See [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for additional setup.
