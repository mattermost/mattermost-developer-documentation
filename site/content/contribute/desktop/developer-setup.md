---
title: "Environment Setup"
date: 2018-01-02T10:44:11-05:00
weight: 2
subsection: "desktop"
---

# Environment Setup

## Prerequisites
- C++ environment which supports C++11 (e.g. VS 2015, Xcode, GCC)
- Python 2.7
- Node.js 4.2.0 or later
- Yarn
- Git

## Installing dependencies
After installation, dependencies of `src/` directory are also installed.

```
$ yarn
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

```
$ npm run package:<all | windows | mac | linux>
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

## Helper commmands

### `npm run watch`
Reload the application automatically when you have saved source codes.
When using this mode, you can use "React Developer Tools" in the Developer Tools window.
