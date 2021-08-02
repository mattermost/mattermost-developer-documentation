---
title: "Server Build (Team Edition)"
heading: "Server Build - Mattermost Team Edition"
description: "Find out how to customize and build your own version of the Mattermost open source project."
date: 2018-05-20T11:35:32-04:00
weight: 1
---

If plugin functionalities don't cover your use cases, you have the freedom to customize and build your own version of the `mattermost-server` project.

Before proceeding with the steps below, make sure you have completed the [mattermost-server setup](/contribute/server/developer-setup/) process.

1. Customize the project according to your requirements.

2. Build binary files for Mattermost server.  
```
make build
```

3. Assemble essential files.  
```
make package
```  

4. Transfer desired `.tar.gz` file to server for deployment.
