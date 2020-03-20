# Locally Working with Sphinx
#### A short guide to working offline with Read The Docs and Sphinx on a local machine.


## Introduction

Writing quality documentation is a great way to enable a wide audience to benefit from ones product. I am a technical writer here at Mattermost and I have been working as developer, sys admin, designer, support engineer and in development operations. I also write fiction in my free time.

As I always try to maximize my productivity I've started to love text editors like Atom, Emacs, Neovim, Vim and Visual Studio Code for their extensibility. I can work on all my different projects - developing in a language of my choice or writing in Markdown, LaTeX or reStructured Text - with the same shortcuts, macros and plug-ins.

> ***NOTE:*** *As there are as many levels of knowledge as there are people, writing a guide with just the perfect level of detail is all but impossible. In an attempt to keep this short while including beginners, I will break down the setup process into four parts, so you can choose the ones you need.*

## Expectations

You want to write documentation for Read The Docs with Sphinx or a compatible project on a local machine with an automated preview. Your editor will be Visual Studio Code with an english spellchecker plug-in and a reStructured Text Linter.

Following the guide from start to finish will take about 20 minutes.

___

## Part I - Installing Software

We need to install some software in addition to Visual Studio Code to satisfy all requirements for the setup. I will provide links to the product pages but I advise to use your package manager for installation. 

> ***Note:*** *If your operating system of choice is MS Windows I recommend using [Chocolatey](https://chocolatey.org) as package manager.*

Install current versions of the following:

1. [Visual Studio Code](https://code.visualstudio.com) - installation recommendation: use your systems package manager
2. [git](https://git-scm.com) - installation recommendation: use your systems package manager
3. [Python3](https://www.python.org) - installation recommendation: use your systems package manager and make sure [pip](https://pip.pypa.io/en/stable/) is installed along
4. [Sphinx](https://www.sphinx-doc.org) - installation recommendation: use pip with `pip install sphinx sphinx-autobuild`
5. [rstcheck](https://github.com/myint/rstcheck) - installation recommendation: use pip with `pip install rstcheck`

___

## Part II - Installing Plug-Ins

Visual Studio Code comes with GitHub integration, so all that is needed for a seamless workflow is a spellchecker, a linter and some way to preview our work. Code Spell Checker will do the former while reStructuredText will do the rest. 

To install these plug-ins open the extension marketplace in Visual Studio Code by pressing `Ctrl + Shift + X`, entering the name of the plug-in and then selecting install.

- [Code Spell Checker](https://github.com/streetsidesoftware/vscode-spell-checker/blob/master/packages/client/README.md)
- [reStructuredText](https://github.com/vscode-restructuredtext/vscode-restructuredtext)

The spellchecker will work out of the box, the reStructured Text plug-in will need some configuration once the workspace has been set up.

___

## Part III - GitHub Setup

Now that all the software has been installed we need to get our copy of the Mattermost documentation and create a workspace for it.

### SSH Key

First of all you need to create an SSH key and associate it with your GitHub account. If you have an SSh key already feel free to use it for GitHub or make sure to back it up before proceeding.

1. Generate SSH key: 
   - Linux: 
     1. Open a Terminal
     2. Type `ssh-keygen`, hit `Return` and follow the instructions on the display. 
   - Windows: 
     1. Open the Start Menu
     2. Type `Git CMD` and hit `Return`
     3. Type `ssh-keygen`, hit `Return` and follow the instructions on the display.
2. Copy SSH key:
   1. Navigate to your user folder (Linux: ~/ , Windows: %UserProfile%)
   2. Open the folder .ssh
   3. Open the file ending in .pub (e.g. `id_rsa.pub`) with a text editor of your choosing
   4. Copy its contents to the clipboard
3. Add SSH key to GitHub:
   1. Create an account on [GitHub](https://github.com/) and log in or feel free to use an existing account.
   2. Navigate to [https://github.com/settings/keys](https://github.com/settings/keys)
   3. Select `New SSH key`, select a title and paste the content from the clipboard to the field called `key`
   4. Select `Add SSH key`

> ***Note:*** *Under 2.3 do* ***NOT*** *use the file without the .pub extension, as this would be your private key.*

### Clone Repository

In Visual Studio Code press `Ctrl + Shift + P` and type `clone`. This will highlight `Git: Clone`, press `Return`. Use `git@github.com:mattermost/docs.git` as repository URL. 

Select the folder you want to store the Mattermost documentation repository in and wait for the download to finish. Once it's done select Add to Workspace at the bottom right.

___

## Part IV - Configuring Plug-Ins

All thats left to do now is configuring the reStructured Text plug-in to build in your current workspace.

1. Create a folder named `.vscode` in the workspace root.
2. Create a file called `config.json` in that folder and add this
   ```json
   {
      "restructuredtext.builtDocumentationPath" : "${workspaceRoot}/build/html",
      "restructuredtext.confPath"               : "${workspaceFolder}/source",
      "restructuredtext.updateOnTextChanged"    : "true",
      "restructuredtext.updateDelay"            : 300
   }
   ```

When you now open a .rst document and hit `Ctrl + Shift + R` it will build the entire sphinx project and display the result in a new editor tab.

> ***Note:*** *Depending on your hardware the build process can take up to a few minutes.*

Well done, you're now able to write the docs. *Let's be about it!*
