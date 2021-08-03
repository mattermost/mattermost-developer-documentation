---
title: "Dependencies"
heading: "Managing Dependencies in Mattermost"
description: "The Mattermost server uses go modules to manage dependencies. To manage dependencies you must have modules enabled."
date: 2019-03-27T16:00:00-0700
weight: 5
---


The Mattermost server uses [go modules](https://github.com/golang/go/wiki/Modules) to manage dependencies. To manage dependencies you must have modules enabled.


## Enabling go modules support (Do this first!)

While golang migrates to support go modules, you need to set the environment variable `GO111MODULE` to `on` if you are developing in the GOPATH. For example:

```bash
export GO111MODULE=on
```

Once this is done, all go commands issued will use the modules system.

## Adding or updating a new dependency

Be sure you have enabled go modules support. Adding a dependency is easy. All you have to do is import the dependency in the code and recompile. The dependency will be automatically added for you. Updating uses the same procedure.

Before committing the code with your new dependency added, be sure to run `go mod tidy` to maintain a consistent format and `go mod vendor` to synchronize the vendor directory.

If you want to add or update to a specific version of a dependency you can use a command of the form:
```bash
go get -u github.com/pkg/errors@v0.8.1
go mod tidy
go mod vendor
```

If you just want whatever the latest version is, you can leave off the `@version` tag.

## Updating all dependencies

To update all dependencies use the make target:
```bash
make update-dependencies
```
this will run `go get -u` and `go mod tidy` and `go mod vendor` for you. It may also hold back specific dependencies as needed.

## Removing a dependency

Be sure you have enabled go modules support. After removing all references to the dependency in the code, you run:
```bash
go mod tidy
go mod vendor
```
to remove it from the `go.mod` file and the `vendor` directory.
