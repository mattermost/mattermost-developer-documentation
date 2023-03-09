---
title: Mobile Build Process
heading: "The Mattermost Mobile Build Process"
description: "Learn what there is to know about the mobile build process for Mattermost's applications."
date: 2023-03-09T09:05:00-05:00
weight: 31
---

# 1. Pre-requisites

In order to run all the Fastlane scripts, you will need an Apple machine. The steps can be run manually, but the scripts make things much more easy.

You must have ruby 2.7. You can use [`rbenv`](https://github.com/rbenv/rbenv) to manage your ruby version.

The Fastlane scripts rely heavily on environment variables. In order to manage them, we recommend defining them in a `.env` file in the fastlane folder (`PROJECT_DIR/fastlane/.env`).

The first time you run this, you will need to install fastlane. On the fastlane folder (`PROJECT_DIR/fastlane/`) run `bundle install`.

# 2. Build and version bump
For build bump, we recommend to use the following set of environment variables:
```
export INCREMENT_BUILD_NUMBER=true
export BUILD_NUMBER=X
export COMMIT_CHANGES_TO_GIT=true
export BRANCH_TO_BUILD=main
export GIT_LOCAL_BRANCH=bump-build
```
Where X is the build number. The build number **MUST** be always greater than the last build number used. If you try to upload two builds with the same build number to the stores, it will fail.

For version bump, also add the following environment variable:
```
VERSION_NUMBER=X.Y.Z
```
Where X.Y.Z is the version number.

With the setup done, you can run the following commands, depending on what you want to bump:
- `bundle exec fastlane set_app_build_number` to bump only the build number
- `bundle exec fastlane set_app_verion` to bump only the version number
- `bundle exec fastlane set_app_version_build` to bump both build and version number

The command should create the branch, and commit the changes. Once that is done, push the branch and create a PR.

# 3. Create a build and publish
When the version bump PR is merged, you can create the build. The build is created on the CI system and automatically sent to the stores. The Release Team takes care of publishing them in the beta or release track.

In order to trigger the CI, you must create a new branch based on the commit you want to compile (usually the head of the main branch or the head of the release branch). The branch name has to follow one of the following patterns

- `build-X` where x is the build number for beta apps.
- `build-release-x` where x is the build number for official releases.

When you create the branch, you will see that the CI system will trigger, and start building the apps. When the process finishes, the apps get posted in the ["Release: Mobile Apps"](https://community.mattermost.com/core/channels/release-mobile-apps) channel.

If the build fails only for one platform, you shouldn't run the build for both platforms (it will have the same build number, and will fail to upload to the one that was successful before). In order to release only for one platform, use the following branch names:
- `build-android-beta-X` where x is the build number for android beta apps.
- `build-android-release-X` where x is the build number for official android releases.
- `build-ios-beta-X` where x is the build number for ios beta apps.
- `build-ios-release-X` where x is the build number for ios official releases.

# 4. Common problems
- Fastlane forces me to update it, and now the version won't bump because the branch is not clean.

You can set the COMMIT_CHANGES_TO_GIT environment variable to false. That will remove the clean check, but you will need to commit the changes yourself.

# 5. Environment variables
- VERSION_NUMBER: The version number to set
- BUILD_NUMBER: (defaults to the build number defined on iOS + 1) The build number to set.
- INCREMENT_BUILD_NUMBER: (`true` or `false`) whether it should increase the build number.
- COMMIT_CHANGES_TO_GIT: (`true` or `false`) whether it should commit the changes to git. Also checks for the clean status of the git repo.
- BRANCH_TO_BUILD: Ensures we are putting the changes on top of the specified branch.
- GIT_LOCAL_BRANCH: Local branch where to commit the changes.
- RESET_GIT_BRANCH:
- MAIN_APP_IDENTIFIER: (defaults to `com.mattermost.rnbeta`) If your app identifier is different, you can set it with this environment variable.
- INCREMENT_VERSION_NUMBER_MESSAGE: (defaults to `Bump app version number to`) Commit message when incrementing the version number. Will be appended the version number.
- INCREMENT_BUILD_NUMBER_MESSAGE: (defaults to `Bump app build number to`) Commit message when incrementing the build number. Will be appended the build number.
