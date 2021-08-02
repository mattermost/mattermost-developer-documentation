---
title: Redux Actions
heading: "Redux Actions for Web App Plugins"
description: "Mattermost-redux is a library of shared code between Mattermost JavaScript clients. Learn how to use Redux actions with a plugin."
date: 2018-07-10T00:00:00-05:00
weight: 11
---

When building web app plugins, it is common to perform actions that web and mobile apps already support. The majority of these actions exist in [mattermost-redux](https://github.com/mattermost/mattermost-redux), our library of shared code between Mattermost JavaScript clients.

Here we'll show how to use Redux actions with a plugin. To learn more about these actions, see the [contributor documentation](/contribute/redux/actions/).

## Prerequisites

This guide assumes you have already set up your plugin development environment for web app plugins to match [mattermost-plugin-starter-template](https://github.com/mattermost/mattermost-plugin-starter-template). If not, follow the README instructions of that repository first, or [see the Hello, World! guide](/extend/plugins/webapp/hello-world/).

## Import mattermost-redux

First, you'll need to add `mattermost-redux` as a dependency of your web app plugin.

```bash
cd /path/to/plugin/webapp
npm install mattermost-redux
```

That will add `mattermost-redux` as a dependency in your `package.json` file, allowing it to be imported into any of your plugin's JavaScript files.

## Use an Action

Actions are used as part of components. To give components access to these actions, we pass them in as React props from the component's container `index.js` file. To demonstrate this, we'll create a new component.

In the `webapp` directory, let's create a component folder called `action_example` and switch into it.

```bash
mkdir -p src/components/action_example
cd src/components/action_example
```

In there, create two files: `index.js` and `action_example.jsx`. If you're not familiar with why we're creating these directories and files, [read the contributor documentation on using React with Redux](/contribute/redux/react-redux/).

Open up `action_example.jsx` and add the following:

```javascript
import React from 'react';
import PropTypes from 'prop-types';

export default class ActionExample extends React.PureComponent {
    static propTypes = {
        user: PropTypes.object.isRequired,
        patchUser: PropTypes.func.isRequired, // here we define the action as a prop
    }

    updateFirstName = () => {
        const patchedUser = {
            id: this.props.user.id,
            first_name: 'Jim',
        };

        this.props.patchUser(patchedUser); // here we use the action
    }

    render() {
        return (
            <div>
                {'First name: ' + this.props.user.first_name}
                <a
                    href='#'
                    onClick={this.updateFirstName}
                >
                    Click me to update the first name!
                </a>
            </div>
        );
    }
}
```

This component will display a user's first name and then, when the link is clicked, use an action to update that user's first name to "Jim".

The action `patchUser` is from mattermost-redux. It takes in a subset of a user object and updates the user on the server, [using the `PUT /users/{user_id}/patch` endpoint](https://api.mattermost.com/#tag/users%2Fpaths%2F~1users~1%7Buser_id%7D~1patch%2Fput).

We must now use our container to import this action and pass it our component. Open up the `index.js` file and add:

```javascript
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {patchUser} from 'mattermost-redux/actions'; // importing the action

import ActionExample from './action_example.jsx';

const mapStateToProps = (state) => {
    const currentUserId = state.entities.users.currentUserId;

    return {
        user: state.entities.users.profiles[currentUserId],
    };
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    patchUser, // passing the action as a prop
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ActionExample);
```

The container is doing two things. First, it's grabbing the current (logged in) user from the Redux state and passing it in as a prop. Anytime the Redux state updates, for example when we use the `patchUser` action, our component will get the updated copy of the current user. Second, the container is importing the `patchUser` action from mattermost-redux and passing it in as an action prop to our component.

Now we can use `this.props.patchUser()` to update a user. The example component we made uses it to patch the current user's first name.

To use our component in our plugin we would then use the registry in the initialization function of the plugin to register the component somewhere in the Mattermost UI. That is beyond the scope of this guide, but you can [read more about that here](/extend/plugins/webapp/reference/).

## Available Actions

The actions that are available for your plugin to import can be [found in the source code for mattermost-redux](https://github.com/mattermost/mattermost-redux/tree/master/src/actions).
