# Recipe

Mattermost recipes are technical posts that show how to use Mattermost alongside other services or demonstrate Mattermost features. The goal of these posts is to provide you with a solution to a specific problem, a discussion about the details of the solution and some tips about how to customize it to suit your needs perfectly.

## Problem

When using the `make i18n-extract` command you may sometimes see unexpected additions or removals after the command execution. Or in some cases you may not see the additions that you expected. It is important to check why.

You want to validate that your strings have been successfully extracted from your source code before you continue. This is a simple recipe illustrating how to review your results and to verify if your extraction was successful or not. If the extraction was unsuccessful this solution also provides a work around to correct this.

{% hint style="info" %}
#### _\(NOTE: The following recipe is for front end users only.\)_
{% endhint %}

1.  After you execute\`make i18n-extract\` you will need to review the results and validate that the strings were either added or removed in the `i18n/en.json` file. 
2. Run  `git diff` and determine if your strings were added or removed in the `i18n/en.json` file correctly.   If this was a successful extraction you will have output similar to the below:

![](.gitbook/assets/image_1.jpg)

1. 
