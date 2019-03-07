---
title: "Overriding Assets & White Labeling"
date: 2018-05-20T11:35:32-04:00
weight: 4
subsection: Build Your Own App
---

We've made it easy to white label the mobile app and to replace override the assets used, however, you have to Build Your Own App from Source\_.

If you look at the [Project Directory Structure](/contribute/mobile/developer-workflow/#project-directory-structure), you'll see that there is an assets folder containing a base folder with assets provided by Mattermost. These include localization files, images and a release folder that optionally contains the icons and the splash screen of the app when building in release mode.

To replace these with your own assets, create a sub-directory called `override` in the `assets` folder. Using the same directory structure and file names as in the `base` directory, you can add assets to the override folder to be used instead.

### Localization Strings

To replace some or all of the strings in the app in any supported language, create a new json file for each locale you wish to support in `assets/override/i18n`. Any strings that you provide will be used instead of the ones located in `assets/base/i18n`, but any that you don't provide will fall back to the base ones.

### Images

To replace an image, copy the image to `assets/override/images/` with the same location and file name as in the `base` folder.

**Make sure the images have the same height, width and DPI as the images that you are overriding.**

### App Splash Screen and Launch Icons

In the `assets` directory you will find a folder named `assets/base/release` which contains an `icons` folder and a `splash_screen` folder under each platform directory.

Copy the full `release` directory under `assets/override/release` and then replace each image with the same name. Make sure you replace all the icon images for the platform you are building for the app - the same applies to the splash screen.

The Splash Screen's background color is white by default and the image is centered. If you need to change the color or the layout to improve the experience of your new splash screen make sure that you also override the file `launch_screen.xml` for Android and `LaunchScreen.xib` for iOS. Both can found under`assets/base/release/splash\_screen/\<platform\>`.

**Make sure the images have the same height, width and DPI as the images that you are overriding.**

### Configuration

The config.json file handles custom configuration for the app for settings that cannot be controlled by the Mattermost server. Like with localization strings, create a `config.json` file under `assets/override` and just include the keys and values that you wish to change.

For example, if you want the app to automatically provide a server URL and skip the screen to input it, you would add the following to `assets/override/config.json`:
```json
{
  "DefaultServerUrl": "http://192.168.0.13:8065",
  "AutoSelectServerUrl": true
}
```

The above key/value pairs are taken from the original `config.json` file and since we don’t need to change anything else, we only included these two settings.
