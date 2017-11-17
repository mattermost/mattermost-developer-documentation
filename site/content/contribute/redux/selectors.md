---
draft: true
title: "Selectors"
date: 2017-08-20T11:35:32-04:00
weight: 5
subsection: "redux"
---

# Selectors

Selectors are the method used to retrieve data from the state of the store. We use [reselect](https://github.com/reactjs/reselect). If you'd like to know more about reselect and how we use it at Mattermost, [check out this developer talk given by core developer Harrison Healey](https://www.youtube.com/watch?v=6N2X7gEwmaQ).

Selectors live in the `src/selectors/` directory.

## Adding a Selector

Selectors must:

* Receive `state` as the first argument and return data based solely on what's in the state
* Be created with `createSelector` whenever the data is manipulated or formatted before return
* Be unit tested

Follow the steps below to add a new selector.

### Implementing the Selector

If your selector is just pulling data directly from the state without any manipulation, simply return the data you need.


```javascript
export function getUser(state, id) {
  return state.entities.users.profiles[id];
}
```

The above example is just simply pulling a user out of the profiles entity and requires no computation or formatting.

If your selector needs to select based on some more advanced requirements or needs the result in a specific format then you'll need to make use of the `createSelector` function from [reselect](https://github.com/reactjs/reselect). If you're not sure what this is good for, [check out the previously mentioned developer talk](https://www.youtube.com/watch?v=6N2X7gEwmaQ). The short form reason is using reselect allows for memoization and only runs the computation of selectors when the state affecting that selector has actually changed.

The basic usage for `createSelector` is to pass it all the selector functions needed as inputs to your computation. The last argument should then be a function that takes in the results of each previous selector, performs some computations, and then returns the result.

```javascript
export const getUsersByUsername = createSelector(
    getUsers,
    (users) => {
      const usersByUsername = {};

      for (const id in users) {
          if (users.hasOwnProperty(id)) {
              const user = users[id];
              usersByUsername[user.username] = user;
          }
      }

      return usersByUsername;
    }
);
```

Here we're using the `getUsers` selector to feed users into our function that builds a map of users with username as the key.

So far that's pretty straightforward, but what if you want to select some data based on an argument? That is a little more tricky if you haven't wrapped your head around the purpose of reselect and how createSelector works, so if you haven't watched the developer talk linked above, I would strongly suggest it.

To accomplish this we need to create factory function that will create the selector, instead of just creating the selector directly.

```javascript
function getAllFiles(state) {
    return state.entities.files.files;
}

function getFilesIdsByPosts(state, post) {
    return state.entities.files.fileIdsByPostId;
}

export function makeGetFilesForPost() {
    return createSelector(
      getAllFiles,
      getFilesIdsForPost,
      (state, postId) => postId,
      (allFiles, fileIdsForPost, postId) => {
          return fileIdsForPost.map((id) => allFiles[id]);
      }
    );
}

// Usage by a third party application
const getFilesForPost = makeGetFilesForPost();
const files = getFilesForPost(state, 'somepostid');
```

This can look a bit confusing, but there is little happening here we haven't seen before. All that we're doing is using three selectors with `createSelector`, the third selector just happens to be returning its second argument so that our final function has access to it. Remember that every selector always takes state in as the first argument.

If you're thinking, "I don't get it. Why can't we just create the selector normally?" then think about how selectors work and remember that if the state changes then the computation happens again. When the postId changes, that counts as a state change, so every time we provide a different `postId` to our selector we lose all the benefits of memoization, which is the whole reason for using reselect. Instead, we create copies of our selector everywhere we know the post id shouldn't change frequently. That may seem a little crazy at first, but if you think about how componentized React is, it's not that bad. All you really need to do is use the factory function to create an instance of your selector for each component and use it solely for that component.

### Testing the Selector

To test your selector you'll want to add a test to the appropriate file in the `tests/selectors` directory.

Testing selectors invovles building some test state and confirming that the data returned from your selector matches what you would expect it to return. Use other tests as examples and make sure to read the [README](https://github.com/mattermost/mattermost-redux/blob/master/README.md) for information on running the tests.
