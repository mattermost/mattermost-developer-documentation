---
title: "Signing Plugins"
date: 2019-09-04T00:00:00-05:00
subsection: Plugins (Beta)
weight: 50
---

"Plugin Marketplace” is a platform used to distribute common plugins, where MM admins can install plugins without verification. To trust a plugin there needs to be a way to verify the authenticity and integrity of a plugin before being installed. [GPG](https://gnupg.org) tool is used to sign and verify plugins. Every plugin is signed using a private key. Every MM instance should have access to a public key which will be used to verify plugin signatures on installation.

## Key Generation
Public and private key pair is needed to sign and verify plugins. Private key is used for signing and should be kept in the Vault. Public key is used for verification and can be distributed freely. To generate key pair run following command:

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
Key is valid for? (0) 1y

Key expires at ...

Is this correct? (y/N) y

GnuPG needs to construct a user ID to identify your key.
Real name: Ali Farooq

Email address: ali_@mattermost.com

Comment:

You selected this USER-ID:
    "Ali Farooq <ali_@mattermost.com>"
Change (N)ame, (C)omment, (E)mail or (O)kay/(Q)uit? O

```

note: key size should be at least 3072 bits.


### Exporting Private Key
Find the ID of your private key first. The ID is the hexadecimal number.
```console
> gpg --list-secret-keys
```
This is your private key keep it secret! Replace XXXXXXXX with your hexadecimal key ID
```console
> gpg --export-secret-keys XXXXXXXX > ./my-priv-gpg-key.plugin.asc
```


### Exporting Public Key
Find the ID of your public key first. The ID is the hexadecimal number.
```console
> gpg --list-keys
```
Replace XXXXXXXX with your hexadecimal key ID
```console
> gpg --export XXXXXXXX > ./my-pub-gpg-key.plugin.asc
```


### Importing Key
If you already have a public and private key pair you can import them to the GPG.
```console
> gpg --import ./my-priv-gpg-key.plugin.asc
> gpg --import ./my-pub-gpg-key.plugin.asc
```


## Plugin Signing
For plugin signing you have to know the hexadecimal ID of the private key. Let's assume you want to sign `com.mattermost.demo-plugin-0.1.0.tar.gz` file. Replace XXXXXXXX with your hexadecimal key ID and run:
```console
> gpg -u XXXXXXXX --verbose --personal-digest-preferences SHA256 --detach-sign com.mattermost.demo-plugin-0.1.0.tar.gz
```
This command will generate `com.mattermost.demo-plugin-0.1.0.tar.gz.sig` which is the signature of your plugin.

## Plugin Verification
Mattermost server should be able to verify plugin before install. Public key has to be added on the server. For this purpose start MM server and run Mattermost command:
```console
> mattermost plugin add key my-pub-gpg-key.plugin.asc
```
note: make sure that your public key file extension is `.plugin.asc`

Multiple public keys can be added to the MM server:
```console
> mattermost plugin add key my-pk-file1.plugin.asc my-pk-file2.plugin.asc
```
To list names of all public keys installed on your Mattermost server use:
```console
> mattermost plugin keys
```
To delete public key(s) from your Mattermost server use:
```console
> mattermost plugin delete key my-pk-file1.plugin.asc my-pk-file2.plugin.asc
```
