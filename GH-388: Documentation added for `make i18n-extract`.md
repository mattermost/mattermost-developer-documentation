Mattermost recipes are technical posts that show how to use Mattermost alongside other services or demonstrate Mattermost features. The goal of these posts are to provide you with a solution to a specific problem, a discussion about the details of the solution and some tips about how to customize it to suit your needs perfectly.

## Problem

When using the `make i18n-extract` command you may sometimes see unexpected additions or removals after the command execution. Or in some cases you may not see the additions that you expected. It is important to check why.

You want to validate that your strings have been successfully extracted from your source code before you continue. This is a simple recipe illustrating how to review your results and to verify if your extraction was successful or not. If the extraction was not successful this solution also provides a work around to correct this.

{% hint style="info" %}
### _\(NOTE: The following recipe is for front end users only.\)_
{% endhint %}

1. After you execute\`make i18n-extract\` you will need to review the results and validate that the strings were either added or removed in the `i18n/en.json` file. 
2. Run  `git diff` and determine if your strings were added or removed in the `i18n/en.json` file correctly.   If this was a successful extraction you will have output similar to the below:

![](.gitbook/assets/image_1.jpg)

3. However, if you have a string that was "not properly extracted" you will see output similar to the below.  If you executed the```make i18n-extract``` at this point nothing would change because the string `"new-text-id"` is not detected as a string that needs to be translated.

![](.gitbook/assets/image_2.jpg)

4.The  solution is to "tag" the string.  We do this by using the `"t"` function, shown in the below example:

![](.gitbook/assets/image_3.jpg)

5. At this point you will need to execute the```make i18n-extract``` once again and determine if the extraction was successful.  This will generate a message in the `i18n/en.json` file.  However this is not going to extract the "default message", you will have to add this yourself.  See example below: 

![](.gitbook/assets/image_4.jpg)

{% hint style="danger" %}
 Be aware when you use the `"t"` function, only the translation id is extracted.  You have to add the translation string in the  `i18n/en.json`  file manually
{% endhint %}

## **Discussion**

 For further discussion about translations or to ask for help, refer to the following Mattermost channels:   
 [Localization](https://community.mattermost.com/core/channels/localization) and [Contributors](https://community.mattermost.com/core/channels/tickets).

