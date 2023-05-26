---
title: Desktop Release Process
heading: "Desktop App Release Process"
description: "Outlines the release process to generate new Desktop App releases"
date: 2023-05-25T14:28:35-05:00
weight: 101
---

***NOTE**: For the purposes of this document, the letter `X` will refer to the major version number, `Y` will refer to the minor version number, and `Z` will refer to the patch (dot) version number.*

### Before you begin

Before starting a new release, you want to make sure you do a few things:
- Check to make sure that there are no further Story tickets waiting to be merged. You can check JIRA to see if there are any tickets with the Fix version: `vX.Y Desktop App`. If there are, you'll want to wait until those have been merged.

- If you work off of a for of the `mattermost/desktop` repo, make sure your local master branch is up to date:
    ```
    git checkout master && git fetch --all && git merge upstream/master`
    ```

### Starting a new release

1. For a new major or minor release, check out the `master` branch and create a new release branch from it.
    ```
    git checkout master
    git checkout -b release-X.Y
    ```
    For a patch release, just check out the existing release branch matching the version you're patching.
    ```
    git checkout release-X.Y
    ```

2. Run the release script to create the first release candidate.
    Major/Minor release:
    ```
    ./scripts/release.sh rc
    ```
    Patch release:
    ```
    ./scripts/release.sh patch
    ```

3. When the script is finished, if it worked successfully, you should see an output like this: 
    ```
    [INFO   ] Generating X.Y.Z release candidate 1
    [INFO   ] Locally created an rc. In order to build you'll have to:
    [INFO   ] $ git push --follow-tags upstream release-X.Y:release-X.Y
    ```
    If so, you can run the provided command.

    If **not**, you may need to:
    - Make sure there are no local uncommitted changes
    - Make sure there are no tags matching the new version you're trying to create

4. **For major/minor releases only**: Once you have pushed the new release branch and tags, switch back to the `master` branch, and edit the `package.json` and `package-lock.json` files to reflect the next minor version. For example, if the version you're releasing is `5.0.0`, change the version number to `5.1.0`. When done, create a PR to bump `master` to the next release.

5. Wait for the release candidate to finish building. You can monitor the progress [here](https://github.com/mattermost/desktop/actions/workflows/release.yaml). When it's finished, there will be a post in the `Release: Desktop Apps` channel with the new version number and a changelog.

6. When the release process is finished, go to the `mattermost/desktop` GitHub repository and select **Releases**.
7. There should be a draft release of your new release candidate. Click the Pencil icon to edit.
8. Make sure it's checked off as a pre-release, then select **Publish Release**.

### Generating additional release candidates

If there are any bugs reported by QA, once they are fixed we will need to generate an additional release candidate to verify that any issues has been fixed.

To generate additional release candidates, you'll simply run the following commands to kick it off:
```
git checkout -b release-X.Y
./scripts/release.sh rc
git push --follow-tags upstream release-X.Y:release-X.Y
```

You can then follow steps **5-8** above to make sure the release is published.

### Mac App Store

Once the final release candidate has been approved by QA, you will need approval from the Mac App Store. To do so, we create a special release for them:
```
git checkout -b release-X.Y
./scripts/release.sh mas
git push --follow-tags upstream release-X.Y:release-X.Y
```

#### Submitting to App Review

In this case, you won't get any notifications from Mattermost or GitHub, as we are submitting directly to Apple at this point. From here, we will need to submit the app for review:

1. Go to our app on [App Store Connect](https://appstoreconnect.apple.com/apps/1614666244/appstore) and log in with your credentials.
    - If you do not have access to App Store Connect, you'll have to ask your team lead.
2. If there is not an unreleased version, click the **+** button on the top-left next to "macOS App" and fill out the version number (should just be `X.Y.Z`)
3. Copy the changelog for this version into the **"What's New in This Version"** section.
4. In the Build section, click Add Build. Find the build corresponding to the version that was just built. 
    - You should be able to recognize it by timestamp, but if not, grab the build from TestFlight and verify that the version number is correct.
5. Make sure under Version Release that we select "Manually release this version"
6. Once that's all done, you can click the Add for Review button and follow the prompts to submit a review.

If the app is **approved** by App Review, you will get an email from App Store Connect saying "Your submission was accepted". From there, you can go back and release the app once the final release has been cut.

If the app is **rejected** by App Review, you will get an email from App Store Connect saying "We noticed an issue with your submission". At that point, you'll need to log back into App Store Connect and review their comments. Make the necessary changes and you can follow the same process as above to re-submit for review until the app has been approved.

### Creating the final release

Once the app has been approved by all parties, we can cut the final release:
```
git checkout -b release-X.Y
./scripts/release.sh final
git push --follow-tags upstream release-X.Y:release-X.Y
```

You can then follow steps **5-8** above to make sure the release is published, but make sure that the checkbox for 'set as pre-release` is unchecked.

#### Final Steps

Afterwards, you will need to update the [`ci/latest`](https://git.internal.mattermost.com/ci/latest) repo in GitLab to update the latest version of the Desktop App available on mattermost.com.

In that repo there is a file called `release-updates.vars`, and in that file there is a line that says `DESKTOP_STREAM_LATEST`. You can replace that version number with the one you just released, and submit a PR to be reviewed by Release team.