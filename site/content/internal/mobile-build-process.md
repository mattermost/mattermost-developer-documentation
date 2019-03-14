---
title: Mobile Build Cutting Process
date: 2019-03-14T14:28:35-05:00
section: internal
weight: 100
---

**Note: To cut mobile builds, please ask help from Elias or Carlos.**

Steps to cut the mobile build:

1. Increase the build number of the app and submit a PR on the mobile repo.

  - To increase the build number, source env vars:

```
export LC_ALL="en_US.UTF-8"

############ MATTERMOST BUILD ############
export COMMIT_CHANGES_TO_GIT=true
export BRANCH_TO_BUILD=master
export GIT_LOCAL_BRANCH=build-number
export RESET_GIT_BRANCH=false

export INCREMENT_BUILD_NUMBER=true
export INCREMENT_BUILD_NUMBER_MESSAGE="Bump app build number to"
```
   
   - ``$ cd fastlane`` in the mattermost-mobile directory.
   - run ``fastlane set_app_build_number``.
   - submit a PR with the ``build-number`` branch.
   
2. Merge the PR to master and cherry-pick.

3. Follow the steps below:
   - ssh to the build machine (MacStadium)
   - ``cd ~/workspace/mm/mattermost-mobile-prod-release``
   - ``rm -rf node_modules``
   - ``npm cache clean --force``
   - ``npm i``

Make sure ``ls node_modules/mattermost-redux/`` shows that mattermost-redux was built.

**Note:** The IP of the build machine user/pwd can be found in the build_qa.sh file that belongs to the 
mattermost-mobile-private repo.

4. Login to Jenkins.

5. Execute the task for ``Build with Parameters`` in ``mattermost-mobile-prod-release`` and set the ``BRANCH_NAME`` to 
``release-X.XX`` (replace the X's with the release version).

After the build is done repeat steps from 3-5 for ``mattermost-mobile-beta-release``.
