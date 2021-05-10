---
title: "Actions"
heading: "Actions in Redux - Mattermost"
description: "Similar to other frameworks like Flux, actions in Redux represent a single change to the Redux store as a plain JavaScript object."
date: 2017-08-20T11:35:32-04:00
weight: 4
---

Similar to other frameworks like Flux, actions in Redux represent a single change to the Redux store as a plain JavaScript object.

```javascript
{
    type: 'SELECT_CHANNEL',
    data: channelId
}
```

They are created by functions called action creators. In regular Redux, this function will take some arguments and return an action representing how the store should be changed. Something to note with Mattermost Redux is that we typically refer to the action creators as the "actions" themselves since there's often a single action creator for a given type of action.

```javascript
function selectChannel(channelId) {
    return {
        type: 'SELECT_CHANNEL',
        data: channelId
    };
}
```

This action is later received by the Redux store's reducers which will know how to read the contents of the action and modify the store accordingly.

Because we use the [Thunk middleware for Redux](https://github.com/gaearon/redux-thunk), we have the ability to use more powerful action creators that can read the state of the store, perform asynchronous actions like network requests, and dispatch multiple actions when needed. Instead of returning a plain object, these action creators return a function that takes the Redux store's `dispatch` and `getState` to be able to dispatch actions as needed.

```javascript
function loadAndSelectChannel(channelId) {
    return async (dispatch, getState) => {
        const {channels} = getState().entities.channels;

        if (!channels.hasOwnProperty(channelId)) {
            // Optionally call another action to asynchronously load the channel over the network
            dispatch(setChannelLoading(true));

            await dispatch(loadChannel(channelId));

            dispatch(setChannelLoading(false));
        }

        // Switch to the channel
        dispatch(selectChannel(channelId));
    };
}
```

Actions live in the `src/actions` directory with the constants that define their types being in the `src/action_types` directory.

## Using Actions

To use an action, you need to pass it into the `dispatch` method of the Redux store so that it can be passed off to the reducers.

```javascript
const store = createReduxStore();

store.dispatch(loadAndSelectChannel(channelId));
```

Since both the Mattermost web and mobile apps also use React, the `dispatch` method is provided for us by using the `connect` function [React Redux](https://github.com/reactjs/react-redux) to wrap our components.

```javascript
// src/components/widget/index.jsx

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {loadAndSelectChannel} from 'src/actions/channels';

import Widget from './widget';

// mapDispatchToProps is used to automatically attach `store.dispatch` to the actions
// so that the component doesn't need to know that it even exists
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ // bindActionCreators does the hard work here
            loadAndSelectChannel
        }, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(Widget);

// src/components/widget/widget.jsx

export default class Widget extends React.PureComponent {
    handleClick = () => {
        // Note that we aren't passing in dispatch here since it's already been
        // done by bindActionCreators
        this.props.actions.loadAndSelectChannel(this.props.channelId);
    };

    render() {
        return (
            <button onClick={this.handleClick}>
                {'Click me!'}
            </button>
        );
    }
}
```

## Adding an Action

To add a new Redux action, you must

1. If you're adding a new action type, add a constant to one of the files in `src/action_types` to be the type of your new action. This is only required if your action is going to be dispatching a unique action instead of just dispatching existing actions.

    ```javascript
    export default keyMirror({
        DO_ACTION: null
    });
    ```

2. Add an action creator to `src/actions`. This function needs to either return a plain JavaScript object for a regular action or a function for a Thunk action. If it's a Thunk action, it should also return an object with two fields: a `data` field containing the results of the action and an `error` field containing an error if one occurs.

    ```javascript
    function doSimpleAction() {
        return {
            type: ActionTypes.DO_SIMPLE_ACTION,
            data: 1234
        };
    }

    function doThunkAction() {
        return async (dispatch, getState) => {
            let data;
            try {
                data = await doSomething();
            } catch(e) {
                const error = {
                    message: e.message
                };

                dispatch({
                    type: ActionTypes.DO_THUNK_ACTION_FAILED,
                    data: error
                });

                return error;
            }

            dispatch({
                type: ActionTypes.DO_THUNK_ACTION,
                data
            });

            return {
                data
            };
        };
    }
    ```

3. If you're adding a new action type, add or update existing reducers to handle the new action. More information about reducers is available [here](/contribute/redux/reducers/).
4. Add unit tests to make sure that the action has the intended effects on the store. Test location is adjacent to the file being tested. Example, for `src/actions/admin.js`, test is located at `src/actions/admin.test.js`.  Add test file if necessary. More information on unit testing reducers is available below.

### Adding a new API Action

If your action is wrapping an API call, there's a few things that you will need to do differently:

1. For your endpoint, you'll need to add a new method to the JavaScript client located in `src/client/client4.js`. This method will look similar to the other methods in that class.

2. In addition to the new action type that you'll be adding, you'll also normally need to add action types to indicate the status of the request. These are not required for optimistic actions.
    ```javascript
    // For a getUser request
    export default keyMirror({
        // Used to update the request state in the store
        USER_REQUEST: null,
        USER_SUCCESS: null,
        USER_FAILURE: null,

        // Used to pass new user data to the store
        USER_RECEIVED: null
    });
    ```
3. When adding the action creator, if it simply calls the client, you can use the `bindClientFunc` helper function to create it for you. More complicated calls will need to dispatch different request actions as necessary.

    ```javascript
    export function getUser(userId) {
        return bindClientFunc(
            Client4.getUser, // The client method
            UserTypes.USER_REQUEST, // The type of action dispatched when the request is started
            [UserTypes.RECEIVED_USER, UserTypes.USER_SUCCESS], // One or more types of actions dispatched when the request is completed
            UserTypes.USER_FAILURE, // The type of action dispatched when the request fails
            userId // Any other arguments to the action that will be passed to the client call
        );
    }
    ```
4. Make the necessary changes to the reducers to handle your action as well as adding a reducer to update the `requests` section of the store. In most cases, you can use the `handleRequest` and `initialRequestState` helper functions to construct the reducer for you. More information about reducers is available [here](/contribute/redux/reducers/).
    ```javascript
    function getUser(state = initialRequestState(), action) {
        return handleRequest(
            UserTypes.USER_REQUEST,
            UserTypes.USER_SUCCESS,
            UserTypes.USER_FAILURE,
            state,
            action
        );
    }

    export default combineReducers({
        getUser
    });
    ```
5. Add unit tests to make sure that the action has the intended effects on the store. Test location is adjacent to the file being tested. Example, for `src/actions/admin.js`, test is located at `src/actions/admin.test.js`.  Add test file if necessary. More information on unit testing reducers is available below.

### Testing an Action

Unit tests for actions are located in the same directory, adjacent to the file being tested. These tests are written using [Jest Testing Framework](https://jestjs.io/). In that folder, there are many examples of how those tests should look. Most follow the same general pattern of:
1. Construct the initial test state. Note that this doesn't need to be shared between tests as it is in many other cases.
2. Mock any actions that would contact the server. This is done using the [nock server mocking framework](https://github.com/node-nock/nock) to mock the server.
3. Dispatch the action and look for the results.
