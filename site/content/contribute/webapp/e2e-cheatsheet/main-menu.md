---
title: "Product Menu"
date: 2020-12-11T00:00
weight: 4
subsection: Cypress cheatsheet
---

![image](/contribute/webapp/e2e-cheatsheet/product-menu.png)

***

### `cy.uiOpenMainMenu(item)`
Open the Product menu by clicking the product name in the Global Header.

- `item`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'Channels'`, `'Boards'`, `'Playbooks'`, `'System Console'`, `'Integrations'`, `'Marketplace'`, `'Download Apps'`, and `'About Mattermost'`.

##### Open the Product menu
```javascript
// # Open 'Product menu'
cy.uiOpenMainMenu();
```

##### Open the Product menu and click on a specific item
```javascript
// # Open 'Integrations' section of 'Product Menu' modal
cy.uiOpenMainMenu('Integrations');
```

***

##### `cy.uiCloseMainMenu()`
Close the Product menu by the product name in the Global Header again, given that the menu is already open.

```javascript
cy.uiCloseMainMenu();
```

***

##### `cy.uiGetMainMenu()`
Get the DOM elements of the Product menu.

```javascript
cy.uiGetMainMenu();
```

***
