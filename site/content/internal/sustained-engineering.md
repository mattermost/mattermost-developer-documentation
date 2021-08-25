---
title: Sustained Engineering Team
heading: "What is the Sustained Engineering Team?"
description: "Learn more about the Sustained Engineering Team (SET), which is responsible for improving and maintaining quality."
date: 2019-02-06T14:28:35-05:00
weight: 120
---

The Sustained Engineering Team (SET) is responsible for improving and maintaining quality.

## Team Members

SET is a rotating team that is comprised of engineers from the different feature teams. The rotation is on a two week cycle. Who is currently on SET can be seen in the header of the [~Sustained Engineering](https://community.mattermost.com/core/channels/sustained-engineering) channel.

Feature teams will commit a total of 4 engineers plus a lead to SET for each rotation. While on SET, that engineer should attend their feature team's sprint planning but should not be assigned any work from their feature team. For the two weeks that engineer should primarily be working on issues for SET. If SET has no tickets to work on, then the engineer may pick up some work for their feature team.

SET has a lead engineer from one of the feature teams who leads the team for the duration of the rotation. This person should be identified as the SET Lead for each rotation in the channel header. The support team can contact this person when they are unsure who else to escalate to.

Engineers on SET are also on an on-call rotation as defined by the [process here](https://docs.google.com/document/d/1-AWQJQelgKvGVSP6sOIi9EOSVjxXVlJlwNuJlkcXKGA/edit).

## Workflow Process

SET works in a continuous style using this [Kanban JIRA board](https://mattermost.atlassian.net/secure/RapidBoard.jspa?rapidView=33). Tickets in the TO DO column should be organized from highest priority to lowest priority, based on the [Priority of Work](#priority-of-work) section. The SET lead should make sure that the tickets are priority ordered but team members can move tickets around to meet the correct priorities as necessary.

Team members on SET should pull tickets off the top of TO DO queue, work on them to completion and then pull another one off the TO DO queue.

Discussion related to SET should occur in the [~Sustained Engineering](https://community.mattermost.com/core/channels/sustained-engineering) channel on https://community.mattermost.com.

On Tuesdays, the SET lead should post a team status update in the ~Sustained Engineering channel using the following template:

```
#set-update #set-update-YYYY-MM-DD

Bugs resolved in the last 7 days: <X> (<X> reported by customers)
Bug fix PRs submitted in the last 7 days: <X> (<X> reported by customer)

In progress fixes:
* <list of tickets that are currently being worked on>

Next in the queue:
* <list of 3-5 tickets next in the queue>

Total bugs in backlog: <X>

Notes:
* <any notes or qualifiers for the week>
```

See https://community.mattermost.com/core/pl/8wryjyfpnjguundipu9nebiuda for an example.

You can get the bugs resolved in the last 7 days from here: https://mattermost.atlassian.net/issues/?filter=15097

And the customer bugs resolved in the last 7 days: https://mattermost.atlassian.net/issues/?filter=15098

To see bugs submitted, look at the Submitted column of the Kanban board.

## Priority of Work

Below is how SET prioritizes what is worked on.

1. Quality issues affecting community.mattermost.com
  * When a high impact issue affects the community server, SET responds and is responsible to coordinate fixing
  * Primary goal is to restore stability, whether this is fixing or reverting code
2. Handles customer support escalation
  * Primary goal is to help with issues that require code change
  * Be helpful with training/knowledge sharing for the support team
  * Identify customer support requests that are features and route to PM as necessary
3. General bug fixes
  * Pick up any bugs in triage without an obvious owning feature team
  * Work on bugs in this order: hotfix, release, customer reported, other
  * Close any low priority bugs that are not worth the mana
4. Identify technical debt issues
  * Help identify areas of the codebase that cause quality problems

## Triage

SET triages SET tickets asynchronously and also helps Release Manager to

* Help route new unassigned tickets to the appropriate feature team
* Assign bugs to SET when there is no clear feature team owner
* Make sure reported bugs are in fact bugs and recommend turning non-bugs into stories or feature requests

## Customer and Pre-Sales Support Escalation Process

Part of SET's responsibility is to interface with the customer support team. SET's primary goal in respect to support is to triage escalated support issues, work on any high priority customer bugs requiring code change, as well as provide training and knowledge share with the customer support team. 

For details on the Customer/Pre-Sales Support Escalation Process, please refer to [this document](https://docs.google.com/document/d/1eEnG0YA6G8_1futRlvBs2Vm88xkc0nTnZCynYXZNTBE/edit?usp=sharing). 

### Support Response Templates

SET members should use the following responses when receiving issue escalations from the customer or pre-sales support teams:

##### Requests that are new features and not bugs

```
Hi [insert reporter name], thanks for the report. After looking into it a bit this is working as designed and any changes in behavior would be a new feature. Is this something we get a lot of requests from different customers for? If so, I’d suggest talking to [insert PM name] to see if it makes sense to put on the product roadmap. If you think this observation is incorrect, could you give us the following so we can look into it further:

1. Information about the customer’s environment (MM version, DB type/version, cloud provider, etc.)
2. Logs around the time of the issue
3. Reproduction steps
4. What you have tried to resolve the issue
5. [insert other needs as necessary]
```

##### For configuration issues reported as bugs

```
Hi [insert reporter name], thanks for the report. This looks like a configuration issue that shouldn’t require any code change to resolve. Have you seen the docs for this [insert link]? If so, can you point to where the docs are deficient and we can work to get those updated.

In the meantime, here’s some things I’d suggest trying: [insert list of troubleshooting steps]
```

##### For configurations we don’t support

```
Hi [insert reporter name], thanks for the report. This seems to be a configuration that we don’t support. I’d recommend steering the customer to use the supported configuration as documented here [insert link]. If you’re seeing lots of requests for this configuration, I’d suggest talking to [insert PM name] to see if we should add support for it.
```

##### We need more information

```
Hi [insert reporter name], to help best could we get some more information? Particularly looking for the following:

1. Information about the customer’s environment (MM version, DB type/version, cloud provider, etc.)
2. Logs around the time of the issue
3. Reproduction steps
4. What you have tried to resolve the issue
5. [insert other needs as necessary]
```

##### Issues we are looking into

```
Hi [insert reporter name], thanks for the report. This looks like a bug, I’ve created [insert ticket link] to track and have put it into the queue to be worked on. Just a reminder that unless this is a hotfix worthy issue the fix won’t make it into the product until the next release. We’ll try to find a workaround that can be applied without code change but that isn’t always possible.
```
