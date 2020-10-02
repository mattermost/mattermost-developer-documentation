---
title: "Sign Unsigned iOS"
date: 2018-05-20T11:35:32-04:00
weight: 2
subsection: Sign Unsigned Builds
---

With every Mattermost mobile app release, we publish the iOS unsigned ipa in in the <a href="https://github.com/mattermost/mattermost-mobile/releases" target="_blank">GitHub Releases</a> page, this guide describes the steps needed to modify and sign the app, so it can be distributed and installed on iOS devices.

#### Requisites

1. MacOS with <a href="https://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12" target="_blank">Xcode</a> installed (Minimum required version is **11.0**)
2. Install the Xcode command line tools
	```bash
	$ xcode-select --install
3. Setup your Certificate and Provisioning profiles as described in steps 1 & 2 for [Run on iOS Devices](/contribute/mobile/developer-setup/run/#run-on-ios-devices) in the Developer Setup.
4. `sign-ios` script to sign the iOS app.

#### Signing Tool

```bash
Usage: sign-ios <unsigned ipa file>
		[-a|--app provisioning]
		[-n|--notification provisioning]
		[-s|--share provisioning]
		[-c|--certificate certificateName]
		[-g|--app-group-id appGroupId]
		[-d|--display-name displayName]
		outputIpa
Usage: sign-ios -h|--help
Options:
	-a, --app provisioning	            Provisioning profile for the main application.
							                -a xxx.mobileprovision

	-n, --notification provisioning		Provisioning profile for the notification extension.
							                -n xxx.mobileprovision

	-s, --share provisioning		    Provisioning profile for the share extension.
							                -s xxx.mobileprovision

	-d, --display-name displayName		(Optional) Specify new application display name.
                                        By default "Mattermost" is used.
							                Warning: will apply for all nested apps and extensions.

	-g, --app-group-id appGroupId		Specify the app group identifier to use (AppGroupId).
							                Warning: will apply for all nested apps and extensions.

	-v, --verbose				        Verbose output.

	-h, --help				            Display help message.
```

#### Sign the Mattermost iOS app

Now that all requisites are met, it's time to sign the Mattermost app for iOS. Most of the options of the signing tool are mandatory
and you should be using your own `provisioning profiles`, `certificate`, also you could change the app `display name`.

* Create a folder that will serve as your working directory to store all the needed files.

* Download your **Apple Distribution certificate** from the
<a href="https://developer.apple.com/account/resources/certificates/list" target="_blank">Apple Developers portal</a> and save it in your working directory.

* Install the previously downloaded certificate into your MacOS Keychain. <a href="https://developer.apple.com/support/certificates/" target="_blank">Learn more</a>.

* Download your **Provisioning profiles** from the
<a href="https://developer.apple.com/account/resources/profiles/list" target="_blank">Apple Developers portal</a> and save it in your working directory.

* Download the <a href="/scripts/sign-ios" download>sign-ios</a> script and save it in your working directory.

* Download the <a href="https://github.com/mattermost/mattermost-mobile/releases" target="_blank">iOS unsigned build</a> and save it in your working directory.

* Open a terminal to your working directory, make sure the `sign-ios` script it is executable.

```bash
$ ls -la
total 81472
drwxr-xr-x  7 user  staff       224 Oct 11 10:54 .
drwxr-xr-x  8 user  staff       256 Oct 11 10:49 ..
-rw-r--r--@ 1 user  staff  75261811 Oct  2 12:44 Mattermost-unsigned.ipa
-rw-r--r--@ 1 user  staff     10746 Oct  2 10:30 app.mobileprovision
-rw-r--r--@ 1 user  staff      9963 Oct  2 10:30 noti.mobileprovision
-rw-r--r--@ 1 user  staff     10763 Oct  2 10:30 share.mobileprovision
-rwxr-xr-x  1 user  staff     38581 Oct 11 10:54 sign-ios
```

* Sign the app

```bash
$ ./sign-ios Mattermost-unsigned.ipa -c "Apple Distribution: XXXXXX. (XXXXXXXXXX)" -a app.mobileprovision -n noti.mobileprovision -s share.mobileprovision -g group.com.mattermost -d "My App Display Name" MyApp-signed.ipa
```

once the code sign is complete you should have a signed IPA in the working directory with the name **MyApp-signed.ipa**.

{{<note "Note">}}
The app name can be anything, use double quotes specially if the name has white spaces.

The name of the `certificate` should match the name in the MacOS Keychain.
{{</note>}}
