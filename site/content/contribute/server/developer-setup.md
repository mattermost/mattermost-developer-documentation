---
title: "Developer Setup"
heading: "Setting up Your Development Environment - Mattermost"
description: "Find out how to set up your development environment for building, running, and testing the Mattermost server."
date: 2020-02-01T19:50:32-04:00
weight: 2
---

Set up your development environment for building, running, and testing the Mattermost server.

**Note:** If you're developing plugins, see the plugin [developer setup]({{< ref "/integrate/plugins/developer-setup" >}}) documentation.

For minimum software requirements, see the following table:

| Software       | Minimum Version  |
|----------------|------------------|
| Docker         | 17.12.0+         |
| Docker Compose | 1.21.0+          |
| Go             | 1.16.0+          |

<div class="tab">
    <button class="tablinks active" onclick="openTab(event, 'mac')">Mac OS X</button>
    <button class="tablinks" onclick="openTab(event, 'ubuntu')">Ubuntu 16.04/18.04</button>
    <button class="tablinks" onclick="openTab(event, 'windows_wsl')">Windows WSL</button>
    <button class="tablinks" onclick="openTab(event, 'archlinux')">Archlinux</button>
    <button class="tablinks" onclick="openTab(event, 'centos')">CentOS 7/Fedora 31</button>
</div>

<div id="mac" class="tabcontent" style="display: block;">
    {{% content "contribute/server/developer-setup/osx.md" %}}
</div>

<div id="ubuntu" class="tabcontent">
    {{% content "contribute/server/developer-setup/ubuntu.md" %}}
</div>

<div id="windows_wsl" class="tabcontent">
    {{% content "contribute/server/developer-setup/windows-wsl.md" %}}
</div>

<div id="archlinux" class="tabcontent">
    {{% content "contribute/server/developer-setup/arch.md" %}}
</div>

<div id="centos" class="tabcontent">
    {{% content "contribute/server/developer-setup/centos.md" %}}
</div>

### Customize your workflow

#### Makefile

You can customize variables of the Makefile by creating a `config.override.mk` file or setting environment variables. To get started, you can copy the `config.mk` file to `config.override.mk` and change the values in your newly copied file.

#### Docker-compose

If you create a `docker-compose.override.yaml` file at the root of the project, it will be automatically loaded by all the Makefile tasks using docker-compose, allowing you to define your own services or change the configuration of the one mattermost provides.
