---
title: Best Practices
date: 2018-07-10T00:00:00-05:00
subsection: Server Plugins
weight: 0
---

## How should server plugins handle static files?

Add all static files under a file directory named `public` within the plugin directory, and include it in the plugin's Makefile. 

Then use `ServePluginPublicRequest` to serve the public plugin files at http(s)://$SITE_URL/plugins/$PLUGIN_ID/public/{your-static-file}`.
