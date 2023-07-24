---
title: "REST API"
heading: "Information about the Mattermost REST API"
description: "The REST API is a JSON web service that facilitates communication between Mattermost clients, as well as integrations, and the server."
date: 2017-08-20T11:35:32-04:00
weight: 4
aliases:
  - /contribute/server/rest-api
---

The REST API is a JSON web service that facilitates communication between Mattermost clients, as well as integrations, and the server. The server is currently on API version 4.

### Reference

Looking for the API reference? You can find it here: {{<newtabref title="https://api.mattermost.com" href="https://api.mattermost.com">}}.

### Add an endpoint

To add an endpoint to API version 4, all of the following must be completed:

- [Document the endpoint](#document-the-endpoint)
- [Implement the API handler on the server](#implement-the-api-handler)
- [Add a function to the Go driver](#update-the-golang-driver)
- [Write a unit test](#write-a-unit-test)
- [Submit your implementation!](#submit-your-pull-request-pr)

A full example of the process can be found through these two pull requests:

- Documenting the `POST /teams` endpoint: {{< newtabref href="https://github.com/mattermost/mattermost-api-reference/pull/72" title="mattermost-api-reference#72" >}}
- Implementing the `POST /teams` endpoint: {{< newtabref href="https://github.com/mattermost/mattermost/pull/5220" title="mattermost/server#5220" >}}

#### Document the endpoint
At Mattermost, the [OpenAPI specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) is used for API documentation. The API documentation lives in the [mattermost-api-reference](https://github.com/mattermost/mattermost-api-reference) repository. To document an endpoint, follow these steps:

1. Fork the [mattermost-api-reference](https://github.com/mattermost/mattermost-api-reference) repository, and create a branch for your changes.
2. Find the `.yaml` file in the [/source/v4](https://github.com/mattermost/mattermost-api-reference/tree/master/v4/source) directory that fits your endpoint.
    - For example, if you were adding the `GET /users/{user_id}` endpoint you would be looking for the [users.yaml](https://github.com/mattermost/mattermost-api-reference/blob/master/v4/source/users.yaml) file.
    - If the file doesn't exist yet, you may need to create it and then update the [Makefile](https://github.com/mattermost/mattermost-api-reference/tree/master/Makefile) to include the file.
3. Copy an existing endpoint from the same or a different file.
4. Update the documentation you copied with the correct information for your endpoint, including:
    - `Tag` - the resource type
    - `Summary` - a summary of few words
    - `Description` - a brief 1-2 sentence description
    - `Permissions` - the permission(s) required
    - `Parameters` - the URL and body parameters
    - `Responses` - the success and error responses
5.  Confirm you don't have any syntax errors by running `make build-v4` and copying `/html/static/mattermost-openapi-v4.yaml` into the {{<newtabref title="Swagger editor" href="http://editor.swagger.io">}}.
6.  Commit your changes and submit a pull request to the [mattermost-api-reference](https://github.com/mattermost/mattermost-api-reference) repository.
#### Implement the API handler
To implement the API handler, you'll first need to [setup your developer environment]({{< ref "/contribute/developer-setup" >}}), and then follow these steps:

1.  Add the declaration for your endpoint. For an example, check out the [/api4/user.go](https://github.com/mattermost/mattermost/blob/master/server/channels/api4/user.go) file.

2.  Implement the handler for your endpoint. Follow this general pattern for handlers:

    ```Go
    func handlerName(c *Context, w http.ResponseWriter, r *http.Request) {
        // 1. Parse the request URL and body.
        // 2. Do a permissions check if required.
        // 3. Invoke handler logic through the app package.
        // 4. (Optional) Check the Etag.
        // 5. Format the response and write the response.
    }
    ```
    For examples, see the [createUser()](https://github.com/mattermost/mattermost/blob/d693f880431741e3e1482503c4e80d6148b0f1bf/server/channels/api4/user.go#L111) and the [getUser()](https://github.com/mattermost/mattermost/blob/d693f880431741e3e1482503c4e80d6148b0f1bf/server/channels/api4/user.go#L177) handlers.

3.  Run the server using `make run-server` to check any other errors.
4.  (Optional) Use `curl` or {{<newtabref title="Postman" href="https://www.getpostman.com/">}} to test the basics of your endpoint. The endpoint will also be tested [through a unit test](#write-a-unit-test), so this step is optional.
#### Update the Golang driver
The Go driver for APIv4 is in [/model/client4.go](https://github.com/mattermost/mattermost/blob/master/server/public/model/client4.go). To add a function to support your new endpoint:

1.  Copy over an existing driver function, such as [CreateUser](https://github.com/mattermost/mattermost/blob/master/server/public/model/client4.go#L827).
2.  Paste the function into the section for your endpoint. For example, `POST /teams` would go in the Teams section.
3.  Modify the function to correctly hit your endpoint. Make sure to update the request method to match your endpoint's HTTP method.
#### Write a unit test
The most important part of this process is to make sure the new endpoint works correctly. Follow these steps to write a unit test:

1.  Open the test Go file related to your endpoint, or create one if necessary. For example, if you put your handler in [/api4/user.go](https://github.com/mattermost/mattermost/blob/master/server/channels/api4/user.go), your test will go in [/api4/user\_test.go](https://github.com/mattermost/mattermost/blob/master/server/channels/api4/user_test.go).
2.  Write your test based on the other tests in your file (or folder). There are several helper functions in [/api4/apitestlib.go](https://github.com/mattermost/mattermost/blob/master/server/channels/api4/apitestlib.go) that you may use.
3.  Ensure that your test covers the following:
    - All combinations of correct inputs to your endpoint.
    - Etags for your endpoint, if applicable.
    - Incorrect URL or body parameters return a **400 Bad Request** status code.
    - Requests without a token return a **401 Unauthorized** status code (for endpoints requiring a session).
    - Requests with insufficient permissions return a **403 Forbidden** status code (for endpoints requiring permission).
    - Requests to non-existent resources or URLs return a **404 Not Found** status code.

Returning the correct error code might require investigation in the {{< newtabref href="https://github.com/mattermost/mattermost/tree/master/server/channels/app" title="app" >}} or {{< newtabref href="https://github.com/mattermost/mattermost/tree/master/server/channels/store" title="store" >}} packages to find the source of errors. Status codes on errors should be set at the creation of the error.

When completing this step, please make sure to use the new `model.NewAppError()` function ([see example](https://github.com/mattermost/mattermost/blob/master/server/channels/store/sqlstore/user_store.go)).
#### Submit your pull request (PR)
Please submit a pull request against the [mattermost/mattermost](https://github.com/mattermost/mattermost) repository by [following these instructions]({{< ref "/contribute/more-info/server/developer-workflow" >}}).
