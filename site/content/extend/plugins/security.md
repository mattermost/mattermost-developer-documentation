---
title: Security
date: 2018-01-09T02:26:54-05:00
subsection: Plugins (Beta)
draft: true
weight: 35
---

# Security

Plugins are powerful. You should only install plugins that you've thoroughly reviewed as they have the potential to compromise the security of your installation.

Only System Administrators can upload custom plugins. They can be disabled in the **System Console > Plugins > Configuration** page.

In Mattermost v4.7 and later, sandboxing adds an additional layer of security for server plugins.

## Server Considerations

Plugins have the ability to execute arbitrary code on your server. If they aren't properly isolated, they can do just about *anything*. For example, they could read your config file to get your database password, connect to your database, then exfiltrate sensitive user information.

Sandboxing mitigates these risks and is enabled by default if your platform supports it.

### Sandboxing

If you're on a platform that supports sandboxing, ensure that Mattermost is able to sandbox your plugins. Sandboxing is currently supported on Linux, and is enabled by default if your platform supports it.

#### Linux Sandboxing

On Linux, sandboxing is used to isolate plugin code. The effect is similar to running plugins in Docker containers with host networking.

Plugins run within new mount, pid, user, UTS, and PID namespaces. From their perspective, they appear to be the only process on the system.

Plugins have read access to `/etc/resolv.conf`, `/lib`, the typical CA certificate locations, and their own contents. They also have their own `/tmp`, `/proc`, and `/dev` directories where `/dev` contains essentials such as `/dev/null` and `/dev/urandom` but doesn't expose any actual devices., or have any access to your devices or filesystem.

Plugins have all capabilities explicitly dropped. They also have a syscall whitelist that matches [Docker's default seccomp profile](https://github.com/moby/moby/blob/master/profiles/seccomp/default.json). This keeps them from using potentially dangerous system calls.

**Plugins have full access to the network!** This means they can access unprotected services within your infrastructure, such as the [EC2 metadata service](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html). It's up to you to take precautions as necessary here.

Linux sandboxing is currently only supported for amd64, but requests for additional architectures are welcome [in our feature proposal forum](https://mattermost.uservoice.com/forums/306457-general).

#### How to Enable Sandboxing

If your platform supports it, sandboxing is enabled by default. Check your logs for warning messages. If you don't see any, you're all set. If sandboxing is not enabled, you'll see log messages with more details.

If you deploy Mattermost using Docker, sandboxing will be blocked by Docker's default seccomp profile. The easiest way to resolve this is to disable the profile with `--security-opt seccomp=unconfined`. Mattermost will still use seccomp for the plugins themselves, but if you really need to run Mattermost with least privilege, you can copy [Docker's default seccomp profile](https://github.com/moby/moby/blob/master/profiles/seccomp/default.json) and add the `clone`, `mount`, `umount2`, and `pivot_root` system calls to the whitelist. Note that additional calls may be required in future, so be vigilant about testing your profile with each release.

## Web App Considerations

Plugins have the ability to execute arbitrary code in client browsers. They have the ability to perform nearly any action on behalf of anyone using the web app.
