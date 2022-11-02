---
title: Embedded bindings
heading: Embedded bindings
---
Posts can be embedded with bindings which display form-like components to the user for asynchronous interaction.

{{<note "Note:">}}
It is recommended to use a [driver]({{<ref "/integrate/apps/drivers">}}) when implementing embedded bindings.
{{</note>}}

A post property, `app_bindings`, defines the embedded bindings. These bindings take the same form as other [App bindings]({{<ref "/integrate/apps/structure/bindings">}}).
The following [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) example shows how to embed a simple button into a post:

```go
post := &models.Post{
    ChannelID: callRequest.Context.Channel.ID,
}
// NOTE: apps.PropAppBindings == "app_bindings"
post.AddProp(apps.PropAppBindings, []apps.Binding{
    Location:    "embedded",
    AppID:       appManifest.AppID,
    Description: "Embedded bindings in a post",
    Bindings: []apps.Binding{
        Location: "click-me",
        Label:    "Click me!",
        Submit:   apps.NewCall("/submit-click"),
    },
})
client := appclient.AsBot(callRequest.Context)
createdPost, err := client.CreatePost(post)
if err != nil {
    // handle the error
}
```

![Screenshot of post with embedded bindings](embedded-binding-example.png)

### Embedded binding elements

Embedded bindings can use two types of form elements: buttons and selects. When a button is clicked or a select is changed, the binding element's `submit` call is performed.
The call will include the App, user, post, root post (if any), channel, and team IDs.

#### Buttons

Button bindings contain the following fields:

| Name                                                                              | Type                                                | Description                                                                                                                              |
|:----------------------------------------------------------------------------------|:----------------------------------------------------|:-----------------------------------------------------------------------------------------------------------------------------------------|
| `location`                                                                        | string                                              | Location name. The whole location path will be provided in the context.                                                                  |
| `label`                                                                           | string                                              | Label that will show in the button. Defaults to location. Must be unique in its level.                                                   |
| `submit`{{<compass-icon icon-star "At least one of submit or form is required">}} | [Call]({{<ref "/integrate/apps/structure/call">}})  | Call to be made when the button is selected. You must provide a call if there is no form, or the form itself does not have a call.       |
| `form`{{<compass-icon icon-star "At least one of submit or form is required">}}   | [Form]({{<ref "/integrate/apps/structure/forms">}}) | Form to open in a modal form when the button is clicked. You must provide a form with a call if there is no call defined in the binding. |

{{<note "Note:" icon-star "At least one of submit or form is required">}}
At least one of the `submit` or `form` fields must be specified for an embedded button binding.
{{</note>}}

#### Selects

Select bindings contain the following fields:

| Name       | Type                                                             | Description                                                             |
|:-----------|:-----------------------------------------------------------------|:------------------------------------------------------------------------|
| `location` | string                                                           | Location name. The whole location path will be provided in the context. |
| `label`    | string                                                           | Placeholder text displayed when there has been no selection.            |
| `submit`   | [Call]({{<ref "/integrate/apps/structure/call">}})               | (_Optional_) Call to be made inherited by the options.                  |
| `form`     | [Form]({{<ref "/integrate/apps/structure/forms">}})              | (_Optional_) Form to be inherited by the options.                       |
| `bindings` | [Binding]({{<ref "/integrate/apps/structure/bindings">}}) (list) | Options for the select.                                                 |

##### Select options

Select options contain the following fields:

| Name                                                                              | Type                                                | Description                                                                                                                                            |
|:----------------------------------------------------------------------------------|:----------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `location`                                                                        | string                                              | Option name. The whole location path will be provided in the context.                                                                                  |
| `label`                                                                           | string                                              | User-facing string. Defaults to location. Must be unique in its level.                                                                                 |
| `submit`{{<compass-icon icon-star "At least one of submit or form is required">}} | [Call]({{<ref "/integrate/apps/structure/call">}})  | (_Optional_) Call to perform when the option is selected. You must provide a call if there is no form, or the form itself does not have a call.        |
| `form`{{<compass-icon icon-star "At least one of submit or form is required">}}   | [Form]({{<ref "/integrate/apps/structure/forms">}}) | (_Optional_) Form to open in a modal form when the option is selected. You must provide a Form with a Call if there is no Call defined in the Binding. |

{{<note "Note:" icon-star "At least one of submit or form is required">}}
At least one of the `submit` or `form` fields must be specified for each embedded select option.
{{</note>}}

The following [Golang driver]({{<ref "/integrate/apps/drivers/golang">}}) example shows an embedded binding that contains a select field:

```go
post := &models.Post{
    ChannelID: callRequest.Context.Channel.ID,
}
// NOTE: apps.PropAppBindings == "app_bindings"
post.AddProp(apps.PropAppBindings, []apps.Binding{
    Location:    "embedded",
    AppID:       appManifest.AppID,
    Description: "Select your favourite coffee roast",
    Bindings: []apps.Binding{
        Location: "coffee-roast",
        Label:    "Coffee roast",
        Bindings: []apps.Binding{
            {
                Location: "dark-roast",
                Label:    "Dark roast",
                Submit:   apps.NewCall("/submit-coffee-roast"),
            },
            {
                Location: "medium-roast",
                Label:    "Medium roast",
                Submit:   apps.NewCall("/submit-coffee-roast"),
            },
            {
                Location: "light-roast",
                Label:    "Light roast",
                Submit:   apps.NewCall("/submit-coffee-roast"),
            },
        },
    },
})
client := appclient.AsBot(callRequest.Context)
createdPost, err := client.CreatePost(post)
if err != nil {
    // handle the error
}
```

![Screenshot of embedded select example](embedded-binding-select-example.png)

The `Call` payload from selecting an option looks like the following:

```json
{
    "path": "/set-roast-preference",
    "expand": {},
    "context": {
        "app_id": "hello-world",
        "location": "/in_post/embedded/coffee-roast/medium-roast",
        "user_agent": "webapp",
        "track_as_submit": true,
        "mattermost_site_url": "http://mattermost:8066",
        "developer_mode": true,
        "app_path": "/plugins/com.mattermost.apps/apps/hello-world",
        "bot_user_id": "mgbd1czngjbbdx6eqruqabdeie",
        "bot_access_token": "pb7g98amypdkiymcwr9f7qtqdw",
        "acting_user": {
            "id": "7q7kaakokfdsdycy3pr9ctkc5r"
            // additional fields omitted for brevity
        },
        "oauth2": {}
    }
}
```

The value of the `location` context field indicates which option was selected by the user.
