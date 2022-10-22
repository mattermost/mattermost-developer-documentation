---
title: "REST API"
heading: "Information about the Mattermost REST API"
description: "The REST API is a JSON web service that facilitates communication between Mattermost clients, as well as integrations, and the server."
date: 2017-08-20T11:35:32-04:00
weight: 4
aliases:
  - /contribute/server/rest-api
---

The REST API is a JSON web service that facilitates communication between Mattermost clients, as well as integrations, and the server.

The server is currently on API version 4.

## Reference

Looking for the API reference? That can be found here: {{<newtabref title="https://api.mattermost.com" href="https://api.mattermost.com">}}.

## Add an endpoint

To add an endpoint to API version 4, each item on the following checklist must be completed:

- [Document the endpoint](#document-the-endpoint)
- [Implement the API handler on the server](#implement-the-api-handler)
- [Add a function to the Go driver](#update-the-golang-driver)
- [Write a unit test](#write-a-unit-test)
- [Submit your implementation!](#submit-your-pull-request)

A full example can be found through these two pull requests:

- Documenting the `POST /teams` endpoint: {{< newtabref href="https://github.com/mattermost/mattermost-api-reference/pull/72" title="mattermost-api-reference#72" >}}
- Implementing the `POST /teams` endpoint: {{< newtabref href="https://github.com/mattermost/mattermost-server/pull/5220" title="mattermost-server#5220" >}}

### Document the endpoint

At Mattermost we use the {{< newtabref href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md" title="OpenAPI specification" >}} for API documentation. That documentation lives in the {{< newtabref href="https://github.com/mattermost/mattermost-api-reference" title="mattermost-api-reference" >}} repository. To document an endpoint, follow these steps:

1. Fork {{< newtabref href="https://github.com/mattermost/mattermost-api-reference" title="mattermost-api-reference" >}}
and create a branch for your changes.
2. Find the `.yaml` file in the {{< newtabref href="https://github.com/mattermost/mattermost-api-reference/tree/master/v4/source" title="/source/v4" >}} directory that fits your endpoint.
    - For example, if you were adding the `GET /users/{user_id}` endpoint you would be looking for {{< newtabref href="https://github.com/mattermost/mattermost-api-reference/blob/master/v4/source/users.yaml" title="users.yaml" >}}
    - If the file doesn't exist yet, you might need to create it and update the {{< newtabref href="https://github.com/mattermost/mattermost-api-reference/tree/master/Makefile" title="" >}} to include it

3. Copy an existing endpoint from the same or a different file.
4. Update the documention you copied with the correct information for your endpoint, including:
    - Tag - The resource type
    - Summary - A few word summary
    - Description - A brief 1-2 sentence description
    - Permissions - The permission required
    - Parameters - The URL and body parameters
    - Responses - The success and error responses
5.  Confirm you don't have any syntax errors by running `make build-v4` and copying `/html/static/mattermost-openapi-v4.yaml` into the {{< newtabref href="http://editor.swagger.io" title="Swagger editor" >}}.
6.  Commit your changes and submit a pull request to {{< newtabref href="https://github.com/mattermost/mattermost-api-reference" title="mattermost-api-reference" >}}.

If you're looking for examples, see {{< newtabref href="https://github.com/mattermost/mattermost-api-reference/blob/master/v4/source/users.yaml" title="users.yaml" >}}.

### Implement the API handler

To implement the API handler you'll first need to [setup your developer environment]({{< ref "/contribute/more-info/server/developer-setup" >}}), then follow these steps:

1.  Add the declaration for your endpoint.
    - For an example, see {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/api4/user.go" title="/api4/user.go" >}}

2.  Implement the handler for your endpoint.
    - The general pattern for handlers is

        ```Go
        func handlerName(c *Context, w http.ResponseWriter, r *http.Request) {
            // 1. Parsing of request URL and body

            // 2. Permissions check if required

            // 3. Invoke logic through the app package

            // 4. (Optional) Check the Etag

            // 5. Format the response and write the response
        }
        ```

    - For examples, see the {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/api4/user.go#L86" title="updateUser()" >}} and the {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/api4/user.go#L58" title="getUser()" >}} handlers.

3.  Run the server using `make run-server` to check for syntax errors.
4.  (Optional) Use `curl` or {{< newtabref href="https://www.getpostman.com/" title="Postman" >}} to test the basics of your endpoint. The endpoint will also be tested [through a unit test](#write-a-unit-test), so this step is optional.

### Update the Golang driver

The Go driver for APIv4 is in {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/model/client4.go" title="/model/client4.go" >}}.

To add a function to support your new endpoint:

1.  Copy an existing driver function, such as {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/model/client4.go#L186" title="CreateUser" >}}.
2.  Paste the function into the section for your endpoint.
    - For example, `POST /teams` would go in the Teams section

3.  Modify the function to correctly hit your endpoint.
    - Make sure to update the request method to match your endpoint's HTTP method

That's it, you'll be able to test your function in the next section.

### Write a unit test

The most important part of this process is to make sure your endpoint works correctly. Follow these steps to write a test:

1.  Open the test Go file related to your endpoint.
    - For example, if you put your handler in {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/api4/user.go" title="/api4/user.go" >}} your test will go in {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/api4/user_test.go" title="/api4/user\_test.go" >}}

2.  Write your test based on the other tests in your file
    - There are several helper functions in {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/api4/apitestlib.go" title="/api4/apitestlib.go" >}} that you may use

3.  Make sure your test covers the following:
    - All combinations of correct inputs to your endpoint
    - Etags for your endpoint, if applicable
    - Incorrect URL or body parameters return a **400 Bad Request** status code
    - Requests without a token return a **401 Unauthorized** status code (for endpoints requiring a session)
    - Requests with insufficient permissions return a **403 Forbidden** status code (for endpoints requiring a permission)
    - Requests to non-existent resources or URLs return a **404 Not Found** status code

Returning the correct error code might require investigation in the {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/app" title="app" >}} or {{< newtabref href="https://github.com/mattermost/mattermost-server/tree/master/store" title="store" >}} packages to find the source of errors. Status codes on errors should be set at the creation of the error.

When completing this step, please make sure to use the new `model.NewAppError()` function ({{< newtabref href="https://github.com/mattermost/mattermost-server/blob/master/store/sqlstore/user_store.go" title="see example" >}}).

### Submit your pull request

Please submit a pull request against the {{< newtabref href="https://github.com/mattermost/mattermost-server" title="mattermost/mattermost-server" >}}[]() repository by [following these instructions]({{< ref "/contribute/more-info/server/developer-workflow" >}}).
