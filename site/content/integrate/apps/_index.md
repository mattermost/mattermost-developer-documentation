---
title: "Mattermost Apps (Developer Preview)"
heading: "Mattermost Apps"
description: "Apps are lightweight interactive add-ons to Mattermost."
weight: 20
---

If you're a developer or system integrator looking to learn how to extend Mattermost product functionality, but not sure where to start,  you're in the right place. In this section, you'll learn how to get started developing Mattermost Apps using the Mattermost Apps Framework.

- Is JavaScript or Golang your language of choice? Jump right in to our [JavaScript](https://developers.mattermost.com/integrate/apps/quick-start-js/) and [Golang](https://developers.mattermost.com/integrate/apps/quick-start-go/) developer quick start guides. Looking for another language? *[learn how to contribute here]*
- Got an existing Mattermost plugin you want to convert to an app? *[where to go for that info?]*

### Want to extend Mattermost **without** having to develop an app? 
Visit the [Mattermost Development Guides](https://developers.mattermost.com/integrate/admin-guide/) to explore the many Mattermost integrations already available. Then, browse the [Mattermost Marketplace](https://mattermost.com/marketplace/) to learn how our Mattermost Community is helping extend core Mattermost features with the Apps Framework to fit their specific organizational needs.

## What are Mattermost Apps?
Mattermost Apps are lightweight, interactive add-ons to Mattermost implemented as a collection of HTTP endpoints. You can write Mattermost apps in your language of choice, and your app is supported on all Mattermost clients, including web, desktop, and mobile.

Apps are available as a Developer Preview and we're looking for your feedback! Share constructive feedback in the [Mattermost Apps channel](https://community.mattermost.com/core/channels/mattermost-apps) on our Mattermost Community instance.

## What's the Mattermost Apps Framework?

*[what is it and how does it differ from the existing plugin framework?]*

Using the Mattermost Apps Framework, you can:

- Include full slash command control, including autocompletion.
- Post messages to channels using the Mattermost REST APIs.
- Add buttons to channel headers and post menus.
- Receive webhooks from Mattermost and third-party systems.
- Deliver an interactive app experience with dynamic fields and on-demand functions.

## Host Mattermost Apps
You can host your Mattermost Apps as HTTP services or as serverless functions running without dedicated infrastructure in one of three ways:

- **As a Mattermost Cloud app**. 
  - Cloud customers can use apps available on the [Mattermost Marketplace](https://mattermost.com/marketplace/). Marketplace apps are deployed as AWS Lambda functions, and their usage is included in the service. See our example AWS Lambda apps available for [JavaScript](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/js/aws_hello) and [Golang](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/hello-serverless).
- **As an external (HTTP) app**. 
  - Apps can be hosted as publicly (or privately) available HTTP services, and the choice of hosting provider is yours. A self-hosted Mattermost customer can install your app from a URL. **External apps are not currently accepted into or available from the Mattermost Marketplace.**
- **As a customer-deployable app**. 
  - An app can be packaged as a bundle, deployable by a customer in their own hosting environment. Currently, [AWS Lambda](https://aws.amazon.com/lambda/), [OpenFaaS](https://www.openfaas.com/), and [Kubeless](https://github.com/vmware-archive/kubeless) are supported, with plans for more serverless platforms, including [Kubernetes](https://kubernetes.io/), and [Docker Compose](https://github.com/docker/compose). **Customer-deployable apps are not yet distributed or available via the Mattermost Marketplace.**

## What's Next?

Learn how to get started developing apps using the Mattermost Apps Framework:
- Deploy with Docker
- Try out the test app
- Review frequently asked questions about the apps framework
- Learn how to troubleshoot common errors

## Deploy Mattermost with Docker

The following steps outline basic steps to deploy Mattermost with Docker. See our [deployment](https://docs.mattermost.com/guides/deployment.html#deploy-mattermost-for-production-use) product documentation for more information.

1. Clone the https://github.com/mattermost/docker repository.
2. Create a copy of the ``env.example`` file as a starting point: 
    ```
    cp env.example .env
    ```
    By default, this repository includes the latest Mattermost server ESR and the Mattermost enterprise binary. 
3. Edit the ENV file to change the following values:
   - The Mattermost server version and binary you want to work with. 
   - Your Mattermost server domain.
4. Create required directories and set their permissions: 

    ```
    mkdir -p ./volumes/app/mattermost/{config,data,logs,plugins,client/plugins,bleve-indexes}
    sudo chown -R 2000:2000 ./volumes/app/mattermost
    ```

5. Deploy the Mattermost server by running the following command:

    ```
    sudo docker-compose -f docker-compose.yml -f docker-compose.without-nginx.yml up -d
    ```
6. Access your Mattermost workspace for the first time based on the hostname and port specified in the ENV file. Follow the onboarding flow as the first first System Admin user for this Mattermost workspace.

## Try the test app

TBD

## Frequently asked questions

### When would you build an app vs. a custom slash command vs. a webhook vs. a plugin?

That depends on your use case, as they each have benefits.

The built-in [incoming webhook]({{< ref "incoming-webhooks" >}}) is great for simple use cases. It requires the incoming payload to contain a valid [Post](https://pkg.go.dev/github.com/nhannv/mattermost-server/model#Post) JSON object - but some external systems don't allow the customization of the fields included in the webhook payload. Compared to built-in webhooks, an App or plugin can be customized to receive an HTTP webhook posting from another system, and can process the incoming data then augment it or make an actionable message in a channel.

A plugin should be used when you need to [directly alter the UI]({{< ref "integrate/plugins/webapp/best-practices" >}}) in Mattermost or you have a feature that requires low latency with the server (such as replacing characters in any message [before it is saved]({{< ref "integrate/plugins/server/reference#Hooks.MessageWillBePosted" >}})). Currently, plugins have several [UX hooks]({{< ref "integrate/plugins/server/reference#Hooks" >}}) that apps cannot access, however we plan to add/migrate more UX hooks into the Apps Framework over time. Please see the [plugin documentation]({{< ref "integrate/plugins" >}}) for more information.

### What's the difference between the Apps Framework and the plugin framework?

The Apps Framework provides a few differences from plugins, including:

- Interactive elements are easier to use and develop.
- Compatible with both Mobile and Desktop clients without any extra code.

### What language should I use to write apps?

Any language you want. We currently have an [official driver for Go](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps), and we are planning to release other drivers in the future in conjunction with our community.

### Can I write "internal" organization-specific apps?

Yes. They can be packaged as "customer-deployable" bundles and then deployed on
the supported serverless platforms, or run as HTTP services on the
organization's own hosting infrastructure.
