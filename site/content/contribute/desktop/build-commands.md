---
title: "Build and CLI Commands"
heading: "Build and CLI Command Reference"
description: "Some useful build commands for the Desktop App"
date: 2019-01-22T00:00:00-05:00
weight: 2
---

## Build

Here's a list of all the commands used by the Desktop App. These can all be found in `package.json`.

All of these should be run using `npm`, using the following syntax:
```
npm run <command>
```

#### Commands
```
build - An amalgam of the following build commands, used to build the Desktop App:
    build:main - Builds the source code used by the Electron Main process
    build:renderer - Builds the source code used by the Electron Renderer process
    build:robotjs - Builds a version of RobotJS specifically for the current OS/architecture/Electron version
start - Runs the Desktop App using the current code built in the dist/ folder
restart - Re-runs the build process and then starts the app (amalgam of build and start)
clean - Removes all installed Node modules and built code
    clean-install - Same as above, but then runs npm install to reinstall the Node modules
    clean-dist - Only removes the built code
watch - Runs the app, but watches for code changes and recompiles on the fly when a file is changed
    watch:main - Same as above, but only for the main module
    watch:renderer - Above, but only for the renderer module.
test - Builds and runs all of the automated tests for the Desktop App
    test:e2e - Builds and runs the E2E tests for the Desktop App
        test:e2e:nobuild - Runs the E2E tests without rebuilding the entire app
        test:e2e:build - Builds the E2E tests
        test:e2e:run - Runs the E2E tests without building them
    test:unit - Runs the unit tests for the main module
    test:coverage - Runs the unit tests and displays a coverage breakdown
package:all - Builds and creates distributable packages for all OSes
    package:windows - Builds and creates distributable packages for Windows
    package:mac - Builds and creates distributable packages for macOS
    package:mac-universal - Builds and creates a Universal binary for macOS
    package:linux - Builds and creates distributable packages for Linux
lint:js - Runs ESLint against the code and displays results
    lint:js-quiet - Same as above, but with the --quiet option
    fix:js - Save as above, but attempts to fix some of the issues
check-build-config - Builds and validates the build config
    check-build-config:build - Builds the build config
    check-build-config:run - Validates the build config
check-types - Runs the TypeScript compiler against the code
prune - Runs ts-prune to display unused code
```

## CLI Options

Some useful CLI options that our app uses are shown below.  
You can also display these by running: `npm run start help`

```
--version, -v: Prints the application version.
--dataDir, -d: Set the path to where user data is stored.
--disableDevMode, -p: Disable development mode. Allows for testing as if it was Production.
```

## Environment Variables

Some common environment variables we use:

- `NODE_ENV`: Defines the Node environment
    - `PRODUCTION`: Used for Production mode
    - `DEVELOPMENT`: Development mode
    - `TEST`: Used when running automated tests
- `MM_DEBUG_MODALS`: Used for debugging modals, set to `1` to show Developer Tools when a modal is opened
- `MM_DEBUG_SETTINGS`: Used for debugging the Settings Window, set to `1` to show Developer Tools when the window is opened