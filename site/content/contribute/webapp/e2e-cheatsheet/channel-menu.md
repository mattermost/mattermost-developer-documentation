---
title: "Channel Menu"
date: 2020-12-11T00:00
weight: 3
subsection: Cypress cheatsheet
---

![image](/contribute/webapp/e2e-cheatsheet/channel-menu.png)

***

### `cy.uiOpenChannelMenu(item)`
Open the Channel Menu by clicking the channel header title or dropdown icon when viewing a channel.

- `item`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'View Info'`, `'Move to...'`,`'Notification Preferences'`, `'Mute Channel'`, `'Add Members'`, `'Manage Members'`,`'Edit Channel Header'`, `'Edit Channel Purpose'`, `'Rename Channel'`, and `'Convert to Private Channel'`, `'Archive Channel'`, and `'Leave Channel'`,.

##### Open the Channel Menu
```javascript
// # Open 'Channel Menu'
cy.uiOpenChannelMenu();
```

##### Open the Channel Menu and click on specific item
```javascript
// # Open 'Advanced' section of 'Settings' modal
cy.uiOpenChannelMenu('View Info');
```

***

##### `cy.uiCloseChannelMenu()`
Close the Channel Menu by clicking the channel header title or dropdown icon again at the center channel view, given that the menu is already open.

```javascript
cy.uiCloseChannelMenu();
```

***

##### `cy.uiGetChannelMenu()`
Get the DOM elements of Channel Menu.

```javascript
cy.uiGetChannelMenu();
```

***
