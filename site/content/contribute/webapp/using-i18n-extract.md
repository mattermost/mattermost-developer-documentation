---
title: "Using make i18n-extract"
heading: "Using make i18n-extract at Mattermost"
description: "This command used for localization allows you to validate that your strings have been successfully extracted from your source code."
date: 2020-04-20T08:31:17-04:00
weight: 7
---

`make i18n-extract` is a command used for localization. It allows you to validate that your strings have been successfully extracted from your source code before you continue.

This page demonstrates how to review your results and to verify if your extraction was successful or not. If the extraction was not successful this page also provides a workaround to correct for this.

NOTE: These steps apply for the `mattermost-webapp` repository only.

1. After you execute `make i18n-extract` you will need to review the results and validate that the strings were either added or removed in the `i18n/en.json` file. 
2. Run  `git diff` and determine if your strings were added or removed in the `i18n/en.json` file correctly. If this was a successful extraction you will have output similar to below:

![image](/img/i18n-extract-1.jpg)

3. However, if you have a string that was not properly extracted you will see an output similar to below. If you executed the `make i18n-extract` at this point nothing would change because the string `"new-text-id"` is not detected as a string that needs to be translated.

![image](/img/i18n-extract-2.jpg)

4. The solution is to tag the string. Do this by using the `"t"` function, shown in the example below:

![image](/img/i18n-extract-3.jpg)

5. At this point you will need to execute the `make i18n-extract` once again and determine if the extraction was successful.  This will generate a message in the `i18n/en.json` file. However, this is not going to extract the "default message", you will have to add this yourself. See example below:

![image](/img/i18n-extract-4.jpg)

NOTE: Be aware that when you use the `"t"` function, only the translation id is extracted. You have to add the translation string in the `i18n/en.json` file manually.

For further discussion about translations or to ask for help, refer to the following Mattermost channels: [Localization](https://community.mattermost.com/core/channels/localization) and [Contributors](https://community.mattermost.com/core/channels/tickets).
