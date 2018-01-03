---
draft: true
title: "Actions"
date: 2017-08-20T11:35:32-04:00
weight: 4
subsection: Redux
---

# Actions

Actions are any sort of logic that will result in the manipulation of store state. The means by which actions manipulate the store is through dispatches. Dispatches will take an object with an action type and some data, and pass it along to the reducers to be transformed into the correct format and placed in the state of the store. An example action might be getting a user, which would use the web client utility to fetch the user and then dispatch that user to the store.

Actions live in the `src/actions/` directory.

## Adding an Action

Actions must:

* Return [async functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) so the caller can [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) on them
* The async function must return an object with an error property containing the error (`{error: yourerrorhere}`), while dispatching an error to store state
* The async function must return the result in an object containing data (`{data: yourresulthere}`) or if there is nothing to return `true` in place of the result, while dispatching the data
* May be chained to return the results of other actions
* Be unit tested

Follow the steps below to add a new action.

### Add Action Types

Action types are the constants the reducers use to know what type of data they are receiving and what to do with it. Generally, there are two kinds of action types you'll need to worry about: data and requests.

Data action types are what you'll use to dispatch the result of your action to the reducers. If your action is manipulating or fetching data in a format already handled by the store, then there might be no need to add a new action type. An example data action type is `RECEIVED_USER`.

Request action types are used to track the state of server requests. Non-optimisitic actions that use the web client utility to interact with the server need three request action types, one for the start of the request, one for success and one for failure. If the request you're using already has action types, then no need to add any. Examples of request action types are `USER_REQUEST`, `USER_SUCCESS` and `USER_FAILURE`.

Note that if you're planning on writing an optimistic action, you do not need to specify request action types.

Add your action types to the appropriate file in `src/action_types/`. When adding request action types you'll also need to add the reducer in `src/reducers/requests/`. Just follow the examples in those files, it's fairly straight forward.

### Add a Web Service Function

If your action is going to use a new REST API endpoint on the server, you'll need to add a function to the web client utility.

The web client lives at `src/client/client4.js`. [Fetch](https://developer.mozilla.org/en/docs/Web/API/Fetch_API) is the library used to interact with the Mattermost REST API.

Adding a function should also be fairly straight-forward, just use the existing functions as an example.

### Implementing the Action

The actual implementation of the action will vary depending on what you're trying to accomplish. Actions live in the `src/actions/` directory. Make sure to add your action to the appropriate file.

If your action is a one-to-one mapping of a web client function, all you need to do is use the `bindClientFunc` function to do the mapping.

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

The above action just gets a user and is a one-to-one mapping to the `getUser` web client function.

If it's not a one-to-one mapping and you need to manipulate the data you get back from the web client, then you'll need to do a bit more manual work.

```javascript
export function getProfiles(page = 0, perPage = General.PROFILE_CHUNK_SIZE) {
    return async (dispatch, getState) => {
      dispatch({type: UserTypes.PROFILES_REQUEST}, getState);

      const {currentUserId} = getState().entities.users;

      let profiles;
      try {
          profiles = await Client4.getProfiles(page, perPage);
          removeUserFromList(currentUserId, profiles);
      } catch (error) {
          forceLogoutIfNecessary(error, dispatch);
          dispatch(batchActions([
              {type: UserTypes.PROFILES_FAILURE, error},
              getLogErrorAction(error)
          ]), getState);
          return {error};
      }

      dispatch(batchActions([
          {
              type: UserTypes.RECEIVED_PROFILES_LIST,
              data: profiles
          },
          {
              type: UserTypes.PROFILES_SUCCESS
          }
      ]));

      return {data: profiles};
    };
}
```

In the above action, we need to remove the current user from profile list so that we don't overwrite it in the state. Because of the need to do that, we could not use `bindClientFunc`.

It is also possible to write optimistic actions that dispatch data to the store immediately before waiting for a response from the server. These are a little more advanced and should only be used in situations that warrant them. The framework that drives this is [redux-offline](https://github.com/jevakallio/redux-offline).

```javascript
export function deletePost(post) {
    return async (dispatch) => {
        const delPost = {...post};

        dispatch({
            type: PostTypes.POST_DELETED,
            data: delPost,
            meta: {
                offline: {
                    effect: () => Client4.deletePost(post.id),
                    commit: {type: PostTypes.POST_DELETED},
                    rollback: {
                        type: PostTypes.RECEIVED_POST,
                        data: delPost
                    }
                }
            }
        });
    };
}
```

There can also be actions that just wrap one or more existing actions.

```javascript
export function flagPost(postId) {
    return async (dispatch, getState) => {
        const {currentUserId} = getState().entities.users;
        const preference = {
            user_id: currentUserId,
            category: Preferences.CATEGORY_FLAGGED_POST,
            name: postId,
            value: 'true'
        };

        return await savePreferences(currentUserId, [preference])(dispatch, getState);
    };
}
```

Make sure to also add your function to the default export at the bottom of the file.

### Testing the Action

The final piece is testing your action. We use the [mochajs framework](https://mochajs.org/) for testing, along with the [nock server mocking framework](https://github.com/node-nock/nock) to mock the server.

The tests for actions live in `test/actions/`. Add your test to the appropriate file following one of the many examples for the other actions.

Make sure to read the [README](https://github.com/mattermost/mattermost-redux/blob/master/README.md) for information on running the tests.
