---
title: "Monorepo migration notes"
heading: "Monorepo migration notes"
description: "Migration notes for the monorepo move"
weight: 2
---

If you are transitioning from the non-monorepo mattermost-server to the monorepo the easiest way to do so is to move the old mattermost server folder to something like mattermost-server-old then re-clone mattermost-server.
Then:

1. Copy over your old config

    ```sh
    cd server
    cp ../../mattermost-server-old/config/config.json ./config/
    ```

1. Copy over your developer config override

    ```sh
    cd server
    cp ../../mattermost-server-old/config.override.mk ./
    ```

