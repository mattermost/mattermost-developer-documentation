---
title: Embedded bindings
heading: Embedded bindings
---
Posts can be embedded with bindings. These are used for asynchronous interaction with the user. In order to add an embedded binding you need to add an `app_bindings` property with a list of `EmbeddedBindings`. An `EmbeddedBinding` includes:

| Name       | Type    | Description                |
|:-----------|:--------|:---------------------------|
| `app_id`   | string  | The app ID.                |
| `title`    | string  | Title of the attachment.   |
| `text`     | string  | Text of the attachment.    |
| `bindings` | Binding | List of embedded bindings. |

[EXAMPLE POST PAYLOAD WITH EMBEDDED BINDINGS]

[SCREENSHOT OF POST WITH EMBEDDED BINDINGS]

Bindings are of two types, buttons or selects.

Buttons include:

| Name       | Type   | Description                                                                                                                                         |
|:-----------|:-------|:----------------------------------------------------------------------------------------------------------------------------------------------------|
| `location` | string | Location name. The whole location path will be provided in the context.                                                                             |
| `label`    | string | Label that will show in the button. Defaults to location. Must be unique in its level.                                                              |
| `call`     | Call   | (Optional) Call to be made when the button is selected. You must provide a call if there is no form, or the form itself does not have a call.       |
| `form`     | Form   | (Optional) Form to open in a modal form when the button is clicked. You must provide a form with a call if there is no call defined in the binding. |

Selects include:

| Name       | Type    | Description                                                             |
|:-----------|:--------|:------------------------------------------------------------------------|
| `location` | string  | Location name. The whole location path will be provided in the context. |
| `label`    | string  | Label that will show in the button.                                     |
| `call`     | Call    | (Optional) Call to be made inherited by the options.                    |
| `form`     | Form    | (Optional) Form to be inherited by the options.                         |
| `bindings` | Binding | Options for the select.                                                 |

Options bindings include:

| Name       | Type   | Description                                                                                                                                          |
|:-----------|:-------|:-----------------------------------------------------------------------------------------------------------------------------------------------------|
| `location` | string | Option name. The whole location path will be provided in the context.                                                                                |
| `label`    | string | User-facing string. Defaults to location. Must be unique in its level.                                                                               |
| `call`     | Call   | (Optional) Call to perform when the option is selected. You must provide a call if there is no form, or the form itself does not have a call.        |
| `form`     | Form   | (Optional) Form to open in a modal form when the option is selected. You must provide a Form with a Call if there is no Call defined in the Binding. |

Whenever a button is clicked or a select field is selected, a submit call is performed to the corresponding call endpoint. The call will include in the context the app ID, user ID, the post ID, the root post ID if any, the channel ID and the team ID.

