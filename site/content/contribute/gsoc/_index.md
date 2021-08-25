---
title: "Google Summer of Code"
description: "Ideas list for Google Summer of Code"
---

# GSoC 2021 Ideas

**Note**: Mattermost was **not** selected as an organization for Google Summer of Code 2021. All that follows is kept here for historical reasons. Hopefully, we'll be able to use some of the ideas in 2022.

For those of you who don’t know, Google Summer of Code is a program that connects students and open source organizations. Following a selection process, students spend ten weeks of their summer break contributing to an open source project. The students are mentored by experienced contributors from each organization, and students receive a stipend from Google as compensation for their time.

To make this a successful experience, we've prepared a list of interesting ideas that have real-world application, require cross-functional collaboration, and that are flexible in terms of output.

In order to achieve your Google Summer of Code goals this summer, we have an excellent team of people ready to support and guide you:

-   Four Software Design Engineers who will provide technical mentorship for the projects:
    -   Devin Binnie ([@devin.binnie](https://community.mattermost.com/core/messages/@devin.binnie))
    -   Daniel Espino García ([@daniel.espino.garcia](https://community.mattermost.com/core/messages/@daniel.espino.garcia))
    -   Alejandro García Montoro ([@alejandro.garcia](https://community.mattermost.com/core/messages/@alejandro.garcia))
    -   Martin Kraft ([@martin.kraft](https://community.mattermost.com/core/messages/@martin.kraft))
-   A Product Manager who will provide guidance, direction, and support across all of the projects:
    -   Eric Sethna ([@eric.sethna](https://community.mattermost.com/core/messages/@eric.sethna))
-   Two Organizational Administrators:
    -   Emily Cook ([@emily.cook](https://community.mattermost.com/core/messages/@emily.cook))
    -   Alejandro García Montoro ([@alejandro.garcia](https://community.mattermost.com/core/messages/@alejandro.garcia))

If you are [eligible to participate as a student](https://summerofcode.withgoogle.com/get-started/), take a look at the list of product enhancement ideas below, then make sure to check back on March 9, 2021 to see whether Mattermost is among the selected organizations participating in the Google Summer of Code!
Join the [Google Summer of Code 2021 channel](https://community-daily.mattermost.com/core/channels/google-summer-of-code-2021), where we are centralizing all communication related to this exciting program.
If Google selects Mattermost to participate in this program, you will need to send your student proposals to [gsoc@mattermost.com](mailto:gsoc@mattermost.com). We hope to be able to share additional program details in the coming weeks!

Here’s a sneak peek of what’s coming next:

-   March 9: Google Summer of Code organizations are announced
-   March 29 - April 13: Students apply to the program
-   April 13 - May 17: Student applications are reviewed
-   May 17: Selected student projects are announced
-   May 17 - June 7: Community bonding
-   June 7 - August 16: Coding

Make sure to take a look at [the full Google Summer of Code timeline](https://summerofcode.withgoogle.com/how-it-works/#timeline) for more details!

## Ideas list

### Core features

All ideas in the *Core features* category propose direct changes to the Mattermost product, either within the server, or within the web client.

#### TypeScript definitions from Go code

Declaring the same data model in both sides of a web application is an old problem. In our case, the data structures in the server are declared in Go, while those same models are defined in the client side in Typescript. Although the relation is not always one to one, there are lots of places where we could leverage an automatic creation of Typescript types from a struct in Go. A tool for this would make the lives of all our contributors much easier.

The main idea in this project is to investigate the existing solutions to this problem, try to find the best tool that suits the needs of the project, then implement it. A nice-to-have feature in this tool would be a way of not only defining the types, but of keeping them synchronized.

-   **Expected outcomes**: Implement a build tool to generate Typescript types from Go structs.
-   **Skills required**: Typescript, Go
-   **Difficulty**: Medium
-   **Mentors**: Martin Kraft, Devin Binnie

#### Custom keyboard shortcuts

Mattermost is built for developers. And we developers _love_ to use keyboard shortcuts. While both the web and the desktop applications have support for a wide variety of shortcuts, they are currently hardcoded in the product. Have you ever tried to agree with another developer on the best shortcut for any action? We have tried, and had dozens of arguments along the way.

That's why we have this project! We need a system to customize keyboard shortcuts on a per user basis. The main idea is to implement a new entry in **Account Settings** that enables users to override the default shortcuts with custom shortcuts. We need to find a way to handle shortcuts collisions, and to default to the original shortcuts if no custom shortcuts are defined.

The design of the UI and UX to define the shortcuts will be done in conjunction with the UX team to ensure that the project follows Mattermost design guidelines.

-   **Expected outcomes**: Implementation of a new user setting to customize keyboard shortcuts.
-   **Skills required**: React
-   **Difficulty**: Easy
-   **Mentors**: Alejandro García Montoro

#### Username aliases

Users in Mattermost have a single username. I can be `@joe` on my own local server, and if I want, I can change my username permanently to be `@jon.doe`. But what if I want to be both `@joe` and `@jon.doe` at the same time? Right now, that's not possible.

This project proposes to add username aliases. While each user would have a primary username (to support cases such as identity provider compatibility), a user could define a set of aliases that would work in the exact same way that their primary username does now. Messages containing the aliases would generate notifications, and those notifications would display when opening the recent mentions. Clicking on an alias would open the user's profile popover, and for end users, aliases would behave exactly the same way as normal mentions.

For this project, the student will be asked to implement a new entry in **Account Settings**, as well as add persistence of the data in the server while properly resolving the aliases in all situations where a username is involved.

-   **Expected outcomes**: Implementation of a new user setting and the infrastructure needed to support username aliases.
-   **Skills required**: React, Go
-   **Difficulty**: Hard
-   **Mentors**: Alejandro García Montoro

#### Do Not Disturb improvements

Mattermost has four different values for user status: Online, Away, Do Not Disturb, and Offline.

One of the most interesting in terms of functionality (or lack thereof!) is Do Not Disturb, as it silences all the notifications while it is enabled. There is room for improvement around this feature. This project has several independent tasks that can be implemented by the student in any order:

1. Ability to enable Do Not Disturb automatically based on the user's working hours set in **Account Settings**. This task would include adding the ability to set working hours, and adding the ability to enable Do Not Disturb automatically based on the user's working hours. A user's specified working hours could also be displayed in the user's profile popover.
2. Ability to override a user's Do Not Disturb mode for important messages. The sender would see a note above the text input area that reads "User X is in Do Not Disturb. Notify them anyway?". Selecting "Notify them anyway" send a special notification type that says "User X is trying to reach you". We would want to limit the number of overrides sent to a user in Do Not Disturb mode.
3. Send push and desktop notification summaries when users come out of Do Not Disturb mode. When a user returns online after being in Do Not Disturb mode, this feature could send a digest push and desktop notification such as "You missed X Direct Messages and 5 channel mentions while in Do Not Disturb".

-   **Expected outcomes**: Implementation of the backend and frontend features for at least two out of the three tasks listed.
-   **Skills required**: React, Go
-   **Difficulty**: Medium
-   **Mentors**: Alejandro García Montoro, Eric Sethna

#### Control link previews in posts

When a message contains a URL, a preview of the linked content is shown in the post. There are situations when a plugin or an app may post several messages, each of them with a different link. This causes the channel to fill quickly with link previews. This project tries to improve this poor user experience with two different tasks:

1.  Modify the endpoint [`POST /posts`](https://api.mattermost.com/#tag/posts/paths/~1posts/post) in the REST API to add a property that would let the submitter control whether the posted message will contain a preview of the link in the post. This information needs to be properly communicated to the client for the preview to be enabled or disabled.
2.  Implement a new feature, probably modifying the [`PUT /posts`](https://api.mattermost.com/#tag/posts/paths/~1posts~1{post_id}/put) endpoint, to dynamically enable and disable the preview of the links in specific, existing posts.

This project is open to ideas that should be reflected in the student proposal.

-   **Expected outcomes**: Design of the feature, modification of the endpoint to implement it, and implementation of the dynamic toggling of the preview, both in the backend and the frontend.
-   **Skills required**: React, Go
-   **Difficulty**: Easy
-   **Mentors**: Daniel Espino García, Alejandro García Montoro

#### Add the concept of *Importance* to messages

The importance of a message is subjective and varies greatly, depending on the content, the sender, the receiver, or even the channel where it is being shared. However, there is no functional difference between such messages, and the application regards them as having equal importance today. This can be a problem in several situations. For example, imagine users in different time zones or users that are on vacation -- when these users are back online, they could be easily overwhelmed with the number of unread messages and notifications. There are also situations where you want to send a low priority message that does not need the immediate attention of the recipient. And others where you need a quick response or, at least, an acknowledgment.

This project is an exploratory one to investigate how to incorporate the concept of importance to messages, adjust the level of notifications on the receiver's end, and possibly implement a proof of concept for acknowledging a message. At Mattermost, we use the ACK emoji to acknowledge messages. Perhaps this could be implemented as a standard feature. What would this workflow look like? What makes sense from both the sender's and the receiver's perspective?

This project is open to ideas that should be reflected in the student proposal.

-   **Expected outcomes**: Design of the feature, implementation proof of concept, and if there is time, implementation of the feature to acknowledge important messages.
-   **Skills required**: React, Go
-   **Difficulty**: Hard
-   **Mentors**: Daniel Espino García, Alejandro García Montoro

### Plugins

Plugins are a standard way of extending Mattermost without modifying the product itself. Plugins are web applications whose server directly talks to the Mattermost server, and whose web component is injected into the Mattermost web application.

While some of the proposed plugins will require a change within the plugin infrastructure, many of the plugin ideas are flexible, as they are not direct modifications to the product itself, but independent pieces of software that users can decide to install and enable.

#### Spotify plugin

There are tons of integrations that are potentially useful for our users. One that seems to be asked for quite a lot is an integration with Spotify. There are several features that we would like to see in such a plugin, but the development of this idea is open to the interests of the student:

-   Share what the user is listening to in a pre-defined channel.
-   Add a new section to the profile popover that shows the current song being played.
-   Add player controls inside Mattermost: Location to be decided, but we would love to control what we are listening to without ever leaving Mattermost.
-   Collective playlist with all the songs shared to a channel.

This project is open to ideas that should be reflected in the student proposal.

-   **Expected outcomes**: A new plugin to integrate Spotify with Mattermost.
-   **Skills required**: React, Go
-   **Difficulty**: Medium
-   **Mentors**: Alejandro García Montoro

#### Quote plugin

When we are writing in a busy thread, and we want to answer a specific post, there's an unwritten rule that says that you should prepend your post with a quote of that message and format it as a quote with the usual Markdown syntax. This is a manual process, and as such, it gets skipped. But what if we could automate it?

This project has that simple purpose: implement a new plugin that would add a new entry, `Quote`, to the post menu that would copy the corresponding post in the input box, and properly format it by prepending it with `> `. The plugin should never delete the current text in the input box, and only add the quoted block of text.

Currently, plugins aren't able to modify the input box, so the first and most important task in this project would be to change the plugin API to support such a feature. These architectural changes are valuable in themselves, so a project that would only deliver this would be considered successful. However, if the student finishes this task before the coding period ends, the next task would be to actually implement the quote plugin, using the new functionality as a basis for it.

-   **Expected outcomes**: The infrastructure changes for letting plugins modify the input box. If there is time, a new plugin that adds the quoting feature.
-   **Skills required**: React
-   **Difficulty**: Medium
-   **Mentors**: Daniel Espino García, Alejandro García Montoro

#### Timed reminders on specific posts

Often we read an interesting message but don't have time to process it at that moment. Some of us use the "Mark as unread" feature or the TODO plugin for this, but it would be valuable to have a feature that reminds us of a specific message after an elapsed period of time, such as after 30 minutes, one hour, or the next day.

This project is focused around that specific feature, and the goal is to build a new plugin that adds a new entry to the post menu that enables users to select a reminder time for the post. The community has already started development on this, but it was never finished, so this is an opportunity to bring back that work and take it to the finish line while better defining its scope and usability in the process.

-   **Expected outcomes**: A new plugin to add timed reminders to posts.
-   **Skills required**: React, Go
-   **Difficulty**: Easy
-   **Mentors**: Alejandro García Montoro, Eric Sethna

#### Active call banner

There are several plugins in Mattermost that integrate the product with video conference software such as Jitsi or Zoom. When a user starts a meeting, a message is automatically posted to the channel inviting other users to join. This post is then edited when the meeting ends, displaying the length of the meeting. However, the plugin post can get buried in the channel as other messages are posted.

This project tries to overcome this problem by adding an always visible banner to the channels where there is an active meeting.

The banner should be displayed when there's an active video call, either in Jitsi or Zoom. Clicking the banner would let the user automatically join the call, and it would display information about the meeting itself: the number of participants, current run time, and whether it's in Jitsi or Zoom. This idea should be discussed with the UX team to come up with a design that could be similar to the "x new messages" that appears in an unread channel.

-   **Expected outcomes**: Design of the feature: will it be a plugin of its own, or a modification of the Zoom and Jitsi plugin? Implementation of the banner for both cases.
-   **Skills required**: React
-   **Difficulty**: Easy
-   **Mentors**: Daniel Espino García, Alejandro García Montoro

### Apps

Mattermost was designed from the very beginning to be extensible. Up until now, plugins were the main way (along with incoming and outgoing webhooks and slash commands) of integrating third-party services into the product. While they have been extremely powerful and successful, we are investigating new ways of letting developers extend Mattermost functionality.

The result of that investigation is the concept of Apps: a new way to integrate external services into Mattermost.

#### App Form Fields

One of the interaction points with Apps are Apps Forms. Apps Forms allow the user to introduce information to send to the App. Right now, we support some basic fields in the forms, like text, bools, or select but we would like to add more complex types and interactions, like date picker, time picker, lists, or checkbox tables.

Apps are designed with mobile support as a first class citizen, so every new form implemented has to support both the web application and the mobile apps.

This project will be developed in close collaboration with the UX team to better define each individual interaction.

-   **Expected outcomes**: The design and implementation of at least two new form fields. This project can be adapted to the student to implement as many form fields as desired.
-   **Skills required**: React, React Native
-   **Difficulty**: Medium
-   **Mentors**: Daniel Espino García, Alejandro García Montoro

#### Apps Locations

One of the ways Mattermost can interact with the new Apps is through the App Locations: Specific locations in the UI (both in the web application and the mobile apps) that can be attached to an action handled by the App. Current locations include buttons in the channel header and the post menu.

The goal of this project is to consider and add other locations, like entries in the main menu, additions to the channel menu, or additions to the configuration menu.

One particularly interesting location to consider adding is one to support audio rooms. There has been a lot of interest in supporting audio rooms in Mattermost, similar to the ones in Discord. There are some proofs of concept, both for Lyno and Mumble, but they are based on hacks to modify the UI of the product. This location would allow an app to host an audio-only chat room in Mattermost, and display that room on the channel sidebar, displaying the current status of the room.

This project will be developed in close collaboration with the UX team to better define each individual location.

-   **Expected outcomes**: The design and implementation of at least two new locations. This project can be adapted to the student to implement as many locations as desired.
-   **Skills required**: React, React Native
-   **Difficulty**: Medium
-   **Mentors**: Daniel Espino García, Alejandro García Montoro

### Bring your own idea

If none of the ideas in this list speak to you, you can always propose your own idea!

Maybe you’ve been wanting to build a specific plugin for a while, you have an amazing core feature in mind that would bring the product to a whole new level, or you want to deep dive into the performance of the server to further optimize it.

Ideas proposed by students are more than welcome, so don’t hesitate to send them our way! As with all the other projects, proposals need to fit in the overall philosophy of the project. Our Product Management team reviews each idea prior to approval, and we can always discuss the details with the whole team if we decide to move forward with it.
