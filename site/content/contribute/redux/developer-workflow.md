---
title: "Redux Workflow"
description: "Learn about the Mattermost Redux repository, useful commands to know, how to submit a pull request, and more."
date: 2017-08-20T11:35:32-04:00
weight: 3
subsection: Redux
---

## Project Structure

If you look at the [Mattermost Redux repository](https://github.com/mattermost/mattermost-redux), you'll see the following folders:

- `src` contains all source code that is compiled and shipped with the library.
    - `src/actions` contains the Redux actions used by the library. Most of the logic that uses the stored data and contacts the server is located here.
    - `src/client` contains the JavaScript drivers to communicate with the Mattermost server. If you're not wanting to use all of the logic from this library but are instead building your own, this code will be the most useful for you.
    - `src/reducers` contains the Redux reducers that handle actions and use them to update the stored data.
    - `src/selectors` contains the selectors used to compute data from the store or just access it more easily.
    - `src/store` contains the setup code for the Redux store that can be extended by applications that use this library.
    - `src/utils` contains utility functions and classes that are shared between the Mattermost web and mobile apps.
- `test` contains unit tests setup. Actual unit test is located on the same folder of the file being tested.

## Useful Commands

- `make test` - Run the unit tests against a mocked server. Running this is required before submitting a pull request.
- `npm run test-no-mock` - Run the unit tests against a real Mattermost server. This server is expected to be available at `http://localhost:8065` with the `TeamSettings.EnableOpenServer` setting set to true.
- `make check-style` - Run ESLint to check code style. Running this is required before submitting a pull request.
- `npm run dev` or `npm run dev:watch` - Attempts to compile Mattermost Redux and copy it into the node_modules folder of the web app. It attempts to install it into `../mattermost-webapp` or a location specified in the `WEBAPP_DIR` environment variable. The `:watch` variation will continue running in the background and update the installed version with any changes that you make while it runs.
- `npm run dev-mobile` or `npm run dev-mobile:watch` - Attempts to compile Mattermost Redux and copy it into the node_modules folder of the mobile app. It attempts to install it into `../mattermost-mobile` or a location specified in the `MOBILE_DIR` environment variable. The `:watch` variation will continue running in the background and update the installed version with any changes that you make while it runs.

## Working with the Mattermost Redux library

If you're making changes to Mattermost Redux for use in the Mattermost web app, you can run a watcher to automatically compile and install any changes to a development copy of the web app by using the following commands:

1. Optionally, set your WEBAPP_DIR environment variable to the location of the web app on your machine, and reload it if necessary.

        export WEBAPP_DIR=/path/to/mattermost-webapp

2. Run the following command to install Mattermost Redux from your local copy. While this is running, it will detect any changes you make and automatically copy them over to the web app.

        `npm run dev:watch`

Similarly, if you're developing for the Mattermost mobile app, you can set the `MOBILE_DIR` environment variable and run a watcher with `npm run dev-mobile`.

## Submitting a Pull Request

Once your changes are complete, there are a few things to do before submitting a pull request back to the [Mattermost Redux repository](https://github.com/mattermost/mattermost-redux).

1. Add or update unit tests as necessary. All new features should include unit tests.
2. Run `make test` to confirm that your changes pass all the unit tests.
3. Run `make check-style` to confirm that your changes fit [the style guide](https://docs.mattermost.com/developer/style-guide.html#javascript).

Once those are done, submit a pull request to the [Mattermost Redux repository](https://github.com/mattermost/mattermost-redux) for review.

Once that has been approved and merged, submit a pull request to the [mattermost-webapp](https://github.com/mattermost/mattermost-webapp) and/or [mattermost-mobile](https://github.com/mattermost/mattermost-mobile) repositories including any other changes as well as updating the package.json and npm.lock files to include your Mattermost Redux changes.
