---
title: "Desktop App"
date: 2018-01-02T10:36:34-05:00
section: "contribute"
---

# Desktop App
The Mattermost desktop app is an [Electron](https://electronjs.org/) wrapper around the <a href="/contribute/webapp">webapp</a> project. It lives in the [mattermost/desktop](https://github.com/mattermost/desktop) repository. The desktop app runs on Windows, Linux, and macOS.

## Directory Structure
```
Mattermost Desktop
├── docs/ - Documentations.
├── resources/ - Resources which are used outside of the application codes, and original images of assets.
├── scripts/ - Helper scripts.
├── src/ - Application source code.
│   ├── assets/ - Assets which are loaded from the application codes.
│   ├── browser/ - Implementation of Electron's renderer process.
│   │   ├── components/ - React.js components.
│   │   ├── css/ - Stylesheets.
│   │   ├── js/ - Helper JavaScript modules.
│   │   └── webview/ - Injection code for Electron's <webview> tag.
│   ├── common/ - Common JavaScript modules for both Electron's processes.
│   └── main/ - Implementation of Electron's main process.
│       └── menus/ - Application menu.
└── test/ - Automated tests.
    ├── modules/ - Scripts which are commonly used in tests.
    └── specs/ - Test scripts.
```

### Other directories
- `node_modules/` - Third party Node.js modules to develop and build the application.
- `release/` - Packaged distributable applications.
- `src/node_modules/` - Third party Node.js modules to use in the application.

<div style="margin-top: 15px;">
<span class="pull-right"><a href="/contribute/desktop/developer-setup/">Go to Environment Setup ></a></span>
</div>
<br/>