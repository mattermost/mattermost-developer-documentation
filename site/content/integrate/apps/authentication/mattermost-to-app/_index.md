---
title: "From Mattermost"
heading: "Authenticating incoming requests from Mattermost"
description: "TODO"
weight: 200
---

- HTTP apps can request that Mattermost includes a secret-based JWT in each request. See [HTTP Deployment]({{< ref "deploy-http">}}) for more.
- AWS apps are invoked via the AWS Lambda `Invoke` and S3 `Get` APIs, which are authenticated with "invoke" AWS credentials (access/secret keys). See [AWS Deployment]({{< ref "deploy-aws">}}) for more.
- OpenFaaS Call and static authentication are still TBD.