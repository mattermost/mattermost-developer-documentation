---
title: "Developer Setup"
date: 2018-01-02T10:44:11-05:00
weight: 2
subsection: "Desktop App"
---

## Prerequisites
- C++ environment which supports C++11 (e.g. VS 2015, Xcode, GCC)
- Python 2.7
- Node.js 8 or later
- NPM
- Git

### Windows
Recommended way to install prerequisites on windows is to install chocolatey package manager.
once installed run from an administrator poweshell console
```
choco install nvm
```
```
choco install git
```

## Installing dependencies
After installation, dependencies of `src/` directory are also installed.

### OsX & Linux
```
$ npm install
```
### Windows
on an administrator powershell run

```
> .\scripts\Makefile.ps1 Install-Deps
```

If the above command fails, it might be due to not having the right policy to install. In that case use this command to temporarily change the policy:

```
> Set-ExecutionPolicy Bypass -Scope Process -Force;
```

## Building
Build JavaScript codes with `webpack`.

```
$ npm run build
```

After building is done, you can execute the application with `npm start`.

## Packaging
Package specific files of `src/` directory as distributable formats with [`electron-builder`](https://github.com/electron-userland/electron-builder).
Files are defined in `electron-builder.json`.
Packages will be generated into `release/` directory.

### OSX & Linux
```
$ npm run package:<all | mac | linux>
```
### Windows
```
> .\scripts\Windows.ps1
```

### Dependencies
Need to install some software required by `electron-builder` to build packages.
Please see [electron-builder wiki](https://www.electron.build/multi-platform-build) for detailed description.
- Windows: Nothing.
- macOS: `brew install gnu-tar`
- Linux (64 bit): `icnsutils`, `graphicsmagick` and `xz-utils` if Ubuntu is used.

### Code signing
Set environment variables to build trusted packages.
Please see [electron-builder wiki](https://www.electron.build/code-signing) for detailed description.

| Environment Variable | Description |
|---|---|
| `CSC_LINK` | The HTTPS link (or base64-encoded data, or `file://` link) to certificate (`*.p12` or `*.pfx` file). |
| `CSC_KEY_PASSWORD` | The password to decrypt the certificate given in `CSC_LINK`. |
| `CSC_NAME` | *macOS-only* Name of certificate (to retrieve from login.keychain). Useful on a development machine (not on CI) if you have several identities (otherwise don't specify it). |

## Tests
Execute automated tests.

```
$ npm test
```

There are two steps in `npm test`.

Test functionality:

```
$ npm run test:app
```

Test coding style:

```
$ npm run lint:js
```

## Helper commands

### `npm run watch`
Reload the application automatically when you have saved source codes.
When using this mode, you can use "React Developer Tools" in the Developer Tools window.

## Directory Structure
```
Mattermost Desktop
├── docs/ - Documentations.
├── resources/ - Resources which are used outside of the application codes, and original images of assets.
├── scripts/ - Helper scripts.
├── src/ - Application source code.
│   ├── assets/ - Assets which are loaded from the application codes.
│   ├── browser/ - Implementation of Electron's renderer process.
│   │   ├── components/ - React.js components.
│   │   ├── css/ - Stylesheets.
│   │   ├── js/ - Helper JavaScript modules.
│   │   └── webview/ - Injection code for Electron's <webview> tag.
│   ├── common/ - Common JavaScript modules for both Electron's processes.
│   └── main/ - Implementation of Electron's main process.
│       └── menus/ - Application menu.
└── test/ - Automated tests.
    ├── modules/ - Scripts which are commonly used in tests.
    └── specs/ - Test scripts.
```

### Other directories
- `node_modules/` - Third party Node.js modules to develop and build the application.
- `release/` - Packaged distributable applications.
- `src/node_modules/` - Third party Node.js modules to use in the application.
