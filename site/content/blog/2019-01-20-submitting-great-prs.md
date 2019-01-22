---
title: "Submitting Great PRs"
date: 2019-01-20T00:00:00-04:00
---

If you want to submit good pull requests, you need start with our [contribution checklist](https://developers.mattermost.com/contribute/getting-started/contribution-checklist/). Today, that page talks about what to fork, how to style your code, how to write unit tests and where to push your code. Implicit in all of that is the need to write great code, of course!

But this blog post isn't about writing great code, it's about making your pull request a great experience for you and your reviewers.

I still remember my first pull request. I was a co-op student a few days into my first term with a company. This was before the days of GitHub, and for that matter we weren't even using git at the time. I staged my changes and notified my mentor. Without even looking at my code, he sat me down and said something like this, "Jesse, before you ask anyone else to review your code, I want you to review it yourself." He asked me to don the hat of a reviewer, read through my code, make comments just like a real reviewer, and then send those comments back to him.

I am forever grateful to my mentor for shaping my thinking about reviewing code. Having given more than a few reviews since then, let me share some advice, starting with what my mentor taught me:

### 1) Review your own code first.

Be the one to catch styling issues. Be the one to ask, "does this variable name make any sense?" Be the one to identify problem areas and points of confusion. Be the first reviewer.

Now, not everything deserves to be fixed in every pull request. I love to refactor code, but there's a time and a place and fixing a one-line bug isn't usually the time to fix a multi-file, variable naming issue. This leads to my second point:

### 2) Give a great description.

The description on a pull request is your chance to prove to a reviewer that you have the credentials to fix this problem. How? State the problem in your own words:

> This pull request adds new functionality to expose ...

Tell the reviewer why we need to do this:

> With this new functionality, we can fix a longstanding customer issue that ...

You don't need to outline everything your code is doing -- that's what the code is there for -- but this is also your opportunity to point the reviewer in the right direction:

> The trickiest part of this pull request was the `SqlStore` changes, because ...

and also:

> I really wanted to fix the variable names in this file, but it's out of scope for this pull request.

Of course, sometimes you have to fix something else before you can get to the issue at hand. Maybe you decide to bite the bullet and fix that variable name problem because it clarifies the feature you're adding. On to my third point:

### 3) Clean up your history.

Everyone has their own development style. Mine usually consists of mashing the keyboard, then typing:

    git commit -m wip

and repeating this process. Commit early and commit often! It's just easier to undo changes this way while you're actively developing.

But a reviewer doesn't need to see that commit history. As a reviewer myself, I'd want to see one of two things. Either a single squashed commit with all of your changes, or a history breaking up your changes into logical groupings. Put that variable name fix in its own commit, commit your feature change on top of it, and add a note to your PR's description. Your reviewers can then use the commits tab in GitHub to review those changes independently.

Maybe you're the kind of developer that writes a pristine commit history the first time, but most of us rely on `git rebase`. If you aren't familiar with rebasing, it might seem terrifying or magical, but it doesn't need to be: play with it, master it, and use it often. Hands down, it's my favourite feature in git. If you need help getting started here, check out Atlassian's excellent [tutorial on git rebase](https://www.atlassian.com/git/tutorials/rewriting-history/git-rebase).

Keep in mind though that rebasing is something to do before you submit your pull request, not after, and this leads to my last point:

### 4) Avoid Force Pushing

Good git etiquette is avoid force pushing any branch someone else is actively using. A pull request is a branch just like any other, so once you've started that pull request, everything that you push upstream should just be a regular or merge commit. In particular, when merge conflicts arise with `master`, just `git fetch && git merge origin/master`, resolve those conflicts, and push up the resulting merge commit. Resist the urge to rebase anything you've already pushed.

Why? When you rebase, you are effectively replaying a commit history on the top of another commit. But in a pull request, a reviewer wants to see a linear history of your changes from when they started reviewing. Rebasing tends to force a reviewer to start over instead of being able to look at just the newest commits. And then GitHub tends to lose or detach comment threads, making it all but impossible to regain the context from an earlier review.

Note that other open source projects may merge your commit history instead of squashing it as we do here at Mattermost. In that case, I'd recommend checking with the project maintainers and possibly rebasing just before merging to ensure a clean history afterwards.

I hope these four points are useful! Keep in mind, too, that you don't have to be a core committer with Mattermost to review someone else's code. If there's a pull request that interests you and you have some useful context to share, jump in and give a review, and I think you'll appreciate some of these points even better.
