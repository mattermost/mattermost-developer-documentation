---
title: "Example Plugins"
subsection: Plugins (Beta)
weight: 50
---

For server-specific best practices for plugins, see:
For webapp-specific best practices for plugins, see:

## How can I review the entire code base of a plugin?

Carry out the following steps:

1. `git checkout --orphan dummy-branch`
2. commit the basic files that aren't going to be code reviewed
3. push to upstream/dummy-branch
4. commit everything we want to review to a new dummy-master branch
5. make a PR for dummy-master -> dummy-branch
6. comment on that PR
