---
title: "Main Menu"
date: 2020-12-11T00:00
weight: 4
subsection: Cypress cheatsheet
---

![image](/contribute/webapp/e2e-cheatsheet/main-menu.png)

***

### `cy.uiOpenMainMenu(item)`
Open the Main Menu by clicking the team header title or hamburger icon at the LHS.

- `item`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'Account Settings'`, `'Invite People'`, `'Team Settings'`, `'Manage Members'`, `'Create a Team'`, `'Join Another Team'`, `'Leave Team'`, `'Integrations'`, `'Plugin Marketplace'`, `'System Console'`, `'Help'`, `'Keyboard Shortcuts'`, `'Report a Problem'`, `'Download Apps'`, `'About Mattermost'` and `'Logout'`.

##### Open the Main Menu
```javascript
// # Open 'Main Menu'
cy.uiOpenMainMenu();
```

##### Open the Main Menu and click on specific item
```javascript
// # Open 'Advanced' section of 'Account Settings' modal
cy.uiOpenMainMenu('Integrations');
```

***

##### `cy.uiCloseMainMenu()`
Close the Main Menu by clicking again the team header title or hamburger icon at the LHS, given that the menu is presently opened.

```javascript
cy.uiCloseMainMenu();
```

***

##### `cy.uiGetMainMenu()`
Get the DOM elements of Main Menu.

```javascript
cy.uiGetMainMenu();
```

***
