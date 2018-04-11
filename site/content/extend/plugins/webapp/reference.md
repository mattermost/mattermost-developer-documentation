---
title: Web App Reference
date: 2017-10-26T17:54:54-05:00
subsection: Web App Plugins
weight: 10
---

# Web App Reference

## PluginClass

The PluginClass interface has a single method that is used by the Mattermost web app to initialize your plugin.

```javascript
class PluginClass {
    initialize(registerComponents, store)
}
```

### Methods

#### `initialize()`
The `PluginClass.initialize()` method is called by the Mattermost web app on first load. To register your plugin you must expose it on `window`. See the example below for more informaton.

#### Syntax

```javascript
plugin.initialize(registerComponents, store);
```

##### registerComponents(components, postTypeComponents, mainMenuActions)

Is a function passed in by the web app, to be called by your initialize function for specifying which components your plugin is overriding and which components will be rendered for certain post types.

* `components` is an object mapping component names to your component implementations
* `postTypeComponents` is an object mapping post types to your equivalent component implementations
* `mainMenuActions` is an array of objects used to add items to the sidebar dropdown menus, sometimes referred to as the main menu. Each object contains the following fields:
 * `text` - String or JSX object to render in the menu
 * `action` - Function to call when the item is clicked on
 * `mobile_icon` - (Optional) Icon to display in the sidebar menu when the app is in mobile view. Defaults to [plus-square](https://fontawesome.com/v4.7.0/icon/plus-square/)

##### store

Is the [Redux](https://redux.js.org/docs/basics/Store.html) store of the web app. Inject any reducers your plugin might have into this.

### Example

The entry point `index.js` of your application might contain:


```javascript
import ProfilePopover from './components/profile_popover';
import SomePost from './components/some_post';
import MenuIcon from './components/menu_icon';
import {openExampleModal} from './actions';

class PluginClass {
    initialize(registerComponents, store) {
        const menuItems = [{
            text: 'Plugin Menu Item',
            action: () => store.dispatch(openExampleModal()),
            mobile_icon: MenuIcon
        }];

        registerComponents({ProfilePopover}, {custom_somepost: SomePost}, menuItems);
    }
}

window.plugins['yourpluginid'] = new PluginClass();
```

This will override the ProfilePopover component and render your SomePost component for any post with the type 'custom_somepost'.

## Pluggable Components

Below is a list of components that can be plugged into. The props defined are passed by default from the Mattermost web app and can be used by your implementation of the component. If needed, you can add more props to your implementation and pass them in using a container.

{{<pluginjsdocs>}}

### Theme

In Mattermost, users are able to set custom themes that change the color scheme of the UI. It's important that plugins have access to a user's theme so that they can set their styling to match and not look out of place.

Every pluggable component in the web app will have the theme object as a prop.

The theme object has the following properties:

| Property | Description |
| -------- | ----------- |
| sidebarBg | Background color of the left-hand sidebar |
| sidebarText | Color of text in the left-hand sidebar |
| sidebarUnreadText | Color of text for unread channels in the left-hand sidebar |
| sidebarTextHoverBg | Background color of channels when hovered in the left-hand sidebar |
| sidebarTextActiveBorder | Color of the selected indicator channel indicator in the left-hand siebar|
| sidebarTextActiveColor | Color of the text for the selected channel in the left-hand sidebar |
| sidebarHeaderBg | Background color of the left-hand sidebar header |
| sidebarHeaderTextColor | Color of text in the left-hand sidebar header |
| onlineIndicator | Color of the online status indicator |
| awayIndicator | Color of the away status indicator |
| dndIndicator | Color of the do not disturb status indicator |
| mentionBg | Background color for mention jewels in the left-hand sidebar |
| mentionColor | Color of text for mention jewels in the left-hand sidebar |
| centerChannelBg | Background color of channels, right-hand sidebar and modals/popovers |
| centerChannelColor | Color of text in channels, right-hand sidebar and modals/popovers |
| newMessageSeparator | Color of the new message separator in channels |
| linkColor | Color of text for links |
| buttonBg | Background color of buttons |
| buttonColor | Color of text for buttons |
| errorTextColor | Color of text for errors |
| mentionHighlightBg | Background color of mention highlights in posts |
| mentionHighlightLink | Color of text for mention links in posts |
| codeTheme | Code block theme, either 'github', 'monokai', 'solarized-dark' or 'solarized-light' |

## Exported Libraries and Functions

The web app exports a number of libraries and functions on the [window](https://developer.mozilla.org/en-US/docs/Web/API/Window) object for plugins to use. We recommend importing as many libraries from the window as possible. Below is a list of the exposed libraries and functions:


| Library | Description |
| -------- | ----------- |
| react | Standard [ReactJS](https://reactjs.org/) library |
| react-dom | [ReactDOM](https://reactjs.org/docs/react-dom.html) |
| redux | [Redux](https://redux.js.org/) |
| react-redux | [React bindings for Redux](https://github.com/reactjs/react-redux) |
| react-bootstrap | [Bootstrap for React](https://react-bootstrap.github.io/) |
| post-utils | Post utility functions for common post related tasks |

#### post-utils

Contains the following post utility functions:

##### `formatText(text, options)`
Performs formatting of text including Markdown, highlighting mentions and search terms and converting URLs, hashtags, @mentions and ~channels to links by taking a string and returning a string of formatted HTML.

* `text` - String of text to format, e.g. a post's message
* `options` - (Optional) An object containing the following formatting options
 * `searchTerm` - If specified, this word is highlighted in the resulting HTML. Defaults to nothing.
 * `mentionHighlight` - Specifies whether or not to highlight mentions of the current user. Defaults to true.
 * `mentionKeys` - A list of mention keys for the current user to highlight.
 * `singleline` - Specifies whether or not to remove newlines. Defaults to false.
 * `emoticons` - Enables emoticon parsing with a data-emoticon attribute. Defaults to true.
 * `markdown` - Enables markdown parsing. Defaults to true.
 * `siteURL` - The origin of this Mattermost instance. If provided, links to channels and posts will be replaced with internal links that can be handled by a special click handler.
 * `atMentions` - Whether or not to render "@" mentions into spans with a data-mention attribute. Defaults to false.
 * `channelNamesMap` - An object mapping channel display names to channels. If provided, ~channel mentions will be replaced with links to the relevant channel.
 * `team` - The current team.
 * `proxyImages` - If specified, images are proxied. Defaults to false.

##### `messageHtmlToComponent(html, isRHS, options)`
Converts HTML to React components.

* `html` - String of HTML to convert to React components
* `isRHS` - Boolean indicating if the resulting componets are to be displayed in the right-hand sidebar
* `options` - (Optional) An object containing options
 * `mentions` - If set, mentions are replaced with the AtMention component. Defaults to true.
 * `emoji` - If set, emoji text is replaced with the PostEmoji component. Defaults to true.
 * `images` - If set, markdown images are replaced with the PostMarkdown component. Defaults to true.
 * `latex` - If set, latex is replaced with the LatexBlock component. Defaults to true.

##### Usage Example

A short usage example of a PostType component using the post utility functions to format text.

```javascript
const React = window.react;
const PostUtils = window['post-utils']; // import the post utilities
import PropTypes from 'prop-types';
import {makeStyleFromTheme} from 'mattermost-redux/utils/theme_utils';

export default class PostTypeFormatted extends React.PureComponent {

    // ...

    render() {
        const style = getStyle(this.props.theme);
        const post = this.props.post;

        const formattedText = PostUtils.formatText(post.message); // format the text

        return (
            <div
                style={style.container}
            >
                {'Formatted text: '}
                {PostUtils.messageHtmlToComponent(formattedText)} // convert the html to components
            </div>
        );
    }
}
```
