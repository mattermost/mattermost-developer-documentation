---
title: "DB Migration Guide"
heading: "DB Migration Guide"
date: 2021-10-05T16:00:00-0700
weight: 3
---

### Background

Schema changes are always made synchronously when Mattermost starts up. This means the application won't be ready to serve requests until all schema changes are applied. In most cases, the new application won't be able to work until those schema changes are in place.

In a high availability environment, multiple instances will try to run migrations. To prevent this, a lock table is used in the migration system. Until migrations are completed, none of the instances will start. Once the lock is released by a node, another instance will obtain the lock, and check the migrations table. Since the previous node already applied the migrations, the remaining nodes won't re-apply the migrations.

From Mattermost release v6.4, we have started using a schema-based migration system. We are now creating SQL statement files to run migrations. A developer must create migration files for each database driver. Since we want our migrations to be reversible, the developer must create one `up` script along with a `down` script. For instance, a single migration would have the following files:

- `000066_upgrade_posts_v6.0.down.sql`
- `000066_upgrade_posts_v6.0.up.sql`

A file naming convention is used to determine the order in which the migrations should be applied that appends `up|down.sql` suffix to the migration name. We were using a database version before the new migration system which is why the versions exist in the migration file name in the example. Going forward, using version identifiers for future next migration files is not mandatory. A developer can add any information to the name if they think it's going to be helpful.

We are using [morph](https://github.com/go-morph/morph) for the migration engine. The tool has a library and also a CLI. Mattermost server imports the library to have programmatic access to morph functions. A developer can use the morph CLI tool to test whether their migrations are working properly. Please follow instructions in the morph documentation to use the morph CLI tool.

If your migration will take more time on a larger data set, check if it is possible to extract it as a separate SQL query for the customer to run off-hours on their DB. This is usually possible with new indexes/columns. As a result, when the application is upgraded, the migration is a no-op because those columns/indexes are already added.

The problem arises when in some databases, for some tables, due to various technical reasons, applying a migration prevents other operations from happening on that table. In that case, it causes unavoidable downtime.

### TLDR

1. Migrations are always synchronous.
2. The time taken to run a migration is not always the primary factor in judging impact.
3. Except in cases where a migration cannot run concurrently with other database operations.

### I need to make a schema change. What do I do?

1. Add the appropriate SQL script file containing the statements you want to run into the migrations directory. This directory is located in `{project_dir}/db/migrations/{driver_name}/`. Do not forget to add scripts for both `mysql` and `postgres` databases.
2. To embed the script, run `make migrations-bindata`.
3. When you run the mattermost-server binary, the tool will automatically apply the migration if it's required. The migration name will be saved in the `db_migrations` table.

### My migration has failed. What do I do?
1. If you think your migration is applied, and you want to revert changes, you can run the down script to roll back in a clean way. You can use morph CLI to apply down migrations.
    - Before rolling down the script, check the `db_migrations` table whether the migration is applied or not.
    - If it's applied you can revert it using morph CLI command. An example command would look like `morph apply down --driver {your-driver} --dsn "{your-dsn}" --path {path-to-your-driver-specific-migration-files} --number 1`
2. If the migration has been shipped in a release and you want to apply fixes, instead of changing the existing script, you should add a new one so that `db_migrations` will stay consistent. You can edit the existing migration to be a no-op for future releases in this case.

### How do I measure the impact of the migration?

Answer the following two questions:
1. Is it a large table (like `Posts` or `ThreadMemberships`)? (The performance team can help you with this.)
2. Can my change run concurrently with other database operations in that table? Check MySQL and PostgreSQL documentation, starting from required minimum versions supported by Mattermost.

If the answer to 2. is yes, then it should be pretty simple. In that case, if the answer to 1 is also yes, then please extract the raw SQL query to be run and add it in the release notes for customers who want to run it in off-hours to speed up upgrade time.

However, If the answer to the second question above is "no", then contact the [performance team](https://community.mattermost.com/core/channels/developers-performance) to discuss a solution.

### Inform SRE team.

If the migration is large, when the PR is review complete, please cc an SRE team member and ask them to merge it and their convenience. This is so that the migration can run on our Community cluster and Cloud at a suitable time.
