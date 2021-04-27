---
title: "Web App"
heading: "Customize the Mattermost Web App"
description: "Learn about customizations to the Mattermost Web App that can be performed when you need to customized branding, functionality or security."
date: 2018-05-20T11:35:32-04:00
weight: 1
---

Customizations to the Mattermost Web App can be performed in cases where you need to customize branding, alter localization strings, or fulfill security requirements that are not immediately offered out-of-the-box.  
  
## Customization steps 
With that in mind, customizing and deploying your Mattermost Web App can be done in a few steps:  

1. Fork the [mattermost-webapp](https://github.com/mattermost/mattermost-webapp) repository and then clone your fork in your local environment.  
```
git clone https://github.com/<yourgithubusername>/mattermost-webapp
```

2. Create a separate branch for your customized version, as it's not recommended to perform them in the `master` branch (more details about that in the next section regarding rebasing).  
```
git checkout -b custom_branch
```
  
3. Perform customization tasks by replacing image assets, changing strings, altering the UI, and whatever else may be necessary. Be mindful not to violate any of the [guidelines on trademark use](https://www.mattermost.org/trademark-standards-of-use/) during this process.

4. Once customization has been completed, build the files that will be used in your deployment.
```
make build
```

5. Create a tarball or zip the files __within__ the `dist` directory.  
```
cd dist
tar -cvf dist.tar *
```

6. In a Mattermost deployment, remove all files seen in the `client` directory (assuming Mattermost was deployed in the `$HOME` directory).  
```
cd ~/mattermost/client && rm -rf *
```

7. Transfer compressed `dist` files inside Mattermost's `client` directory, and decompress it.  
```
tar -xvf dist.tar
```

## Rebasing to latest version
Challenges arise when creating a separate custom branch from an active open-source project like `mattermost-webapp`. As the project gets new commits and pull requests on a daily basis, your custom webapp can quickly become outdated.

To deal with that, you'll need to leverage Git's [interactive rebasing functionality](https://git-scm.com/docs/git-rebase#_interactive_mode) in the following way:

1. Add an upstream with the original `mattermost-webapp` repository.  
```
git remote add upstream https://github.com/mattermost/mattermost-webapp.git
```

2. Update `master` branch to latest upstream commit.  
```
git checkout master
git pull upstream master
```

3. Perform interactive rebase.  
```
git checkout custom_branch  
git rebase -i master
```  
Use `git rebase --continue` after resolving any conflicts that arise during rebase process

4. Push new version back to remote (Note: Rebasing requires that you override previous remote version with a `force` push. Be sure you've tested that your rebase was successful before completing this last command).  
```
git push -f origin custom_branch  
```
