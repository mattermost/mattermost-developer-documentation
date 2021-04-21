---
title: "Apps (Developers Preview)"
heading: "Introduction"
description: "Apps are lightweight interactive add-ons to Mattermost."
section: "integrate"
weight: 90
---

Apps are lightweight, interactive add-ons to Mattermost which use serverless hosting to run without any dedicated infrastructure. Apps can:

- Display interactive, dynamic Modal forms and Message Actions.
- Attach themselves to locations in the Mattermost user interface (e.g. channel bar buttons, post menu, channel menu, commands), and can add their custom `/` commands with full Autocomplete.
- Receive webhooks from Mattermost, and third-parties, and use the Mattermost REST APIs to post messages, etc.
- Be hosted externally (HTTP), on Mattermost Cloud (AWS Lambda), and soon in self-managed as well as customers' own AWS environments.
- Work on both Mobile and Desktop Mattermost clients so developers can focus on the functionality of their apps, and can be written in several different languages.
- Can be deployed using our Mattermost Serverless hosting infrastructure that keeps data within the secure cloud environment and allows for unexpected scaling of usage.

The new Marketplace in Mattermost Cloud is being launched alongside the new Apps Framework and will include two new listings: ServiceNow and Zendesk helps DevOps support agents monitor new incidents and customer requests while investigating critical events.

Apps are available as a Developers Preview and we're looking for your feedback! Share constructive feedback in the [Mattermost Apps channel](https://community.mattermost.com/core/channels/mattermost-apps) on our Mattermost community instance.

Read the [quick start guide]({{< ref  "quick-start-go" >}}) to learn how to write your first app.

## Mattermost Serverless App Hosting

The Mattermost Apps framework provides the ability to extend Mattermost’s integration capabilities using any programming language. Unlike plugins that must be hosted on the Mattermost server itself, Apps can be hosted anywhere.  The new Mattermost Serverless App Hosting service provides a secure environment for Mattermost Cloud customers to install Apps from the Marketplace and have them hosted in the same secure environment as Mattermost Cloud.  Developers who create Mattermost Serverless apps using a serverless development approach can easily deploy Apps securely, efficiently, and at scale in the Mattermost Cloud compared to other SaaS offerings. 

Currently, when a customer wants to deploy an app to their infrastructure - they need to provision a server that will host some code such as a Python script.  This server will handle any incoming requests at any time and must be equipped for high volume in the case of incidents that trigger many notifications to Mattermost at once, as such - it must be maintained as a high-availability asset that can scale.  The IT Team also needs to deploy code changes to that server over time and maintain the host OS’s security patches and so on. If this server fails, critical notifications in Mattermost will be missed.  

With Mattermost Serverless Hosting, cloud customers will be deploying Apps (note; Not plugins) such as ServiceNow and Zendesk using our Mattermost Serverless hosting infrastructure.  They will install these Apps through the Marketplace, which instantiates a new Serverless function in the cloud and awaits any notifications sent to Mattermost from the external services. It is a high availability environment that scales on-demand.  Code updates to the App are provisioned through Mattermost as they are released.  Since a server is not needed to remain idle for long periods of inactivity, costs are reduced.  Another benefit is code deployments have no downtime associated - and all the data is kept within the same secure environment as Mattermost Cloud.  

With other SaaS offerings, integrations are offered with a limit of Apps on a free account (Slack limits to 10 Apps).  With Mattermost Serverless hosting we are advancing a hosting usage model: integration traffic determines costs, not the number of Apps installed.  Customers benefit from more integrations. Moreover, this model opens up our hosting engine to open source developers who can create Apps that are easy to deploy, without them needing to pay for third-party hosting and managing customers’ data - your data remains in the Mattermost Cloud environment at all times. 

Each “use” of an App is tracked - an example may be receiving a notification from ServiceNow to a Mattermost channel, or a user creating a ServiceNow ticket from Mattermost.  These costs are minimal, less than a penny per execution - and most customers are not expected to pay overages, because they will be below their included usage allocations for their product tier.   

Mattermost serverless hosting allows for easy App installation by a system administrator from the App Marketplace and uses AWS Lambda serverless technology to power our App Hosting in order to provide stable, reliable service for the Mattermost Cloud Infrastructure without the data ever leaving the Mattermost Cloud environment. Serverless app hosting for self-managed customers is planned in Q3 with serverless engines such as OpenFaas, OpenWhisk, or AWS Lambda.

To get started using the Matterhost service, install either the Zendesk or ServiceNow App from the App Marketplace to experience our first 2 serverless apps in action. If you haven’t yet created a Mattermost Cloud Workspace you can create one HERE, and then visit the Marketplace from within the Mattermost main menu.   

## FAQ

### What serverless technology is powering Matterhost?  

We are using AWS Lambda service to host our serverless applications with a custom built provisioning system to manage the serverless instances.  The Lambda instances reside within the VPC that hosts our Mattermost Cloud Environment.

### Is it hard for a developer to build a serverless app for Matterhost?

No, it is simple to convert existing apps or to build a new App with the serverless approach in mind. Refer to our developer documentation to learn more: <link>.

### As a developer do I need to do anything different to make my App hostable by Mattermost Serverless?

Yes, you will need to code your application in such a way that it can be run in a serverless environment.  This may be simple using a library such as ‘Vendia’ <<LINK and Details>>  You can read more about this approach in our App Framework Documentation site <<Best practices for Serverless hosting DOC>>

## Development environment

Visit the [Developer Setup Guide](https://developers.mattermost.com/contribute/server/developer-setup/) for information about setting up your development environment.

## Functions and calls

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/hello.go#L45) `send` function.
- [Post Menu Message Flow]({{< ref example-post-menu >}}) - Message flow to define a Post Menu action, then have a user click it.
- godoc: [Call](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Call) - Describes how to call a function.
- godoc: [CallRequest](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#CallRequest) - Structure of a request to a function.
- godoc: [Context](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Context) - Extra data passed to call requests.
- godoc: [Expand](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Expand) - Controls context expansion.

## Forms

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/send_form.json) `send` form.
- [Interactive Message Flows]({{< ref example-interactivity >}}) - Message flow to define a Post Menu action, then have a user click it.
- godoc [Form](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Form)
- godoc [Field](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Field)

## Bindings and locations

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/bindings.json) bindings.
- godoc [Binding](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/apps#Binding)

## Autocomplete

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/bindings.json) bindings.

## Modals

- Example: [Hello, World](https://github.com/mattermost/mattermost-plugin-apps/tree/master/examples/go/helloworld/send_form.json) `send` form.

## In-post interactivity

({{< ref "example-interactivity" >}})

## Using Mattermost APIs

{{< ref "using-mattermost-api" >}}

## Using third-party APIs

{{< ref "using-third-party-api" >}}

## App Lifecycle

- [App Lifecycle]({{< ref "lifecycle" >}})
- godoc: [appsctl](https://pkg.go.dev/github.com/mattermost/mattermost-plugin-apps/cmd/appsctl) - CLI tool used to provision Mattermost Apps in development and production.
