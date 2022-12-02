---
title: "Using /apps debug command"
heading: "Using /apps debug command"
description: "`/apps debug` command can be used to debug an App's bindings, KV store records, view the logs, etc."
weight: 100
aliases:
  - /integrate/apps/apps-debug/
---

This reference guide documents /apps debug command that can be used to display
and modify apps' bindings, KV store records, and other data. This command is
available exclusively in developer mode **TODO** link.

The following subcommands are available:
- `bindings` fetches and displays an app's bindings, in the command's context, and any errors associated with it.
- `logs` controls streaming apps logs to a channel in Mattermost.
- `clean` wipes out apps and their data.
- `kv` examine and modify apps' KV store records. (quirky!)
- `sessions` examine the current pool of user sessions.
- `oauth` examine apps' OAuth2 records.

