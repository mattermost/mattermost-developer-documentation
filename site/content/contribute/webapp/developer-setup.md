---
title: "Developer Setup"
date: 2017-08-20T11:35:32-04:00
weight: 2
subsection: Web App
---

Set up your development environment for building, running, and testing the Mattermost web app.

#### Prerequisites

1. Set up your [development environment for the Mattermost server](/contribute/server/developer-setup). 

 - Running these steps will also install Git on your machine, and Homebrew for Mac.

2. Install Node.js and npm following the instructions at https://www.npmjs.com/get-npm.

3. On Mac, install libpng:

    ```sh
    brew install libpng
    ```

#### Setup

1. Go to https://github.com/mattermost/mattermost-webapp and create a fork.

2. Clone the fork, replacing `{yourgithubusername}` with your GitHub username:

    ```sh
    git clone https://github.com/{yourgithubusername}/mattermost-server.git
    ```

3. Test your environment:

    ```sh
    cd mattermost-webapp
    make test # If all tests pass, your install was successful.
    ```
