---
title: "Avoiding Common Internationalization Mistakes"
slug: common-i18n-mistakes
date: 2020-03-26T12:00:00-05:00
categories:
    - "i18n"
author: Harrison Healey
github: hmhealey
community: harrison
---

Languages are complicated, and every language is complicated in different ways that can be hard to understand. Some form words from multiple characters while others have symbols that represent entire concepts. Some features words without pluralization or gender and rely on context for that while others have two or more genders for words. Some are very phonetic while others pronounce words seemingly at random (*cough* English, though *cough*).

Thanks to a tremendous contribution from then community member Elias Nahum long ago, we have full support for translation throughout Mattermost, and thanks to our community of translators, Mattermost is usable by many people speaking a variety of different languages.

Because we support so many languages now, we have to be aware of how to keep our applications properly translatable. There's many easy mistakes you can make when writing an application in one language that can make it difficult to translate into others. We use [react-intl](https://formatjs.io/docs/react-intl/) in our client-side applications and [go-i18n](https://github.com/nicksnyder/go-i18n) on the server which both offer a variety of tools to help with this, but we still run into issues occasionally that they can't fix. Here's a few examples of problems that we've run into and how to solve them.

## Mistake 1: Not translating something at all

This one is definitely the easiest to avoid, but it can particularly catch people who aren't used to using a system like we have.

The easiest way for this to happen is if someone simply forgets to add a translation for something. For example, suppose someone is adding a new button to the web app using React. It's easy enough to just write

```jsx
function MyButton() {
    return <button>{'Click me!'}</button>;
}
```

without realizing that some additional work needs to be done to make it translatable.

```jsx
import {FormattedMessage} from 'react-intl';

function MyButton() {
    return (
        <button>
            <FormattedMessage
                id='my_button.label'
                defaultMessage='Click me!'
            />
        </button>
    );
}
```

In this case, we're using react-intl's `FormattedMessage` component to do the translation for us. It ends up being a bit longer, but that's worth it for making the app usable by everyone.

## Mistake 2: Hard coding translations

This one occurs less often, but it comes from a real-world example in Mattermost.

When you reply to an older message in Mattermost, we display "Commented on Billy's message:" to tell the user what you're responding to, but for a while after we had translation support added, the code for that looked like this:

```jsx
let username = '@' + rootPost.username;
if (!username.endsWith('s')) {
    username += '\'s';
}

return (
    <FormattedMessage
        id='post.commentedOn'
        defaultMessage='Commented on {username} message:'
        values={{username}}
    />
)
```

Here, we're using react-intl to add the user's username into the message as a value, but we're making a mistake here by trying to make the username into a possessive adjective. By manually adding the "'s", we're applying English grammar regardless of the user's language setting, so in other languages, we're adding text that doesn't make sense.

We solved this by moving the "'s" into the translation string. That required changing our grammar rules to add "'s" to the end of names that end in the letter S, but that's still correct by some grammar guidelines. Isn't English great?

```jsx
return (
    <FormattedMessage
        id='post.commentedOn'
        defaultMessage="Commented on @{username}'s message:"
        values={{username: rootPost.username}}
    />
);
```

## Mistake 3: Incorrect pluralization

Another common mistake is to forget that pluralization exists or to attempt to avoid it by adding (s) to the end of a word. While the latter is technically correct, it doesn't look very nice, and thankfully, our translation libraries can help us out there.

Say you want to write something that sends an email to a list of any number of people, and you want it to report back on its progress as it sends those email in both the UI and in the server's logs.

```jsx
return (
    <FormattedMessage
        id='email_sender.remaining'
        defaultMessage='{remaining, number} email(s) remaining.'
        values={{remaining}}
    />
);
```

```go
/*
    The translation file contains:
    {
        "id": "app.email_sender.remaining",
        "translation": "{{.Remaining}} email(s) remaining"
    }
*/

func logEmailsRemaining(remaining int) {
    log.Print(translateFunc("app.email_sender.remaining", map[string]interface{}{
        "Remaining": remaining,
    }))
}
```

Note that the React example specifies that `remaining` is a number since otherwise zero would be treated as an empty string because it's falsey.

As mentioned before, these are both technically correct since they add the number of remaining emails to the right place, but they both look ugly. Instead, both libraries support pluralization by passing in a count of some object which is the number of remaining emails in this case.

```jsx
return (
    <FormattedMessage
        id='email_sender.remaining'
        defaultMessage='{remaining, number} {remaining, plural, one {email} other {emails}} remaining.'
        values={{remaining}}
    />
);
```

```go
/*
    The translation file contains:
    {
        "id": "app.email_sender.remaining",
        "translation": {
            "one": "{{.Remaining}} email remaining",
            "other": "{{.Remaining}} emails remaining"
        }
    }
*/

func logEmailsRemaining(remaining int) {
    log.Print(translateFunc("app.email_sender.remaining", remaining, map[string]interface{}{
        "Remaining": remaining,
    }))
}
```

In both cases, we're defining different translation strings based on the value of remaining. react-intl lets you change how just part of the string is translated as opposed to go-intl which swaps out the entire string, but the result is the same either way.

Since different languages provide different translation data, translators are free to handle pluralization differently as their language requires.

## Mistake 4: Concatenating translated strings

This last mistake is one we encounter more often, and it's one that's a bit harder to solve because it requires using some more complicated techniques that even we haven't adopted everywhere yet. It also takes a bit longer to describe the problem we can encounter here.

Suppose you have a popup which contains some helpful information as well as a link to further documentation. It probably ends with the sentence "[Click here](https://mattermost.com) for more information." where "Click here" is a link. You might just write this as

```jsx
return (
    <>
        <a
            href='https://mattermost.com'
            rel='noreferrer'
            target='_blank'
        >
            <FormattedMessage
                id='popup.clickHere'
                defaultMessage='Click here'
            />
        </a>
        {' '}
        <FormattedMessage
            id='popup.forMoreInformation'
            defaultMessage='for more information.'
        />
    </>
);
```

but that may not work in all langauges. For example, other languages may invert the sentence structure to be more like "For more information, click here" or they may not include the same space between words like in Chinese.

Instead, you can pass in values like above to help construct the translation string in a way that lets translators rewrite the entire sentence. There's a few ways to do this that we've been iterating and improving on, so I'm going to present them separately and talk about why the final method is likely the best.

### Solution 1: React elements as values

This technique has us pass the link with its text as a value into another translation string that represents the whole sentence.

```jsx
return (
    <FormattedMessage
        id='popup.moreInformation'
        defaultMessage='{link} for more information.'
        values={{
            link: (
                <a
                    href='https://mattermost.com'
                    rel='noreferrer'
                    target='_blank'
                >
                    <FormattedMessage
                        id='popup.moreInformation.link'
                        defaultMessage='Click here'
                    />
                </a>
            ),
        }}
    />
);
```

You'll often see this used in older Mattermost code to solve this problem. It allows us to add more complex formatting within translated text without making it impossible to translate, but it does make it harder for translators to understand the meaning of the text. They need to spend time reconstructing the entire string which may be difficult. It also makes the code more complicated to read since developers have to worry about more React elements.

### Solution 2: FormattedHTMLMessage

`FormattedHTMLMessage` is another helper provided to us by `react-intl`. It lets us include HTML in the translation string to format the text.

```jsx
// import {FormattedHTMLMessage} from 'react-intl';

return (
    <FormattedHTMLMessage
        id='popup.moreInformation'
        defaultMessage='<a href="https://mattermost.com" rel="noreferrer" target="_blank">Click here</a> for more information.'
    />
);
```

Again, this allows translators to reconstruct the sentence however they need, but it comes with a few downsides such as:
1. Translators need to understand HTML more, including more complicated things like the extra parameters on the `a` tag.
2. It adds the chance that an incorrect translation could break part of the application by accidentally including malformed HTML within a string
3. It also has potential performance negatives since we're going outside of React's DOM manipulation optimizations by using raw HTML
4. We lose the ability to wrap parts of the string in React elements which can have more functionality, such as encapsulating the additional parameters passed into `a` tag.

For those reasons, you won't see this one used in Mattermost any more since it has been replaced by our own similar component.

### Solution 3: FormattedMarkdownMessage

`FormattedMarkdownMessage` was added by another one of our team members, Martin Kraft, as a safer and slightly simpler alternative to `FormattedHTMLMessage`. Instead of the translator needing to understand the complexities of HTML, they can instead use Markdown which is generally simpler.

```jsx
// import {FormattedMarkdownMessage} from 'components/formatted_markdown_message';

return (
    <FormattedMarkdownMessage
        id='popup.moreInformation'
        defaultMessage='[Click here](!https://mattermost.com) for more information.'
    />
);
```

Much simpler! It does require some knowledge to add the extra exclamation mark that tells `FormattedMarkdownMessage` to open a link to open in a new window, but there's a lot less overhead required there. That said, this formatting is even more limited than the previous options, and it may have minor performance issues due to having to parse Markdown.

This technique is used frequently throughout our apps, and until recently, I'd consider it to be the best way of doing this, but we've recently upgraded react-intl which has added support for something that I think is even nicer.

### Solution 4: Rich text formatting in react-intl v3

Instead of having to either pass in React elements as values or having to write out HTML or Markdown within the translation string, react-intl v3 now supports rich text formatting within the translation string. To do this, you can construct a HTML-like string such as `<link>Click here</link> for more information.` using any sort of custom label such as link, and then the code can define what that means without the translator having to worry about the defails.

```jsx
return (
    <FormattedMessage
        id='popup.moreInformation'
        defaultMessage='<link>Click here</link> for more information.'
        values={{
            link: (msg) => (
                <a
                    href='https://mattermost.com'
                    referrer='noreferrer'
                    target='_blank'
                >
                    {msg}
                </a>
            ),
        }}
    />
);
```

The code ends up looking mostly like the first solution, but a function is now passed in as the `link` value instead and, most importantly, the translated string is now all in one piece.

This gives us the most power when formatting a translated string without complicating the lives of our translators since we can once again style parts of the string with custom React elements. For example, if we had an `ExternalLink` component that encapsulated the extra parameters passed to the `a` tag, we could clean the code up a bit more.

```jsx
return (
    <FormattedMessage
        id='popup.moreInformation'
        defaultMessage='<link>Click here</link> for more information.'
        values={{
            link: (msg) => <ExternalLink href='https://mattermost.com'>{msg}</ExternalLink>,
        }}
    />
);
```

## Closing Thoughts

Hopefully, we can do our best to avoid making translations completely impossible by avoiding most of these mistakes going forward while also finding more ways to reduce the workload on our translators, even as Mattermost grows and the amount of text that needs to be translated increases.

Special thanks again to everyone who has helped translate Mattermost and make it usable by more people around the world. We tremendously appreciate your efforts and all the work you put in to make sure the translations stay up to date.

If you're interested in helping out with localization or if you have any suggestions for how to improve our process, feel free to join us in the `~localization` channel on the Mattermost community server at https://community.mattermost.com.
