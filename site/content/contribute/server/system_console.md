---
title: "System Console"
heading: "The Mattermost System Console"
description: "Find out how to add fields, expose settings, and make settings available for non-admins in the System Console."
date: 2019-10-09T13:38:26-04:00
weight: 5
---

## Adding fields to the configuration

In order to add fields to the configuration, you need to modify `model/config.go` in the server by adding the desired field to one of the structs such as `ServiceSettings` and setting its default value in the corresponding `SetDefaults` method.


### Exposing settings in the System Console

To expose the newly-added field in the System Console, you need to add that same setting to the `AdminDefinition` JS object in `mattermost-webapp/components/admin_console/admin_definition.jsx`. This object defines most of the settings in the System Console.


### Making settings available for non-admin users

To make the newly added setting accessible to non-admin users in the apps, you'll need to add it to the `GenerateClientConfig` method in `config/client.go` in the server. Note that this always encodes the setting as a string, so anywhere that you would want to use this value in the client, you have to look for a string.
