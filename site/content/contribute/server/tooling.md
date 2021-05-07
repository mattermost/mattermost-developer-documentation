---
title: Tooling
heading: "Mattermost Server - Tooling"
description: "Learn more about the tooling that is required to set up the developer's environment."
date: 2020-04-22T17:52:04-05:00
weight: 10
---

## Mattermost Server

In the [mattermost-server repository](https://github.com/mattermost/mattermost-server) we are using [Docker](https://www.docker.com/) images and [Docker Compose](https://docs.docker.com/compose/) to set up the development enviroment. The following are required images:

- [MySQL](https://www.mysql.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [MinIO](https://min.io/)
- [Inbucket](https://www.inbucket.org/)
- [OpenLDAP](https://www.openldap.org/)
- [Elasticsearch](https://www.elastic.co)

We also have added optional tools to help with your development:

### Dejavu

[Dejavu](https://opensource.appbase.io/dejavu/) is a user interface for Elasticsearch when no UI is provided to visualize or modify the data you're storing inside Elasticsearch.

To use Dejavu, execute `docker-compose up -d dejavu`. It will run at `http://localhost:1358`.
