# Recipe

Mattermost recipes are technical posts that show how to use Mattermost alongside other services or demonstrate Mattermost features. The goal of these posts is to provide you with a solution to a specific problem, a discussion about the details of the solution and some tips about how to customize it to suit your needs perfectly.

## Problem

When using the `make i18n-extract` command you may sometimes see unexpected additions or removals after the command execution. Or in some cases you may not see the additions that you expected. It is important to check why.

You want to validate that your strings have been successfully extracted from your source code before you continue. This is a simple recipe illustrating how to review your results and to verify if your extraction was successful or not. If the extraction was unsuccessful this solution also provides a work around to correct this.

{% hint style="info" %}
#### _\(NOTE: The following recipe is for front end users only.\)_
{% endhint %}

1.  After you execute\`make i18n-extract\` you will need to review the results and validate that the strings were either added or removed in the `i18n/en.json` file. 
2.  Run  `git diff` and determine if your strings were added or removed in the `i18n/en.json` file correctly.   If this was a successful extraction you will have output similar to the below:

```text
diff --git a/components/get_link_modal.tsx b/components/get_link_modal.tsx
index ab067a4a2..412db6289 100644
--- a/components/get_link_modal.tsx
+++ b/components/get_link_modal.tsx
@@ -79,6 +79,10 @@ export default class GetLinkModal extends React.PureComponent<Props, State> {
                         id='get_link.copy'
                         defaultMessage='Copy Link'
                     />
+                    <FormattedMessage
+                        id='new-text-id'
+                        defaultMessage='New Text'
+                    />
                 </button>
             );
         }
diff --git a/i18n/en.json b/i18n/en.json
index 99223a690..cd08b432b 100644
--- a/i18n/en.json
+++ b/i18n/en.json
@@ -2906,6 +2906,7 @@
   "navbar.toggle2": "Toggle sidebar",
   "navbar.viewInfo": "View Info",
   "navbar.viewPinnedPosts": "View Pinned Posts",
+  <span style="color:blue">"new-text-id": "New Text" *blue* text</span>"new-text-id": "New Text",
   "notification.dm": "Direct Message",
   "notify_all.confirm": "Confirm",
   "notify_all.question": "By using @all or @channel you are about to send notifications to {totalMembers} people. Are you sure you want to do this?",
```



