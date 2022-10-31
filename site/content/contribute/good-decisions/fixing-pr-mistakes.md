---
title: "Merged PR Scenario"
heading: "Merged PR Scenario"
weight: 2
---

This document's aim is to explain what process should be in place in the following scenario:

1. A contributor (either staff or community member) submits a PR, it is reviewed and merged into the codebase
2. Sometime later, the community notices a mistake with the PR

Question is, what should we, as a community, do? That depends on the scope of the changes in the PR that was merged.

## Low Impact
A low impact PR might mean that it affected:
- Some non-critical functionality
- It does not affect users in a substantial way 

If this is the case, do the following:

1. Create an issue for this
2. Mark it according to it's priority
3. Would be best to assign it to the person who introduced the issue in the first place

## High Impact
A high impact PR represents something that caused an incident or might well be causing one and we caught it early.

If this is the case, there are two scenarios:

1. The feature introduced in the PR is handled by a feature flag 
2. The feature introduced in the PR is **not** handled by a feature flag 

For scenario 1, if it is not affecting other functionality, turn that feature flag off so the feature will be disabled.

For scenario 2:

1. Revert the changes introduced in the original PR
2. Let the original person who worked on the PR know this so they can work on a proper fix for their PR
3. Reintroduce the change through the regular PR cycle