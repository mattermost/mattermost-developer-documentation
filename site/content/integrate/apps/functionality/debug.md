---
title: "Debug Apps"
heading: "Debug Apps"
description: "`/apps debug` command can be used to debug an App's bindings, KV store records, view the logs, etc."
weight: 50
---
The Apps framework includes a built-in slash command, `/apps debug`, that enables App debugging features, such as viewing logs and listing key/value (K/V) store records.

{{<note>}}
App debug features require the **Developer Mode** to be enabled. This can be done via [`/apps settings`]({{<ref "/integrate/apps/deploy/settings/">}}).
{{</note>}}

The following debug features are available as subcommands:

- [`logs`](#logs): streams App logs to a channel in Mattermost.
- `bindings`: fetches and displays an App's bindings, in the command's context, and any errors associated with it.
- `clean`: wipes out Apps and their data.
- `kv`: examine and modify App KV store records.
- `sessions`: examine the current pool of user sessions.
- `oauth`: examine App OAuth2 records.

## Debug subcommands

### Logs

The `logs` subcommand enables log streaming to a Mattermost channel.

The generic form of the `/apps debug logs` subcommand is:

```
/apps debug logs [--create-channel <true/false> | --channel <channel_id>] [--level <Debug/Info/Warning/Error>] [--json <true/false>]
```

The subcommand parameters are:

| Name             | Type    | Description                                                                                            |
|------------------|---------|--------------------------------------------------------------------------------------------------------|
| `create-channel` | boolean | Create a new channel to receive log messages. The new channel will be named `DEBUG: Apps Plugin Logs`. |
| `channel`        | string  | The ID of an existing channel to receive log messages.                                                 |
| `level`          | string  | The level of log messages to stream to the channel.<br/>One of `Debug`, `Info`, `Warning`, or `Error`. |
| `json`           | boolean | Include log entry properties, in JSON format, with log messages.                                       |


Examples:

- Enable App debug logging at `Info` level in a new channel:

  ```
  /apps debug logs --create-channel true --level Info
  ```

- Enable App debug logging at `Debug` level in an existing channel and include log entry properties:

  ```
  /apps debug logs --channel ytqokpzzcinszf7ywrbdfitusw --level Debug --json true 
  ```
