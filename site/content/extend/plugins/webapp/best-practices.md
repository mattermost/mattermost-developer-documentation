---
title: Best Practices
date: 2019-06-02T00:00:00-00:00
subsection: Web App Plugins
weight: 0
---

This page provides best practices for web app plugins.

## User Experience

### Plugin placement in the user interface

1. Actions that apply to specific channels
- Recommendation: Have your plugin register the actions to [the channel header](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerChannelHeaderButtonAction). This makes it quickly accessible by users and actions apply to the channel they're viewing. You can additionally [register a slash command](https://developers.mattermost.com/extend/plugins/server/reference/#API.RegisterCommand) on the server-side to take channel-specific actions.
- Examples: Jira project subscriptions to a channel; Zoom meeting posts to a channel

2. Actions that apply to specific messages
- Recommendation: Have your plugin register a [post dropdown menu component](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerPostDropdownMenuComponent) with some text, icon and an action function. This adds your action to the "More Actions" post menu dropdown.
- Examples: Create or attach to Jira issue from a message; Copy a message to another channel; report an inappropriate message

3. Actions related to files or images
- Recommendation: Have your plugin register a [file upload method](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerFileUploadMethod) with some text, icon and an action function. This adds your action to the file upload menu.
- Examples: File sharing from OneDrive or GDrive; Draw plugin for sketches

4. Actions that apply to specific users
- Recommendation: Have your plugin register a [popover user actions component](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerPopoverUserActionsComponent). This adds your action to the user profile popover. 
- Examples: ..

5. Attributes added for a user
- Recommendation: Have your plugin register a [popover user attribute component](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerPopoverUserAttributesComponent). This adds your attributes to the user profile popover. 
- Examples: Custom User Attributes plugin

6. Actions related to emoji and GIFs
- Recommendation: Have your plugin add a component to the emoji picker. This is not yet supported, but some [work had previously started](https://github.com/mattermost/mattermost-server/issues/10412#issuecomment-481776595) with the issue currently opeend as Help Wanted
- Examples: Bitmoji plugin; GIFs via Giphy or Gfycat

7. Actions that apply to specific teams
- Recommendation: Have your plugin register [left sidebar header component](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerLeftSidebarHeaderComponent) with some text, icon and an action function. This adds your action above your team's channels in the sidebar.
- Examples: Trello kanban board plugin, ..

8. Quick links or status summaries of workflows ..??
- Recommendation: Have your plugin register a [bottom team sidebar component](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerBottomTeamSidebarComponent). This adds ... to ...
- Examples: GitHub sidebar links with summary of outstanding reviews or unread messages; ServiceNow incident status summary

9. Global actions that can be taken anywhere in the server and not directly related to teams, channels or users
- Recommendation: Have your plugin register [main menu action](https://developers.mattermost.com/extend/plugins/webapp/reference/#registerMainMenuAction) with some text, icon for mobile, and an action function. This adds your action to the Main Menu. You can additionally [register a slash command](https://developers.mattermost.com/extend/plugins/server/reference/#API.RegisterCommand) on the server-side.
- Examples: Share feedback plugin in Main Menu; /jira slash commands for quick actions
