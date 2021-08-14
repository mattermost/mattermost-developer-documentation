---
title: Redux Actions
heading: "Redux Actions for Web App Plugins"
description: "Mattermost-redux is a library of shared code between Mattermost JavaScript clients. Learn how to use Redux actions with a plugin."
date: 2018-07-10T00:00:00-05:00
weight: 11
aliases: [/extend/plugins/webapp/actions/]
---

When building web app plugins, it is common to perform actions or access the state that web and mobile apps already support. The majority of these actions exist in [mattermost-redux](https://github.com/mattermost/mattermost-redux), our library of shared code between Mattermost JavaScript clients. The `mattermost-redux` library exports types and functions that are imported by the web application. These functions can be imported by plugins and used the same way. There are a few different kinds of functions exported by the library:

* [actions](https://github.com/mattermost/mattermost-redux/tree/master/src/actions) - Actions perform API requests and can change the state of Mattermost.
* [client](https://github.com/mattermost/mattermost-redux/tree/master/src/client) - The client package can be used to instantiate a Client4 object, to interact with the Mattermost API directly. This is useful in plugins as well as JavaScript server applications communicating with Mattermost.
* [constants](https://github.com/mattermost/mattermost-redux/tree/master/src/constants) - An assortment of constants within Mattermost's data model.
* [selectors](https://github.com/mattermost/mattermost-redux/tree/master/src/selectors) - Selectors return certain data from the Redux store, such as getPost which allows you get a post by id from the Redux store.
* [store](https://github.com/mattermost/mattermost-redux/tree/master/src/store) - Functions related to the Redux store itself.
* [types](https://github.com/mattermost/mattermost-redux/tree/master/src/types) - Various types of objects in Mattermost's data model. These are useful for plugins written in Typescript.
* [utils](https://github.com/mattermost/mattermost-redux/tree/master/src/utils) - Various utility functions shared across the web application.

## Prerequisites

This guide assumes you have already set up your plugin development environment for web app plugins to match [mattermost-plugin-starter-template](https://github.com/mattermost/mattermost-plugin-starter-template). If not, follow the README instructions of that repository first, or [see the Hello, World! guide]({{< ref "/integrate/plugins/webapp/hello-world/" >}}).

## Basic example

Here's an [example](https://github.com/mattermost/mattermost-plugin-jira/blob/master/webapp/src/components/modals/create_issue/index.ts) of a web app plugin making use of [mattermost-redux's](https://github.com/mattermost/mattermost-redux) functions:

```javascript
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';

import {closeCreateModal, createIssue, fetchJiraIssueMetadataForProjects, redirectConnect} from 'actions';
import {isCreateModalVisible, getCreateModal} from 'selectors';

import CreateIssue from './create_issue_modal';

const mapStateToProps = (state) => {
    const {postId, description, channelId} = getCreateModal(state);
    const post = (postId) ? getPost(state, postId) : null;
    const currentTeam = getCurrentTeam(state);

    return {
        visible: isCreateModalVisible(state),
        post,
        description,
        channelId,
        currentTeam,
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    close: closeCreateModal,
    create: createIssue,
    fetchJiraIssueMetadataForProjects,
    redirectConnect,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CreateIssue);
```

## Some common actions

We've listed out some of the commonly-used actions that you can use in your web app plugin. You can find all the actions that are available for your plugin to import [in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/tree/master/src/actions).

* ### [createChannel(channel: Channel, userId: string)](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/actions/channels.ts#L47)

Dispatch this action to create a new channel.


* ### [getCustomEmoji(emojiId: string)](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/actions/emojis.ts#L32)

Dispatch this action to fetch a specific emoji associated with the `emojiId` provided.


* ### [createPost(post: Post, files: any[] = [])](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/actions/posts.ts#L162)

Dispatch this action to create a new post.


* ### [getMyTeams()](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/actions/teams.ts#L67)

Dispatch this action to fetch all the team types associated with the current user.


* ### [createUser(user: UserProfile, token: string, inviteId: string, redirect: string)](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/actions/users.ts#L53)

Dispatch this action to create a new user profile.


## Some common selectors

We've listed out some of the commonly-used selectors that you can use in your web app plugin. You can find all the selectors that are available for your plugin to import [in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/tree/master/src/selectors).

* ### [getCurrentUserId(state)](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/common.ts#L46)

Retrieves the `userId` of the current user from the `Redux store`.


* ### [getCurrentUser(state: GlobalState): UserProfile](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/common.ts#L42)

Retrieves the user profile of the current user from the `Redux store`.


* ### [getUsers(state: GlobalState): IDMappedObjects<UserProfile>](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/common.ts#L50)

Retrieves all user profiles from the `Redux store`.


* ### [getChannel(state: GlobalState, id: string)](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/channels.ts#L218)

Retrieves a channel as it exists in the store without filling in any additional details such as the `display_name` for Direct Messages/Group Messages.


* ### [getCurrentChannelId(state: GlobalState)](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/common.ts#L14)

Retrieves the channel ID of the current channel from the `Redux store`.


* ### [getCurrentChannel: (state: GlobalState)](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/channels.ts#L235)

Retrieves the complete channel info of the current channel from the `Redux store`.


* ### [getPost(state: GlobalState, postId: $ID<Post>)](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/posts.ts#L46)

Retrieves the specific post associated with the supplied `postID` from the `Redux store`.


* ### [getCurrentTeamId(state: GlobalState)](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/teams.ts#L20)

Retrieves the `teamId` of the current team from the `Redux store`.


* ### [getCurrentTeam: (state: GlobalState)](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/teams.ts#L57)

Retrieves the team info of the current team from the `Redux store`.


* ### [getCustomEmojisByName: (state: GlobalState)](https://github.com/mattermost/mattermost-redux/blob/master/src/selectors/entities/emojis.ts#L37)

Retrieves the the specific emoji associated with the supplied `customEmojiName` from the `Redux store`.


## Some common client functions

We've listed out some of the commonly-used client functions that you can use in your web app plugin. You can find all the client functions that are available for your plugin to import [in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts).

* ### [getUser = (userId: string)](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts#L846)

Routes to the user profile of the specified `userId` from the `Mattermost Server`.


* ### [getUserByUsername = (username: string)](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts#L853)

Routes to the user profile of the specified `username` from the `Mattermost Server`.


* ### [getChannel = (channelId: string)](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts#L1600)

Routes to the channel of the specified `channelId` from the `Mattermost Server`.


* ### [getChannelByName = (teamId: string, channelName: string, includeDeleted = false)](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts#L1609)

Routes to the channel of the specified `channelName` from the `Mattermost Server`.


* ### [getTeam = (teamId: string)](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts#L1192)

Routes to the team of the specified `teamId` from the `Mattermost Server`.


* ### [getTeamByName = (teamName: string)](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts#L1199)

Routes to the team of the specified `teamName` from the `Mattermost Server`.


* ### [executeCommand = (command: string, commandArgs: CommandArgs)](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts#L2463)

Executes the specified command with the arguments provided and fetches the response.


* ### [getOptions(options: Options) {const newOptions: Options = {...options}](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts#L440)

Get the client options to make requests to the server. Use this to create your own custom requests.

    ## Custom reducers and actions

Reducers in Redux are pure functions that describe how the data in the store changes after any given action. Reducers will always produce the same resulting state for a given state and action. You can register a custom reducer for your plugin against the Redux store with the `registerReducer` function.

### [registerReducer(reducer)]({{< ref "/plugins/webapp/reference/#registerReducer/" >}})

Registers a reducer against the Redux store. It will be accessible in Redux state under `state['plugins-<yourpluginid>']`. It generally accepts a reducer and returns undefined.

You can also refer to the [Redux developer guide]({{< ref "/contribute/webapp/redux/" >}}) to learn more about the [Redux actions]({{< ref "/webapp/redux/actions/" >}}), [Redux selectors]({{< ref "/webapp/redux/selectors/" >}}), and [Redux reducers]({{< ref "/webapp/redux/reducers/" >}}) and gain insights into how these can be used in your web app plugins.
