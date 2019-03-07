---
title: "Build Your Own App"
date: 2018-05-20T11:35:32-04:00
weight: 5
subsection: Mobile Apps
---

You can build the app from source and distribute it within your team or company either using the App Stores, Enterprise App Stores or EMM providers, or another way of your choosing.

We recommend using the [**make build**\* commands](/contribute/mobile/makefile) in conjunction with [Fastlane](https://docs.fastlane.tools/#choose-your-installation-method). With Fastlane, you can also configure the app using environment
variables.


### Push Notifications with Your Own Build

When building a custom version of the Mattermost mobile app, you will also need to host your own [Mattermost Push Notification Service](https://github.com/mattermost/mattermost-push-proxy) and make a few modifications to your Mattermost mobile app to be able to get push notifications.

Follow [this steps](/contribute/mobile/push-notifications/) to receive push notifications in your custom app.

