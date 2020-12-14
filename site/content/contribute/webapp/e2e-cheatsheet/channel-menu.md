---
title: "Channel Menu"
date: 2020-12-11T00:00
weight: 3
subsection: Cypress cheatsheet
---

![image](/contribute/webapp/e2e-cheatsheet/channel-menu.png)

***

### `cy.uiOpenChannelMenu(item)`
Open the Channel Menu by clicking the channel header title or dropdown icon at the center channel view.

- `item`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'View Info'`, `'Notification Preferences'`, `'Mute Channel'`, `'View Members'`, `'Edit Channel Header'`, `'Edit Channel Purpose'` and `'Rename Channel'`.

##### Open the Channel Menu
```javascript
// # Open 'Channel Menu'
cy.uiOpenChannelMenu();
```

##### Open the Channel Menu and click on specific item
```javascript
// # Open 'Advanced' section of 'Account Settings' modal
cy.uiOpenChannelMenu('View Info');
```

***

##### `cy.uiCloseChannelMenu()`
Close the Channel Menu by clicking again the channel header title or dropdown icon at the center channel view, given that the menu is presently opened.

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
