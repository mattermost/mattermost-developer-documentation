---
title: "Deployment (admin)"
heading: "Admin's Guide to Deploying Apps"
description: "TODO"
weight: 1000
---

- In **Mattermost Cloud**, all apps are deployed to the Marketplace by Mattermost
  staff. They can be installed onto a specific Mattermost instance using `/apps
  install listed` command. No special configuration is required, the `/apps
  install` command should be enabled and functional by default.

- **Self-Managed Mattermost** installations can use external Apps as HTTP services
  that have already been deployed, or can deploy App bundles on self-managed
  hosting or serverless platforms. Currently, [AWS Lambda]({{< relref "deploy-aws"
  >}}), [OpenFaaS]({{< relref "deploy-openfaas" >}}), and Kubeless deployments are
  supported. `appsctl` command can be used to deploy app bundles to these
  environments.

  Self-managed customers can also install external [HTTP]({{< relref "deploy-http"
  >}}) apps, with no need to deploy them.

  `appsctl` CLI tool is provided to deploy AWS and OpenFaaS apps in self-managed
  environments. To install appsctl, `go install
  github.com/mattermost/mattermost-plugin-apps/cmd/appsctl@latest`

