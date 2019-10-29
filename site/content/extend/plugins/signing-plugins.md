---
title: "Signing Plugins"
date: 2019-09-04T00:00:00-05:00
subsection: Plugins (Beta)
weight: 50
---

The Plugin Marketplace allows system administrators to download and install plugins from a central repository. Plugins installed via the Plugin Marketplace must be signed by a public key certificate trusted by the local Mattermost server.

While the server ships with a default certificate used to verify plugins from the default Mattermost plugin marketplace, the server can be configured to trust different certificates and point at a different plugin marketplace. This document outlines the steps for generating a public key certificate and signing plugins for use with a custom plugin marketplace. It assumes access to the [GNU Privacy Guard (GPG)](https://gnupg.org) tool.

## Configuration
Configuring plugin signatures allows finer control over the verification process:
```console
PluginSettings.RequirePluginSignature = true
```
is used to enforce plugin signature verification. With flag on, only marketplace plugins will be installed and verified. With flag off, customers will be able to install plugins manually without signature verification. Note, that marketplace plugins will still be verified even if flag is off.

## Key Generation
Public and private key pairs are needed to sign and verify plugins. Private key is used for signing and should be kept in a secure location. Public key is used for verification and can be distributed freely. To generate a key pair, run the following command:

```console
> gpg --full-generate-key

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
Your selection? 1

RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 3072

Requested keysize is 3072 bits

Please specify how long the key should be valid.
         0 = key does not expire
      <n>  = key expires in n days
      <n>w = key expires in n weeks
      <n>m = key expires in n months
      <n>y = key expires in n years
Key is valid for? (0) 0

Key expires at ...

Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.
Real name: Mattermost Inc

Email address: info@mattermost.com

Comment:

You selected this USER-ID:
    "Mattermost Inc <info@mattermost.com>"
Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O

```
Note: key size should be at least 3072 bits.

### Exporting the Private Key
Find the ID of your private key first. The ID is a hexadecimal number.
```console
> gpg --list-secret-keys
```
This is your private key and should be kept secret. Your hexadecimal key ID will, of course, be different.
```console
> gpg --export-secret-keys F3FACE45E0DE642C8BD6A8E64C7C6562C192CC1F > ./my-priv-key
```

### Exporting the Public Key
Find the ID of your public key first. The ID is a hexadecimal number.
```console
> gpg --list-keys
```
```console
> gpg --export F3FACE45E0DE642C8BD6A8E64C7C6562C192CC1F > ./my-pub-key
```

### Importing the Key
If you already have a public and private key pair, you can import them to the GPG.
```console
> gpg --import ./my-priv-gpg-key
> gpg --import ./my-pub-gpg-key
```

## Plugin Signing
For plugin signing you have to know the hexadecimal ID of the private key. Let's assume you want to sign `com.mattermost.demo-plugin-0.1.0.tar.gz` file, run:
```console
> gpg -u F3FACE45E0DE642C8BD6A8E64C7C6562C192CC1F --verbose --personal-digest-preferences SHA256 --detach-sign com.mattermost.demo-plugin-0.1.0.tar.gz
```
This command will generate `com.mattermost.demo-plugin-0.1.0.tar.gz.sig`, which is the signature of your plugin.

## Plugin Verification
Mattermost server will verify plugin signatures downloaded from plugin marketplace. To add custom public keys, run the following command on the Mattermost server:
```console
> mattermost plugin add key my-pub-key
```
Multiple public keys can be added to the Mattermost server:
```console
> mattermost plugin add key my-pk-file1 my-pk-file2
```
To list the names of all public keys installed on your Mattermost server, use:
```console
> mattermost plugin keys
```
To delete public key(s) from your Mattermost server, use:
```console
> mattermost plugin delete key my-pk-file1 my-pk-file2
```

## Implementation
See this [document](https://docs.google.com/document/d/1qABE7VEx4k_ZAeh6Ydn4pGbu6BQfZt65x68i2s65MOQ/) for the implementation details.
