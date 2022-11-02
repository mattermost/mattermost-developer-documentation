---
title: Static assets
description: Static assets
weight: 60
---
An App's static assets include resources such as images and JSON data. 

Requests for static assets are made relative to the `<RootURL>/static` URI path. For example, retrieving the icon named `icon.png` for a `/channel_header` binding would result in the following HTTP request:

```http request
GET http://my-app:4000/static/icon.png HTTP/1.1
```

At this time, binding icons and profile picture overrides are the only static assets that are automatically requested by the Mattermost UI.
