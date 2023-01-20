---
title: "Testing"
heading: "Apps testing"
description: "How to test the App framework"
weight: 81
---

This page describes how to test changes made to the App Framework.

## E2E Testing

To run end-to-end testing with Cypress you need to do the following:

1. Clone and enter the [`mattermost-app-examples`](https://github.com/mattermost/mattermost-app-examples) repository:

```bash
git clone https://github.com/mattermost/mattermost-app-examples
cd mattermost-app-examples
```

2. Launch the provided Mattermost server

```bash
docker compose up
```

3. Clone and enter the [`mattermost-plugin-apps`](https://github.com/mattermost/mattermost-plugin-apps) repository's `/test/e2e/` directory:

```bash
git clone https://github.com/mattermost/mattermost-plugin-apps
cd mattermost-plugin-apps/test/e2e
```

4. Run the E2E testing:

```bash
npm install
npm run test
```

If everything goes fine, you should see Cypress starting and running the tests successfully.
