---
draft: true
title: "Environment Setup"
date: 2017-08-20T11:35:32-04:00
weight: 2
subsection: Mattermost Redux
---

# Environment Setup

1. Install [yarn](https://yarnpkg.com/en/) by following the instructions found [here](https://yarnpkg.com/en/docs/install).
2. Fork the repository at https://github.com/mattermost/mattermost-redux.
3. Clone your fork using the following command. If you have the [mattermost-webapp](/contribute/webapp) environment set up or are planning on setting it up, you would typically clone your copy to `$GOHOME/src/github.com/mattermost/mattermost-redux`.
    ```
    git clone https://github.com/<yourgithubusername>mattermost-redux
    ```

4. Run the tests to confirm everything is installed correctly. Doing this will also use yarn to install any other required dependencies.
    ```
    cd mattermost-redux
    make test
    ```

<div style="margin-top: 15px;">
<span class="pull-left"><a href="/contribute/redux/">< Back to Redux</a></span>
<span class="pull-right"><a href="/contribute/redux/developer-workflow/">Go to Development Workflow ></a></span>
</div>
<br/>
