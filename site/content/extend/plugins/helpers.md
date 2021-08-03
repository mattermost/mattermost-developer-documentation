---
title: Plugin Helpers
heading: "Plugin Helpers at Mattermost"
description: "Learn when to write a new plugin helper, a new API method, and a new hook for Mattermost."
date: 2019-09-30T00:00:00-05:00
weight: 100
---

The plugin architecture consists of an [API](/extend/plugins/server/reference/#API), [hooks](/extend/plugins/server/reference/#Hooks), and plugin helpers.

When a plugin invokes an API method, it makes an RPC call to the Mattermost server and waits for a response. When the Mattermost server invokes a hook method, it makes an RPC call to the plugin and waits for a response:

```go
// OnActivate is a hook called by the server when the plugin is started.
func (p *Plugin) OnActivate() error {
    // CreatePost is an API called by the plugin to create a post.
	post, err := p.API.CreatePost(&model.Post{...})
    if err != nil {
        return err
    }

    return nil
}
```

By contrast, a plugin helper is just Go code that wraps the existing API and hook methods without introducing any new RPC calls:

```go
func (p *Plugin) OnActivate() error {
    var enabled bool

    // KVGetJSON is a plugin helper that wraps KVGet to simplify reading JSON data.
    _, err := p.Helpers.KVGetJSON("enabled", enabled)
    if err != nil {
        return err
    }

    if enabled {
        // ...
    }
}
```

Although plugin helpers are defined in the [github.com/mattermost/mattermost-server/v5/plugin](https://godoc.org/github.com/mattermost/mattermost-server/v5/plugin#Helpers) package, they aren't part of the RPC exchange with the Mattermost server. This distinction has a number of advantages:

* Compatibility with older Mattermost servers (so long as they support the underlying API and hooks).
* Flexibility in adding new helpers without cluttering the RPC protocol and corresponding API documentation.
* Potential for independent versioning to improve the helpers without breaking previously compiled plugins.

# FAQ

## When should I write a plugin helper?

In general, always write a plugin helper when the functionality can be expressed using the existing API or hooks.

Even if this is not possible, consider whether the helper functionality naturally decomposes into smaller, general purpose API calls and hooks to enable future plugin helpers to build upon your changes.

## When to write a new API method? New hook?

Don't be afraid to extend the API or hooks to support brand new functionality. Consider accepting an options struct instead of a list of parameters to simplify extending the API in the future:

```go
	// GetUsers a list of users based on search options.
	//
	// Minimum server version: 5.10
	GetUsers(options *model.UserGetOptions) ([]*model.User, *model.AppError)
```

Old servers won't do anything with new, unrecognized fields, but also won't break if they are present. When adding new options that will only be supported by some Mattermost server versions, consider wrapping the functionality with a plugin helper to help plugin authors safely use the API.

## How do I add a plugin helper?

To add a helper to the official [github.com/mattermost/mattermost-server/v5/plugin](https://godoc.org/github.com/mattermost/mattermost-server/v5/plugin#Helpers) package:

* Extend the [`Helpers` interface](https://github.com/mattermost/mattermost-server/blob/master/plugin/helpers.go) with the new method.
* Add a new method to the concrete `HelpersImpl` struct in a new or existing `helpers_*` file:

```go
func (p *HelpersImpl) NewHelper(param1 string) (error) {
        // ...
        return nil
}
```

* Ensure the documented minimum server version reflects the maximum of any API calls or hooks your helper relies upon.
