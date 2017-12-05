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

*`registerComponents(components, postTypeComponents)`*

Is a function passed in by the web app, to be called by your initialize function for specifying which components your plugin is overriding and which components will be rendered for certain post types. `components` is an object mapping component names to your component implementations and `postTypeComponents` is an object mapping post types to your equivalent component implementations.

*`store`*

Is the [Redux](https://redux.js.org/docs/basics/Store.html) store of the web app. Inject any reducers your plugin might have into this.

### Example

The entry point `index.js` of your application might contain:


```javascript
import ProfilePopover from './components/profile_popover';
import SomePost from './components/some_post';

class PluginClass {
    initialize(registerComponents, store) {
        registerComponents({ProfilePopover}, {'custom_somepost': SomePost});
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

