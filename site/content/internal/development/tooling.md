---
title: Tooling
date: 2020-04-22T17:52:04-05:00
subsection: internal
weight: 10
---

## Server

In the server repository we are using [docker](https://www.docker.com/) images and [docker compose](https://docs.docker.com/compose/) to set-up the development enviroment. We have mandatory images to be run:

- [Mysql](https://www.mysql.com/)
- [Postgresql](https://www.postgresql.org/)
- [Minio](https://min.io/)
- [Inbucket](https://www.inbucket.org/)
- [OpenLDAP](https://www.openldap.org/)
- [Elasticsearch](https://www.elastic.co)

But we have added optional tooling that could be useful for developers

##### Dejavu

[Dejavu](https://opensource.appbase.io/dejavu/) is a UI for Elasticsearch that fills the gap left by Elasticsearch when they decide not to provide a UI or tool to visualize or modify the data you're storing inside.

In order to start using Dejavu you only have to execute `docker-compose up [-d] dejavu` and it will running at `http://localhost:1358`