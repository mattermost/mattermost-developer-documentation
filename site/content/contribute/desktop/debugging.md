---
title: "Debugging"
date: 2019-01-22T00:00:00-05:00
weight: 3
subsection: "Debugging"
---

# Developer Tools

The electron app itself can be inspected using the developer tools, available from the View menu:

![View toggle developer tools](/contribute/desktop/view-toggle-developer-tools.png)

However, this view does not expose the contents of the webviews for inspection. To open the developer tools for a webview, first access the console for the electron shell as above, and then run

    document.getElementById("mattermostView0").openDevTools();

using `mattermostView0` for the first opened tab, `mattermostView1` for the second opened tab, etc. A new window will appear with the developer tools for that webview:

![Webview developer tools](/contribute/desktop/webview-developer-tools.png)
