---
title: "Troubleshooting"
date: 2018-12-04T11:35:32-04:00
weight: 6
subsection: End-to-End Testing
---

### Cypress Failed To Start After Running 'npm run cypress:run'

Either the command line exits immediately without running any test or it logs out like the following.

##### Error message
```sh
✖  Verifying Cypress can run /Users/user/Library/Caches/Cypress/3.1.3/Cypress.app
   → Cypress Version: 3.1.3
Cypress failed to start.

This is usually caused by a missing library or dependency.
```

##### Solution
Clear node options by initiating `unset NODE_OPTIONS` in the command line. Running `npm run cypress:run` should proceed with Cypress testing.


##### Error message
This error may occur in Ubuntu when running any Cypress spec.

```
code: 'ENOSPC',
errno: 'ENOSPC',
```
##### Solution
Run the following command

```
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
```
