---
title: "White Labeling"
date: 2018-05-20T11:35:32-04:00
weight: 3
subsection: Build Your Own App
---

We've made it easy to white label the mobile app and to replace and override the assets used, however, you have to [Build Your Own App](/contribute/mobile/build-your-own) from Source.

If you look at the [Project Folder Structure](/contribute/mobile/developer-setup/structure/), you'll see that there is an assets folder containing a base folder with assets provided by Mattermost. These include localization files and images as well as a release folder that optionally contains the icons and the splash screen of the app when building in release mode.

To replace these with your own assets, create a sub-directory called `override` in the `assets` folder. The assets that you add using the same directory structure and file names as in the `base` directory, will be used instead of the original ones.

### Localization Strings

To replace some or all of the strings in the app in any supported language, create a new json file for each locale you wish to override in `assets/override/i18n`. Any strings that you provide will be used instead of the ones located in `assets/base/i18n`, but any that you don't provide will fall back to the original ones.

### Images

To replace an image, copy the image to `assets/override/images/` with the same location and file name as in the `base` folder.

{{<note "Note">}}
Make sure the images have the same height, width and DPI as the images that you are overriding.
{{</note>}}

### App Splash Screen and Launch Icons

In the `assets` directory you will find a folder named `assets/base/release` which contains an `icons` folder and a `splash_screen` folder under each platform directory.

Copy the full `release` directory under `assets/override/release` and then replace each image with the same name. Make sure you replace all the icon images for the platform you are building the app - the same applies to the splash screen.

The splash screen's background color is white by default and the image is centered. If you need to change the color or the layout to improve the experience of your new splash screen make sure that you also override the file `launch_screen.xml` for Android and `LaunchScreen.storyboard` for iOS. Both can be found under`assets/base/release/splash\_screen/\<platform\>`.

Splash screen and launch icons assets are replaced at build time when the [Environment Variable](/contribute/mobile/build-your-own/environment-vars/) `REPLACE_ASSETS` is set to true (default is false).

{{<note "Note">}}
Make sure the images have the same height, width and DPI as the images that you are overriding.
{{</note>}}

### Configuration

The config.json file handles custom configuration for the app for settings that cannot be controlled by the Mattermost server. Like with localization strings, create a `config.json` file under `assets/override` and just include the keys and values that you wish to change that are present in `assets/base/config.json`.

For example, if you want the app to automatically provide a server URL and skip the screen to input it, you would add the following to `assets/override/config.json`:
```json
{
  "DefaultServerUrl": "http://192.168.0.13:8065",
  "AutoSelectServerUrl": true
}
```
{{<note "Note">}}
The above key/value pairs are taken from the original `config.json` file. Since we don’t need to change anything else, we only included these two settings.
{{</note>}}