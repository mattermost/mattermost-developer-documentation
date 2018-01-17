---
title: "Code Signing"
date: 2018-01-16T10:32:51-05:00
subsection: "Desktop App"
---
# Code Signing
When releasing the Mattermost Desktop application for Windows and macOS, we have to sign the executable with a certificate that allows the end user's computer to verify our identity. 

The signing procedure varies depending on the platform that the release is destined for and the platform that the signing operation is performed on. This page attempts to document the procedure and some common pitfalls that developers may encounter along the way.

## Code Signing Windows Releases
Releases destined for Windows can be code signed on Windows, macOS, or Linux. 

#### Prerequisites
In order to code sign releases on behalf of Mattermost Inc., you'll need a `.pfx` (Personal Information Exchange) file that contains Mattermost's public key (SSL certificate file), and the associated private key file. The file is protected by a password that you'll need in order to use it. 

This file has been shared in LastPass. Talk to Joram Wilander, Corey Hulen, or Jonathan Fritz to get access to it. 

#### Code Signing on Windows
On Windows hosts, Microsoft's [`signtool`](https://msdn.microsoft.com/en-us/library/windows/desktop/aa387764(v=vs.85).aspx) utility can be used to code sign releases.

#### Code Signing on macOS and Linux
On macOS and Linux hosts, the open source [`osssigntool`](https://sourceforge.net/projects/osslsigncode/) can be used to code sign releases. It can be installed via Homebrew on macOS:
```bash
~$ brew install openssl
~$ brew install osslsigncode
```
or via Apt on Ubuntu:
```bash
~$ sudo apt-get install openssl
~$ sudo apt-get install osslsigncode
```

After successfully [building and packaging](/contribute/desktop/developer-setup#building) the Mattermost Desktop application for Windows, you can run the signing command from the root of the repository:
```bash
~$ osslsigncode -pkcs12 [PATH_TO_THE_PFX_FILE] -pass [PFX_FILE_PASSWORD] -n "Mattermost Desktop" -i https://mattermost.com -t http://timestamp.verisign.com/scripts/timstamp.dll -h sha2 -in [PATH_TO_UNSIGNED_EXE] -out [PATH_TO_WRITE_SIGNED_EXE_TO]
Succeeded
```
Where
<ul>
    <li>**PATH_TO_THE_PFX_FILE** is the absolute path to the `.pfx` file that was obtained in the Prerequisites section above</li>
    <li>**PFX_FILE_PASSWORD** is the password that protects the `.pfx` file from being misused</li>
    <li>**PATH_TO_UNSIGNED_EXE** is the absolute path of the unsigned executable that you want to sign. It is typically in the `release/win` or `release/win-ia32` subdirectory of the repository</li>
    <li>**PATH_TO_WRITE_SIGNED_EXE_TO** is the absolute path to write the signed executable to
</ul>

#### Verifying the Signature:
Once you have successfully signed the release, you can use the `verify` flag of the `osslsigncode` utility to ensure that the signature was applied correctly. 
```bash
~$ osslsigncode verify PATH_TO_SIGNED_EXE 
Current PE checksum   : 03CF3E32
Calculated PE checksum: 03CF3E32

Message digest algorithm  : SHA256
Current message digest    : 3B8B25C49C1D3D0DFB34D79602D9A7E565A09CA10E3BDB49A4562668C042B07F
Calculated message digest : 3B8B25C49C1D3D0DFB34D79602D9A7E565A09CA10E3BDB49A4562668C042B07F

Signature verification: ok

Number of signers: 1
	Signer #0:
		Subject: /C=US/ST=California/L=Palo Alto/O=Mattermost, Inc./CN=Mattermost, Inc.
		Issuer : /C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc./OU=http://certs.godaddy.com/repository//CN=Go Daddy Secure Certificate Authority - G2

Number of certificates: 5
	Cert #0:
		Subject: /C=US/ST=California/L=Palo Alto/O=Mattermost, Inc./CN=Mattermost, Inc.
		Issuer : /C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc./OU=http://certs.godaddy.com/repository//CN=Go Daddy Secure Certificate Authority - G2
	Cert #1:
		Subject: /C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc./OU=http://certs.godaddy.com/repository//CN=Go Daddy Secure Certificate Authority - G2
		Issuer : /C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc./CN=Go Daddy Root Certificate Authority - G2
	Cert #2:
		Subject: /C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc./CN=Go Daddy Root Certificate Authority - G2
		Issuer : /C=US/O=The Go Daddy Group, Inc./OU=Go Daddy Class 2 Certification Authority
	Cert #3:
		Subject: /C=US/O=Symantec Corporation/CN=Symantec Time Stamping Services Signer - G4
		Issuer : /C=US/O=Symantec Corporation/CN=Symantec Time Stamping Services CA - G2
	Cert #4:
		Subject: /C=US/O=Symantec Corporation/CN=Symantec Time Stamping Services CA - G2
		Issuer : /C=ZA/ST=Western Cape/L=Durbanville/O=Thawte/OU=Thawte Certification/CN=Thawte Timestamping CA

Succeeded
```

## Code Signing macOS Releases
Releases destined for macOS can **only** be code signed on a macOS host. It is not possible to sign macOS releases on a Windows or Linux host.

#### Prerequisites
In order to code sign releases on behalf of Mattermost Inc., you'll need to be a member of the Apple Developer program and a part of the Mattermost, Inc. team. You can check your team membership in Xcode by selecting **Preferences** from the **Xcode** menu, and opening the **Accounts** tab in the dialog box that appears. 
{{< figure src="/img/code-signing/xcode-accounts-mattermost.png" width="600px" >}}
If you aren't a member of the Mattermost, Inc. team, talk to Joram Wilander, Corey Hulen, or Jonathan Fritz.

Once you are a member of the team, click the **Download Manual Profiles** button at the bottom of the Accounts dialog. Next, highlight **Mattermost, Inc.** in the team list, and click the **Manage Certificates...** button. 

In the dialog that appears, ensure that you have a **Developer ID Application** certificate under the **macOS Distribution Certificates** heading:
{{< figure src="/img/code-signing/missing-private-key.png" width="600px" >}}

If you do not see the **macOS Distribution Certificates** heading or the **Developer ID Application** certificate is missing, you can download the certificate from [The Apple Developers Portal](https://developers.apple.com). Sign in with your Apple ID and select **Certificates, IDs & Profiles** from the left hand sidebar:  
{{< figure src="/img/code-signing/apple-developer-lhs.png" width="600px" >}}

From the drop down box in the top left hand corner of the **Certificates, Identifiers & Profiles** page that appears, select **macOS**. Next, under the **Certificates** heading in the left hand sidebar, select **All**. The **Mattermost, Inc. Developer ID Application** certificate should appear in the centre panel of the screen. Click on it to expand it and then click on the **Download** button that appears.
{{< figure src="/img/code-signing/apple-developer-download-cert.png" width="600px" >}}

Once downloaded, you can double-click on the certificate file to import it into your local keychain.
{{< figure src="/img/code-signing/keychain-access.png" width="600px" >}}   

Back in XCode, the entry in the **Status** column of the **Manage Certificates...** dialog for this certificate will be `Missing Private Key`:
{{< figure src="/img/code-signing/missing-private-key.png" width="600px" >}}

The private key is available in a `.p12` file that has been shared in LastPass. Talk to Joram Wilander, Corey Hulen, or Jonathan Fritz to get access to it. Once downloaded, double-click on the file to import it into your macOS keychain. It should appear in the **Keys** category of your **login** keychain:
{{< figure src="/img/code-signing/private-key.png" width="600px" >}}

Back in Xcode, under **Xcode** > **Preferences** > **Accounts** > **Manage Certificates...**, the **Status** column entry for the **Developer ID Application** certificate should now be empty:
{{< figure src="/img/code-signing/empty-status.png" width="600px" >}} 

Finally, you'll need to install the `electron-osx-sign` utility via NPM:
```bash
~$ npm install -g electron-osx-sign
``` 

#### Signing the Release
After successfully [building and packaging](/contribute/desktop/developer-setup#building) the application for macOS, you can run the signing command from the root of the repository:
```bash
~$ electron-osx-sign release/mac/Mattermost.app
 > Name: Developer ID Application: Mattermost, Inc. (****) 
 > Hash: **** +3s 
 * Disable by setting `pre-embed-previsioning-profile` to `false`. +1ms
 * Disable by setting `pre-auto-entitlements` to `false`. +0ms
 > Application: Mattermost.app 
 > Platform: darwin 
 > Entitlements: undefined 
 > Child entitlements: undefined 
 > Additional binaries: [] 
 > Identity: { name: 'Developer ID Application: Mattermost, Inc. (****)',
  hash: '****' } +0ms
  Electron Framework +0ms
  Libraries/libffmpeg.dylib +0ms
  Libraries/libnode.dylib +1ms
  Resources/crashpad_handler +0ms
  Mattermost Helper EH +0ms
  Mattermost Helper NP +0ms
  Mattermost Helper +1ms
  ReactiveCocoa +0ms
  ShipIt +0ms
  +0ms
 Application signed: Mattermost.app
```

#### Known Issues
Code signing is a bit of a black art. Some issues that have been observed in the past are likely to affect you in the future. If you encounter any troubles while code signing macOS releases, please document them here to help the rest of the team.

##### No Identity Found for Signing
If the `electron-osx-sign` command failed with an error message like this one:
```bash
~$ electron-osx-sign release/mac/Mattermost.app
 Sign failed:
 No identity found for signing.
```
It is likely that you have not successfully imported the Mattermost Developer ID Application certificate and associated private key. See the Prerequisites section above.

#### Code Object is not Signed at all
If the `electron-osx-sign` command failed with an error message like this one:
```bash
~$ electron-osx-sign release/mac/Mattermost.app
...
Sign failed:
Command failed: codesign --sign **** --force Mattermost.app/Contents/MacOS/Mattermost
Mattermost.app/Contents/MacOS/Mattermost: code object is not signed at all
In subcomponent: /Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/LICENSE.txt
```
You have resource files in the wrong place in your release folder. According to [Apple's Developer Docs](https://developer.apple.com/library/content/documentation/Security/Conceptual/CodeSigningGuide/Procedures/Procedures.html), all resource files (i.e. anything that isn't code) must be in the `Content/Resources` folder within the `.app` package. In this case, the `LICENSE.txt` file is located in the top-level `Contents` directory, causing the code signing operation to fail. This can be fixed by moving any non-code resource files into the `Content/Resources` directory.

#### Verifying the Signature
Once you have successfully signed the release, you can use the `codesign` utility that ships with macOS to verify that the signature was applied correctly.
```bash
~$ codesign --verify --verbose=4 Mattermost.app
   --prepared:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Mattermost Helper EH.app
   --validated:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Mattermost Helper EH.app
   --prepared:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Mattermost Helper.app
   --validated:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Mattermost Helper.app
   --prepared:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Squirrel.framework/Versions/Current/.
   --validated:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Squirrel.framework/Versions/Current/.
   --prepared:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/Current/.
   --validated:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/ReactiveCocoa.framework/Versions/Current/.
   --prepared:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/.
   --validated:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Electron Framework.framework/Versions/Current/.
   --prepared:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Mattermost Helper NP.app
   --prepared:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Mantle.framework/Versions/Current/.
   --validated:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Mattermost Helper NP.app
   --validated:/Users/jfritz/go/src/github.com/mattermost/desktop/release/mac/Mattermost.app/Contents/Frameworks/Mantle.framework/Versions/Current/.
   Mattermost.app: valid on disk
   Mattermost.app: satisfies its Designated Requirement
```

You can also use the `spctl` utility to ensure that end users will be allowed to install the application on their machines:
```bash
~$ spctl --verbose=4 --assess --type execute Mattermost.app
   Mattermost.app: accepted
   source=Developer ID
```