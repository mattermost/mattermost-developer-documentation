---
title: Plugin Release Process
date: 2017-11-07T14:28:35-05:00
section: internal
weight: 101
---

This document outlines the steps required to release a new version of a Mattermost plugin.

### Update version

Update `plugin.json` with the new version:
```diff
{
    "id": "github",
    "name": "GitHub",
    "description": "GitHub plugin for Mattermost.",
    "homepage_url": "https://github.com/mattermost/mattermost-plugin-github",
    "support_url": "https://github.com/mattermost/mattermost-plugin-github/issues",
    "icon_path": "assets/icon.svg",
-    "version": "0.12.0",
+    "version": "0.13.0",
    "min_server_version": "5.12.0",
    ...
}
```

Apply the updated manifest into the server and webapp:
```
make apply
```

Submit a pull request referencing the updated `plugin.json`, `server/manifest.go` and `webapp/src/manifest.js`. Note that server-only or webapp-only will only have one of the generated files.

### Tag, Build & Sign

Tag, build and sign a plugin via [matterbuild](https://github.com/mattermost/matterbuild) by using a slash command on our [community](https://community.mattermost.com) servers.

Simply invoke:
```
/mb cutPlugin --tag v0.13.0 --repo mattermost/mattermost-plugin-github
```

Matterbuild will create the given tag pointing at the current `master`, triggering CircleCI to [automatically create a GitHub release](https://github.com/mattermost/circleci-orbs/blob/3fb37c7920037c857a9ed9bc1a4e31be20092cdd/plugin-ci/orb.yml#L111-L120). Once the assets are built and uploaded to the release, matterbuild will download and sign using our production plugin signing key.

Note that only authorized users have access to matterbuild.

### Update the release description

Install [goreleaser](https://goreleaser.com/install/), export the appropriate `GITHUB_TOKEN`, and then run:

```
goreleaser release --skip-validate --rm-dist
```

the tool will fail with an error about a missing main function, but successfully generates `dist/CHANGELOG.md`. Copy the contents of that file and update the corresponding release on GitHub.

Automating this is scheduled as [MM-19848](https://mattermost.atlassian.net/browse/MM-19848).

### Update the Plugin Marketplace

Submit a ticket to the [Toolkit Team](/internal/rd-teams/#toolkit-team) to list the plugin in the marketplace.

Automating this is scheduled as [MM-20841](https://mattermost.atlassian.net/browse/MM-20841).
