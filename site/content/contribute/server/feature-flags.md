---
title: "Feature Flags"
description: "Feature flags allow us to be more confident in shipping features continuously to Mattermost Cloud. Find out why."
date: 2020-10-15T16:00:00-0700
weight: 3
subsection: Server
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


## Deploying to split.io

Deployments to the managment system are overseen by the Cloud team. If you have any questions or need help with the process, please ask in the cloud channel.

1. When ready to deploy the feature, create the feature flag (called a split) in split.io. The name of the feature flag should match the name of the split. Everything else can be left at defaults.
2. Once created, set the treatment values appropriately. The defaults of "on" an "off" can work for most feature flags.
3. When ready to deploy to cloud, set the targeting rules appropriately to slowly roll out as required. 

## Timelines for rollouts

The feature flag is initially “off” and will be rolled out slowly. Note: this is an initial guideline and can be further iterated on over time.

 - 1st week after feature is merged (T-30): 10% rollout; only to test servers, no rollout to customers.
 - 2nd week (T-22): 50% rollout; rollout to some customers (excluding big customers and newly signed-up customers); no major bugs in test servers.
 - 3rd week (T-15): 100% rollout; no major bugs from customers or test servers. 
 - End of 3rd week (T-8): Remove flag. Feature is production ready and not experimental.

For smaller, non-risky features, the above process can be more fast tracked as needed, such as starting with a 10% rollout to test servers, then 100%.
Features have to soak on cloud for at least 2 weeks for testing. Focus is on severity and number of bugs found; if there are major bugs found at any stage, the feature flag can be turned off to roll back the feature.

## On-prem releases

For a feature flagged feature to be included in an on-prem release, the feature flag should be removed. 

Feature flags are generally off by default and on-prem releases do not contact the management system. Therefore feature flags that are not ready for an on-prem release will be automatically disabled for all on-prem releases. 

## Testing

Tests should be written to verify all states of the feature flag. Tests should cover any migrations that may take place in both directions (ie. from off to on and from on to off). 

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

1. What is the expected default value for boolean feature flags? Is it "false"? In the sense of "the normal product is when the feature is not around, and therefore the default should be the normal product". Or should it be "true" as in "the product now has this, we only shut it down if something weird happens"?
 - Definitely off. The idea is to use them to slowly roll out a feature. So when the code is deployed, its not on yet. Then you roll out to a small portion, make sure everything is OK and gradually roll out from there.

2. Is it possible to use a plugin feature flag like ``PluginIncidentManagement`` to "prepackage" a plugin only on cloud by only setting a plugin version to that flag on cloud? Could on-prem customers manually set that flag to install such plugin?
 - Yes. If you leave the default "" then nothing will happen for on-prem installations. Then you can have cloud team set split.io/environment to set a specific version. On-prem can set environment variables to set feature flag values.

3. How do feature flags work on Webapp?
 - To add a feature flag that affects frontend, the following is needed: 1. PR to server code to add the new feature flag. 2. PR to redux to update the types. 3. PR to webapp to actually use the feature flag.
