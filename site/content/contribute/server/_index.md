+++
draft = true
title = "Server"
date = "2017-08-19T12:01:23-04:00"
section = "contribute"
+++

# Server

The Mattermost server is written in [Go](https://golang.org/) and lives in the [mattermost/platform](https://github.com/mattermost/platform) respository.

## Network Diagram

<img src="/img/mattermost-network.png" style="width: 1200px"/>

## Server Packages

The server consists of several different Go packages:

* `api` - Version 3 of the RESTful JSON Web Service *(scheduled for deprecation January 18th, 2018)*
* `api4` - Version 4 of the RESTful JSON Web Service
* `app` - Logic layer for getting, modifying, and interacting with models
* `cmd` - Command line interface
* `einterfaces` - Interfaces for Enterprise Edition features
* `jobs` - Job server and scheduling
* `model` - Definitions and helper functions for data models
* `store` - Storage layer for interacting with caches and databases
* `util` - Utility functions for various tasks
* `web` - Serves static pages

<div style="margin-top: 15px;">
<span class="pull-right"><a href="{{< contributeurl >}}/server/developer-setup/">Go to Environment Setup ></a></span>
</div>
<br/>
