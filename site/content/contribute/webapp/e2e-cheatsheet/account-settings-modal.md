---
title: "Account settings modal"
date: 2020-12-11T00:00
weight: 2
subsection: Cypress cheatsheet
---

![image](/contribute/webapp/e2e-cheatsheet/account-settings-modal.png)

***

#### `cy.uiOpenAccountSettingsModal(section)`
Open the settings modal when currently viewing the channel page.

- `section`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'General'`, `'Security'`, `'Notifications'`, `'Display'`, `'Sidebar'` and `'Advanced'`

##### Open the Account Settings modal
```javascript
// # Open 'Account Settings' modal and view the default 'General Settings'
cy.uiOpenAccountSettingsModal();
```

##### Open the Account Settings modal and view a specific section
```javascript
// # Open 'Advanced' section of 'Account Settings' modal
cy.uiOpenAccountSettingsModal('Advanced');
```


##### Open the Account Settings modal, view a specific section and change a setting
```javascript
// # Open 'Advanced' section of 'Account Settings' modal
cy.uiOpenAccountSettingsModal('Advanced').within(() => {
    // # Open 'Enable Join/Leave Messages' and turn it off
    cy.findByRole('heading', {name: 'Enable Join/Leave Messages'}).click();
    cy.findByRole('radio', {name: 'Off'}).click();

    // # Save and close the modal
    cy.uiSave();
    cy.uiClose();
});
```

***

#### `cy.findByRoleExtended('button', {name})`
Use to select section's button within a modal.

- `name`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'General'`, `'Security'`, `'Notifications'`, `'Display'`, `'Sidebar'` and `'Advanced'`

##### Open a section within the Account Settings modal
```diff
// # Open 'Advanced' section of 'Account Settings' modal
cy.uiOpenAccountSettingsModal().within(() => {
+   // # Click 'Notifications' button
+   cy.findByRoleExtended('button', {name: 'Notifications'}).should('be.visible').click();
});
```

***

#### `cy.findByRole('heading', {name})`
Use to select a setting of a section within a modal.

- `name`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'Full Name'`, `'Username'`, and others depending of a section

##### Open a section within the Account Settings modal
```diff
// # Open 'Notifications' of 'Account Settings' modal
cy.uiOpenAccountSettingsModal('Notifications').within(() => {
+   // # Open 'Words That Trigger Mentions' setting
+   cy.findByRole('heading', {name: 'Words That Trigger Mentions'}).should('be.visible').click();
});
```

***

#### `cy.findByRole(role, {name})`
Use to select a setting of a section within a modal.

- `role`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'textbox'`, `'radio'`, `'checkbox'` and other <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles">roles</a>
- `name`
< <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type">string</a> >
  - Possible values: `'On'`, `'Off'`, and others depending of a section's setting

##### Change value of a section's setting
```diff
// # Open 'Notifications' of 'Account Settings' modal
cy.uiOpenAccountSettingsModal('Notifications').within(() => {
    // # Open 'Words That Trigger Mentions' setting
    cy.findByRole('heading', {name: 'Words That Trigger Mentions'}).should('be.visible').click();

+    // # Check channel-wide mentions
+   cy.findByRole('checkbox', {name: 'Channel-wide mentions "@channel", "@all", "@here"'}).click();
});
```

***

#### `cy.uiSave` and `cy.uiClose`
Common commands that can be used to save settings and close the modal

##### Save and Close
```diff
// # Open 'Notifications' of 'Account Settings' modal
cy.uiOpenAccountSettingsModal('Notifications').within(() => {
    // # Open 'Words That Trigger Mentions' setting
    cy.findByRole('heading', {name: 'Words That Trigger Mentions'}).should('be.visible').click();

    // # Check channel-wide mentions
    cy.findByRole('checkbox', {name: 'Channel-wide mentions "@channel", "@all", "@here"'}).click();

+   // # Save then close the modal
+   cy.uiSave();
+   cy.uiClose();
});
```

***
