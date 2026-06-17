---
title: Sidebar components
heading: "Add your plugin to the Mattermost sidebar"
description: "Learn how to register your plugin in the Mattermost webapp sidebar for quick access to your integration."
weight: 5
aliases:
  - /extend/plugins/webapp/sidebar/
  - /integrate/plugins/webapp/sidebar/
---

Mattermost provides several integration points in the webapp sidebar that allow you to expose your plugin functionality to users. This guide will walk you through registering your plugin components in the sidebar with step-by-step examples.

## Prerequisites

Before adding sidebar components, ensure you have:
- A working webapp plugin with the basic `PluginClass` implementation
- Familiarity with the [webapp plugin SDK reference]({{< ref "/integrate/reference/webapp/webapp-reference" >}})
- Your plugin's `webapp/src/index.js` (or `.tsx`) file ready for modification

## Types of sidebar components

There are three main types of sidebar components you can register:

1. **Left Sidebar Header Component** - Appears above the channel list in a team, ideal for team-specific actions
2. **Bottom Team Sidebar Component** - Appears in the lower left corner, great for quick links and status summaries
3. **App Bar Component** (experimental) - Appears in the global apps bar at the top of the sidebar (requires [Apps Bar]({{< ref "/integrate/plugins/components/webapp/app-bar" >}}) to be enabled)

### Left Sidebar Header Component

The left sidebar header component allows you to add an icon and action that appears above the channels in a specific team. This is perfect for plugins that provide team-specific functionality.

#### When to use

- You need actions that apply to the entire team, not just channels or messages
- You want a highly visible location for key features
- Examples: Trello kanban board, GitHub repository summary, project management dashboards

#### Registration

Use `registry.registerLeftSidebarHeaderComponent()` in your plugin's `initialize` method:

```javascript
class PluginClass {
    initialize(registry, store) {
        // Register a left sidebar header component
        registry.registerLeftSidebarHeaderComponent(
            'my-plugin-sidebar-header',
            {
                // Required: The icon to display in the sidebar
                icon: 'https://example.com/icons/my-plugin.svg',
                
                // Required: Text to show in tooltip when hovering
                tooltipText: 'My Plugin Dashboard',
                
                // Required: Action function to execute when clicked
                action: () => {
                    // Open your plugin's interface
                    this.openMyPluginInterface(store);
                },
                
                // Optional: Additional component props
                menuItemId: 'my-plugin-menu-item',
            }
        );
    }
}
```

#### Complete example

Here's a complete example from a GitHub plugin that shows repository status:

```javascript
// webapp/src/index.js
import React from 'react';
import {Store} from 'redux';
import {GlobalState} from '@mattermost/types/store';

import {openGitHubDashboard} from './actions/github_dashboard';

class PluginClass {
    initialize(registry, store) {
        // Register GitHub status in the left sidebar header
        registry.registerLeftSidebarHeaderComponent(
            'github-sidebar-header',
            {
                icon: 'https://example.com/icons/github.svg',
                tooltipText: 'GitHub Repositories',
                action: () => {
                    store.dispatch(openGitHubDashboard());
                }
            }
        );
        
        // ... other component registrations
    }
}

window.registerPlugin('github', new PluginClass());
```

{{<note "Note:">}}
The left sidebar header component is team-specific. It will only appear in the team sidebar where your plugin is installed.
{{</note>}}

### Bottom Team Sidebar Component

The bottom team sidebar component adds icons to the lower left corner of the UI. This is ideal for displaying status indicators or providing quick access to key features that users can access from anywhere in the team.

#### When to use

- You need to show status indicators or counts that update dynamically
- You want quick access to features that don't require opening a full interface
- Examples: GitHub unread PRs, Jira ticket counts, ServiceNow incident status

#### Registration

Use `registry.registerBottomTeamSidebarComponent()`:

```javascript
class PluginClass {
    initialize(registry, store) {
        // Register a bottom sidebar component
        registry.registerBottomTeamSidebarComponent(
            'my-plugin-status-icon',
            {
                // Required: Icon component or URL
                icon: 'https://example.com/icons/status.svg',
                
                // Required: Text to show in tooltip
                tooltipText: 'View Status',
                
                // Required: Action when clicked
                action: () => {
                    this.openStatusPanel(store);
                },
                
                // Optional: Enable badge for counts
                showBadge: true,
                
                // Optional: Badge text (updated dynamically)
                badgeText: '5', // Number of unread items, etc.
            }
        );
    }
}
```

#### Dynamic badge updates

To update the badge count dynamically (e.g., when new items arrive):

```javascript
class PluginClass {
    constructor() {
        this.badgeCount = 0;
    }
    
    initialize(registry, store) {
        let badgeComponent;
        
        // Initial registration
        badgeComponent = registry.registerBottomTeamSidebarComponent(
            'my-plugin-badge',
            {
                icon: 'https://example.com/icons/badge.svg',
                tooltipText: 'My Plugin',
                action: () => this.openPanel(store),
                showBadge: true,
                badgeText: this.badgeCount.toString(),
            }
        );
        
        // Function to update badge count
        this.updateBadge = (newCount) => {
            this.badgeCount = newCount;
            if (badgeComponent && badgeComponent.updateBadge) {
                badgeComponent.updateBadge(this.badgeCount.toString());
            }
        };
        
        // Example: Listen for events and update badge
        store.subscribe(() => {
            const state = store.getState();
            const newItems = this.countNewItems(state);
            this.updateBadge(newItems);
        });
    }
}
```

#### Complete example

From a GitHub plugin showing outstanding reviews:

```javascript
// webapp/src/index.js
import React from 'react';
import {Store} from 'redux';

class PluginClass {
    initialize(registry, store) {
        let reviewBadge;
        
        // Register the review count badge
        reviewBadge = registry.registerBottomTeamSidebarComponent(
            'github-reviews-badge',
            {
                icon: 'https://example.com/icons/github-pr.svg',
                tooltipText: 'Pull Requests',
                action: () => {
                    store.dispatch(openPullRequestsPanel());
                },
                showBadge: true,
                badgeText: '0',
            }
        );
        
        // Update badge based on data
        this.updateReviewCount = async () => {
            const count = await this.fetchReviewCount();
            if (reviewBadge && reviewBadge.updateBadge) {
                reviewBadge.updateBadge(count.toString());
            }
        };
        
        // Set up polling or websockets to update the count
        setInterval(this.updateReviewCount, 60000); // Every minute
    }
}
```

### App Bar Component (Experimental)

The App Bar appears at the top of the sidebar and provides global access to your plugin. This is an experimental feature that must be enabled via [configuration settings]({{< ref "/integrate/reference/configure/experimental-configuration-settings#disable-apps-bar" >}}).

{{<note "Warning:">}}
The App Bar is experimental and may change in future releases. It must be enabled by administrators using the \`Enable Apps Bar\` experimental configuration setting.
{{</note>}}

#### When to use

- You need global access to your plugin from anywhere in Mattermost
- Your plugin provides core platform features
- Examples: Help button, global search, platform-wide integrations

#### Registration

The `registerAppBarComponent` method may not be available in all Mattermost versions. Always check for its existence:

```javascript
class PluginClass {
    initialize(registry, store) {
        // Check if App Bar registration is available
        if (registry.registerAppBarComponent) {
            const {getConfig} = require('mattermost-redux/selectors/entities/general');
            const config = getConfig(store.getState());
            const siteUrl = config?.SiteURL || '';
            
            const iconUrl = `${siteUrl}/plugins/${manifest.id}/public/app-bar-icon.png`;
            
            registry.registerAppBarComponent({
                iconUrl: iconUrl,
                tooltipText: 'My Plugin',
                action: () => {
                    this.openGlobalInterface(store);
                },
                supportedProductIds: '*', // Supports all Mattermost products
            });
        }
    }
}
```

#### Complete example

Based on the [customer plugin example](https://github.com/coltoneshaw/mattermost-customer-plugin/blob/main/webapp/src/index.tsx):

```typescript
import React from 'react';
import {Store} from 'redux';

import {getConfig} from 'mattermost-redux/selectors/entities/general';
import {GlobalState} from '@mattermost/types/store';

import {CustomerRHS} from './app';
import {RHSTitlePlaceholder} from './components/rhsTitle';
import {manifest} from '@/manifest';

export default class Plugin {
    public async initialize(registry, store: Store<GlobalState>) {
        // Register RHS panel
        const {toggleRHSPlugin} = registry.registerRightHandSidebarComponent(
            CustomerRHS,
            <RHSTitlePlaceholder/>
        );
        const boundToggleRHSAction = () => store.dispatch(toggleRHSPlugin);
        
        // Register App Bar icon (experimental)
        if (registry.registerAppBarComponent) {
            const config = getConfig(store.getState());
            const siteUrl = config?.SiteURL || '';
            const iconURL = `${siteUrl}/plugins/${manifest.id}/public/app-bar-icon.png`;
            
            registry.registerAppBarComponent({
                iconUrl: iconURL,
                tooltipText: 'Customers',
                action: boundToggleRHSAction,
                supportedProductIds: '*',
            });
        }
    }
}

window.registerPlugin(manifest.id, new Plugin());
```

## Accessing Mattermost Server configuration

When building sidebar components, you often need to reference plugin assets using the configured SiteURL:

```javascript
import {getConfig} from 'mattermost-redux/selectors/entities/general';

export const getPluginServerRoute = (state) => {
    const config = getConfig(state);
    let basePath = '';
    
    if (config && config.SiteURL) {
        basePath = new URL(config.SiteURL).pathname;
        if (basePath && basePath[basePath.length - 1] === '/') {
            basePath = basePath.substr(0, basePath.length - 1);
        }
    }
    
    return basePath + '/plugins/' + PluginId;
};
```

This ensures your plugin's assets load correctly regardless of the server's URL configuration.

## Using the Redux store

Sidebar components can dispatch actions and access the global state:

```javascript
import {openPluginModal} from './actions/plugin_actions';

class PluginClass {
    initialize(registry, store) {
        registry.registerLeftSidebarHeaderComponent(
            'my-plugin-header',
            {
                icon: 'icon-url',
                tooltipText: 'Open Plugin',
                action: () => {
                    // Dispatch Redux action to open your plugin's interface
                    store.dispatch(openPluginModal());
                }
            }
        );
        
        // Access store state
        const state = store.getState();
        const currentUser = state.entities.users.currentUserId;
        
        // Subscribe to store updates
        store.subscribe(() => {
            const newState = store.getState();
            // React to state changes
        });
    }
}
```

## Combining multiple sidebar components

A plugin can register multiple sidebar components:

```javascript
class PluginClass {
    initialize(registry, store) {
        // Left sidebar header for team actions
        registry.registerLeftSidebarHeaderComponent(
            'plugin-team-actions',
            {
                icon: 'https://example.com/icons/team.svg',
                tooltipText: 'Team Actions',
                action: () => store.dispatch(openTeamActions()),
            }
        );
        
        // Bottom sidebar for status
        registry.registerBottomTeamSidebarComponent(
            'plugin-status',
            {
                icon: 'https://example.com/icons/status.svg',
                tooltipText: 'Status',
                action: () => store.dispatch(openStatusPanel()),
                showBadge: true,
                badgeText: '0',
            }
        );
        
        // App Bar (if available)
        if (registry.registerAppBarComponent) {
            registry.registerAppBarComponent({
                iconUrl: 'https://example.com/icons/global.svg',
                tooltipText: 'Global Access',
                action: () => store.dispatch(openGlobalPanel()),
                supportedProductIds: '*',
            });
        }
    }
}
```

## Best practices

1. **Use descriptive tooltip text** - Users should immediately understand what each sidebar component does
2. **Keep badge counts accurate** - Update badges in real-time as data changes
3. **Choose appropriate icons** - Use SVG icons that scale well and match your brand
4. **Handle errors gracefully** - If your component fails to load, the rest of Mattermost should still work
5. **Test across themes** - Ensure your sidebar components look good with both light and dark Mattermost themes
6. **Consider accessibility** - Provide appropriate aria-labels and ensure keyboard navigation works

## Troubleshooting

### Component not appearing

1. Check that your plugin is installed and enabled in the current team
2. Verify the plugin is properly initialized (check browser console for errors)
3. Ensure your icon URL is accessible and valid
4. For App Bar components, verify that the Apps Bar is enabled in configuration

### Badge not updating

1. Verify the `updateBadge` function exists on the returned component
2. Check that your state subscription is working correctly
3. Ensure you're calling `updateBadge` with a string value

### Icon not displaying

1. Check that the URL is correct and the image is accessible
2. Use the SiteURL from the Redux store to construct absolute URLs
3. Verify the image format is supported (SVG recommended)

## Related documentation

- [Web app plugin SDK reference]({{< ref "/integrate/reference/webapp/webapp-reference" >}})
- [Best practices for web app plugins]({{< ref "/integrate/plugins/components/webapp/best-practices" >}})
- [Plugin developer setup]({{< ref "/integrate/plugins/developer-setup" >}})
- [Experimental configuration settings]({{< ref "/integrate/reference/configure/experimental-configuration-settings#disable-apps-bar" >}})
- [Channel header plugin changes](https://forum.mattermost.com/t/channel-header-plugin-changes/13551) (Forum discussion)

## Examples

- [Mattermost customer plugin](https://github.com/coltoneshaw/mattermost-customer-plugin) - Complete sidebar plugin with App Bar integration
- [Mattermost plugin todo](https://github.com/mattermost/mattermost-plugin-todo) - Example with sidebar components