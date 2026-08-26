---
title: "CLI commands"
heading: "CLI commands and mmctl"
description: "Mattermost provides a CLI tool (mmctl) to to enable access to Mattermost Server from the command line."
date: 2022-03-15T18:40:32-04:00
weight: 5
aliases:
  - /contribute/server/cli-commands
---

As of 6.0, Mattermost CLI has been replaced by {{< newtabref href="https://github.com/mattermost/mmctl" title="mmctl" >}}. `mmctl` is built to enable access to Mattermost server from the command line. The tool leverages the public API so that administrator and user tasks can be performed.

Since `mmctl` uses the public API, an authorization mechanism is required. Which means the access rights are managed on the server side. There is a pre-run check to read credentials and use it in the client. In addition to authentication via credentials, `mmctl` can communicate to a local server without any authentication. This must be enabled via server configuration and both `mmctl` and `mattermost/server` needs to be running in the same machine.

In addition to provide more functionality towards testing and development, `db` subcommand has been added Mattermost server binary.

The CLI interface is written using {{< newtabref href="https://github.com/spf13/cobra" title="Cobra" >}}, a
powerful and modern CLI creation library. If you have never used Cobra before, it is
well documented in its {{< newtabref href="https://github.com/spf13/cobra" title="GitHub Repository" >}}.

The source code used to build our CLI interface is written in the `commands` directory of the {{< newtabref href="https://github.com/mattermost/mmctl" title="mmctl" >}} repository.

Each "command" of the CLI is stored in a different file of the
`commands` directory. Within each file, you can find
multiple "subcommands".

## Add a new subcommand

If you want to add a new subcommand in an existing mattermost command, first find the relevant file. For example, if you want to add a `show` command to
the `channel` command, go to `commands/channel.go` and add your subcommand there.

To add the subcommand, start by creating a new `Command` instance, for example:

```go
var ChannelShowCmd = &cobra.Command{
    Use:   "show",
    Short: "Show channel info",
    Long:  "Show channel information, including the name, header, purpose and the number of members.",
    Example: "  channel show --team myteam --channel mychannel"
    RunE: showChannelCmdF,
}
```

Then implement the subcommand function, in this example `showChannelCmdF`.

```go
func showChannelCmdF(c client.Client, cmd *cobra.Command, args []string) error {
    // Your code implementing the command itself
    newChannel, _, err := c.ShowChannel(channel)
	if err != nil {
		return err
	}

    return nil
}
```

Now, you set the flags of your subcommand and register it in the command. In our case we register our new `ChannelShowCmd` flag in `ChannelCmd`.

```go
func init() {
    ...

    ChannelShowCmd.Flags().String("team", "", "Team name or ID")
    ChannelShowCmd.Flags().String("channel", "", "Channel name or ID")
    ...
    ChannelCmd.AddCommand(
        ...
        ChannelShowCmd,
    )
    ...
}
```

Finally, implement unit tests in `commands/channel_test.go` and end-to-end tests to commands/channel_e2e_test.go`.

## Add a new command

If you want to add a new command to `mmctl`, first create a file for the command.
For example, if you want to add a new `emoji` command to manage emojis in
Mattermost from the CLI, create `commands/emoji.go`
and add your command and your subcommands there.

A command is exactly the same as a subcommand, so you can follow the same
steps of the previous section. However, you must also register the new command in the
"Root" command as follows:

```go
var EmojiCmd = &cobra.Command{
    Use:   "emoji",
    Short: "Emoji management",
    Long:  "Lists, creates and deletes custom emoji",
}
func init() {
    ...
    RootCmd.AddCommand(EmojiCmd)
    ...
}
```

Usually, you would then add several subcommands to perform various tasks.

## Team and channel migration (scoped export/import)

`mmctl export create` and `mmctl import process` support exporting and importing a single team, a subset of teams, or individual channels, instead of the whole server. This is useful for moving a team or channel between Mattermost instances without a full-server export.

### Export flags

| Flag | Description | Notes |
| --- | --- | --- |
| `--team-name` | One or more team names/slugs, comma-separated. | Mutually exclusive with `--team-id`. |
| `--team-id` | One or more team IDs, comma-separated. | Mutually exclusive with `--team-name`. |
| `--channel-name` | One or more channel names within the specified team(s), comma-separated. | Requires `--team-name` or `--team-id`. Mutually exclusive with `--channel-id`. Only validated client-side (at invocation time) when exactly one team is in scope; with multiple teams, channels that don't exist are silently skipped. |
| `--channel-id` | One or more channel IDs, comma-separated. The team is inferred from each channel when no team flag is given. | Mutually exclusive with `--channel-name`. If teams are given, each channel must belong to one of them. |

```
# Export a single team by name
mmctl export create --team-name engineering

# Export multiple teams in one pass
mmctl export create --team-name engineering,sales

# Export only specific channels within a team
mmctl export create --team-name engineering --channel-name dev-talk,announcements

# Export a channel by ID; its team is inferred automatically
mmctl export create --channel-id xyz789
```

Direct messages and group messages are never included in a scoped export — a full, unscoped export is required to migrate DM history. The export's version line records the source team/channel scope (`ExportScopeAdditional`) so the import side knows what it's dealing with; exports produced by older binaries without this metadata still work when `--destination-team-name` is used, falling back to inferring the source team name from the first team entry in the export file.

### Import flags

| Flag | Description | Notes |
| --- | --- | --- |
| `--destination-team-name` | Remap the source team to a different team name on the destination. If the destination team doesn't yet exist, it is created as part of the import. | Mutually exclusive with `--destination-team-id`. Requires a single-team export; fails if the export contains multiple teams. |
| `--destination-team-id` | Remap to an existing destination team by ID. The team must already exist — the ID is looked up and validated before the job is created. | Mutually exclusive with `--destination-team-name`. Requires a single-team export; fails if the export contains multiple teams. |
| `--destination-channel-name` | Rename the imported channel on the destination, by name. | Only valid for channel-scoped exports; mutually exclusive with `--destination-channel-id`. Validated when the import job starts, not at invocation time. |
| `--destination-channel-id` | Map to an existing destination channel by ID. | Only valid for channel-scoped exports; mutually exclusive with `--destination-channel-name`. The channel must already exist — the ID is looked up and validated at invocation time. |
| `--skip-preflight` | Skip the check that source SSO/auth providers are enabled on the destination. | By default, import fails if an auth provider present in the export (LDAP, SAML, GitLab, Google, Office 365, or OpenID) isn't configured on the destination. Only applies to ZIP-packaged imports; JSONL-only imports skip this check regardless. |
| `--workers` | Number of concurrent import goroutines. Defaults to the host CPU count; capped at 4x CPU count. | Optional; omit to use the default. |

```
# Remap the source team to a destination team by name (created if missing)
mmctl import process <importname> --destination-team-name engineering-destination

# Remap to an existing destination team by ID instead
mmctl import process <importname> --destination-team-id abc-123-def

# Channel-scoped import: also rename the channel on the destination
mmctl import process <importname> --destination-team-name engineering-destination --destination-channel-name team-announcements
```

`<importname>` is the name the file is known by on the destination server (returned by `mmctl import upload`), not a local file path — see the steps below.

### Migration steps

1. **Export from the source server.**

    ```
    # Kick off a scoped export job on the source server
    mmctl export create --team-name engineering
    ```

    This starts an export job and prints its job ID. Poll it until it succeeds:

    ```
    # See recent export jobs and their status
    mmctl export job list

    # Check a specific job once you have its ID
    mmctl export job show <exportJobID>
    ```

2. **Find and download the export file**, still against the source server:

    ```
    # List completed export files available to download
    mmctl export list

    # Download the file to a local path
    mmctl export download <exportname> engineering-export.zip
    ```

3. **Upload the file to the destination server.** Point `mmctl` at the destination instance (switch context, or pass `--server`/config flags) and upload it:

    ```
    # Upload the downloaded file to the destination server
    mmctl import upload engineering-export.zip

    # Find the <importname> the server assigned to your upload
    mmctl import list available
    ```

    `import list available` shows the `<importname>` the server assigned to the upload — use that in the next step. If `mmctl` and the destination server run on the same machine, you can skip the upload step entirely with `--local --bypass-upload`, passing the local file path directly as `<importname>`. Note that `--bypass-upload` does not work when the destination server is running in high availability (HA) mode.

4. **Run the import**, mapping to the destination team (and channel, if this was a channel-scoped export):

    ```
    # Start the import job, remapping to the destination team
    mmctl import process <importname> --destination-team-name engineering-destination
    ```

5. **Monitor the job**, and re-run the same command if it fails partway through — it detects its own checkpoint and prompts to resume rather than starting over:

    ```
    # See recent import jobs and their status
    mmctl import job list

    # Check a specific job once you have its ID
    mmctl import job show <importJobID>
    ```

### Example: moving a single channel to another instance

Move the `dev-talk` channel out of the `engineering` team on one instance, into an `engineering-destination` team on another, renaming it to `archived-dev-talk` along the way.

On the source server:

```
# Create a channel-scoped export of dev-talk from the engineering team
mmctl export create --team-name engineering --channel-name dev-talk

# Poll until the job's status is "success"
mmctl export job list

# Confirm the export file is ready
mmctl export list

# Pull it down locally so it can be moved to the destination server
mmctl export download dev-talk-export.zip dev-talk-export.zip
```

On the destination server:

```
# Upload the export file to the destination server
mmctl import upload dev-talk-export.zip

# Note the <importname> mmctl reports, e.g. 35uy6cwrqfnhdx3genrhqqznxc_dev-talk-export.zip
mmctl import list available

# Import it, remapping to the destination team and renaming the channel
mmctl import process 35uy6cwrqfnhdx3genrhqqznxc_dev-talk-export.zip \
  --destination-team-name engineering-destination \
  --destination-channel-name archived-dev-talk

# Watch the import job until it completes (re-run the command above to resume if it fails)
mmctl import job list
```

If `engineering-destination` doesn't exist yet on the destination, it's created automatically. All of the channel's posts, reactions, and file attachments are recreated under `archived-dev-talk`; any post author not already present on the destination is created as a deactivated, `importedInactive`-tagged placeholder account.

### Behavior notes

- **User matching**: For scoped imports (any export with team or channel scope), the importer matches post authors to destination users first by `auth_data` (for SSO/LDAP-authenticated accounts). If no `auth_data` match is found, a deactivated placeholder account is created — there is no username fallback for SSO users in this path, because usernames can change across instances (e.g. via SAML attribute sync) and a username match could silently link content to the wrong account. For local (non-SSO) accounts, matching falls back to username; if no match is found, a deactivated placeholder is created so the post keeps its author. For full (non-scoped) imports, SSO users that don't match by `auth_data` do fall back to username before a placeholder is created.

- **Deactivated placeholder accounts**: Placeholder accounts created for unmatched users are tagged with an `importedInactive = "true"` user property. This allows admin tooling and the Mattermost UI to distinguish imported-inactive placeholders from ordinary deactivated accounts.

- **Team display name**: When `--destination-team-name` or `--destination-team-id` is used and the destination team already exists, the team's current display name on the destination is preserved rather than overwritten by the export. If the destination team does not yet exist, it is created using the display name from the export. For a plain re-import without a destination-remap flag, the display name is always set from the export (overwriting the current value if the team already exists).

- **Resuming a failed import**: For imports whose uncompressed JSONL content is 100 MB or larger, the importer writes progress checkpoints as it processes the file. If `mmctl import process` is re-run against the same file after a prior run failed (reached `error` status), it detects the checkpoint and interactively prompts to resume from the last completed point rather than starting over. This prompt only appears when stdin is a terminal; scripted/CI runs skip straight to a fresh run. Imports below the 100 MB threshold do not write checkpoints, so the resume prompt never appears for them. If the import filename changes between runs, the checkpoint is silently ignored and the import starts fresh.

- **Idempotency**: Posts and files that already exist on the destination (matched by content) are skipped rather than duplicated, so re-running a completed import is safe.

## Submit your pull request

Please submit a pull request against the {{< newtabref href="https://github.com/mattermost/mmctl" title="mattermost/mmctl" >}} repository by [following these instructions]({{< ref "/contribute/more-info/server/developer-workflow" >}}).
