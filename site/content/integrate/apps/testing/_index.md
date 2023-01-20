---
title: "Testing"
heading: "Apps testing"
description: "How to test the App framework"
weight: 31
---

This page describes how to test changes made to the App Framework.

## E2E Testing

To run end-2-end testing with cypress you need to do the following:

- Clone the [Mattermost app examples](https://github.com/mattermost/mattermost-app-examples) repository
- Launch the mattermost server

```bash
cd mattermost-app-examples
docker compose up
```

Once you have it up and running:

- Go to the cloned [Mattermost Apps](https://github.com/mattermost/mattermost-plugin-apps) repository
- Then run the e2e testing

```bash
cd mattermost-plugin-apps/test/e2e
npm install
npm run test
```

If everything goes fine, you should see Cypress starting and running the tests successfully.
