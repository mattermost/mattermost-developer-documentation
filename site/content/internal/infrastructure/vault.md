---
title: Vault
date: 2017-11-06T19:30:07-05:00
subsection: internal
weight: 30
---

Vault is a high security secret store. At Mattermost, its primary purpose is to sign SSH keys.

# Installation

If you're on macOS and have Brew installed, you can just `brew install vault`. Otherwise, see the [Vault installation instructions](https://www.vaultproject.io/docs/install/index.html).

Once installed, you'll need to configure it. Add the following to your .bash_profile or .zshrc:

```
export VAULT_ADDR='https://vault.mattermost.com'
```

# Authenticating

Authentication is done via OneLogin and RADIUS:

```
vault login -method=radius username=your_username@mattermost.com
```

OneLogin users must have the "Developers" role in order to authenticate.

Note: If authentication times out or fails for any reason other than "access denied by the authentication server", have a OneLogin admin verify that the Vault server IP addresses are whitelisted in the OneLogin RADIUS configuration.

# SSH'ing into a Machine

You can use a command like the following to sign your SSH key and connect to a machine:

```
vault ssh -mount-point=dev-ssh-signer -mode=ca -role=default ubuntu@52.87.227.129
```

Creating a wrapper or alias for this command is recommended.

The command assumes you have an SSH key at ~/.ssh/id_rsa. If you don't, you'll need to use a modified command or generate an SSH key with `ssh-keygen -t rsa -b 4096 -C "your_email@example.com"`.

# Configuring SSH on a Host Machine

To configure SSH on a host machine, you need to copy Vault's CA certificate to that machine and point the "TrustedUserCAKeys" option to it in /etc/ssh/sshd_config.

The certificate can be obtained via...

```
vault read dev-ssh-signer/config/ca
```

When launching a machine on EC2 that you want to make accessible to all developers, you can simply use this as "user data" when launching the machine:

```yaml
#cloud-config
bootcmd:
  - cloud-init-per once ssh-users-ca echo "TrustedUserCAKeys /etc/ssh/trusted_ca_keys.pub" >> /etc/ssh/sshd_config
write_files:
  - path: /etc/ssh/trusted_ca_keys.pub
    content: ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDHDwQhQ3eRiW4CV5RKAJb0n9P/07aHrku5hAVc+M59ejZHPVD/4sEfSaKvIXNTcY5TsrudzEhY3nVBsJDcJjb5qC5ayy+JNGFNnF05JoZ4E3tggJm5HQv3Znm/N6s65ZMA0HsZojCvEf+K8P0AKdJWiZbZGF095+N3WL9bUQIxBmCIBVPAOQSTCo8QKeorFfxhw/XcmH3s/KDV52/hEt6RWTxaDup03r7y8fbVo81F4QJ2ItmHgL3vGSpJk/nkLB2RWxT6zp4JIEo7PZ6S2Gm/2jaW+B5DftUd0gI8GKo9+vhtWjEEbOdu/mz92/GHLHW+s3TnftLeXVs7a8UYwdh/qJ4P64U3wlA//igo7ToXONsZ4TwmcKg6FD9JAq+LKTC0+prx/Gulx5esiPS+bgnkM/CMuoWMtucLoXaNz9ELBmeb6QSj1a7T/4LFzBiefT977OIhglORnEsKvY0HXvzX66a73Lm3bC9mUXxi1HSJNTDdLOmnVK+ipVjViy2/C9KJmKL3ePwBQSJ9d9IK76W4SGXTGT4mTVBSSF6j+/2a4tXq9c3NCuEWyXgPJRP1t6Iib42oAosxPoZ4zeBZM05BHbveD2b0G/bmeaZRgsEaZ3Qjnr50a6Wke7Vr9q3QGjn3+8QEdUdrnCTN8dlloLYhwY9pgh1JEYDaCdPHSP1ppw==
```

# Unsealing the Vault

When the Vault instance starts up, it needs to be "unsealed" in order to decrypt its storage and become functional. At the time of writing, there are 8 keyholders. Two of them must work together to unseal Vault using this command:

```
VAULT_ADDR='https://vault-sealed.mattermost.com' vault unseal
```
