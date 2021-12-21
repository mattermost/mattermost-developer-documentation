---
title: "Packaging and Releasing"
heading: "Packaging and Releasing the Desktop App"
description: "Learn how to build, package and release the Desktop App"
date: 2019-01-22T00:00:00-05:00
weight: 4
---

## Building

You can build the Desktop App by running the following command:

    npm run build

You can build the Desktop App for development and watch for changes in the main process with this command:

    npm run watch

Our application uses `webpack` to bundle the scripts together for the main and renderer process.  
There are bundles generated for each page used the renderer process, and one bundle for the main process.  
A bundle is also generated for the E2E tests when needed.

You can predefine certain variables in the app before building, by editing the build config under `src/common/config/buildConfig.ts`. For example, you can predefine servers, or disable server management.

## Packaging

Our app uses `electron-builder` to package the app into a distributable format for release.  
You can find the configuration for the builder in the `electron-builder.json` file in the root directory.

You can run the packager using this command:

    npm run package:<os>

where **<os>** is one of the following values: `windows, mac, mac-universal, linux`

All of the above values will generate builds for all applicable architectures:
- `windows`: x86, x64 - `exe` format
- `mac`: x64, arm64 (M1) - `dmg` and `zip` formats, one for each architecture.
- `mac-universal`: universal binary for all architectures - `dmg`
- `linux`: x64, x86 - `deb`, `rpm` and `tarball` formats

If you want to build the MSI installer for Windows, you need to run the `Makefile.ps1` script in the `scripts/` folder.

```powershell
./scripts/Makefile.ps1 build
```

#### After Pack Script

We include an `afterPack` script to run functions after the application is built into a binary. This is a good place to inject code and make any modifications to the binary after build.

#### Code Signing

In order to generate signed builds of the application for Windows and macOS, you'll need a certificate file for each of the operating systems.

These files are under control of Mattermost and aren't generally distributed, but you can obtain your own certificate and sign the app yourself if necessary.

For macOS, you'll need a valid `Mac Developer` or `Developer ID Application` certificate from the Apple Developer Program.

For Windows, you'll need a valid `.pfx` file.

More information on Code Signing can be found here: https://www.electron.build/code-signing

## Releasing

Releasing a new version of the Desktop App can be done by running the shell script `release.sh` under the `scripts/` folder.  
It will increment the version number in `package.json` for you, create a tag and generate a commit for you. It will also give you the `git` command to run to push all these changes to your repository.

It has the following options:
```
// generates a patch version release candidate, will increment x of v0.0.x (so v5.0.1 becomes v5.0.2-rc1)
$ ./scripts/release.sh patch

// generates a release candidate version, on top of a current release candidate (so v5.0.2-rc1 becomes v5.0.2-rc2)
$ ./scripts/release.sh rc

// generates a final version, on top of a current release candidate (so v5.0.2-rc2 becomes v5.0.2)
$ ./scripts/release.sh final
```