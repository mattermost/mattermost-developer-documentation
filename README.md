# Mattermost Developer Documentation [![Mattermost dev docs status badge](https://circleci.com/gh/mattermost/mattermost-developer-documentation.svg?style=svg)](https://circleci.com/gh/mattermost/mattermost-developer-documentation/tree/master)

Website for Mattermost developer documentation, built using [Hugo](https://gohugo.io/). Master is continuously deployed to [developers.mattermost.com](https://developers.mattermost.com/).

## Contributing

Set up steps for Mac OS X:

1. Install Hugo
```
brew install hugo
```

2. Fork and clone the repo into your ~/Sites/ directory
```
git clone git@github.com:<yourgithubname>/mattermost-developer-documentation.git ~/Sites/
```

3. Run the server
```
cd ~/Sites/mattermost-developer-documentation/site
hugo server -D
```

4. Go to http://localhost:1313 to see the running server

5. Make your changes (add a new page/post, modify layouts, etc.) and test against local server

6. Submit a PR
