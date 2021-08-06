---
title: Interactions with Redux
heading: "Redux Interactions for Web App Plugins"
description: "Mattermost-redux is a library of shared code between Mattermost JavaScript clients. Learn how to use Redux with a plugin."
date: 2018-07-10T00:00:00-05:00
weight: 11
---

When building web app plugins, it is common to perform actions that web and mobile apps already support. The majority of these actions exist in [mattermost-redux](https://github.com/mattermost/mattermost-redux), our library of shared code between Mattermost JavaScript clients. The `mattermost-redux` library exports types and functions that are imported by the web application and mobile application. These functions can be imported by plugins and used the same way. There are a few different kinds of functions exported by the library:

[actions](https://github.com/mattermost/mattermost-redux/tree/master/src/actions) - Actions perform API requests and can change the state of Mattermost.

[client](https://github.com/mattermost/mattermost-redux/tree/master/src/client) - The client package can be used to instantiate a Client4 object, to interact with the Mattermost API directly. This is useful in plugins as well as JavaScript server applications communicating with Mattermost.

[constants](https://github.com/mattermost/mattermost-redux/tree/master/src/constants) - An assortment of constants within Mattermost's data model.

[selectors](https://github.com/mattermost/mattermost-redux/tree/master/src/selectors) - Selectors return certain data from the Redux store, such as getPost which allows you get a post by id from the Redux store.

[store](https://github.com/mattermost/mattermost-redux/tree/master/src/store) - Functions related to the Redux store itself.

[types](https://github.com/mattermost/mattermost-redux/tree/master/src/types) - Various types of objects in Mattermost's data model. These are useful in plugins written in Typescript.

[utils](https://github.com/mattermost/mattermost-redux/tree/master/src/utils) - Various utility functions shared across the web application and mobile application.

## Prerequisites

This guide assumes you have already set up your plugin development environment for webapp plugins to match [mattermost-plugin-starter-template](https://github.com/mattermost/mattermost-plugin-starter-template). If not, follow the README instructions of that repository first, or [see the Hello, World! guide](/extend/plugins/webapp/hello-world/).


## Basic Example

Here's an [example](https://github.com/mattermost/mattermost-plugin-jira/blob/master/webapp/src/components/modals/create_issue/index.ts) of a webapp plugin making use of [mattermost-redux's](https://github.com/mattermost/mattermost-redux) functions:

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


## Some Common Actions

We have listed out some of the commonly used actions that you can use in your web app plugin as per requirement. But you can always find all the actions that are available for your plugin to import [in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/tree/master/src/actions).

**createChannel**

This action should be dispatched when we intend to create a new channel

```javascript
export function createChannel(channel: Channel, userId: string): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        let created;
        try {
            created = await Client4.createChannel(channel);
        } catch (error) {
            forceLogoutIfNecessary(error, dispatch, getState);
            dispatch(batchActions([
                {
                    type: ChannelTypes.CREATE_CHANNEL_FAILURE,
                    error,
                },
                logError(error),
            ]));
            return {error};
        }
```

**getCustomEmoji**

This action should be dispatched when we intend to fetch a specific emoji associated with the emoji ID provided

```javascript
export function getCustomEmoji(emojiId: string): ActionFunc {
    return bindClientFunc({
        clientFunc: Client4.getCustomEmoji,
        onSuccess: EmojiTypes.RECEIVED_CUSTOM_EMOJI,
        params: [
            emojiId,
        ],
    });
}
```

**createPost**

This action should be dispatched when we intend to create a new post

```javascript
export function createPost(post: Post, files: any[] = []) {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        const state = getState();
        const currentUserId = state.entities.users.currentUserId;

        const timestamp = Date.now();
        const pendingPostId = post.pending_post_id || `${currentUserId}:${timestamp}`;
        let actions: Action[] = [];

        if (Selectors.isPostIdSending(state, pendingPostId)) {
            return {data: true};
        }

        let newPost = {
            ...post,
            pending_post_id: pendingPostId,
            create_at: timestamp,
            update_at: timestamp,
            reply_count: 0,
        };

        if (post.root_id) {
            newPost.reply_count = Selectors.getPostRepliesCount(state, post.root_id) + 1;
        }

        // We are retrying a pending post that had files
        if (newPost.file_ids && !files.length) {
            files = newPost.file_ids.map((id) => state.entities.files.files[id]); // eslint-disable-line
        }

        if (files.length) {
            const fileIds = files.map((file) => file.id);

            newPost = {
                ...newPost,
                file_ids: fileIds,
            };

            actions.push({
                type: FileTypes.RECEIVED_FILES_FOR_POST,
                postId: pendingPostId,
                data: files,
            });
        }

        actions.push({
            type: PostTypes.RECEIVED_NEW_POST,
            data: {
                ...newPost,
                id: pendingPostId,
            },
        });

```

**getMyTeams**

This action should be dispatched when we intend to fetch all the team types associated with

```javascript
export function getMyTeams(): ActionFunc {
    return bindClientFunc({
        clientFunc: Client4.getMyTeams,
        onRequest: TeamTypes.MY_TEAMS_REQUEST,
        onSuccess: [TeamTypes.RECEIVED_TEAMS_LIST, TeamTypes.MY_TEAMS_SUCCESS],
        onFailure: TeamTypes.MY_TEAMS_FAILURE,
    });
}
```

**createUser**

This action should be dispatched when we intend to create a new user profile

```javascript
export function createUser(user: UserProfile, token: string, inviteId: string, redirect: string): ActionFunc {
    return async (dispatch: DispatchFunc, getState: GetStateFunc) => {
        let created;

        try {
            created = await Client4.createUser(user, token, inviteId, redirect);
        } catch (error) {
            forceLogoutIfNecessary(error, dispatch, getState);
            dispatch(logError(error));
            return {error};
        }

        const profiles: {
            [userId: string]: UserProfile;
        } = {
            [created.id]: created,
        };
        dispatch({type: UserTypes.RECEIVED_PROFILES, data: profiles});

        return {data: created};
    };
}
```


## Some Common Selectors

We have listed out some of the commonly used selectors that you can use in your web app plugin as per requirement. But you can always find all the selectors that are available for your plugin to import [in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/tree/master/src/selectors).

**getCurrentUserId**

Retrieves the user ID of the current user from the Redux store

```javascript
export function getCurrentUserId(state) {
    return state.entities.users.currentUserId;
}
```

**getCurrentUser**

Retrieves the user profile of the current user from the Redux store

```javascript
export function getCurrentUser(state: GlobalState): UserProfile {
    return state.entities.users.profiles[getCurrentUserId(state)];
}
```

**getUsers**

Retrieves all user profiles from the Redux store

```javascript
export function getUsers(state: GlobalState): IDMappedObjects<UserProfile> {
    return state.entities.users.profiles;
}
```

**getChannel**

Retrieves a channel as it exists in the store without filling in any additional details such as the display_name for DM/GM channels.

```javascript
export function getChannel(state: GlobalState, id: string) {
    return getAllChannels(state)[id];
}
```

**getCurrentChannelId**

Retrieves the channel ID of the current channel from the Redux store

```javascript
export function getCurrentChannelId(state: GlobalState): string {
    return state.entities.channels.currentChannelId;
}
```

**getCurrentChannel**

Retrives the complete channel info of the current channel from the Redux Store

```javascript
export const getCurrentChannel: (state: GlobalState) => Channel = createSelector(
    getAllChannels,
    getCurrentChannelId,
    (state: GlobalState): UsersState => state.entities.users,
    getTeammateNameDisplaySetting,
    (allChannels: IDMappedObjects<Channel>, currentChannelId: string, users: UsersState, teammateNameDisplay: string): Channel => {
        const channel = allChannels[currentChannelId];

        if (channel) {
            return completeDirectChannelInfo(users, teammateNameDisplay, channel);
        }

        return channel;
    },
);
```

**getPost**

Retrieves the specific post associated with the supplied `postID` from the Redux Store

```javascript
export function getPost(state: GlobalState, postId: $ID<Post>): Post {
    return getAllPosts(state)[postId];
}
```

**getCurrentTeamId**

Retrieves the Team ID of the current team from the Redux store

```javascript
export function getCurrentTeamId(state: GlobalState) {
    return state.entities.teams.currentTeamId;
}
```

**getCurrentTeam**

Retrieves the team info of the current team from the Redux store

```javascript
export const getCurrentTeam: (state: GlobalState) => Team = createSelector(
    getTeams,
    getCurrentTeamId,
    (teams, currentTeamId) => {
        return teams[currentTeamId];
    },
);
```

**getCustomEmojisByName**

Retrieves the the specific emoji associated with the supplied `customEmojiName` from the Redux Store

```javascript
export const getCustomEmojisByName: (state: GlobalState) => Map<string, CustomEmoji> = createSelector(
    getCustomEmojis,
    (emojis: IDMappedObjects<CustomEmoji>): Map<string, CustomEmoji> => {
        const map: Map<string, CustomEmoji> = new Map();

        Object.keys(emojis).forEach((key: string) => {
            map.set(emojis[key].name, emojis[key]);
        });

        return map;
    },
);
```

**getConfig**

Retrieves the config of the server for admin analysis

```javascript
export function getConfig(state: GlobalState) {
    return state.entities.admin.config;
}
```


## Some Common Client Functions

We have listed out some of the widely used common client functions that you can use in your web app plugin as per requirement. But you can always find all the client functions that are available for your plugin to import [in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts).

**getUser**

Routes to the user profile of the specified `userId` from the Redux store

```javascript
 getUser = (userId: string) => {
        return this.doFetch<UserProfile>(
            `${this.getUserRoute(userId)}`,
            {method: 'get'},
        );
    };
```

**getUserByUsername**

Routes to the user profile of the specified `username` from the Redux store

```javascript
getUserByUsername = (username: string) => {
        return this.doFetch<UserProfile>(
            `${this.getUsersRoute()}/username/${username}`,
            {method: 'get'},
        );
    };
```

**getChannel**

Routes to the channel of the specified `channelId` from the Redux store

```javascript
getChannel = (channelId: string) => {
        this.trackEvent('api', 'api_channel_get', {channel_id: channelId});

        return this.doFetch<Channel>(
            `${this.getChannelRoute(channelId)}`,
            {method: 'get'},
        );
    };
```

**getChannelByName**

Routes to the channel of the specified `channelName` from the Redux store.

```javascript
 getChannelByName = (teamId: string, channelName: string, includeDeleted = false) => {
        return this.doFetch<Channel>(
            `${this.getTeamRoute(teamId)}/channels/name/${channelName}?include_deleted=${includeDeleted}`,
            {method: 'get'},
        );
    };
```

**getTeam**

Routes to the team of the specified `teamId` from the Redux store.

```javascript
  getTeam = (teamId: string) => {
        return this.doFetch<Team>(
            this.getTeamRoute(teamId),
            {method: 'get'},
        );
    };
```

**getTeamByName**

Routes to the team of the specified `teamName` from the Redux store

```javascript
  getTeamByName = (teamName: string) => {
        this.trackEvent('api', 'api_teams_get_team_by_name');

        return this.doFetch<Team>(
            this.getTeamNameRoute(teamName),
            {method: 'get'},
        );
    };
```

**executeCommand**

Executes the specified command with the arguments provided and fetches the response.

```javascript
   executeCommand = (command: string, commandArgs: CommandArgs) => {
        this.trackEvent('api', 'api_integrations_used');

        return this.doFetch<CommandResponse>(
            `${this.getCommandsRoute()}/execute`,
            {method: 'post', body: JSON.stringify({command, ...commandArgs})},
        );
    };
```

**getOptions**

This call is needed in order to make custom requests to the server.

```javascript
  getOptions(options: Options) {
        const newOptions: Options = {...options};

        const headers: {[x: string]: string} = {
            [HEADER_REQUESTED_WITH]: 'XMLHttpRequest',
            ...this.defaultHeaders,
        };

        if (this.token) {
            headers[HEADER_AUTH] = `${HEADER_BEARER} ${this.token}`;
        }

        const csrfToken = this.csrf || this.getCSRFFromCookie();
        if (options.method && options.method.toLowerCase() !== 'get' && csrfToken) {
            headers[HEADER_X_CSRF_TOKEN] = csrfToken;
        }

        if (this.includeCookies) {
            newOptions.credentials = 'include';
        }

        if (this.userAgent) {
            headers[HEADER_USER_AGENT] = this.userAgent;
        }

        if (newOptions.headers) {
            Object.assign(headers, newOptions.headers);
        }

        return {
            ...newOptions,
            headers,
        };
    }
```

You can also refer to the [Redux developer guide](https://developers.mattermost.com/contribute/webapp/redux/) to learn more about the [Redux actions](https://developers.mattermost.com/contribute/webapp/redux/actions/), [Redux selectors](https://developers.mattermost.com/contribute/webapp/redux/selectors/), and [Redux reducers](https://developers.mattermost.com/contribute/webapp/redux/reducers/) and gain insights into how these can be used in your Web App plugins.
