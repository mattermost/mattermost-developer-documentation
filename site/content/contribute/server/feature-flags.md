---
title: "Feature Flags"
heading: "Feature Flags and Mattermost Cloud"
description: "Feature flags allow us to be more confident in shipping features continuously to Mattermost Cloud. Find out why."
date: 2020-10-15T16:00:00-0700
weight: 3
---


Feature flags allow us to be more confident in shipping features continuously to Mattermost Cloud. Feature flags also allow us to control which features are enabled on a cluster level.

# How to use

## Adding the feature flag in code

1. Add the new flag to the feature flag struct located in `model/feature_flags.go`.
2. Set a default value in the `SetDefaults` function in the same file.
3. Use the feature flag in code as you would use a regular configuration setting. In tests, manipulate the configuration value to test value changes, such as activation and deactivation of the feature flag.
4. Code may be merged regardless of setup in the management system. In this case it will always take the default value supplied in the `SetDefaults` function.
5. Create a removal ticket for the feature flag. All feature flags should be removed as soon as they have been verified by Cloud. The ticket should encompass removal of the supporting code and archiving in the management system.

### Feature flag code guidelines

- A ticket should be created when a feature flag is added to remove the feature flag as soon as it isn't required anymore.
- Tests should be written to verify the feature flag works as expected. Note that in cases where there may be a migration or new data, off to on and on to off should both be tested.
- Log messages by the feature should include the feature flag tag, with the feature flag name as a value, in order to ease debugging.

## Split

[Split](https://split.io) is the feature flag management service we use for internal testing and for our production Cloud service. It enables us to create and control feature flags for multiple servers and environments as well as gives us the ability to run A/B split tests.

We've used Split's SDK to integrate with the Mattermost server. You can find the [Split documentation here](https://help.split.io/hc/en-us).

### Who has access to Split?

We currently have a limited number of seats for our Split account, so not everyone gets access. Currently, two people per each engineering team plus some PM/UX folk have access. If you need to manage some feature flags, ask your team lead who has access and can help you out. It's up to each team to determine who has access.

### How do I log in?

Login is controlled via OneLogin. If you have access you will be able to log in through there.

### Terminology

In Split, there's some terminology you will need to understand:

 - **Split** - A feature flag
 - **Treatment** - The values a split (e.g. feature flag) can have
 - **Environment** - Different environments that splits can target such as test, staging, and production
 - **Server** - Single Mattermost workspace
 - **Segment** - A list of servers that can be targeted by a split

### Adding a split

After you've added the feature flag in code, you'll need to create a split for it.

 1. Log in to Split.
 2. On left sidebar, click **Splits**.
 3. At the top click **Create split**.
 4. Fill in the following:
     1. Enter the name of your feature flag. It must match the name used in code in `model/feature_flags.go`.
     2. Select ``server`` as the traffic type.
     3. Optionally add tags and a description.
     4. Click **Create**.

The split is now created but not targeting anything. The next section covers adding basic targeting rules.

###  Add targeting rules to a split

To have the split have any effect, it needs targeting rules to know which environment and servers it should set the feature flag value to. To add basic targeting rules:

 1. Find your split and click on it.
 2. Under the name of the split at the top, select the **Environment** that you want to target.
     - See [Environments](#Environments) for a description of each.
 3. In the center of the screen, select **Add Rules**.
 4. Define your treatments:
     - Recall that treatments are just the values your feature flag can have.
     - Boolean flags should use the default "on" and "off" treatments.
     - For non-boolean flags, change the treatments to be the possible values. E.g. for a split that specifies a plugin's version you could have three treatments of "1.0", "1.1" and "2.0".
 5. Down the page a bit, set the default rule to one of your treatments.
     - This will set the flag for all servers in the environment while you don't have any other targeting rules configured.
 6. At the top right, click **Save changes** and confirm them on the next screen.

That covers targeting an environment with a split and adding a default rule for all servers in that environment. The next section covers targeting specific servers.

### Target a specific server

The ID for a "server" as seen by Split is the Mattermost server's telemetry ID. To target a specific server you need that telemetry ID. The main way to get the telemetry ID from a server would be from the analytics but you can also manually grab the telemetry ID by one of the following methods:

#### Get telemetry ID via inspecting browser traffic

 1. In Chrome (any browser with dev tools will work but instructions are specific to Chrome), open the developer console and switch to the Network tab.
 2. Type "config" into the filter for the network requests.
 3. Go to the server's URL (e.g. xxxxxx.test.mattermost.cloud).
 4. In the network tab, click on the request for `/api/v4/config/client?format=old`.
 5. Click on the "Response" tab and search for "TelemetryId".
 6. Copy the value of "TelemetryId".

#### Get telemetry ID via curl and jq

```bash
$ curl -s https://<your-workspace-url>/api/v4/config/client?format=old | jq ".TelemetryId"
```
#### Target using the telemetry ID

With the telemetry ID, go to your split and do the following:

 1. Find the section "Create whitelists" and click **Add whitelist**.
 2. Choose the treatment value you want the workspace to get.
 3. Under "Server" paste in your telemetry ID.
 4. At the top right, click **Save changes** and confirm them on the next screen.

Now your workspace will have its feature flag set according to this rule, regardless of what the default for the split is set to.

### Add or update a feature flag for community.mattermost.com

Note that this will set the flag for community.mattermost.com, community-release.mattermost.com, and community-daily.mattermost.com. It is not possible to set a rule for only one via Split. It is possible to set the flags only for one version of community via environment variables. This will require manual configuration by the SRE team. You can ask for support for this on community.mattermost.com via the `@sresupport` mention.

To set a flag via Split for community:

 1. Open the split for your flag.
 2. At the top under the split name, select the "Cloud Staging" environment.
 3. Find "Set targeting rules" and click **Add rule**.
   - The rule may already exist, and in that case you can edit the existing one.
 4. Leave the rule set to "is in segment" and click **Select Segment...** and choose "community".
 5. Select the treatment you want community.mattermost.com to get.
 6. At the top right, click **Save changes** and confirm them on the next screen.

The feature flag is now set for community.mattermost.com.

### Environments

 - Cloud Test - All the Cloud test servers/workspaces, including those created on PRs and by the ``/cloud`` command.
 - Cloud Staging - Mainly community.mattermost.com, including community-release and community-daily. It's not possible to target those separately.
 - Cloud Production - All our production Cloud workspaces.

### Split FAQ

How long does it take for workspaces/servers to pick up on changes to feature flags in Split?
 - Syncing occurs once every 30 seconds so your feature flag will get changes at maximum 30 seconds after they're made.

## Timelines for rollouts

The feature flag is initially “off” and will be rolled out slowly. Individual teams should decide how they want to roll out their features as they are responsible for them and know them best. Once we have split.io access for 2-3 people per team, the feature teams can enable/disable feature flags at will without needing to ask the Cloud team. 

**Note:** The steps below are an initial guideline and will be iterated on over time.

 - 1st week after feature is merged (T-30): 10% rollout; only to test servers, no rollout to customers.
 - 2nd week (T-22): 50% rollout; rollout to some customers (excluding big customers and newly signed-up customers); no major bugs in test servers.
 - 3rd week (T-15): 100% rollout; no major bugs from customers or test servers. 
 - End of 3rd week (T-8): Remove flag. Feature is production ready and not experimental.

For smaller, non-risky features, the above process can be more fast tracked as needed, such as starting with a 10% rollout to test servers, then 100%.
Features have to soak on Cloud for at least two weeks for testing. Focus is on severity and number of bugs found; if there are major bugs found at any stage, the feature flag can be turned off to roll back the feature.

When the feature is rolled out to customers, logs will show if there are crashes, and normally users will report feedback on the feature (e.g. bugs).

## Self-managed releases

For a feature-flagged feature to be included in a self-managed release, the feature flag should be removed.

Feature flags are generally off by default and self-managed releases do not contact the management system. Therefore feature flags that are not ready for a self-managed release will be automatically disabled for all self-managed releases.

## Testing

Tests should be written to verify all states of the feature flag. Tests should cover any migrations that may take place in both directions (i.e., from "off" to "on" and from "on" to "off"). Ideally E2E tests should be written before the feature is merged, or at least before the feature flag is removed.

# When to use

There are no hard rules on when a feature flag should be used. It is left up to the best judgement of the responsible engineers to determine if a feature flag is required. The following are guidelines designed to help guide the determination.

- Any "substantial" feature should have a flag
- Features that are probably substantial:
    - Features with new UI or changes to existing UI
    - Features with a risk of regression
- Features that are probably not substantial:
    - Small bug fixes
    - Refactoring
    - Changes that are not user facing and can be completely verified by unit and E2E testing.

## Examples of feature flags

< add some examples when we create them >

## FAQ

1. What is the expected default value for boolean feature flags? Is it `true` or `false`?
 - Definitely `false`. The idea is to use them to slowly roll out a feature. When the code is deployed, the feature flag is not enabled yet. See more details on feature flag rollout timelines [here](https://developers.mattermost.com/contribute/server/feature-flags/#timelines-for-rollouts).

2. Is it possible to use a plugin feature flag such as `PluginIncidentManagement` to "prepackage" a plugin only on Cloud by only setting a plugin version to that flag on Cloud? Can self-managed customers manually set that flag to install the said plugin?
 - Yes. If you leave the default "" then nothing will happen for self-managed installations. You can ask the Cloud team to set ``split.io/environment`` to a specific version.

3. How do feature flags work on webapp?
 - To add a feature flag that affects frontend, the following is needed: 
    1. PR to server code to add the new feature flag. 
    2. PR to redux to update the types. 
    3. PR to webapp to actually use the feature flag.

4. How do feature flags work on mobile?
 - To add a feature flag that affects mobile, the following is needed: 
    1. PR to server code to add the new feature flag. 
    2. PR to mobile to update the types and to actually use the feature flag.

5. How do we enable a feature flag for testing on community-daily and on Cloud test servers?
 - You can post in [~Developers: Cloud channel](https://community.mattermost.com/core/channels/cloud) with the feature flag name and what you want the Cloud team to set it to.

6. What is the environment variable to set a feature flag?
 - It is `MM_FEATUREFLAGS_<myflag>`.

7. Can plugins use feature flags to enable small features aside of the version forcing feature flag?
 - Yes. You can create feature flags as if they were added for the core product, and they'll get included in the plugin through the config.

8. Does it make sense to use feature flags for A/B testing?
 - This is something we're going to be evaluating using split.io. We've already implemented support for this in the server.

9. Do feature flag changes require the server to be restarted?
 - Feature flags don’t require a server restart unless the feature being flagged requires a restart itself.

10. For features that are requested by self-managed customers, why do we have to deploy to Cloud first, rather than having the customer who has the test case test it?
 - Cloud is the way to validate the stability of the feature before it goes to self-managed customers. In exceptional cases we can let the self-managed customer know that they can use environment variables to enable the feature flag (but specify that the feature is experimental).

11. How does the current process take into account bugs that may arise on self-managed specifically?
 - The process hasn’t changed much from the old release process: Features can still be tested on self-managed servers once they have been rolled out to Cloud. The primary goal is that bugs are first identified on Cloud servers.

12. How can self-managed installations set feature flags?
 - Self-managed installations can set environment variables to set feature flag values. However, users should recognize that the feature is still considered "experimental" and should not be enabled on production servers.
