---
title: Sustained Engineering Team
date: 2019-02-06T14:28:35-05:00
section: internal
weight: 120
---

The Sustained Engineering Team (SET) is responsible for improving and maintaining quality.

## Team Members

SET is a rotating team that is comprised of engineers from the different feature teams. The rotation is from the 16th of one month to the 16th of the next month, lining up with Mattermost releases.

Each feature team will commit a single engineer to SET for each rotation. While on SET, that engineer should attend their feature team's sprint planning but should not be assigned any work from their feature team. For the month that engineer should primarily be working on issues for SET. If SET has no ticketse to work on, then the engineer may pick up some work for their feature team.

At any one time SET will have a lead engineer from one of the feature teams who will lead the team.

## Workflow Process

SET works in a continuous style using this [Kanban JIRA board](https://mattermost.atlassian.net/secure/RapidBoard.jspa?rapidView=33). Tickets in the TO DO column should be organized from highest priority to lowest priority, based on the [Priority of Work](#priority-of-work) section. The SET lead should make sure that the tickets are priority ordered but team members can move tickets around to meet the correct priorities as necessary.

Discusson related to SET should occur in the [~Sustained Engineering](https://community.mattermost.com/core/channels/sustained-engineering) channel on https://community.mattermost.com.

SET meets twice per week, after the Tuesday and Thursday triage meetings. During these meetings SET members should provide status updates and talk about any blockers that have been encountered.

After the Tuesday meeting, the SET lead should post a team status update in the ~Sustained Engineering channel using the following template:

```
#set-update #set-update-YYYY-MM-DD

Bugs resolved in the last 7 days: <X> (<X> reported by customers)
Bug fix PRs submitted in the last 7 days: <X> (<X> reported by customer)

In progress fixes:
* <list of tickets that are currently being worked on>

Next in the queue:
* <list of 3-5 tickets next in the queue>

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

SET attends all triage meetings. During triage, SET should:
* Help route tickets to the appropriate feature team
* Assign bugs to SET when there is no clear feature team owner
* Make sure reported bugs are in fact bugs and recommend turning non-bugs into stories or feature requests

During non-release weeks, triage is held twice a week. Near the end of the release cycle, triage is held daily.
