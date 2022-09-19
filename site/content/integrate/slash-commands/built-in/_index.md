---
title: Built-in commands
heading: Built-in slash commands
weight: 10
---
Each Mattermost installation comes with some built-in slash commands that are ready to use. These commands are available in the [latest Mattermost release](https://mattermost.com/download):

| Command                                               | Description                                                                                       | Example                                                    |
|:------------------------------------------------------|:--------------------------------------------------------------------------------------------------|:-----------------------------------------------------------|
| /away                                                 | Set your availablity to away                                                                      | /away                                                      |
| /offline                                              | Set your availablity to offline                                                                   | /offline                                                   |
| /online                                               | Set your availablity to online                                                                    | /online                                                    |
| /dnd                                                  | Set your availablity to Do Not Disturb                                                            | /dnd                                                       |
| /code *{text}*                                        | Display text as a code block                                                                      | /code File bugs                                            |
| /collapse                                             | Turn on auto-collapsing of image previews                                                         | /collapse                                                  |
| /expand                                               | Turn off auto-collapsing of image previews                                                        | /expand                                                    |
| /echo *{message}* *{delay in seconds}*                | Echo back text from your account                                                                  | /echo Hello World 5                                        |
| /header *{text}*                                      | Edit the channel header                                                                           | /header File bugs here                                     |
| /invite *@{user}* *~{channel-name}*                   | Invite user to the channel                                                                        | /invite @john ~sampleChannel                               |
| /purpose *{text}*                                     | Edit the channel purpose                                                                          | /purpose A channel to discuss bugs                         |
| /rename *{text}*                                      | Rename the channel                                                                                | /rename Developers                                         |
| /help                                                 | Display Mattermost product documentation links                                                    | /help                                                      |
| /invite *@{user}* *~{channel-name}*                   | Invite user to the channel                                                                        | /invite @john ~sampleChannel                               |
| /invite_people *{name@domain.com ...}*                | Send an email invite to your Mattermost team                                                      | /invite_people john@example.com                            |
| /kick (or /remove) *{@username}*                      | Remove a member from a public or private channel                                                  | /kick @alice                                               |
| /join (or /open) *{channel-name}*                     | Join the given channel                                                                            | /join off-topic                                            |
| /leave                                                | Leave the current channel                                                                         | /leave                                                     |
| /mute                                                 | Turn off desktop, email and push notifications for the current channel or the [channel] specified | /mute ~[channel]                                           |
| /logout                                               | Log out of Mattermost                                                                             | /logout                                                    |
| /me *{message}*                                       | Do an action                                                                                      | /me Hello World                                            |
| /msg *{@username}* *{message}*                        | Send a Direct Message to a user                                                                   | /msg @alice hello                                          |
| /groupmsg *{@username1, @username2, ...}* *{message}* | Send a Group Message to the specified users                                                       | /groupmsg @alice, @bob hello                               |
| /search *{text}*                                      | Search text in messages                                                                           | /search meeting                                            |
| /settings                                             | Open the Settings dialog                                                                          | /settings                                                  |
| /shortcuts                                            | Display a list of keyboard shortcuts                                                              | /shortcuts                                                 |
| /shrug *{message}*                                    | Add `¯\_(ツ)_/¯` to your message                                                                   | /shrug oh well                                             |
| /status *{emoji_name}* *{descriptive status_message}* | Set a custom status that includes an optional emoji and a descriptive status message              | /status sick Feeling unwell and taking time off to recover |
| /status clear                                         | Clear the current status                                                                          | /status clear
| /marketplace                                          | Open the Mattermost product Marketplace                                                           | /marketplace

{{<note "Note:">}}
`/status` and `/status clear` slash commands listed above will be available in the Mattermost Mobile App in a future release.
{{</note>}}

To create a custom slash command, see the [Custom slash commands]({{< ref "/integrate/slash-commands/custom" >}}) documentation.
