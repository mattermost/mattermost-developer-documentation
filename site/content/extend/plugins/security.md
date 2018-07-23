---
title: Security
date: 2018-07-10T00:00:00-05:00
subsection: Plugins (Beta)
weight: 35
---

# Security

Plugins are powerful. You should only install plugins that you've thoroughly reviewed as they have the potential to compromise the security of your installation.

Only System Administrators can upload custom plugins. They can be disabled in the **System Console > Plugins > Configuration** page.

## Server Considerations

Plugins have the ability to execute arbitrary code on your server. If they aren't properly isolated, they can do just about *anything*. For example, they could read your config file to get your database password, connect to your database, then exfiltrate sensitive user information.

## Web App Considerations

Plugins have the ability to execute arbitrary code in client browsers. They have the ability to perform nearly any action on behalf of anyone using the web app.
