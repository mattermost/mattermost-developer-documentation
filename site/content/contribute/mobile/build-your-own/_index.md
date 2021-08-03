---
title: "Build Your Own App"
heading: "Build Your Own Mattermost App"
description: "Learn how to build your own Mattermost mobile app and distribute it within your team."
date: 2018-05-20T11:35:32-04:00
weight: 2
---

You can build the app from source and distribute it within your team or company either using the App Stores, Enterprise App Stores or EMM providers, or another way of your choosing.

At Mattermost, we build and deploy the Apps using a CI pipeline. The pipeline has different jobs and steps that run on specific contexts based on what we want to accomplish. You can check it out [here](https://github.com/mattermost/mattermost-mobile/blob/master/.circleci/config.yml).

As an alternative we've also created a set of **scripts** to help automate build tasks. Learn more about the scripts by reviewing the [package.json](https://github.com/mattermost/mattermost-mobile/blob/master/package.json) file.

**Note:** By using the **scripts**, [Fastlane](https://docs.fastlane.tools/#choose-your-installation-method) and other dependencies will be installed in your system.

##### [Buid the Android app](android/) or [Buid the iOS app](ios/)


### Push Notifications with Your Own App

When building your own Mattermost mobile app, you will also need to host the [Mattermost Push Notification Service](https://github.com/mattermost/mattermost-push-proxy) in order to receive push notifications.

See [Setup Push Notifications](/contribute/mobile/push-notifications/) for more details.
