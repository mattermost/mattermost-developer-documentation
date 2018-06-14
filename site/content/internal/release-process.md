---
title: Release Process
date: 2017-11-07T14:28:35-05:00
section: internal
---

# Release Cutting Process

On code complete day, work with the PM on rotation to get all the pull requests for the current release merged into `master`. Once that is done and you've confirmed with the PM, cut the first release candidate by following these steps:

1. Give yourself access to matterbuild by adding yourself in the platform-private repo. See an [example here](https://github.com/mattermost/platform-private/commit/89f91d81bd4602f4708270c0ca7626da8fc45291). You will need to know your user Id in the Pre-release server.
2. Trigger the matterbuild Jenkins job to update it https://build.mattermost.com/job/matterbuild.
3. Submit a PR to uncomment the upgrade code for the release version and add it to the version array. Use these PRs as examples, [https://github.com/mattermost/mattermost-server/pull/6336/files](https://github.com/mattermost/mattermost-server/pull/6336/files) and [https://github.com/mattermost/mattermost-server/pull/6600/files](https://github.com/mattermost/mattermost-server/pull/6600/files).
4. Once the above PR is merged, post `/mb cut X.X.X-rc1` into a private channel. Replace `X.X.X` with the release version, ex: `3.10.0`. This will begin cutting the build and make an automatic post to the Release Discussion channel.
5. Wait approximately 25 minutes for the build to finish. If the build fails, you will need to delete the version tags from the mattermost-server, mattermost-webapp and enterprise repositories by running `git push origin :vX.X.X-rc1` in all of them. Then simply repeat step 4. You can monitor build status from https://build.mattermost.com.
6. Once the build finishes, submit a PR to `master` to add the upgrade code for the next release. For example, [https://github.com/mattermost/mattermost-server/pull/6337/files](https://github.com/mattermost/mattermost-server/pull/6337/files) and [https://github.com/mattermost/mattermost-server/pull/6616/files](https://github.com/mattermost/mattermost-server/pull/6616/files).

The build automation will take care of updating all the CI and test servers, and it will make a post in the Release Discussion channel with all the download links. It will also create the release branch named `release-X.X`, with `X-X` replace by the major and minor version numbers.

Between now and the final release being cut, work with the PM on rotation to get priority fixes merged into the release branch. Note that all PRs to the release branch:

1. Must be for Jira tickets approved for this release by you and the PM on rotation.
2. Should be assigned to you and have the correct milestone set.

Work with the PM on rotation to decide when to cut new release candidates. The general guideline is cut a new RC after 3-5 fixes have been merged or it's been a day or two since any more issues have come up. Each release usually has 3-4 release candidates. To cut a new release candidate:

1. Post `/mb cut X.X.X-rcX` into a private channel, replacing `X.X.X-rcX` with the release version and the release candidate number we're on. For example, `3.10.0-rc2`.
2. Wait for the build to finish, deleting tags  (`git push origin :X.X.X-rcX`) and re-running if the build fails.

Again, the build automation will update all the servers and post in the Release Discussion channel.

In addition to cutting new release candidates, you should merge the release branch into master on a daily basis. You can do this by making a pull request to merge `release-X.X` into `master`.

When it's time to cut the final build, confirm with the PM that no more changes need to be merged. To cut the final release:

1. Post `/mb cut X.X.X` into a private channel, replacing `X.X.X` with the release version.
2. Just like before, if the build fails you can delete the tags and re-run it.

The links to download the final build will be posted in the Release Discussion channel. Congratulations you've cut a release!

After a couple days pass you will need to set the CI servers to point back to `master`. To do this:

1. Post `/mb setci master` into a private channel.
2. Post `/mb setprerelease master` into a private channel.

# Daily Merges from Release Branch to Master Branch

After a release branch is cut, we need to merge the release branch into `master` daily to sync all changes made in the release branch.

To do, so follow these steps for the following repositories:

* mattermost-server
* mattermost-webapp
* mattermost-redux
* enterprise

1. Create a branch:

```Bash
$ git checkout master
$ git fetch upstream -p
$ git merge upstream/master
$ git push origin master

$ git checkout -b <name-of-the-branch> # ie. release-x.x-daily-merge-yyyymmdd
$ git merge upstream/release-X.X --no-ff # where X.X is the release number
$ git push origin <name-of-the-branch>
```

2. Open a PR for the branch.
3. After the PR is approved, create a merge commit:

```Bash
$ git checkout master
$ git merge <name-of-the-branch> --ff-only
$ git push upstream master
```

That's it!
