---
title: "Feature Flags"
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

< Guidelines coming soon > 

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
