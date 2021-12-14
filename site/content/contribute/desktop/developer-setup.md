---
title: "Developer Setup"
heading: "Setting up Your Development Environment"
description: "Find out how to set up your development environment for building, running, and testing the Mattermost Desktop App."
date: 2020-02-01T19:50:32-04:00
weight: 2
---

Set up your development environment for building, running, and testing the Mattermost Desktop App.

## Dependencies

<div class="tab">
    <button class="tablinks active" onclick="openTab(event, 'mac')">macOS</button>
    <button class="tablinks" onclick="openTab(event, 'windows')">Windows</button>
    <button class="tablinks" onclick="openTab(event, 'ubuntu')">Ubuntu</button>
    <button class="tablinks" onclick="openTab(event, 'archlinux')">Arch Linux</button>
    <button class="tablinks" onclick="openTab(event, 'redhat')">Fedora/RedHat</button>
</div>

<div id="mac" class="tabcontent" style="display: block;">
    {{% content "contribute/desktop/developer-setup/macos.md" %}}
</div>

<div id="ubuntu" class="tabcontent">
    {{% content "contribute/desktop/developer-setup/ubuntu.md" %}}
</div>

<div id="windows" class="tabcontent">
    {{% content "contribute/desktop/developer-setup/windows.md" %}}
</div>

<div id="archlinux" class="tabcontent">
    {{% content "contribute/desktop/developer-setup/arch.md" %}}
</div>

<div id="redhat" class="tabcontent">
    {{% content "contribute/desktop/developer-setup/redhat.md" %}}
</div>

#### Mattermost Server

To develop with the Desktop App, you'll likely want to setup a Mattermost server and webapp instance that can be customized as needed, in case there are specific integration requirements needed for testing.

You can find information on setting up those instances here:

[Server Developer Setup](/contribute/server/developer-setup)  
[Webapp Developer Setup](/contribute/webapp/developer-setup)

## Repo Setup

1. Fork GitHub Repository: https://github.com/mattermost/desktop
2. Clone from your repo: 

    ```sh
    git clone https://github.com/<YOUR_GITHUB_USERNAME>/desktop.git
    ```

3. Open the desktop directory

    ```sh
    cd desktop
    ```

4. Install Node Modules

    ```sh
    npm i
    ```

5. Run the application

    ```sh
    npm run watch
    ```