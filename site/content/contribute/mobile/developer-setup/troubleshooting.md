---
title: "Troubleshooting"
date: 2017-08-20T11:35:32-04:00
weight: 5
subsection: Developer Setup
---

#### Errors When Running 'make run-android'

##### Error message
```sh
React-native-vector-icons: cannot find dependencies
```

##### Solution
Make sure the **Extras > Android Support Repository** package is installed with the Android SDK.

##### Error message
```sh
Execution failed for task ':app:packageAllDebugClassesForMultiDex'.
> java.util.zip.ZipException: duplicate entry: android/support/v7/appcompat/R$anim.class
```

##### Solution
Clean the Android part of the mattermost-mobile project. Issue the following commands:

1. ``cd android``
2. ``./gradlew clean``

##### Error message
```sh
Execution failed for task ':app:installDebug'.
> com.android.builder.testing.api.DeviceException: com.android.ddmlib.InstallException: Failed to finalize session : INSTALL_FAILED_UPDATE_INCOMPATIBLE: Package com.mattermost.react.native signatures do not match the previously installed version; ignoring!
```

##### Solution
The development version of the Mattermost app cannot be installed alongside a release version. Open ``android/app/build.gradle`` and change the applicationId from ``"com.mattermost.react.native"`` to a unique string for your app.

##### Error Message
```
[Error] Error: Compilation of µWebSockets has failed and there is no pre-compiled binary available for your system. Please install a supported C++11 compiler and reinstall the module 'uws'.
... looping infinitely ...
```
##### Solution

Your are most likely using the wrong version of node and npm. Recommended versions are node 10.11.0 and npm 6.4.1. 

#### Errors When Running 'make run-ios'

##### Error message
```sh
xcrun: error: unable to find utility "instruments", not a developer tool or in PATH
```

##### Solution

- Launch XCode and agree to the terms first.
- Go to **Preferences -> Locations** and you'll see an option to select a version of the Command Line Tools. Click the select box and choose any version to use.

![preferences](/img/mobile/xcode_preferences.png)

- After this go back to the command line and run ``make run-ios`` again.

##### Error message
```sh
Getting Cocoapods dependencies
/Library/Ruby/Site/2.0.0/rubygems/dependency.rb:315:in `to_specs': Could not find 'cocoapods' (>= 0) among 17 total gem(s) (Gem::LoadError)
Checked in 'GEM_PATH=/Users/<username>/.rvm/gems/ruby-2.4.2:/Users/<username>/.rvm/gems/ruby-2.4.2@global', execute `gem env` for more information
    from /Library/Ruby/Site/2.0.0/rubygems/dependency.rb:324:in `to_spec'
    from /Library/Ruby/Site/2.0.0/rubygems/core_ext/kernel_gem.rb:64:in `gem'
    from /Users/<username>/Software/ruby/bin/pod:22:in `<main>'
make: *** [.podinstall] Error 1
```

##### Solution
- Install cocoapods with `gem install cocoapods`
- If that fails with the below, then reinstall ruby with OpenSSL using `rvm reinstall 2.3.0 --with-openssl-dir=/usr/local/opt/openssl` and then install cocoapods
```sh
ERROR:  While executing gem ... (Gem::Exception)
Unable to require openssl, install OpenSSL and rebuild ruby (preferred) or use non-HTTPS sources
```
- Run `make run-ios` again

#### Errors When Running 'react-native packager'

##### Error message
```sh
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
```

##### Solution
- Increase `max_old_space_size` of the NodeJS instance.
    - On macOS, add the following line to your `~/.bash_profile` file: `export NODE_OPTIONS=--max_old_space_size=12000`

- Then reload your bash configuration:

    ```sh
    source ~/.bash_profile
    ```
