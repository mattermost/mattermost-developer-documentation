---
title: "Developer Setup"
date: 2017-08-20T11:35:32-04:00
weight: 2
subsection: Server
---

# Developer Setup
<p>Set up your development environment for building, running, and testing the Mattermost server.</p>

<div class="tab">
  <button class="tablinks active" onclick="openTab(event, 'mac')">Mac OS X</button>
  <button class="tablinks" onclick="openTab(event, 'ubuntu')">Ubuntu 16.04</button>
  <button class="tablinks" onclick="openTab(event, 'windows')">Windows</button>
  <button class="tablinks" onclick="openTab(event, 'windows_wsl')">Windows WSL</button>
  <button class="tablinks" onclick="openTab(event, 'archlinux')">Archlinux</button>
  <button class="tablinks" onclick="openTab(event, 'centos')">CentOS 7</button>
</div>

<div id="mac" class="tabcontent" style="display: block;">
{{% md %}}
1. Install and configure Docker CE

    1. Follow the instructions at https://docs.docker.com/docker-for-mac/
    2. Edit your `/etc/hosts` file to include the following line:

        ```sh
        127.0.0.1     dockerhost
        ```

2. Download and install homebrew, using the instructions at https://brew.sh/

3. Install Go:
    ```sh
    brew install go
    ```

4. Set up your Go workspace:
    1. `mkdir ~/go`
    2. Add the following lines to your `~/.bash_profile` file:

        ```sh
        export GOPATH=$HOME/go
        export PATH=$PATH:$GOPATH/bin
        export PATH=$PATH:/usr/local/go/bin
        ulimit -n 8096
        ```

    3. `source ~/.bash_profile`
5. Go to https://github.com/mattermost/mattermost-server and create a fork

6. Clone the Mattermost source code from your fork:
    1. Set up the directories:

        ```sh
        mkdir -p ~/go/src/github.com/mattermost
        cd ~/go/src/github.com/mattermost
        ```
    3. Clone the fork, replacing `{yourgithubusername}` with your GitHub username:

        ```sh
        git clone https://github.com/{yourgithubusername}/mattermost-server.git
        ```

7. Start up the server and test your environment:
    ```sh
    cd mattermost-server
    make run-server
    make stop-server # stop the server after it starts succesfully
    ```

8. You can check if the server is running using the following `curl` command or opening the URL in your web browser:

   ```sh
   curl http://localhost:8065/api/v4/system/ping
   ```

   The server should return a JSON object containing `"status":"OK"`.

   **Notice:** The server root will return a `404 Not Found` status, since the web app is not configured as part of the server setup. Please refer to the [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for the setup steps.

{{% /md %}}
</div>

<div id="ubuntu" class="tabcontent">
{{% md %}}
1. Install and configure Docker CE using the instructions at https://docs.docker.com/install/linux/docker-ce/ubuntu/
    1. Edit your `/etc/hosts/` file to include:

        ```sh
        127.0.0.1     dockerhost
        ```
    2. Add your username to the `docker` group, replacing `{username}` with your username:

        ```sh
        sudo gpasswd -a {username} docker
        ```
    3. Restart the Docker daemon:

        ```sh
        sudo service docker restart
        ```
    4. Change your current group ID to the `docker` group

        ```sh
        newgrp docker
        ```
2. Install the build-essential package:
    ```sh
    sudo apt-get install build-essential
    ```

3. Download and install Go 1.11 for Linux:
    1. Download the Go binary:

        ```sh
        wget https://storage.googleapis.com/golang/go1.11.linux-amd64.tar.gz
        ```
    2. Install the Go binary:

        ```sh
        sudo tar -C /usr/local -xzf go1.11.linux-amd64.tar.gz
        ```

4. Set up your Go workspace:
    1. `mkdir ~/go`
    2. Add the following lines to your `~/.bashrc` file:

        ```sh
        export GOPATH=$HOME/go
        export PATH=$PATH:$GOPATH/bin
        export PATH=$PATH:/usr/local/go/bin
        ulimit -n 8096
        ```

    3. `source ~/.bashrc`

5. Go to https://github.com/mattermost/mattermost-server and create a fork

6. Clone the Mattermost source code from your fork:
    1. Set up the directories:

        ```sh
        mkdir -p ~/go/src/github.com/mattermost
        cd ~/go/src/github.com/mattermost
        ```
    3. Clone the fork, replacing `{yourgithubusername}` with your GitHub username:

        ```sh
        git clone https://github.com/{yourgithubusername}/mattermost-server.git
        ```

7. Start up the server and test your environment:
    ```sh
    cd mattermost-server
    make run-server
    make stop-server # stop the server after it starts succesfully
    ```

8. You can check if the server is running using the following `curl` command or opening the URL in your web browser:

   ```sh
   curl https://localhost:8065/api/v4/system/ping
   ```

   The server should return a JSON object containing `"status":"OK"`.

   **Notice:** The server root will return a `404 Not Found` status, since the web app is not configured as part of the server setup. Please refer to the [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for the setup steps.

{{% /md %}}
</div>

<div id="windows" class="tabcontent">
{{% md %}}
1. Install and setup Docker. If you are using Windows 10 Pro or Enterprise, you can use Docker for Windows:
    1. Follow the instructions at https://docs.docker.com/docker-for-windows/
    2. Add following line to `C:\Windows\System32\drivers\etc\hosts` using a text editor with administrator privileges

        ```sh
        127.0.0.1     dockerhost
        ```

2. For other Windows versions, or if you prefer to use VirtualBox, use Docker Toolbox:
    1. Follow the instructions at https://docs.docker.com/toolbox/toolbox_install_windows/
    2. Run the `Docker Quickstart Terminal` and let it configure the `default` machine
    3. Run `docker-machine ip default` in the terminal to get the IP address for the next step
    4. Add following line using a text editor with administrator privileges:

        ```sh
        {Docker-IP} dockerhost to C:\Windows\System32\drivers\etc\hosts
        ```

3. Download and install Go from https://golang.org/dl/

4. Go to https://github.com/mattermost/mattermost-server and create a fork

5. Set up the workspace and clone the code:
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

7. Setup the following environment variables (change the path accordingly):

    ```sh
    export PATH="/c/Program Files/go/bin":$PATH
    export PATH="/c/Program Files/nodejs":$PATH
    export PATH="/c/Program Files/Git/bin":$PATH
    export GOROOT="c:\\Program Files\\go"
    export GOPATH="c:\\User\\{user-name}\\go"
    export PATH="/c/Program Files/Docker Toolbox":$PATH # change the path accordingly if you are using Docker for Windows
    eval $(docker-machine env default) # skip this line if you are using Docker for Windows
    ```

8. Start up the server and test your environment:
    ```sh
    cd ~/go/src/github.com/mattermost/mattermost-server
    make run-server
    make stop-server # stop the server after it starts succesfully
    ```

9. You can check if the server is running opening the following URL in your web browser:

   ```sh
   https://localhost:8065/api/v4/system/ping
   ```

   The server should return a JSON object containing `"status":"OK"`.

   **Notice:** The server root will return a `404 Not Found` status, since the web app is not configured as part of the server setup. Please refer to the [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for the setup steps.

{{% /md %}}
</div>

<div id="windows_wsl" class="tabcontent">
{{% md %}}

#### Installing on Window 10 and the Windows Subsystem for Linux (WSL)

##### This is an unofficial guide. Community testing, feedback and improvements are welcome and greatly appreciated. You can propose updates by [editing the GitHub source file here](https://github.com/mattermost/mattermost-developer-documentation/blob/windows-wsl/site/content/contribute/server/developer-setup.md).

Set up your development environment for building, running, and testing Mattermost.

1. Install the Windows Subsystem for Linux following https://docs.microsoft.com/en-us/windows/wsl/install-win10

1. Install and setup Docker. If you are using Windows 10 Pro or Enterprise, you can use Docker for Windows.
    1. Install Docker for Windows https://docs.docker.com/docker-for-windows/
    1. Add the line `127.0.0.1 dockerhost` to `C:\Windows\System32\drivers\etc\hosts` using a text editor with administrator privileges.

1. Link Windows Subsystem for Linux to Docker for Windows. Refer to this blog article for more information: https://medium.com/@sebagomez/installing-the-docker-client-on-ubuntus-windows-subsystem-for-linux-612b392a44c4. You should end up with the Docker client running on Linux (WSL) sending commands to your Docker Engine daemon installed on Windows.

1. Install the build-essential and libpng16-dev package
  In bash `sudo apt-get install build-essential libpng16-dev`

1. Download and install Go 1.11 for Linux:
    1. Download the Go binary.  
        In bash``wget https://dl.google.com/go/go1.11.linux-amd64.tar.gz``
    1. Install the Go binary.  
        In bash``sudo tar -C /usr/local -xzf go1.11.linux-amd64.tar.gz``

1. Set up your Go workspace:  
    1. In PowerShell ``mkdir d:\Projects\go``
    1. In bash ``ln -s "/mnt/d/Projects/go" /home/<Linux User>/go``
    1. Add the following lines to your ``~/.bashrc`` file in bash:

        ```bash
        export GOPATH=$HOME/go
        export PATH=$PATH:$GOPATH/bin
        export PATH=$PATH:/usr/local/go/bin
        ulimit -n 8096
        ```
    1. Reload your bash configuration. `source ~/.bashrc`

1. Install Node.js:
    1. Add the Node.js repository to your repository list.
      ``curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -``
    1. Install Node.js
      ``sudo apt-get install -y nodejs``

1. Fork Mattermost server on GitHub from https://github.com/mattermost/mattermost-server.

1. Fork Mattermost webapp on GitHub from https://github.com/mattermost/mattermost-webapp.

1. Download the Mattermost code from your forked repositories:
    1. Create the directory for the code.
    ``mkdir -p ~/go/src/github.com/mattermost``
    1. Change to the directory that you created.
    ``cd ~/go/src/github.com/mattermost``
    1. Clone your Mattermost server fork. In the following command, replace *{username}* with your GitHub username.
    ``git clone https://github.com/{username}/mattermost-server.git``
    1. Clone your Mattermost webapp fork. In the following command, replace *{username}* with your GitHub username.
    ``git clone https://github.com/{username}/mattermost-webapp.git``

1. You can check if the server is running using the following `curl` command or opening the URL in your web browser:

   ```sh
   curl https://localhost:8065/api/v4/system/ping
   ```

   The server should return a JSON object containing `"status":"OK"`.

   **Notice:** The server root will return a `404 Not Found` status, since the web app is not configured as part of the server setup. Please refer to the [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for the setup steps.

### Troubleshooting:
1. If you see an error like `the input device is not a TTY.  If you are using mintty, try prefixing the command with 'winpty'`.  Reinstall git for windows and make sure you choose `Use Windows' default console window` instead of `Use MinTTY`
1.  If you see the follow message sometimes the LDAP docker container is slow to start, either increase the wait time in the make file or run `make run` twice in a row.

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

Now that everything is set up, you are ready to compile and run Mattermost.

{{% /md %}}
</div>

<div id="archlinux" class="tabcontent">
{{% md %}}
1. Install and configure Docker CE:
    1. Execute the following commands:

        ```sh
        pacman -S docker
        gpasswd -a user docker
        systemctl enable docker.service
        systemctl start docker.service
        newgrp docker
        ```
    2. Edit your `/etc/hosts/ to include the following line:

        ```sh
        127.0.0.1     dockerhost
        ```

2. Install Go:
    ```sh
    pacman -S go
    ```

3. Set up you Go workspace:
    1. `mkdir ~/go`
    2. Add the following lines to your `~/.bashrc` file:

        ```sh
        export GOPATH=$HOME/go
        export PATH=$PATH:$GOPATH/bin
        export PATH=$PATH:/usr/local/go/bin
        ```
    3. `source ~/.bashrc`

4. Edit `/etc/security/limits.conf` and add the following lines, replacing `{username}`:
    ```sh
    {username}  soft  nofile  8096
    {username}  hard  nofile  8096
    ```

5. Go to https://github.com/mattermost/mattermost-server and create a fork

6. Clone the Mattermost source code from your fork:
    1. Set up the directories:

        ```sh
        mkdir -p ~/go/src/github.com/mattermost
        cd ~/go/src/github.com/mattermost
        ```
    3. Clone the fork, replacing `{yourgithubusername}` with your GitHub username:

        ```sh
        git clone https://github.com/{yourgithubusername}/mattermost-server.git
        ```

7. Start up the server and test your environment:
    ```sh
    cd mattermost-server
    make run-server
    make stop-server # stop the server after it starts succesfully
    ```

8. You can check if the server is running using the following `curl` command or opening the URL in your web browser:

   ```sh
   curl https://localhost:8065/api/v4/system/ping
   ```

   The server should return a JSON object containing `"status":"OK"`.

   **Notice:** The server root will return a `404 Not Found` status, since the web app is not configured as part of the server setup. Please refer to the [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for the setup steps.

{{% /md %}}
</div>

<div id="centos" class="tabcontent">
{{% md %}}
1. Install and configure Docker CE:
    1. Follow the instructions at https://docs.docker.com/engine/installation/linux/docker-ce/centos/
    2. Edit your `/etc/hosts` file to include the following line:

        ```sh
        127.0.0.1     dockerhost
        ```
    3. Add your username to the `docker` group, replacing `{username}` with your username:

        ```sh
        sudo gpasswd -a {username} docker
        ```
    4. Restart the Docker daemon:

        ```sh
        sudo systemctl restart docker
        ```
    5. Change your current group ID to the `docker` group

        ```sh
        newgrp docker
        ```

2. Install the development tools package, wget and libpng12 required by pngquant.
    ```sh
    sudo yum group install "Development Tools"
    sudo yum install -y wget libpng12
    ```

3. Download and install Go 1.11 for Linux:
    1. Download the Go binary:

        ```sh
        wget https://storage.googleapis.com/golang/go1.11.linux-amd64.tar.gz
        ```
    2. Install the Go binary:

        ```sh
        sudo tar -C /usr/local -xzf go1.11.linux-amd64.tar.gz
        ```

4. Set up your Go workspace:
    1. `mkdir ~/go`
    2. Add the following lines to your `~/.bashrc` file:

        ```sh
        export GOPATH=$HOME/go
        export PATH=$PATH:$GOPATH/bin
        export PATH=$PATH:/usr/local/go/bin
        ```

    3. `source ~/.bashrc`

    4. Edit the file sudo nano /etc/security/limits.conf to include the following lines:

        ```sh
        {username} soft nofile 8096
        {username} hard nofile 10000
        ```

    5. Log out and back in to pick up the changes

5. Go to https://github.com/mattermost/mattermost-server and create a fork

6. Clone the Mattermost source code from your fork:
    1. Set up the directories:

        ```sh
        mkdir -p ~/go/src/github.com/mattermost
        cd ~/go/src/github.com/mattermost
        ```
    3. Clone the fork, replacing `{yourgithubusername}` with your GitHub username:

        ```sh
        git clone https://github.com/{yourgithubusername}/mattermost-server.git
        ```

7. Start up the server and test your environment:
    ```sh
    cd mattermost-server
    make run-server
    make stop-server # stop the server after it starts succesfully
    ```

8. You can check if the server is running using the following `curl` command or opening the URL in your web browser:

   ```sh
   curl https://localhost:8065/api/v4/system/ping
   ```

   The server should return a JSON object containing `"status":"OK"`.

   **Notice:** The server root will return a `404 Not Found` status, since the web app is not configured as part of the server setup. Please refer to the [Web App Developer Setup](https://developers.mattermost.com/contribute/webapp/developer-setup/) and [Mobile App Developer Setup](https://developers.mattermost.com/contribute/mobile/developer-setup/) for the setup steps.

{{% /md %}}
</div>
