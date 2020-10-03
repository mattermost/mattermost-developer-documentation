---
title: "Build Preparations"
date: 2018-05-20T11:35:32-04:00
weight: 1
subsection: Build Your Own App
---

First of all, ensure that the following remains exactly the same as in the original [mattermost-mobile](https://github.com/mattermost/mattermost-mobile) repo:

- The package ID for the Android app and the Bundle Identifier for the iOS app remain the same as the one in the original mattermost-mobile repo `com.mattermost.rnbeta`.
- Android-specific source files remain under `android/app/src/main/java/com/mattermost/rnbeta`.
- Your [environment variables](/contribute/mobile/build-your-own/environment-vars) are set according to your needs.

### Install Xcode command line tools:

```bash
$ xcode-select --install
```

### Install Fastlane

Fastlane is the easiest way to automate beta deployments and releases for your iOS and Android apps. 🚀 It handles all tedious tasks, like generating screenshots, dealing with code signing, and releasing your application.

```bash
# Using RubyGems
$ gem install fastlane -NV

# Alternatively using Homebrew
# (has been moved from cask to homebrew/core)
$ brew install fastlane 
```

For more information you can visit the Fastlane [docs](https://docs.fastlane.tools/).
