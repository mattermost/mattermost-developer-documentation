---
title: "Onelogin and AWS"
date: 2018-11-07T16:10:15+01:00
weight: 45
---

# Generating Keys using Onelogin authentication

To get temporary AWS Keys to use we are using this project [https://github.com/physera/onelogin-aws-cli](https://github.com/physera/onelogin-aws-cli)

## Installation

To install, use pip:

```Bash
$ pip install onelogin-aws-cli
```

Note that `onelogin-aws-cli` requires Python 3.

Note that it is not recommended to install Python packages globally
on your system.

## Usage

Running `onelogin-aws-login`  will perform the authentication against OneLogin,
and cache the credentials in the AWS CLI Shared Credentials File.

For every required piece of information, the program will present interactive
inputs, unless that value has already been provided through either
[command line parameters](#command-line-parameters),
[environment variables](#environment-variables),
or [configuration file directives](#configuration-file).

```Bash
$ onelogin-aws-login
Onelogin Username: myuser@mattermost.com
Onelogin Password:
Google Authenticator Token: 579114
Pick a role:
[1]: arn:aws:iam::xoxoxoxo:role/onelogin-test-ec2
[2]: arn:aws:iam::xoxoxoxo:role/onelogin-test-s3
[3]: arn:aws:iam::xoxoxoxo:role/onelogin-test-s3
? 3
Credentials cached in '/Users/myuser/.aws/credentials'
Expires at 2018-05-24 15:15:41+00:00
Use aws cli with --profile xoxoxoxo:role/onelogin-test-s3/myuser@mattermost.com
```
