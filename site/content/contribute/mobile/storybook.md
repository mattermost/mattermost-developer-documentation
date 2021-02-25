---
title: "Storybook"
heading: "Storybook for mobile"
description: "Using Storybook to develop components"
date: 2021-02-25T11:17:44+05:30
subsection: Mobile Apps
---

Storybook has been added to the mobile repo to help prototype components. To use storybook:

1. In the root of the repo run `npm run storybook`. This step automatically scans and loads all stories. A new browser tab will open with the storybook interface. You can configure the storybook host url by updating the .env file in the root of the repo. This might be required if you're using a real device. When running in an emulator, the code tries to use the default network values.
2. Run the usual `npm run android` (or `npm run ios`) and `npm start` commands.
3. Storybook has been integrated into the react-native-dev-menu. You can use the Cmd+D keyboard shortcut when your app is running in the iOS Simulator, or Cmd+M when running in an Android emulator on Mac OS and Ctrl+M on Windows and Linux to open the dev menu and select the "Storybook" option. If running on a real device, shaking the device will bring up the react-native dev menu. You can also press `d` in the terminal where you ran `npm start`.
4. The storybook interface will open in the mobile app. The stories can be controlled either through the desktop browser storybook UI or the mobile browser storybook UI. Both will render the component on the device.

>**caveat**: Promises are currently broken in storybook for react native. Components using promises will not work correctly. There is a temporary hacky fix to work around this issue: [storybookjs/react-native#57](https://github.com/storybookjs/react-native/issues/57#issuecomment-737931284).
