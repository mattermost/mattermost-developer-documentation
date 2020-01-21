# Mattermost Developer Documentation [![Mattermost dev docs status badge](https://circleci.com/gh/mattermost/mattermost-developer-documentation.svg?style=svg)](https://circleci.com/gh/mattermost/mattermost-developer-documentation/tree/master)

Website for Mattermost developer documentation, built using [Hugo](https://gohugo.io/). Master is continuously deployed to [developers.mattermost.com](https://developers.mattermost.com/).

## Installing Hugo

There's no need to directly install Hugo on your workstation, [Hugo Wrapper](https://github.com/khos2ow/hugo-wrapper) is being used. `hugow` is a POSIX-style shell script which acts as a wrapper to download and run Hugo binary.

## Contributing

Set up steps:

1. Fork and clone the repo into your ~/Sites/ directory

    ```bash
    git clone git@github.com:<yourgithubname>/mattermost-developer-documentation.git ~/Sites/
    ```

2. Run the server

    ```bash
    cd ~/Sites/mattermost-developer-documentation/site
    ./hugow server -D
    ```

3. Go to http://localhost:1313 to see the running server

4. Make your changes (add a new page/post, modify layouts, etc.) and test against local server

5. Submit a PR
