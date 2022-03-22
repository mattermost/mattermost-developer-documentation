---
title: "Revamping Mattermost Schema Migrations"
slug: revamping-mattermost-schema-migrations
date: 2022-03-22T00:00:00-04:00
categories:
    - "paltform"
author: Ibrahim Serdar Acikgoz
github: isacigkoz
community: ibrahim.acikgoz
summary: An overview of revamping schema migrations for Mattermost suite.
---

# Revamping Mattermost Schema Migrations

## What are schema migrations

As an application evolves, the data flowing inside inevitably evolves. If you have an application that persists the data in a relational database, the way you store the data is probably going to change over time. The definition or the structure of your data is called the database schema. The schema is a key factor in relational databases, as it’s a guarantee that the data is being read from the database will have a certain structure.

As we mentioned in the beginning, as the application evolves, you need to find a way to keep track of your changes. It’s pretty straightforward for the source code, using a version control system and publishing releases with semantic versioning is a proven way that works for many teams. There are also alternatives to versioning strategy but in the essence, they generally serve similar purposes.

So, what happens to your schema changes over time? One way to track these changes is to sync the schema versioning to the application version. Although it seems to make sense at a glance, there is a major difference once you dig deeper into the motivations of versioning. In a nutshell, you don’t need to give promises as your public API since the database is not intended for public use (generally). So you don’t need to follow major, minor, and patch semantics. But still, you may want to track the changes for several reasons. Let’s review some of these reasons:

### Track history of a version

You can see when a table or column was changed and who changed it. You can also see how the change is implemented by looking diffs between the two versions.

### Restore a previous version

If there is an error in any version, if the current version is broken, or if you simply like a previous version better, you can replace the current version with a previous one.

If we have enough reasons to control versions of our schema, let’s continue with how we can manage this.

## Managing the changes on the schema

Since we decided versioning the schema is a good idea, let’s think about how to do it. Let’s start with tracking the version then continue with how to apply changes for every version. Also since the database stores data, we can actually keep the schema version in itself. Some versioning approaches could be:

- You create a table in the database and store the latest schema version.
- You create a table in the database and store every applied migration.

Generally, both approaches can do the job. But once you decide to migrate down a migration other than the latest one, you will need to either, write a new script and add it as new forward migration or you will need to migrate down every migration from the latest to the one you want to migrate down. The latter wouldn’t be a big problem if you map the application version to the schema version. To render this, we can imagine an example case: Let’s say your application version is 2.1 and it had 3 migration steps on top of 2.0 (say it’s 10 -> 13). So if you decided to downgrade the application version it will be pretty straightforward. But, let’s imagine a case you just want to remove a migration in between that causes some pain and move on? You can’t simply manage each migration, you need to think about it as a whole. This can be beneficial of being on the safe side but you pay the price with losing a bit of flexibility.

But if you track each applied migration you are adding another dimension to the version control. With this approach, you know exactly which migrations are actually applied or not by looking at the version table.

## Implementation of the migrations

By implementation, we mean the SQL statements that are going to be applied to the schema. There are two major ways of implementing the migrations;

- Add these statements to your source code and execute them programmatically from your application code.
- Add these statements as separate script files and apply each file as a migration step.

The first approach is very hard to track since the code lives inside your application, it’s generally mixed with a high-level programming language logic and requires your application to be running to get applied. And you don’t necessarily add the backward migration logic while adding a new one because if you decide to roll back to an earlier version that logic would be present only in a newer version. In essence, you cannot decouple schema management from your application which can cause you lots of pain.

The latter, having the statements in separate files comes with a huge advantage: flexibility. You can test the scripts in your database console right away, or, use another tool to apply migrations since it doesn’t require the application to be running. Another advantage would be the easy navigation among scripts and there will be not many context switches while reading a migration implementation as it can’t have a high-level programming language semantic in it.

So far, it seems like using a schema migration tool seems a good way of managing this matter. Here [morph](https://github.com/mattermost/morph/) comes to the stage. It’s a schema migration tool that is built to help improve Mattermost schema migrations.

## Morph

Morph is a schema migration tool that could be used programmatically with a library and from a CLI. It stores the schema version in a table where all applied migrations are persisted.
It’s a flexible library that can be used as a driver interface implementation, a source to read migration scripts from. The engine uses a dependency injection pattern so that any implementation could be used with the library. And the interfaces of the dependencies are kept minimal to avoid confusion.

The morph engine can be initialized as following:

```Go
engine, err := morph.New(context.Background(), driver, src)
if err != nil {
    return err
}
defer engine.Close()

err = engine.ApplyAll()
```

It’s worth mentioning that MySQL, PostgreSQL, and SQLite implementations are provided within the project. The interface is defined as follows:

```Go
type Driver interface {
    Ping() error 
    Close() error
    Apply(migration *models.Migration, saveVersion bool) error
    AppliedMigrations() ([]*models.Migration, error)
    SetConfig(key string, value interface{}) error
}
```

Morph engine expects the migration scripts to be parsed and accessible from an interface: `source.Source` which is a minimal interface as:

```Go
type Source interface {
    Migrations() (migrations []*models.Migration)
}
```

The `models.Migration` is a simple struct that contains migration name, version, direction, and the migration statements as an `io.ReadCloser` interface can be a file essentially. The `models.Migration` struct can be initialized from the files and the built-in file source expects files to have a specific format.

The migrations files should have up and down versions. The tool expects each migration to be reversible, and the naming of the migration should be in the following form:

```none
{order_number}_{migration_name}.{(up|down).sql}
```

The first part will be used to determine the order in which the migrations should be applied and the next part until the `up|down.sql` suffix will be the migration name.

For example:

```none
0000000001_create_user.up.sql
0000000001_create_user.down.sql
```

Apart from the essential arguments, morph can be initialized with a locking option which enables a lock mechanism (to mimic advisory locking) that’s been builtin with the tool. It is being used for cases where multiple applications could execute the migrations at the same time. If the database driver implements the following interface, morph can be used safely in multi-application deployments:

```Go
type Locker interface {
    Lock(context.Context) error
    Unlock() error
}
```

It essentially allows an instance to create a mutex value with expiration in the database and refreshes it until the instance finishes applying migrations. Other instances will keep waiting until the mutex is either removed from the database or get expired. The main difference here is that locking is not used for a single statement but it’s being used for the entire migration process. And this mechanism creates another level above sessions hence it wouldn’t fail if the advisory locks are bound to the sessions.

The morph CLI provides the same functionality from the command line. Feel free to install and experiment as we think the command discovery should be sufficient to start using it!

## Summary

Schema migrations enable versioning as the schema evolves. Making schema changes to databases is serious business as it means changing your customers' data structures. And that always comes with some risks. We consider it is a good practice to have easy recovery paths and to handle changes as a unit. We developed [morph](https://github.com/mattermost/morph/) to achieve these goals. Even though it’s not mature enough to be used in many different application types, we are continuously improving it as requirements change.
