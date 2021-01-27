---
title: "Streamlining Developer Access to Prometheus and Grafana"
slug: streamlining-developer-access-to-prometheus-and-grafana
date: 2021-01-21T00:00:00-04:00
categories:
    - "testing"
    - "performance"
author: Jesse Hallam
github: lieut-data
community: jesse.hallam
summary: With access to the enterprise source code, the developer build tooling now automates the setup of Prometheus and Grafana for performance monitoring. Even the canonical Grafana dashboards are setup without any manual configuration required!
---

Our [Makefile](https://github.com/mattermost/mattermost-server/blob/master/Makefile) entrypoint for developing against the [Mattermost Server](https://github.com/mattermost/mattermost-server) already tries to simplify things for developers as much as possible.

For example, when invoking `make run-server`, this build tooling takes care of all of the following (among other things!):
* downloading a suitable version of `mmctl` for API-driven command line interaction
* checking your installed Go version to avoid cryptic error messages
* downloading and starting various Docker containers:
    - `mysql` and `postgres`, both for a backend to the server and also to automate tests
    - `inbucket` to simplify email testing without routing outside your machine
    - `minio` to expose an S3-compatible interface to your local disk for hosting uploaded files
    - `openldap` to simplify testing alternate modes of authentication (requires access to the enterprise source)
    - `elasticsearch` to expose an improved search backend for posts and channels (requires access to the enterprise source)
* linking your server to an automatically detected `mattermost-webapp` directory
* optionally starting the server in the foreground if `RUN_SERVER_IN_BACKGROUND` is `false`
* piping the structured server logs through a `logrus` decorator for easier reading
* invoking the `go` compiler to run the server code in your local repository

### Adding Prometheus & Grafana

As of https://github.com/mattermost/mattermost-server/pull/16649, this build tooling now supports automating the setup of Prometheus and Grafana Docker containers. Together, these tools form the backbone of our [Performance Monitoring (E20)](https://docs.mattermost.com/deployment/metrics.html) functionality, scraping metrics from Mattermost to help give enterprise customers insight into the performance of their clusters. Automating this setup makes it easier for developers to test in a production-like environment, and to help extend the monitoring available to customers.

Since the corresponding Mattermost functionality is only available with access to the enterprise source code, these containers aren't enabled by default. To turn them on, export the following environment variable into your shell:
```
export ENABLED_DOCKER_SERVICES="mysql postgres inbucket prometheus grafana"
```

Alternatively, you can follow the instructions in [config.mk](https://github.com/mattermost/mattermost-server/blob/master/config.mk). (Note that it's not necessary to specify `minio`, `openldap` or `elasticsearch` -- these are added automatically when an enterprise-enabled repository is detected.)

The build tooling does more than just spin up two new containers, however. [Various configuration files](https://github.com/mattermost/mattermost-server/tree/master/build/docker) also automate the following:
* configuring Prometheus to scrape the Mattermost `:8067/metrics` endpoint (requires access to the enterprise source)
* enabling anonymous access to Grafana (you can still login with the default `admin`/`admin` credentials if needed)
* configuring Grafana with the containerized Prometheus as the default data source
* installing our canonical Grafana dashboards ([Mattermost Performance KPI Metrics](https://grafana.com/grafana/dashboards/2539), [Mattermost Performance Monitoring](https://grafana.com/grafana/dashboards/2542), [Mattermost Performance Monitoring (Bonus Metrics)](https://grafana.com/grafana/dashboards/2545))

This means that simply running `make run-server` gets you immediate access to the Mattermost Performance dashboards at `http://localhost:3000`:

![Grafana home dashboard](/blog/2021-01-21-streamlining-developer-access-to-prometheus-and-grafana/grafana.png)

Prometheus is also available at `http://localhost:9090`:

![Prometheus landing page](/blog/2021-01-21-streamlining-developer-access-to-prometheus-and-grafana/prometheus.png)

### Enabling Metrics

Although the tooling is all setup to scrape metrics and display the dashboards, you'll need to do some one-time work to enable metrics within the Mattermost server.

First, be sure you have an Enterprise license installed. Staff members should have access to the shared developer license, but you can also request a trial license in-product. Browse to `/admin_console/about/license` on your local Mattermost instance to setup the license.

Second, enable performance monitoring. You can do this manually via `config.json` and setting `MetricsSettings.Enable` to `true`, or by exporting `MM_METRICSSETTINGS_ENABLE=true` into your shell before starting the server, or by enabling this manually via the System Console at `/admin_console/environment/performance_monitoring`:

![Performance monitoring configuration](/blog/2021-01-21-streamlining-developer-access-to-prometheus-and-grafana/performance-monitoring-config.png)

### What's next?

These changes weren't just made in isolation -- in fact, this is all just infrastructure work for another recent project to improve Mattermost Performance Monitoring. Stay tuned for a follow-up blog post!
