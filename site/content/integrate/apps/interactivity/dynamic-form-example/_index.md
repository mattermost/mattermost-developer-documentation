---
title: "Dynamic Form Example"
heading: "Dynamic Form Example"
description: "This guide explains how to provide dynamic values to forms, as well as how to show a new or modified form upon submission"
weight: 5
---

### Overview

Each of these examples will be using a modal form to help the user create a ticket in an external system such as Jira or Zendesk. The form will get a little more complex in each example. In this guide we'll cover:

- How to render an item in the post dot menu.
- How to open a modal when the post menu item is clicked
- How to create a form with:
    - Text fields
    - Static select fields
    - Dynamic autocomplete select fields
- How to redefine the form based on user interaction
- Using `context` and `expand`:
    - How to access the associated post after interacting with the post menu
    - How to access other entities in the user's context such as the current `Team` or `Channel`

### Setup

These examples assume you have a Node.js App set up using [express](https://github.com/expressjs/express), like the [quick start example]({{< ref "quick-start-js" >}}), or the [example](https://github.com/mattermost/mattermost-plugin-apps/blob/master/dev/node_app/src/app.ts) from the App framework [development environment](https://github.com/mattermost/mattermost-plugin-apps/tree/master/dev).

The examples on this page use types from the [mattermost-redux](https://github.com/mattermost/mattermost-redux) library, namely the App-specific types in [types/apps.ts](https://github.com/mattermost/mattermost-redux/blob/master/src/types/apps.ts); Mattermost types `Post`, `UserProfile`, and `Team`; and the Mattermost JavaScript client. See the end of the guide for the import paths for each of these.

### Manifest

When our App is installed, we will return this Manifest to define our App:

```ts
app.get('/manifest', (req, res) => {
    const manifest = {
        app_id: 'ticket-form-example',
        display_name: "Create tickets using forms",
        homepage_url: 'https://github.com/mattermost/mattermost-plugin-apps',
        app_type: 'http',
        icon: 'icon.png',
        root_url: `http://localhost:3000`,
        requested_permissions: [
            'act_as_bot', // This is necessary to create public posts as our bot
        ],
        requested_locations: [
            '/post_menu', // This is necessary to render elements in the post menu
        ],
    } as AppManifest;

    res.json(manifest);
});
```

With our server running, we can then install our App in Mattermost using this command:

`/apps install http http://localhost:3000/manifest`

### Bindings

The App will receive a request to provide UI elements to show to the user, whenever the user visits a different channel. This allows us to dynamically show different UI elements or slash commands in each channel. We need to handle this request being sent to the `/bindings` endpoint.

```ts
app.post('/bindings', (req, res) => {
    const call: AppCallRequest = req.body;

    // Use the user id and channel id to dynamically return certain UI elements. Though for this example, we won't use these value.
    const channelID = call.context.channel_id;
    const userID = call.context.acting_user_id;

    const bindings: AppBinding[] = [{
        location: '/post_menu',
        bindings: [
            {
                location: 'create-ticket',
                icon: 'create-ticket.png',
                label: 'Create ticket',
                call: {
                    path: '/forms/create-ticket-post-menu',
                    expand: {
                        post: 'summary',
                    },
                },
            },
        ],
    }];

    const callResponse: AppCallResponse = {
        type: 'ok',
        data: bindings,
    };

    res.json(callResponse);
});

// When static files are fetched from our App, the request paths are prefixed with `/static`, so our files `icon.png` and `create-ticket.png` will be requested as `static/icon.png` and `static/create-ticket.png`. If we have all of our static assets in one directory, we can serve all of them like this:
const staticDirectory = './static';
app.use('/static', express.static(staticDirectory));
```

We now have an item in the post dropdown menu that says "Create ticket", along with the icon located at `static/create-ticket.png` displayed next to the label. When the post menu item is clicked, our App will receive a [Call]({{< ref "call" >}}) at the endpoint `/forms/create-ticket-from-post/submit`. If we return a form in our response, a modal will be shown to the user with our form in the modal.

Note that the `expand` object with `post: 'summary'` means that we will receive the relevant `Post` at `call.context.post` when we receive the request. This makes it so we don't have to fetch the `Post` manually when handling the request. Learn more about Expand [here]({{< ref "call" >}}).

By defining the post menu item's `Call` with the path `/forms/create-ticket-post-menu`, we've implicitly registered an endpoint to process a request when this item is clicked:
- `/forms/create-ticket-post-menu/submit`

### Opening a modal

Now let's process the post menu item click, and return an `AppForm` to show as a modal:

```ts
app.post('/forms/create-ticket-post-menu/submit', (req, res) => {
    const call: AppCallRequest = req.body;

    // Extract the Post from the expanded context
    const post: Post = call.context.post;

    const call: AppCall = {
        path: '/forms/create-ticket',
        expand: {
            acting_user: 'summary', // Expand the acting user so we can get the user's username for our post
            team: 'summary', // Expand the current team so we can construct a permalink for the selected post using the team's name
        },
    };

    const form: AppForm = {
        title: 'Create a Ticket',
        fields: [
            {
                name: 'summary',
                value: '',
                modal_label: 'Summary',
                type: 'text',
                is_required: true, // This makes it so the user must provide this value before submitting the form
                min_length: 10, // We set a minimum length of 10 characters for this field
            },
            {
                name: 'description',
                value: post.message, // Use the Post's message as the default value for the description field
                modal_label: 'Description',
                type: 'text',
                subtype: 'textarea',
            },
        ],
    };

    const callResponse: AppCallResponse = {
        type: 'form',
        call,
        form,
    }

    res.json(callResponse);
});
```

The user is shown a form with text fields labeled "Summary" and "Description". The Description field is prepopulated with the `Post`'s message.

By defining the form's `Call` with the path `/forms/create-ticket`, we've implicitly registered three endpoints for this form to use:
- `/forms/create-ticket/lookup` is used to fetch autocomplete values
- `/forms/create-ticket/form` is used to dynamically redefine the modal when a particular field's value is chosen
- `/forms/create-ticket/submit` is used to process the form's submission

### Processing the form submission

Now let's process the form submitted at the path `/forms/create-ticket/submit`

We've specified in the `expand` clause to include the acting `User` that is submitting the form, as well as the `Team` so we can construct a post's permalink using the team's name.

```ts
import Client4 from 'mattermost-redux/client/client4';

type CreateTicketFormSubmission = {
    summary: string;
    description: string;
};

app.post('/forms/create-ticket/submit', async (req, res) => {
    const call: AppCallRequest = req.body;

    // Extract the submitted form values
    const {summary, description}: CreateTicketFormSubmission = call.values;

    // Let validateSummary and validateDescription be functions that each return a string if the given field validation fails.
    const summaryError = validateSummary(summary);
    const descriptionError = validateDescription(description);

    if (summaryError || descriptionError) {
        const callResponse: AppCallResponse = {
            type: 'error',
            errors: {
                summary: summaryError, // If defined, this will show as an error message under the Summary field
                description: descriptionError, // If defined, this will show as an error message under the Description field
            },
        };

        res.json(callResponse);
        return;
    }

    const context: AppContext = call.context;

    // Extract the user's team from the expanded context
    const team: Team = context.team;

    // Create a permalink to put at the bottom of the ticket description
    const permalink = `${context.mattermost_site_url}/${team.name}/pl/${context.post_id}`;
    const ticketFooter = `_Created from a [post](${permalink}) in Mattermost_`

    const fullDescription = `${description}\n\n${ticketFooter}`;

    // Some ticket from another system, e.g. Jira or ZenDesk
    let ticket: Ticket;
    try {
        ticket = await createTicket(summary, fullDescription);
    } catch (e) {
        // The modal will remain open on the user's screen, and this error will be shown at the bottom of the form.
        const callResponse: AppCallResponse = {
            type: 'error',
            error: `Error creating the ticket: ${e.message}`,
        };

        res.json(callResponse);
        return;
    }

    // Extract the acting user from the expanded context so we can access their username.
    const actingUser: UserProfile = context.acting_user;

    // Create a public post using the bot token. This requires the `act_as_bot` permission to be in your App manifest.
    const publicMessage = `@${actingUser.username} created ticket [${ticket.id}: ${summary}](${ticket.url})`;
    await createPostAsBot(call.context, publicMessage);

    const privateResponseToUser = 'Thanks for making the ticket! Feel free to create more :)';
    const callResponse: AppCallResponse = {
        type: 'ok',
        markdown: privateResponseToUser,
    }

    res.json(callResponse);
});

const createPostAsBot = async (context: AppContext, message: string): Promise<Post> => {
    const botClient = new Client4();
    botClient.setUrl(context.mattermost_site_url);
    botClient.setToken(context.bot_access_token);

    const rootID = context.root_post_id || context.post_id;

    const post = {
        message,
        channel_id: context,
        root_id: rootID,
    } as Post;

    return botClient.createPost(post);
};
```

Now we have a functioning form that allows the user to attach a post to a new ticket, along with a reply `Post` made by our bot that links to the new ticket.

### Static select values

This form works for simple use cases, but ticket systems are usually more complicated than this. What if we have some labels the user needs to choose from? We'll call the labels "tags" in this example so as to not get confused with the `label` field for the select options.

If the App needs to provide a fixed set of values, we can use a `static_select` field. Let's add this field to our form's `fields` array:

```ts
const tagsField: AppField = {
    name: 'tags',
    modal_label: 'Tags',
    type: 'static_select',
    value: [],
    multiselect: true, // When multiselect is true, the user can select multiple options. If multiselect is false or omitted, the user can only select one option.
    options: [
        {label: 'Sensitive', value: 'sensitive'},
        {label: 'Urgent', value: 'urgent'},
        {label: 'Feature Request', value: 'feature_request'},
    ],
};
```

We can then process the selected values in the form submission like so:

```ts
type CreateTicketFormSubmission = {
    summary: string;
    description: string;
    tags: AppSelectOption[]; // {label: string; value: string}[]
};

app.post('/forms/create-ticket/submit', async (req, res) => {
    const call: AppCallRequest = req.body;

    // Extract the submitted form values
    const {summary, description, tags}: CreateTicketFormSubmission = call.values;

    // Extract selected values from the tags array
    const tagValues = tags.map(option => option.value);

    // Process request differently based on tags selected
    const isUrgent = tagValues.includes('urgent');
    if (isUrgent) {
        // ...
    }

    // ... Process the submission as usual
});
```

### Autocomplete select values

> Note: If we need autocomplete functionality for users or channels, we can set the field's `type` to "user" or "channel", and the from will show an autocomplete selector for the respective field type. The Mattermost server will take care of the autocomplete requests for users and channels. WHen the form is submitted, the field's value will be submitted as an [AppSelectOption](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L138), where the selected option's `value` is the `id` for the `UserProfile` or `Channel`.

What if the list of available tags is too large to be computed at once, and we need to use an autocomplete API to retrieve these values dynamically? We will use a `dynamic_select` field for this.

Let's change the field's `type` to `dynamic_select`, and remove the `options` property:

```ts
const tagsField: AppField = {
    name: 'tags',
    modal_label: 'Tags',
    type: 'dynamic_select',
    value: [],
    multiselect: true,
};
```

This will use the form's `call` to fetch these values at the endpoint `/forms/create-ticket/lookup`. The same `lookup` path is used for any `dynamic_select` field of this form. We know what field is requesting the autocomplete by accessing `call.selected_field`. We can get the user's query typed in by accessing `call.query`:

```ts
app.post('/forms/create-ticket/lookup', async (req, res) => {
    const call: AppCallRequest = req.body;

    // For this form, we only have one dynamic select field, so we should only be receiving requests for that field. This block is here to show that this endpoint could be called for another field, if the form had multiple dynamic select fields, and we would need to handle them individually here when that field is being queried for autocomplete.
    if (call.selected_field !== 'tags') {
        const callResponse: AppCallResponse = {
            type: 'error',
            error: `Unexpected lookup field: ${call.selected_field}`,
        };

        res.json(callResponse);
        return;
    }

    // TicketTag represents a tag in the external ticket system
    let tags: TicketTag[];
    try {
        // Use some other service to process the autocomplete request
        tags = await autocompleteTags(call.query);
    } catch (e) {
        const callResponse: AppCallResponse = {
            type: 'error',
            error: `Error performing autocomplete: ${e.message}`,
        };

        res.json(callResponse);
        return;
    }

    const selectOptions: AppSelectOption[] = tags.map(tag => ({
        label: tag.name,
        value: tag.id,
    }));

    const callResponse: AppCallResponse = {
        type: 'ok',
        data: {
            items: selectOptions,
        },
    };

    res.json(callResponse);
});
```

Now we have our form integrated with an external system's autocomplete service, with just a few lines of code. Note that we also have access to all of the currently selected values in the form whenever we receive a `lookup` request. For example, we have access to the current Summary and Description through `call.values.summary` and `call.values.description`.

### Redefining the form after user actions

Our use case may be more complex, and the form's structure needs to be updated as the user fills out certain fields. For example, let's say the user needs to choose an Issue Type, which should then cause the form to show other form fields based on the Issue Type chosen by the user. We'll need to use the "form refresh" feature of the App forms to accomplish this.

Let's add the "Issue Type" field to the form:

```ts
const issueTypeField: AppField = {
    name: 'issue_type',
    modal_label: 'Issue Type',
    type: 'static_select',
    value: null,
    refresh: true, // This tells the frontend to contact our App when the user has chosen a value for this field. We then have the opportunity to redefine a new form with access to the current form's state.
    options: [
        {label: 'Story', value: 'story'},
        {label: 'Task', value: 'task'},
        {label: 'Bug', value: 'bug'},
    ],
}
```

When the Issue Type value is selected, our App will receive a request at the endpoint `/forms/create-ticket/form`. The request body will be similar to that of a form submission, but it will also include what field was selected in the `call.selected_field` property.

Note that we can return an entirely new form here. We can also create a flow between several forms by responding to a form submission with a new form.

Let's process this request and return an appropriate form:

```ts
app.post('/forms/create-ticket/form', (req, res) => {
    const call: AppCallRequest = req.body;

    // For this form, we only have one refresh field, so we should only be receiving requests for that field. This block is here to show that this endpoint could be called for another field, if the form had multiple refresh fields. We would need to handle them individually here when that field's value is selected from the form.
    if (call.selected_field !== 'issue_type') {
        const callResponse: AppCallResponse = {
            type: 'error',
            error: `Unexpected refresh field: ${call.selected_field}`,
        };

        res.json(callResponse);
        return;
    }

    const baseFields: AppField[] = [
        {
            name: 'summary',
            modal_label: 'Summary',
            type: 'text',
            value: values.summary, // We're using `values.summary` here to make sure we keep the user's entered values in tact when we return this new form
            is_required: true,
            min_length: 10,
        },
        {
            name: 'description',
            modal_label: 'Description',
            type: 'text',
            subtype: 'textarea',
            value: values.description, // Same for this field
        },
        {
            name: 'issue_type',
            modal_label: 'Issue Type',
            type: 'static_select',
            value: values.issue_type, // And this field
            refresh: true,
            options: [
                {label: 'Story', value: 'story'},
                {label: 'Task', value: 'task'},
                {label: 'Bug', value: 'bug'},
            ],
        },
    ];

    const values = call.values;

    // If values.issue_type is null, then we know that the user has just "cleared" this field. For our use case, we will just return the form as if the value was never selected.
    let otherFields: AppField[] = [];

    if (values.issue_type) {
        if (values.issue_type.value === 'story') {
            otherFields = getStoryFields();
        } else if (values.issue_type.value === 'task') {
            otherFields = getTaskFields();
        } else if (values.issue_type.value === 'bug') {
            otherFields = getBugFields();
        }
    }

    // Combine the form's base fields with the new fields, to create the full form.
    const allFields = baseFields.concat(otherFields);

    const form: AppForm = {
        title: 'Create a Ticket',
        fields: allFields,
    };

    const call: AppCall = {
        path: '/forms/create-ticket',
        expand: {
            acting_user: 'summary',
            team: 'summary',
        },
    };

    // Respond with modal form
    const callResponse: AppCallResponse = {
        type: 'form',
        call,
        form,
    };

    res.json(callResponse);
});
```

Now we can respond to user action by rearranging the form's fields when the user selects an Issue Type. Note that this handler will be also called if the user clears the Issue Type field, or selects a new value after already choosing one. We can lock in the chosen value by providing a `readonly: true` property on the field after the user has selected it the first time.

In this example, we should share code between this handler and the `/forms/create-ticket-post-menu/submit` endpoint's handler, since they are returning the same form in both cases.

```ts
app.post('/forms/create-ticket-post-menu/submit', (req, res) => {
    const call: AppCallRequest = req.body;

    const post: Post = call.context.post;
    call.values = {
        description: post.message,
    };

    const callResponse: AppCallResponse = getFormResponse(call);
    res.json(callResponse);
});

app.post('/forms/create-ticket/form', (req, res) => {
    const call: AppCallRequest = req.body;

    const callResponse: AppCallResponse = getFormResponse(call);
    res.json(callResponse);
});

const getFormResponse = (call: AppCallRequest): AppCallResponse => {
    // ...
}
```

### Importing types from mattermost-redux

`import {...} from 'mattermost-redux/types/apps`;
- [AppCall](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L63)
- [AppCallRequest](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L69)
- [AppContext](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L90)
- [AppCallResponse](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L79)
- [AppBinding](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L24)
- [AppForm](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L122)
- [AppField](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L147)
- [AppSelectOption](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/apps.ts#L138)

`import {Team} from 'mattermost-redux/types/teams`;
- [Team](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/teams.ts#L27)

`import {UserProfile} from 'mattermost-redux/types/users`;
- [UserProfile](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/users.ts#L25)

`import {Post} from 'mattermost-redux/types/posts`;
- [Post](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/types/posts.ts#L53)

`import Client4 from 'mattermost-redux/client/client4`;
- [Client4](https://github.com/mattermost/mattermost-redux/blob/3d1028034d7677adfda58e91b9a5dcaf1bc0ff99/src/client/client4.ts#L131)
