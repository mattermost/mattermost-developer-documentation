---
title: "From Mattermost"
heading: "Authenticate incoming requests from Mattermost"
weight: 20
---

- HTTP apps can request that Mattermost includes a secret-based JWT in each request. See {{< newtabref href="https://docs.mattermost.com/guides/deploy-http.html" title="HTTP Deployment" >}} for details.
- AWS apps are invoked via the AWS Lambda `Invoke` and S3 `Get` APIs, which are authenticated with "invoke" AWS credentials (access/secret keys). See [AWS Deployment]("https://docs.mattermost.com/guides/deploy-aws.html") for more.
- OpenFaaS and Kubeless calls and static authentication are still TBD.
