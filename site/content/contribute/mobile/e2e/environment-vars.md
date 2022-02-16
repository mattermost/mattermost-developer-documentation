---
title: "Environment Variables"
heading: "Environment Variables at Mattermost"
description: "At Mattermost, we use several environment variables for Detox testing. Find out the two main reasons why."
date: 2020-10-06T09:00:00-00:00
weight: 7
---

We use several environment variables for Detox testing in order to:
- Easily change when running in CI.
- Cater to different values across developer machines.

Test configurations are [defined at test_config.js](https://github.com/mattermost/mattermost-mobile/blob/master/detox/e2e/support/test_config.js) and environment variables are used to override default values. In most cases you don't need to change the values, because it makes use of the default local developer setup. If you do need to make changes, you may override by exporting, e.g. `export SITE_URL=<site_url>`.

| Variable            | Description                                |
|---------------------|--------------------------------------------|
| SITE_URL | Host of test server.<br><br>Default: `http://localhost:8065` for iOS or `http://10.0.2.2:8065` for Android. |
| ADMIN_USERNAME | Admin's username for the test server.<br><br>Default: `sysadmin` when server is seeded by `make test-data`. |
| ADMIN_PASSWORD | Admin's password for the test server.<br><br>Default: `Sys@dmin-sample1` when server is seeded by `make test-data`. |
| LDAP_SERVER | Host of LDAP server.<br><br>Default: `localhost` |
| LDAP_PORT | Port of LDAP server.<br><br>Default: `389` |
