---
title: "Server"
heading: "An Introduction to the Mattermost Server"
description: "The server, which is written in Go and compiles on a single binary, is the highly scalable backbone of the Mattermost project."
date: "2018-04-19T12:01:23-04:00"
weight: 2
---

The server is the highly scalable backbone of the Mattermost project. Written in Go it compiles to a single, standalone binary. It's generally stateless except for the WebSocket connections and some in-memory caches.

Communication with Mattermost clients and integrations mainly occurs through the RESTful JSON web API and WebSocket connections primarily used for event delivery.

Data storage is done with MySQL or PostgreSQL for non-binary data. Files are stored locally, on network drives or in a service such as S3 or Minio.

## Repository

https://github.com/mattermost/mattermost-server

## Server Packages

The server consists of several different Go packages:

* `api4` - Version 4 of the RESTful JSON Web Service
* `app` - Logic layer for getting, modifying, and interacting with models. Anything that interact with different services, put the information together, and give a result, should go here
* `services` - Set of packages providing functionality to the rest of the application, especially to the `app` package
* `cmd` - Command line interface
* `einterfaces` - Interfaces for Enterprise Edition features
* `jobs` - Job server and scheduling
* `model` - Definitions and helper functions for data models
* `store` - Storage layer for interacting with caches and databases
* `utils` - Utility functions for various tasks
* `web` - Serves static pages

## Package Design Guide

We are trying to follow certain rules about when is needed to create a new
package or add functionality to the existing ones (Some of them can not fit
with the current implementation because it is an ongoing effort).

* Any integration with a third party tool should be implemented as an
  independent service (Examples: Bleve, Cache, File backends).
* Any well isolated chunk of code that has a very small public API and a lot of
  code behind, should be separated into a service (Examples: Import/Export,
  Tracing, Telemetry)
* Any package should expose the minimal API needed, trying to avoid any public
  function or method that is not used from the outside.
* If you are validating inputs from the user or permissions, you should do it
  in the external layers (e.g. `api4`, `web`, `app/slashcommands`).
* If you are initializing something (for example a new service) that is going
  to be there for the whole time the server is running, you should be adding it
  to the `app.Server` data structure, probably in the `app/server.go` file.
