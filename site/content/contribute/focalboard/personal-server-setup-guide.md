---
title: "Personal Server Setup Guide"
heading: "Personal Server Setup Guide"
description: "Learn how to build the Focalboard Personal Server."
date: 2022-03-24T00:40:23-07:00
weight: 1
---

This guide will help you configure your developer environment for the Focalboard **Personal Server**. For most features, this is the easiest way to get started working against code that ships across editions. For working with **Mattermost Boards** (Focalboard as a plugin), please refer to the [Mattermost Boards Plugin Guide](../mattermost-boards-setup-guide/).

## Installing prerequisites
### All
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (if using Windows, see below)
* [Go](https://golang.org/doc/install)
* [Node.js](https://nodejs.org/en/download/) (v10+)
* [npm](https://www.npmjs.com/get-npm)

### Windows
* Install [MinGW-w64](https://chocolatey.org/packages/mingw) via [Chocolatey](https://chocolatey.org/)
* Install [Git for Windows](https://gitforwindows.org/) and use the `git-bash` terminal shell

### Mac
* Install [Xcode](https://apps.apple.com/us/app/xcode/id497799835?mt=12) (v12+)
* Install the Xcode Command Line Tools via `xcode-select --install`

### Linux
* `sudo apt-get install libgtk-3-dev`
* `sudo apt-get install libwebkit2gtk-4.0-dev`
* `sudo apt-get install autoconf dh-autoreconf`

## Forking the project repository

Fork the [Focalboard GitHub repository](https://github.com/mattermost/focalboard) and clone it locally.

## Building via the terminal

To build the server:

```
make prebuild
make
```

To run the server:

```
 ./bin/focalboard-server
```

Then navigate your browser to [`http://localhost:8000`](http://localhost:8000) to access your Focalboard server. The port is configured in `config.json`.

Once the server is running, you can rebuild just the web app via `make webapp` in a separate terminal window. Reload your browser to see the changes.

## Building and running standalone desktop apps

You can build standalone apps that package the server to run locally against [SQLite](https://www.sqlite.org/index.html):

* **Windows**:
    * *Requires Windows 10, [Windows 10 SDK](https://developer.microsoft.com/en-us/windows/downloads/sdk-archive/) 10.0.19041.0, and .NET 4.8 developer pack*
    * Open a `git-bash` prompt.
    * Run `make win-wpf-app`
    * Run `cd win-wpf/msix && focalboard.exe`
* **Mac**:
    * *Requires macOS 11.3+ and Xcode 13.2.1+*
    * `make mac-app`
    * `open mac/dist/Focalboard.app`
* **Linux**:
    * *Tested on Ubuntu 18.04*
    * Install `webgtk` dependencies
        * `sudo apt-get install libgtk-3-dev`
        * `sudo apt-get install libwebkit2gtk-4.0-dev`
    * `make linux-app`
    * Uncompress `linux/dist/focalboard-linux.tar.gz` to a directory of your choice
    * Run `focalboard-app` from the directory you have chosen
* **Docker**:
    * To run it locally from offical image:
        * `docker run -it -p 80:8000 mattermost/focalboard`
    * To build it for your current architecture:
        * `docker build -f docker/Dockerfile .`
    * To build it for a custom architecture (experimental):
        * `docker build -f docker/Dockerfile --platform linux/arm64 .`

Cross-compilation currently isn't fully supported, so please build on the appropriate platform. Refer to the GitHub Actions workflows (`build-mac.yml`, `build-win.yml`, `build-ubuntu.yml`) for the detailed list of steps on each platform.

## Setting up VS Code

* Open a [VS Code](https://code.visualstudio.com/) terminal window in the project folder.
* Run `make prebuild` to install packages. *Do this whenever dependencies change in `webapp/package.json`.*
* Run `cd webapp && npm run watchdev` to automatically rebuild the web app when files are changed. It also includes source maps from JavaScript to TypeScript.
* Install the [Go](https://marketplace.visualstudio.com/items?itemName=golang.Go) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) VS Code extensions (if you haven't already).
* Launch the server:
    * **Windows**: `Ctrl+P`, type `debug`, press the `Space` key, and select `Go: Launch Server`.
    * **Mac**: `Cmd+P`, type `debug`, press the `Space` key, and select `Go: Launch Server`.
    * *If you do not see `Go: Launch Server` as an option, check your `./.vscode/launch.json` file and make sure you are not using a VS Code workspace.*
* Navigate a browser to `http://localhost:8000`

You can now edit the web app code and refresh the browser to see your changes efficiently.

**Debugging the web app**: As a starting point, add a breakpoint to the `render()` function in `BoardPage.tsx` and refresh the browser to walk through page rendering.

**Debugging the server**: As a starting point, add a breakpoint to `handleGetBlocks()` in `server/api/api.go` and refresh the browser to see how data is retrieved.

## Rebuilding translations

We use `i18n` to localize the web app. Localized string generally use `intl.formatMessage`. When adding or modifying localized strings, run `npm run i18n-extract` in `webapp` to rebuild `webapp/i18n/en.json`.

Translated strings are stored in other json files under `webapp/i18n`, (e.g. `es.json` for Spanish).

## Accessing the database

By default, data is stored in a sqlite database `focalboard.db`. You can view and edit this directly using `sqlite3 focalboard.db`.

## Unit testing

Run `make ci`, which is similar to the `.gitlab-ci.yml` workflow and includes:

* **Server unit tests**: `make server-test`
* **Web app ESLint**: `cd webapp; npm run check`
* **Web app unit tests**: `cd webapp; npm run test`
* **Web app UI tests**: `cd webapp; npm run cypress:ci`

## Staying informed

Are you interested in influencing the future of the Focalboard open source project? Please read the [Focalboard Contribution Guide](../). We welcome everyone and appreciate any feedback. ❤️ There are several ways you can get involved:

* **Changes**: See the [CHANGELOG](https://github.com/mattermost/focalboard/blob/main/CHANGELOG.md) for the latest updates
* **GitHub Discussions**: Join the [Developer Discussion](https://github.com/mattermost/focalboard/discussions) board
* **Bug Reports**: [File a bug report](https://github.com/mattermost/focalboard/issues/new?assignees=&labels=bug&template=bug_report.md&title=)
* **Chat**: Join the [Focalboard community channel](https://community.mattermost.com/core/channels/focalboard)
