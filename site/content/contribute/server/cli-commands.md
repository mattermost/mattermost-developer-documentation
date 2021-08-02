---
title: "CLI Commands"
heading: "CLI Commands in Mattermost"
description: "Mattermost provides a CLI (command-line interface) to administer and handle specific administrative tasks."
date: 2018-09-21T18:40:32-04:00
weight: 5
---

Mattermost provides a CLI (command-line interface) to administer and handle specific administrative tasks.

## Understanding the CLI

The CLI interface is written in [Cobra](https://github.com/spf13/cobra), a
powerful and modern CLI creation library. If you have never used Cobra before, it is
well documented in its [GitHub Repository](https://github.com/spf13/cobra).

The source code used to build our CLI interface is written in the `cmd/mattermost` directory of the [mattermost-server](https://github.com/mattermost/mattermost-server) repository.

Each "command" of the CLI is stored in a different file of the
`cmd/mattermost/commands` directory. Within each file, you can find
multiple "subcommands".

## Adding a New Subcommand

If you want to add a new subcommand in an existing mattermost command, first find the relevant file. For example, if you want to add a `show` command to
the `channel` command, go to `cmd/mattermost/commands/channel.go` and add your subcommand there.

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
func showChannelCmdF(command *cobra.Command, args []string) error {
    app, err := InitDBCommandContextCobra(command)
    if err != nil {
        return err
    }
    defer app.Shutdown()

    // Your code implementing the command itself

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

Finally, implement unit tests in `cmd/mattermost/commands/channel_test.go`.

## Adding a New Command

If you want to add a new command to Mattermost, first create a file for the command.
For example, if you want to add a new `emoji` command to manage emojis in
Mattermost from the CLI, create `cmd/mattermost/commands/emoji.go`
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

## Submitting your Pull Request

Please submit a pull request against the [mattermost/mattermost-server](https://github.com/mattermost/mattermost-server) repository by [following these instructions](/contribute/server/developer-workflow/).
