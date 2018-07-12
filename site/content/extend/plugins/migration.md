---
title: Migrating v1 Plugins
date: 2018-07-10T00:00:00-05:00
subsection: Plugins
weight: 50
---

# Migrating v1 Plugins

Plugins v2 introduces breaking changes relative to the plugins beta. This page documents the changes necessary to migrate your existing plugins.

## Server changes

Although the changes under the cover are significant, the required changes to server plugins are minimal.

### Entry Point

The plugin entry point used to be:

```go
import "github.com/mattermost/mattermost-server/plugin/rpcplugin"

func main() {
	rpcplugin.Main(&HelloWorldPlugin{})
}
```

Change the imported package and invoke `ClientMain` instead:

```go
import "github.com/mattermost/mattermost-server/plugin"

func main() {
	plugin.ClientMain(&HelloWorldPlugin{})
}
```

### Hook Parameters

Most hook callbacks now contain a leading `plugin.Context` parameter. Consult the [Hooks](http://localhost:1313/extend/plugins/server/reference/#Hooks) documentation for more details, but for example, the `ServeHTTP` hook used to be:

```go
func (p *MyPlugin) ServeHTTP(w http.ResponseWriter, r *http.Request) {
    // ...
}
```

Change it to:

```go
func (p *MyPlugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
    // ...
}
```

### API Changes

Most of the previous API calls remain available and unchanged, with the notable exception of removing the `KeyValueStore()`. Use [KVSet](http://localhost:1313/extend/plugins/server/reference/#API.KVSet), [KVGet](http://localhost:1313/extend/plugins/server/reference/#API.KVGet) and [KVDelete](http://localhost:1313/extend/plugins/server/reference/#API.KVDelete) instead:

```go
func (p *MyPlugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	key := r.URL.Query().Get("key")
	switch r.Method {
	case http.MethodGet:
		value, _ := p.API.KVGet(key)
		fmt.Fprintf(w, string(value))
	case http.MethodPut:
		value := r.URL.Query().Get("value")
		p.API.KVSet(key, []byte(value))
	case http.MethodDelete:
		p.API.KVDelete(key)
	}
}
```

Any standard error from your plugin will now be captured in the server logs, including output from the standard [log](https://golang.org/pkg/log/) package, but there are also explicit API methods for emitting structured logs:

```go
func (p *MyPlugin) ServeHTTP(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
    p.API.LogDebug("received http request", "user_agent", r.UserAgent())
    if r.Referer() == "" {
        p.API.LogError("missing referer")
    }
}
```

This would generate something like the following in your server logs:
```
{"level":"debug","ts":1531494669.83655,"caller":"app/plugin_api.go:254","msg":"received http request","plugin_id":"my-plugin","user_agent":"HTTPie/0.9.9"}
{"level":"error","ts":1531494669.8368616,"caller":"app/plugin_api.go:260","msg":"missing referer","plugin_id":""my-plugin"}
```

## Web App Changes

The changes to web app plugins are more significant than server plugins.

### Entry Point

The plugin entry point used to be registered by directly manipulating a global variable:

```js
window.plugins['my-plugin'] = new MyPlugin();
```

Instead, use the globally exported `registerPlugin` method:

```js
window.registerPlugin('my-plugin', new MyPlugin());
```

### Externalizing Dependencies

The plugins beta suggested relying on the global export of common libraries from the web app:

```js
const React = window.react;
```

While this remains supported, it is more natural to leverage Webpack [Externals](https://webpack.js.org/configuration/externals/). Configure this in your `.webpack.config.js`:

```
module.exports = {
    // ...
    externals: {
        react: 'react',
    },
    // ...
};
```

and then import your modules naturally:

```js
import React from 'react';
```

### Initialization

The `initialize` callback used to receive a `registerComponents` callback to configure components, post types and main menu overrides:

```js
import ChannelHeaderButton from './components/channel_header_button';
import MobileChannelHeaderButton from './components/mobile_channel_header_button';
import PostTypeZoom from './components/post_type_zoom';
import {configureZoom} from './actions/zoom';

class MyPlugin {
    initialize(registerComponents) {
         registerComponents(
             {ChannelHeaderButton, MobileChannelHeaderButton}, 
             {custom_zoom: PostTypeZoom}, 
             {
                 id: 'zoom-configuration',
                 text: 'Zoom Configuration',
                 action: configureZoom,
             },
        );
    }
}
```

The `initialize` callback now receives an instance of the plugin [registry](/extend/plugins/webapp/reference/#registry). In some cases, the registry's API now requires a more discrete breakdown of the registered component to allow the web app to handle various rendering scenarios:

```js
import ChannelHeaderButtonIcon from './components/channel_header_button/icon';
import MobileChannelHeaderButton from './components/mobile_channel_header_button';
import PostTypeZoom from './components/post_type_zoom';
import {startZoomMeeting, configureZoom} from './actions/zoom';

class MyPlugin {
    initialize(registry) {
        registry.registerChannelHeaderButtonAction(
            ChannelHeaderButtonIcon,
            startZoomMeeting,
            'Start Zoom Meeting',
        );

        registry.registerPostTypeComponent('custom_zoom', PostTypeZoom);

        registry.registerMainMenuAction(
            'Zoom Configuration',
            configureZoom,
            MobileChannelHeaderButton,
        );
    }
}
```

Restructuring your plugin to use the new registry API will likely prove to be the hardest part of migrating.

### Uninitialization

The `uninitialize` callback used to be called `deinitialize`:
```js
class MyPlugin {
    // ...
    deinitialize() {
        // ...
    }
    // ...
}
```

Change it to `uninitialize`:
```js
class MyPlugin {
    // ...
    uninitialize() {
        // ...
    }
    // ...
}
```
