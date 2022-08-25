---
title: Developer setup
description: Developer setup and guides for quickly getting started building apps
weight: 10
aliases:
  - /integrate/apps/quick-start-developer-setup
---

To get started making Mattermost Apps, the first thing you need to do is set up your development environment via the [mattermost-app-examples repository](https://github.com/mattermost/mattermost-app-examples). Then you can follow language-specific guides to get started with the Apps Framework, or just start tinkering on your own.

## Prerequisites

You need [the latest version of Docker](https://docs.docker.com/get-docker/) installed.

## Set up your development environment

Clone and enter a local copy of the [mattermost-app-examples repository](https://github.com/mattermost/mattermost-app-examples) with the following command:

```sh
git clone https://github.com/mattermost/mattermost-app-examples && cd mattermost-app-examples
```

When you're developing your own app, you need an actual Mattermost server to be running. The development environment accomplishes this by using a [`docker-compose.yml`](https://github.com/mattermost/mattermost-app-examples/blob/master/docker-compose.yml) with a network named `mattermost-apps-dev`. This compose has just two containers: the Mattermost server with a Postgres database. The Mattermost image itself is preconfigured with the ideal settings for app development. 

Because they exist on a pre-defined network, other `docker-compose.yml` configurations can connect their containers to this development environment by specifying the same `mattermost-apps-dev` Docker network. Then the Mattermost server can be accessed at `http://mattermost:8065` by any other container on the `mattermost-apps-dev` network. Similarly, your own development apps can then be accessed by Mattermost via their service name (e.g., `http://mattermost-apps-typescript-hello-world:4000`). You can learn more about Docker networks on the [official documentation](https://docs.docker.com/network/).

To change the Mattermost Apps plugin or the Mattermost server versions, you can edit [`docker-compose.yml`](https://github.com/mattermost/mattermost-app-examples/blob/master/docker-compose.yml).

Next, use the following command to bring your development environment online.

```sh
docker compose up -d
```

Once Mattermost is online, you can access the server at [http://localhost:8065](http://localhost:8065) and create your superuser account. You can also add `127.0.0.1 mattermost` to your `/etc/hosts` file to be able to access Mattermost at [http://mattermost:8065](http://mattermost:8065), which is the value of `MM_SERVICESETTINGS_SITEURL` for Docker networking.

To temporarily stop the container (and preserve your database), use the following command:

```sh
docker compose stop
```

To stop and clean up the database (for a fresh start), use the following command:

```sh
docker compose down
```

Now you're fully equipped with the ideal environment to develop Mattermost apps locally! 

## Quick start guides

The following quick start guides can help you start developing a Mattermost app in different languages:

| Language                | Guide                                                                                             |
|-------------------------|---------------------------------------------------------------------------------------------------|
| Golang                  | [Hello World in Go]({{< ref "/integrate/apps/quickstart/quick-start-go" >}})                      |
| Golang                  | [JWT]({{< ref "/integrate/apps/quickstart/quick-start-jwt" >}})                                   |
| Golang                  | [Serverless on AWS or OpenFaaS in Go]({{< ref "/integrate/apps/quickstart/quick-start-serverless" >}})  |
| Golang                  | [Webhooks]({{< ref "/integrate/apps/quickstart/quick-start-webhooks" >}})                         |
| TypeScript              | [Hello World in TypeScript]({{< ref "/integrate/apps/quickstart/quick-start-js" >}})              |
| Python                  | [Hello World in Python]({{< ref "/integrate/apps/quickstart/quick-start-python" >}})              |

More guides from community members are encouraged! Check out the [open issue](https://github.com/mattermost/mattermost-plugin-apps/issues/351) and our [contributing guide](https://developers.mattermost.com/contribute/getting-started/) for more details.
