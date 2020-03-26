#!/usr/bin/env bash

set -x
git diff --name-only --diff-filter=A HEAD~1 | grep -E "^site/content/blog/.*.md$" > file.log
FILEADDED=$(cat file.log)
echo "$FILEADDED"
if [ -z "$FILEADDED" ]
then
  echo "nothing added in the .md"
  echo "{}" > mattermost.json
  exit 0
fi
FILENAME=$(grep slug: <"$FILEADDED" | cut -d':' -f 2 | sed 's/^ *//g')
TITLE=$(grep title: <"$FILEADDED"| cut -d':' -f 2 | sed 's/^ *//g')
TITLE=$(echo "$TITLE" | tr -d '"') # fix quoting
AUTHOR=$(grep author: <"$FILEADDED"| cut -d':' -f 2 | sed 's/^ *//g')
AUTHOR_GH=$(grep github: <"$FILEADDED"| cut -d':' -f 2 | sed 's/^ *//g')
echo "{\"username\":\"GitHub Action Notify\",\"icon_url\":\"https://www.mattermost.org/wp-content/uploads/2016/04/icon.png\",\"attachments\":[{\"author_name\":\"$AUTHOR\",\"author_link\":\"https://github.com/$AUTHOR_GH\",\"fallback\":\"New Blog Post! Check out [here](https://developers.mattermost.com/blog/)\",\"color\":\"good\",\"title\":\"$TITLE\",\"text\":\"New Blog Post! Check out [here](https://developers.mattermost.com/blog/$FILENAME)\"}]}" > mattermost.json
