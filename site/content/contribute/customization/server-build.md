---
title: "Server Build (Team Edition)"
date: 2018-05-20T11:35:32-04:00
weight: 1
subsection: Customizing Mattermost
---

# Server Build (Team Edition)
If plugin functionalities don't cover your use cases, you have the freedom to customize and build your own version of the `mattermost-server` project.

Before proceeding with the steps below, make sure you have completed the [mattermost-server setup](/contribute/server/developer-setup/) process.

1. Customize the project according to your requirements.

3. Build binary files for Mattermost server.  
```
make build
```

4. Assemble essential files.  
```
make package
```  

5. Transfer desired `.tar.gz` file to server for deployment.