---
title: "Environment Setup"
date: 2017-08-20T11:35:32-04:00
weight: 2
subsection: "mobile"
---

<div class="section" id="mobile-developer-machine-setup">
<span id="mobile-developer-setup"></span><h1>Environment Setup</h1>
<p>The following instructions apply to the mobile apps for iOS and Android built in React Native. Download the iOS version <a class="reference external" href="http://about.mattermost.com/mattermost-ios-app/">here</a> and the Android version <a class="reference external" href="http://about.mattermost.com/mattermost-android-app/">here</a>. Source code can be found at: <a class="reference external" href="https://github.com/mattermost/mattermost-mobile">https://github.com/mattermost/mattermost-mobile</a></p>
<p>If you run into any issues getting your environment set up, check the Troubleshooting section at the bottom for common solutions.</p>
<div class="section" id="development-environment-setup">
<h2>Development Environment Setup</h2>
<div class="section" id="mac-os-x">
<h3>Mac OS X</h3>
<ol class="arabic simple">
<li>Install <a class="reference external" href="https://developer.apple.com/download/">XCode 8.3</a>.</li>
<li>Install <a class="reference external" href="http://brew.sh/">Homebrew</a>.</li>
<li>Using Homebrew, install <a class="reference external" href="https://nodejs.org">Node.js</a> and npm.</li>
</ol>
<blockquote>
<div><code class="docutils literal"><span class="pre">brew</span> <span class="pre">install</span> <span class="pre">node</span></code></div></blockquote>
<ol class="arabic simple" start="4">
<li>Using Homebrew, install <a class="reference external" href="https://github.com/facebook/watchman">Watchman</a>.</li>
</ol>
<blockquote>
<div><code class="docutils literal"><span class="pre">brew</span> <span class="pre">install</span> <span class="pre">watchman</span></code></div></blockquote>
<ol class="arabic simple" start="5">
<li>Using npm, install the React Native CLI tools globally.</li>
</ol>
<blockquote>
<div><code class="docutils literal"><span class="pre">npm</span> <span class="pre">install</span> <span class="pre">-g</span> <span class="pre">react-native-cli</span></code></div></blockquote>
<ol class="arabic" start="6">
<li><p class="first">Using Homebrew or npm install <a class="reference external" href="https://yarnpkg.com">Yarn</a>.</p>
<p><code class="docutils literal"><span class="pre">brew</span> <span class="pre">install</span> <span class="pre">yarn</span></code> or <code class="docutils literal"><span class="pre">npm</span> <span class="pre">install</span> <span class="pre">-g</span> <span class="pre">yarn</span></code></p>
</li>
<li><p class="first">Fork <a class="reference external" href="https://github.com/mattermost/mattermost-mobile">mattermost-mobile</a> on GitHub.</p>
</li>
<li><p class="first">Clone your fork locally.</p>
</li>
</ol>
<blockquote>
<div><p><code class="docutils literal"><span class="pre">cd</span></code> into the folder that you want to store the local copy of your code</p>
<p><code class="docutils literal"><span class="pre">git</span> <span class="pre">clone</span> <span class="pre">https://github.com/&lt;username&gt;/mattermost-mobile.git</span></code></p>
<p><code class="docutils literal"><span class="pre">cd</span> <span class="pre">mattermost-mobile</span></code></p>
</div></blockquote>
<ol class="arabic simple" start="9">
<li>Using npm, download any other dependencies.</li>
</ol>
<blockquote>
<div><code class="docutils literal"><span class="pre">make</span> <span class="pre">pre-run</span></code></div></blockquote>
<ol class="arabic simple" start="10">
<li><em>Optional:</em> Install Mattermost locally so that you can run unit tests and connect to the server while doing development.</li>
</ol>
<blockquote>
<div><ol class="loweralpha simple">
<li>Follow the steps in the <a class="reference external" href="developer-setup.html">Developer Machine Setup</a> to install Mattermost.</li>
<li>Edit your Mattermost instance’s configuration file to allow sign-up without an invite.</li>
</ol>
<blockquote>
<div>In <code class="docutils literal"><span class="pre">config/config.json</span></code>, set <code class="docutils literal"><span class="pre">&quot;EnableOpenServer&quot;</span></code> to <code class="docutils literal"><span class="pre">true</span></code></div></blockquote>
<ol class="loweralpha simple" start="3">
<li>Start/restart your server.</li>
</ol>
<blockquote>
<div><code class="docutils literal"><span class="pre">make</span> <span class="pre">restart-server</span></code></div></blockquote>
</div></blockquote>
</div>
</div>
<div class="section" id="test-environment-setup">
<h2>Test Environment Setup</h2>
<div class="section" id="android-device">
<h3>Android (Device)</h3>
<ol class="arabic simple">
<li>Install the Android SDK (can be skipped if you already have Android Studio installed).</li>
</ol>
<blockquote>
<div><ol class="loweralpha simple">
<li>Go to <a class="reference external" href="https://developer.android.com/studio/index.html#downloads">the Android developer downloads page</a>, scroll down to the Get Just the Command Line Tools, and download the zip file suitable for your operating system.</li>
<li>Unzip the SDK to somewhere on your hard drive. For example, <code class="docutils literal"><span class="pre">/Users/&lt;username&gt;/Library/Android/sdk</span></code> on Mac OS X.</li>
</ol>
</div></blockquote>
<ol class="arabic simple" start="2">
<li>Configure the following environment variables:</li>
</ol>
<blockquote>
<div><ul class="simple">
<li>Set <code class="docutils literal"><span class="pre">ANDROID_HOME</span></code> to where Android SDK is located (likely <code class="docutils literal"><span class="pre">/Users/&lt;username&gt;/Library/Android/sdk</span></code>)</li>
<li>Add <code class="docutils literal"><span class="pre">ANDROID_HOME/tools</span></code> and <code class="docutils literal"><span class="pre">ANDROID_HOME/platform-tools</span></code> to the <code class="docutils literal"><span class="pre">PATH</span></code>.</li>
</ul>
</div></blockquote>
<ol class="arabic simple" start="3">
<li>Run <code class="docutils literal"><span class="pre">android</span></code> to open the Android SDK Manager and install the following packages:</li>
</ol>
<blockquote>
<div><ul class="simple">
<li>Tools &gt; Android SDK Tools 25.2.5 or higher</li>
<li>Tools &gt; Android SDK Platform-tools 25.0.3</li>
<li>Tools &gt; Android SDK Build-tools 25.0.2</li>
<li>Tools &gt; Android SDK Build-tools 25.0.1</li>
<li>Android 6.0 &gt; SDK Platform 23</li>
<li>Android 6.0 &gt; Google APIs 23</li>
<li>Android 5.1.1 &gt; SDK Platform 22</li>
<li>Android 5.1.1 &gt; Google APIs 22</li>
<li>Extras &gt; Android Support Repository and/or Androud Support Library</li>
<li>Extras &gt; Google Play Services</li>
<li>Extras &gt; Google Repository</li>
</ul>
</div></blockquote>
<ol class="arabic simple" start="4">
<li>Connect your Android device to your computer.</li>
<li>Enable USB Debugging on your device.</li>
<li>Ensure that your device is listed in the output of <code class="docutils literal"><span class="pre">adb</span> <span class="pre">devices</span></code>.</li>
<li>Start the React Native packager to deploy the APK to your device.</li>
</ol>
<blockquote>
<div><code class="docutils literal"><span class="pre">make</span> <span class="pre">run-android</span></code></div></blockquote>
<ol class="arabic simple" start="8">
<li>The installed APK may not be opened automatically. You may need to manually open the Mattermost app on your device.</li>
</ol>
</div>
</div>
<div class="section" id="troubleshooting">
<h2>Troubleshooting</h2>
<div class="section" id="errors-when-running-make-run-android">
<h3>Errors when running ‘make run-android’</h3>
<dl class="docutils">
<dt>Error message</dt>
<dd><div class="first last highlight-none"><div class="highlight"><pre><span></span>React-native-vector-icons: cannot find dependencies
</pre></div>
</div>
</dd>
<dt>Solution</dt>
<dd>Make sure the <strong>Extras &gt; Android Support Repository</strong> package is installed with the Android SDK.</dd>
<dt>Error message</dt>
<dd><div class="first last highlight-none"><div class="highlight"><pre><span></span>Execution failed for task &#39;:app:packageAllDebugClassesForMultiDex&#39;.
&gt; java.util.zip.ZipException: duplicate entry: android/support/v7/appcompat/R$anim.class
</pre></div>
</div>
</dd>
<dt>Solution</dt>
<dd><p class="first">Clean the Android part of the mattermost-mobile project. Issue the following commands:</p>
<ol class="last arabic simple">
<li><code class="docutils literal"><span class="pre">cd</span> <span class="pre">android</span></code></li>
<li><code class="docutils literal"><span class="pre">./gradlew</span> <span class="pre">clean</span></code></li>
</ol>
</dd>
<dt>Error message</dt>
<dd><div class="first last highlight-none"><div class="highlight"><pre><span></span>Execution failed for task &#39;:app:installDebug&#39;.
&gt; com.android.builder.testing.api.DeviceException: com.android.ddmlib.InstallException: Failed to finalize session : INSTALL_FAILED_UPDATE_INCOMPATIBLE: Package com.mattermost.react.native signatures do not match the previously installed version; ignoring!
</pre></div>
</div>
</dd>
<dt>Solution</dt>
<dd>The development version of the Mattermost app cannot be installed alongside a release version. Open <code class="docutils literal"><span class="pre">android/app/build.gradle</span></code> and change the applicationId from <code class="docutils literal"><span class="pre">&quot;com.mattermost.react.native&quot;</span></code> to a unique string for your app.</dd>
</dl>
</div>
</div>
</div>


<div style="margin-top: 15px;">
<span class="pull-left"><a href="{{< contributeurl >}}/mobile/">< Back to Mobile</a></span>
<span class="pull-right"><a href="{{< contributeurl >}}/mobile/developer-workflow/">Go to Workflow ></a></span>
</div>
<br/>
