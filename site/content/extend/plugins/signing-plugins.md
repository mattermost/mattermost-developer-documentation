---
title: "Signing Plugins"
date: 2019-09-04T00:00:00-05:00
subsection: Plugins (Beta)
weight: 50
---

"Plugin Marketplace” is a platform used to distribute common plugins, where Mattermost admins can install plugins without verification. To trust a plugin, there needs to be a way to verify the authenticity and integrity of a plugin before being installed. [The GNU Privacy Guard (GPG)](https://gnupg.org) tool is used to sign and verify plugins. Every plugin is signed using a private keyand every Mattermost instance should have access to a public key which is used to verify plugin signatures on installation.

## Key Generation
Public and private key pairs are needed to sign and verify plugins. Private key is used for signing and should be kept in the Vault. Public key is used for verification and can be distributed freely. To generate a key pair, run the following command:

```console
> gpg --expert --full-gen-key

Please select what kind of key you want:
   (1) RSA and RSA (default)
   (2) DSA and Elgamal
   (3) DSA (sign only)
   (4) RSA (sign only)
   (7) DSA (set your own capabilities)
   (8) RSA (set your own capabilities)
   (9) ECC and ECC
  (10) ECC (sign only)
  (11) ECC (set your own capabilities)
  (13) Existing key

Your selection? 9

Please select which elliptic curve you want:
   (1) Curve 25519
   (3) NIST P-256
   (4) NIST P-384
   (5) NIST P-521
   (6) Brainpool P-256
   (7) Brainpool P-384
   (8) Brainpool P-512
   (9) secp256k1

Your selection? 1

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


### Exporting the Private Key
Find the ID of your private key first. The ID is a hexadecimal number.
```console
> gpg --list-secret-keys
```
This is your private key and you should keep it secret. Replace `XXXXXXXX` with your hexadecimal key ID
```console
> gpg --export-secret-keys XXXXXXXX > ./my-priv-key.plugin.gpg
```


### Exporting the Public Key
Find the ID of your public key first. The ID is a hexadecimal number.
```console
> gpg --list-keys
```
Replace `XXXXXXXX` with your hexadecimal key ID
```console
> gpg --export XXXXXXXX > ./my-pub-key.plugin.gpg
```


### Importing the Key
If you already have a public and private key pair, you can import them to the GPG.
```console
> gpg --import ./my-priv-gpg-key.plugin.gpg
> gpg --import ./my-pub-gpg-key.plugin.gpg
```


## Plugin Signing
For plugin signing you have to know the hexadecimal ID of the private key. Let's assume you want to sign `com.mattermost.demo-plugin-0.1.0.tar.gz` file. Replace `XXXXXXXX` with your hexadecimal key ID and run:
```console
> gpg -u XXXXXXXX --verbose --personal-digest-preferences SHA256 --detach-sign com.mattermost.demo-plugin-0.1.0.tar.gz
```
This command will generate `com.mattermost.demo-plugin-0.1.0.tar.gz.sig` which is the signature of your plugin.

## Plugin Verification
Mattermost server should be able to verify plugins before install. the public key has to be added on the server. For this purpose, start the Mattermost server and run the following command:
```console
> mattermost plugin add key my-pub-key.plugin.gpg
```
Note: if your public key file does not have an extension `.plugin.gpg` Mattermost will append it automatically.

Multiple public keys can be added to the Mattermost server:
```console
> mattermost plugin add key my-pk-file1.plugin.gpg my-pk-file2.plugin.gpg
```
To list the names of all public keys installed on your Mattermost server, use:
```console
> mattermost plugin keys
```
To delete public key(s) from your Mattermost server, use:
```console
> mattermost plugin delete key my-pk-file1.plugin.gpg my-pk-file2.plugin.gpg
```

### Storing plugin signatures
When a plugin is installed, Mattermost server will store plugin signatures in its internal filestore(not to be confused with the public keys). This is to allow the server to verify signatures during the plugin-synchronization process that happens during server startup. To avoid name collisions and overwriting existing files, Mattermost will store plugin signatures along side plugin bundles using the naming convention mentioned below. The benefit of storing signature files independently is to avoid double-tar, where the tar file contains the bundle tar along with its signature. This would have required Mattermost to migrate existing plugin bundles into double-tar format. Which would have resulted in increased complexity and made upgrade/downgrade scenarios a lot harder to deal with.
```console
# Filestore plugin structure
/plugins/<plugin_id>.tar.gz            # plugin bundle tar
/plugins/<plugin_id>.<counter-1>.sig   # multiple plugin signatures
/plugins/<plugin_id>.<counter-2>.sig     

# Examples
/plugins/com.mattermost.demo.tar.gz    # plugin bundle tar
/plugins/com.mattermost.demo.1.sig     # multiple plugin signatures
/plugins/com.mattermost.demo.2.sig
/plugins/com.mattermost.demo.3.sig
/plugins/com.github.matterpoll.tar.gz
/plugins/com.github.matterpoll.1.sig
/plugins/com.github.matterpoll.2.sig
/plugins/com.github.matterpoll.3.sig

```

## Mattermost plugin assets naming convention
In order to keep plugin signatures close to their bundle tar, Mattermost will generate plugin signatures and upload them directly to github releases using the following naming convention. This is purely a convention which makes it easier for a human to parse signature and public key pairs at a quick glance.
```console
# Mattermost plugin naming convention
<plugin_id>-<plugin_version>.tar.gz
<plugin_id>-<plugin_version>-<counter>-<public_key_fingerprint_hash>.sig


# Mattermost demo plugin example
com.mattermost.demo-plugin-0.2.0.tar.gz
com.mattermost.demo-plugin-0.2.0-1-1E11.sig
com.mattermost.demo-plugin-0.2.0-2-6E1D.sig
com.mattermost.demo-plugin-0.2.0-3-3MN6.sig
```
