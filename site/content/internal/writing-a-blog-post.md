---
title: Writing a Blog Post
date: 2019-02-06T14:28:35-05:00
section: internal
weight: 105
---

Went to a conference recently? Worked on something cool? Got something else Mattermost-related you want to post about? Follow these steps to write a blog post:

1. Clone https://github.com/mattermost/mattermost-developer-documentation 
2. Create a new .md file in the [/site/content/blog/](https://github.com/mattermost/mattermost-developer-documentation/tree/master/site/content/blog) folder
  - Use `YYYY-MM-DD-<your-blog-post-title>.md` as the filename

3. Paste this template into your file

   ```
   ---
   title: <user readable title of your blog post, e.g. My Blog Post>
   slug: <URL name of your blog post, e.g. my-blog-post>
   date: YYYY-MM-DDT12:00:00-04:00
   author: <FirstName LastName>
   github: <your GitHub username>
   community: <your community.mattermost.com username>
   ---

   <intro to blog post>

   #### <some heading>
   <some content>

   #### <another heading>
   <some more content>
   ```

4. Write your blog post!
5. Submit a pull request to https://github.com/mattermost/mattermost-developer-documentation and assign two dev reviews and an editor review from @amyblais
6. Once merged it should show up on [developers.mattermost.com/blog](https://developers.mattermost.com/blog) within 10-15 minutes. When it shows up, post about it in the Developers channel on community.mattermost.com!

Looking for examples? The [/site/content/blog/](https://github.com/mattermost/mattermost-developer-documentation/tree/master/site/content/blog) folder has a bunch!
