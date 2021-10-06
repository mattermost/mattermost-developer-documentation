---
title: "DB Migration Guide"
heading: "DB Migration Guide"
date: 2021-10-05T16:00:00-0700
weight: 3
---

### Background

Schema changes are always made synchronously when Mattermost starts up. This means the application won't be ready to serve requests until all schema changes are applied. In most cases, the new application won't be able to work until those schema changes are in place.

The time taken to run migrations is irrelevant in general. A migration can take hours to run and that is fine. Most of our large customers use High Availability environments, so the application as a whole will always be up. In cases where the customer doesn't run a High Availability environment, we extract out some key SQL queries that the customer can run off-hours on their database. When the application is upgraded, the migration is a no-op because those columns/indexes are already added.

The problem arises when in some databases, for some tables, due to various technical reasons, applying a migration prevents other operations from happening on that table. In that case, it causes unavoidable downtime.

### TLDR

1. Migrations are always synchronous.
2. The time taken to run a migration is irrelevant.
3. Except in cases where a migration cannot run concurrently with other database operations.

### I need to make a schema change. What do I do?

1. Every store is initialized in a `newXXXStore` function in `store/sqlstore/XXX_store.go` file. It should have a `db.AddTableWithName` call. Add your column to that table with the right `ColMap` param. Add other constraints as necessary.
2. Modify the `store/sqlstore/upgrade.go` file. Scroll to the bottom, and add your migration there. (This method is going to change in the near future).

### How do I measure the impact of the migration?

Answer the following two questions:
1. Is it a large table (like `Posts` or `ThreadMemberships`)? (The performance team can help you with this.)
2. Can my change run concurrently with other database operations in that table? Check MySQL and PostgreSQL documentation, starting from required minimum versions supported by Mattermost.

If the answer to 2. is yes, then it should be pretty simple. In that case, if the answer to 1 is also yes, then please extract the raw SQL query to be run and add it in the release notes for customers who want to run it in off-hours to speed up upgrade time.

However, If the answer to the second question above is "no", then contact the Performance team to discuss a solution.

### Inform SRE team.

If the migration is large, when the PR is review complete, please cc an SRE team member and ask them to merge it and their convenience. This is so that the migration can run on our Community cluster and Cloud at a suitable time.
