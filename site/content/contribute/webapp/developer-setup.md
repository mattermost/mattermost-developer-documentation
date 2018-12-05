---
title: "Developer Setup"
date: 2017-08-20T11:35:32-04:00
weight: 2
subsection: Web App
---

## Prerequisites
- Git
- homebrew (for Mac)

## Setup

Follow these steps to set up your web app developer environment:

1. To develop for the web app you're also going to need to [set up the developer environment for the server](/contribute/server/developer-setup). So if you haven't done that yet, start there and then come back here.

2. Install [Node.js and npm](https://www.npmjs.com/get-npm).

3. If you're on Mac, you'll need to install libpng as well: `brew install libpng`

4. Go to https://github.com/mattermost/mattermost-webapp and fork the repository.

5. Clone your fork `git clone https://github.com/<yourgithubusername>/mattermost-webapp` beside your `mattermost-server`.

6. Inside the `mattermost-webapp` directory, run `make test`. If that passes succesfullly, everything is installed correctly.
