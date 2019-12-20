---
title: On Hermes and Mattermost
slug: on-hermes-and-mattermost
date: 2019-12-20T12:00:00-04:00
author: Miguel Alatzar
github: migbot
community: miguel.alatzar
---

With the upgrade to [React Native 61](https://facebook.github.io/react-native/blog/2019/09/18/version-0.61) came the prospect of substantially improving performance of our Android app. How? Through the use of [Hermes](https://github.com/facebook/hermes), Facebook’s new JavaScript engine. To say that we were excited is an understatement. And with that excitement came curiosity: how is this new JavaScript engine achieving performance boosts? Let’s first chat a bit about JS engines in general. 

How does your JavaScript code eventually get executed by the CPU on the machine? Through a JavaScript engine. Initially JS engines interpreted JS code, that is, as each line came in during run-time the JS engine would translate it to machine code that the host machine then executed. Later, with the use of Just-In-Time (JIT) compilation, optimizations could be made as “hot code” can be compiled and stored so that it, instead of the source code, could be executed the next time it’s needed. Another optimization that can be made is type specialization. Because of JavaScript’s dynamic type system, when the compiler encounters say, a for-loop on an array, it needs to check the types of each element each time it’s accessed during execution. To avoid this the compiler can move the type checks before the loop so that it’s done only once. You can read more about JIT compilers [here](https://hacks.mozilla.org/2017/02/a-crash-course-in-just-in-time-jit-compilers/).

How does this all play in with React Native? In RN, the JS engine used is the one provided by the [JavaScriptCore Framework](https://developer.apple.com/documentation/javascriptcore). Facebook provides build scripts to get JSC built for Android ([android-jsc](https://github.com/facebook/android-jsc)). When you build your app, the JS source code is minified and included in your APK as a resource. When your app starts running all the JS code is handled by the JSC engine and all the optimization is done at run-time through the JIT compiler. But what if that optimization could be done during build time? That’s where Hermes comes in. With Hermes, there is no JIT compiler. Instead, the compilation and optimization of the JS code happens when the APK is built and instead of minified JS code, optimized bytecode is included as a resource in your APK. This has various benefits including decreasing launch time since the bytecode is ready to be executed and allowing for considerations of more complex and time-consuming optimizations since the compilation process no longer affects the end-user.

So, once we upgraded to RN 61 and enabled Hermes, we were ecstatic to see the Mattermost Android app launch within 3 seconds as opposed to about 7 without Hermes. You can see a demo of this presented during the Chain React 2019 [here](https://www.youtube.com/watch?v=zEjqDWqeDdg&feature=youtu.be&t=156). Unfortunately, after further use of our app we experience very noticeable lag when scrolling the channel list, opening/closing the sidebars, and switching channels. Sadly, the app was unusable so we shipped Mattermost v1.26 without Hermes enabled.

The bugs in Hermes that seemed to be the cause of these issues have since been fixed and we have a [JIRA ticket](https://mattermost.atlassian.net/browse/MM-21184) plan to build the latest Hermes, package it with RN, and test to see if we can ship v1.28 with Hermes enabled. Stay tuned!
