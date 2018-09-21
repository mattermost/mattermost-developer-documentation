---
title: "New CLI Commands"
date: 2018-09-21T18:40:32-04:00
weight: 5
subsection: Server
---

# New CLI Commands

Mattermost provides a CLI interface to administer and deal with specific administration tasks.

## Understanding the CLI

The CLI interface is written in [Cobra](https://github.com/spf13/cobra), a
powerful and modern CLI creation library. If you never used Cobra before, it is
well documented in its [Github Repository](https://github.com/spf13/cobra).

All the code used build our CLI interface is written in the `cmd/mattermost`
directory of the
[mattermost-server](https://github.com/mattermost/mattermost-server)
repository.

Each "command" of the CLI is stored in a different file of the
`cmd/mattermost/commands` directory. And inside that file you will find
multiple "subcommands".

## Adding a new subcommand

If you want to add a new subcommand in an existing mattermost command, you must
to find the proper file, for example, if you want to add a `show` command to
the `channel` command, you go to the `cmd/mattermost/commands/channel.go` file,
and there, you add the subcommand.

To add the subcommand you start creating a new `Command` instance, for example:

```go
var ChannelShowCmd = &cobra.Command{
      Use:   "show",
      Short: "Show channel info",
      Long:  "Show the channel information, including name, header, purpose and the number of members.",
      Example: "  channel show --team myteam --channel mychannel"
      RunE: showChannelCmdF,
}
```

After that, you need to implement the subcommand function, in this example `showChannelCmdF`.

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

Now, you set the flags of your subcommand and register it in the command. In our case we register our new `ChannelShowCmd` in to the `ChannelCmd`.

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

And finally, you implement the tests in the `cmd/mattermost/commands/channel_test.go`.

## Adding a new Command.

If you want to add a new command to mattermost, you must to create the file,
for example, if you want to add a `emoji` command to manage the emojis in
mattermost from the CLI, you create the `cmd/mattermost/commands/emoji.go`
file, and there you create your command and your subcommands.

A command is exactly the same that a subcommand, so you can follow the same
steps of the previous version, but, you must to register the new command in the
"Root" command.

```go
var EmojiCmd = &cobra.Command{
      Use:   "emoji",
      Short: "Emoji management",
      Long:  "Lists, creates and deletes custom emojis",
}
func init() {
    ...
    RootCmd.AddCommand(EmojiCmd)
    ...
}
```

Normally after that you want to add a bunc of subcommand to do the different
tasks.

## Submitting your Pull Request

Please submit a pull request against the [mattermost/mattermost-server](https://github.com/mattermost/mattermost-server) repository by [following these instructions](/contribute/server/developer-workflow).
