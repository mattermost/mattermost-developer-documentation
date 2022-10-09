---
title: Apps - Developer setup
description: Developer setup and guides for quickly getting started building Apps
weight: 10
---

To get started making Mattermost Apps, the first thing you need to do is set up your development environment via the [mattermost-app-examples repository](https://github.com/mattermost/mattermost-app-examples). Then you can follow language-specific guides to get started with the Apps framework, or just start tinkering on your own.

## Prerequisites

You need the latest version of [Docker Desktop](https://docs.docker.com/desktop/) (Windows, Mac, or Linux desktop application) or [Docker Engine](https://docs.docker.com/engine/) (CLI) installed.

## Set up your development environment

Clone a local copy of the [mattermost-app-examples repository](https://github.com/mattermost/mattermost-app-examples) with the following command:

```sh
git clone https://github.com/mattermost/mattermost-app-examples && cd mattermost-app-examples
```

When you're developing your own App, you need an actual Mattermost Server to be running. The development environment accomplishes this by using a [`docker-compose.yml`](https://github.com/mattermost/mattermost-app-examples/blob/master/docker-compose.yml) with a network named `mattermost-apps-dev`. This Docker Compose file has just two containers: the Mattermost Server and a Postgres database.

The Mattermost image itself is preconfigured with settings for local App development but you can customize them. For example, the `MM_SERVICESETTINGS_SITEURL` environment variable is set to `http://mattermost:8065` on the Mattermost container, but you could change this to be any URL, like one from {{<newtabref title="ngrok" href="https://ngrok.com/">}} or {{<newtabref title="Gitpod" href="https://gitpod.io/">}}.

Because they exist on a pre-defined network, other `docker-compose.yml` configurations can connect their containers to this development environment by specifying the same `mattermost-apps-dev` Docker network. Then the Mattermost Server can be accessed at `http://mattermost:8065` by any other container on the `mattermost-apps-dev` network. Similarly, your own development Apps can then be accessed by Mattermost via their service name (e.g., `http://mattermost-apps-typescript-hello-world:4000`). You can learn more about Docker networks in the [official documentation](https://docs.docker.com/network/).

You can also access Mattermost from outside the Docker network via [http://localhost:8065](http://localhost:8065). Similarly, the examples provided in the [mattermost-app-examples repository](https://github.com/mattermost/mattermost-app-examples) can be accessed at their designated ports on `localhost`. This is because the Docker Compose files have been configured to expose the appropriate ports locally.

To change the Mattermost Apps plugin or the Mattermost Server versions, you can edit [`docker-compose.yml`](https://github.com/mattermost/mattermost-app-examples/blob/master/docker-compose.yml).

To complete the Docker Compose configuration, you'll need to create a `.docker.env` file in the same directory as the `docker-compose.yml` file. This file is used to store any secrets or other environment variables you wish to use with the Mattermost server. To complete configuration without storing secrets or other environment variables, create an empty `.docker.env` file. The `.docker.env` file is ignored in the repository's `.gitignore` file, so it won't be committed to the repository if you make any edits.

An example of this file, {{<newtabref title=".docker.env.example" href="https://github.com/mattermost/mattermost-app-examples/blob/master/.docker.env.example">}}, can be found in the examples repository.

Next, use the following command to bring your development environment online:

```sh
docker compose up -d
```

Once Mattermost is online, you can access the server at [http://localhost:8065](http://localhost:8065) and create your superuser account.

To temporarily stop the container (and preserve your database), use the following command:

```sh
docker compose stop
```

To stop and clean up the database (for a fresh start), use the following command:

```sh
docker compose down
```

Now you're fully equipped with an environment to develop Mattermost Apps locally!

{{<note "Tip:">}}
If you are using [Docker Engine](https://docs.docker.com/engine/) with the [docker-compose plugin](https://docs.docker.com/compose/install/) instead of [Docker Desktop](https://docs.docker.com/desktop/) (recommended), then use hyphenated versions of the commands above (e.g., `docker-compose up -d`).
{{</note>}}

## Quick start guides

The following quick start guides can help you start developing a Mattermost App in different languages:

| Language   | Guide                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Go         | [Hello World in Go]({{< ref "/integrate/apps/quickstart/quick-start-go" >}})                           |
| Go         | [JWT in Go]({{< ref "/integrate/apps/quickstart/quick-start-jwt" >}})                                  |
| Go         | [Serverless on AWS or OpenFaaS in Go]({{< ref "/integrate/apps/quickstart/quick-start-serverless" >}}) |
| TypeScript | [Hello World in TypeScript]({{< ref "/integrate/apps/quickstart/quick-start-ts" >}})                   |
| Python     | [Hello World in Python]({{< ref "/integrate/apps/quickstart/quick-start-python" >}})                   |

More guides from community members are encouraged! Check out the [open issue](https://github.com/mattermost/mattermost-plugin-apps/issues/351) and our [contributing guide]({{< ref "/contribute/more-info/getting-started" >}}) for more details.
