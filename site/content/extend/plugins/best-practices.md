---
title: "Example Plugins"
subsection: Plugins (Beta)
weight: 50
---

See here for [server-specific best practices for plugins](/extend/plugins/server/best-practices/). Webapp-specific best practices are incoming.

## How can I review the entire code base of a plugin?

Carry out the following steps:

1. Take a backup of project directory
2. Create a dummy-master branch with no code:

   ```
   git checkout --orphan dummy-master #create the dummy master branch
   git rm -rf . #remove everything from this branch
   git push origin dummy-master
   ```
   
3. Create a dummy-feature branch from dummy-master:

   ```
   git checkout -b dummy-feature
   # copy. everything from backup except the .git dir
   git add .
   git commit -m "Full checkin"
   git push origin dummy-feature
   ```
   
4. Create a PR from dummy-feature -> dummy-master

5. Code review on the resulting PR
