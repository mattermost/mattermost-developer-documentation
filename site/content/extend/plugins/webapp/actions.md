---
title: Interactions with Redux
heading: "Redux Interactions for Web App Plugins"
description: "Mattermost-redux is a library of shared code between Mattermost JavaScript clients. Learn how to use Redux with a plugin."
date: 2018-07-10T00:00:00-05:00
weight: 11
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

This guide assumes you've already set up your plugin development environment for web app plugins to match [mattermost-plugin-starter-template](https://github.com/mattermost/mattermost-plugin-starter-template). If not, follow the README instructions of that repository first, or [see the Hello, World! guide]({{< ref "/webapp/hello-world/" >}}).

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

<details>
    <summary> <b>createChannel</b> <br/>

Dispatch this action to create a new channel.</summary>

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
</details>

<details>
    <summary> <b>getCustomEmoji</b> <br/>

Dispatch this action to fetch a specific emoji associated with the `emojiId` provided.</summary>

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
</details>

<details>
    <summary> <b>createPost</b> <br/>

Dispatch this action to create a new post.</summary>

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
</details>

<details>
    <summary> <b>getMyTeams</b> <br/>

Dispatch this action to fetch all the team types associated with the current user.</summary>

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
</details>

<details>
    <summary> <b>createUser</b> <br/>

Dispatch this action to create a new user profile.</summary>

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
</details>

## Some common selectors

We've listed out some of the commonly-used selectors that you can use in your web app plugin. You can find all the selectors that are available for your plugin to import [in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/tree/master/src/selectors).

<details>
    <summary> <b>getCurrentUserId</b> <br/>

Retrieves the `userId` of the current user from the `Redux store`.</summary>

```javascript
export function getCurrentUserId(state) {
    return state.entities.users.currentUserId;
}
```
</details>

<details>
    <summary> <b>getCurrentUser</b> <br/>

Retrieves the user profile of the current user from the `Redux store`.</summary>

```javascript
export function getCurrentUser(state: GlobalState): UserProfile {
    return state.entities.users.profiles[getCurrentUserId(state)];
}
```
</details>

<details>
    <summary> <b>getUsers</b> <br/>

Retrieves all user profiles from the `Redux store`.</summary>

```javascript
export function getUsers(state: GlobalState): IDMappedObjects<UserProfile> {
    return state.entities.users.profiles;
}
```
</details>

<details>
    <summary> <b>getChannel</b> <br/>

Retrieves a channel as it exists in the store without filling in any additional details such as the `display_name` for Direct Messages/Group Messages.</summary>

```javascript
export function getChannel(state: GlobalState, id: string) {
    return getAllChannels(state)[id];
}
```
</details>

<details>
    <summary> <b>getCurrentChannelId</b> <br/>

Retrieves the channel ID of the current channel from the `Redux store`.</summary>

```javascript
export function getCurrentChannelId(state: GlobalState): string {
    return state.entities.channels.currentChannelId;
}
```
</details>

<details>
    <summary> <b>getCurrentChannel</b> <br/>

Retrieves the complete channel info of the current channel from the `Redux store`.</summary>

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
</details>

<details>
    <summary> <b>getPost</b> <br/>

Retrieves the specific post associated with the supplied `postID` from the `Redux store`.</summary>

```javascript
export function getPost(state: GlobalState, postId: $ID<Post>): Post {
    return getAllPosts(state)[postId];
}
```
</details>

<details>
    <summary> <b>getCurrentTeamId</b> <br/>

Retrieves the `teamId` of the current team from the `Redux store`.</summary>

```javascript
export function getCurrentTeamId(state: GlobalState) {
    return state.entities.teams.currentTeamId;
}
```
</details>

<details>
    <summary> <b>getCurrentTeam</b> <br/>

Retrieves the team info of the current team from the `Redux store`.</summary>

```javascript
export const getCurrentTeam: (state: GlobalState) => Team = createSelector(
    getTeams,
    getCurrentTeamId,
    (teams, currentTeamId) => {
        return teams[currentTeamId];
    },
);
```
</details>

<details>
    <summary> <b>getCustomEmojisByName</b> <br/>

Retrieves the the specific emoji associated with the supplied `customEmojiName` from the `Redux store`.</summary>

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
</details>

## Some common client functions

We've listed out some of the commonly-used client functions that you can use in your web app plugin. You can find all the client functions that are available for your plugin to import [in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/blob/master/src/client/client4.ts).

<details>
    <summary> <b>getUser</b> <br/>

Routes to the user profile of the specified `userId` from the `Mattermost Server`.</summary>

```javascript
 getUser = (userId: string) => {
        return this.doFetch<UserProfile>(
            `${this.getUserRoute(userId)}`,
            {method: 'get'},
        );
    };
```
</details>

<details>
    <summary> <b>getUserByUsername</b> <br/>

Routes to the user profile of the specified `username` from the `Mattermost Server`.</summary>


```javascript
getUserByUsername = (username: string) => {
        return this.doFetch<UserProfile>(
            `${this.getUsersRoute()}/username/${username}`,
            {method: 'get'},
        );
    };
```
</details>

<details>
    <summary> <b>getChannel</b> <br/>

Routes to the channel of the specified `channelId` from the `Mattermost Server`.</summary>

```javascript
getChannel = (channelId: string) => {
        this.trackEvent('api', 'api_channel_get', {channel_id: channelId});

        return this.doFetch<Channel>(
            `${this.getChannelRoute(channelId)}`,
            {method: 'get'},
        );
    };
```
</details>

<details>
    <summary> <b>getChannelByName</b> <br/>

Routes to the channel of the specified `channelName` from the `Mattermost Server`.</summary>

```javascript
 getChannelByName = (teamId: string, channelName: string, includeDeleted = false) => {
        return this.doFetch<Channel>(
            `${this.getTeamRoute(teamId)}/channels/name/${channelName}?include_deleted=${includeDeleted}`,
            {method: 'get'},
        );
    };
```
</details>

<details>
    <summary> <b>getTeam</b> <br/>

Routes to the team of the specified `teamId` from the `Mattermost Server`.</summary>

```javascript
  getTeam = (teamId: string) => {
        return this.doFetch<Team>(
            this.getTeamRoute(teamId),
            {method: 'get'},
        );
    };
```
</details>

<details>
    <summary> <b>getTeamByName</b> <br/>

Routes to the team of the specified `teamName` from the `Mattermost Server`.</summary>

```javascript
  getTeamByName = (teamName: string) => {
        this.trackEvent('api', 'api_teams_get_team_by_name');

        return this.doFetch<Team>(
            this.getTeamNameRoute(teamName),
            {method: 'get'},
        );
    };
```
</details>

<details>
    <summary> <b>executeCommand</b> <br/>

Executes the specified command with the arguments provided and fetches the response.</summary>

```javascript
   executeCommand = (command: string, commandArgs: CommandArgs) => {
        this.trackEvent('api', 'api_integrations_used');

        return this.doFetch<CommandResponse>(
            `${this.getCommandsRoute()}/execute`,
            {method: 'post', body: JSON.stringify({command, ...commandArgs})},
        );
    };
```
</details>

<details>
    <summary> <b>getOptions</b> <br/>

Get the client options to make requests to the server. Use this to create your own custom requests.</summary>

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
</details>

## Custom reducers and actions

Reducers in Redux are pure functions that describe how the data in the store changes after any given action. Reducers will always produce the same resulting state for a given state and action. You can register a custom reducer for your plugin against the Redux store with the `registerReducer` function. You can refer to this [documentation]({{< ref "/webapp/reference/#registerReducer/" >}}).

<details>
    <summary> <b>registerReducer</b> <br/>

Registers a reducer against the Redux store. It will be accessible in Redux state under `state['plugins-<yourpluginid>']`. It generally accepts a reducer and returns undefined.</summary>

```javascript
  registerReducer(reducer)
```
</details>

You can also refer to the [Redux developer guide]({{< ref "/webapp/redux/" >}}) to learn more about the [Redux actions]({{< ref "/redux/actions/" >}}), [Redux selectors]({{< ref "/redux/selectors/" >}}), and [Redux reducers]({{< ref "/redux/reducers/" >}}) and gain insights into how these can be used in your web app plugins.
    
    [see the Hello, World! guide]({{< ref "/webapp/hello-world/" >}})
