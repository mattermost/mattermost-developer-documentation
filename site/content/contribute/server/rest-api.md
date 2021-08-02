---
title: "REST API"
heading: "Information about the Mattermost REST API"
description: "The REST API is a JSON web service that facilitates communication between Mattermost clients, as well as integrations, and the server."
date: 2017-08-20T11:35:32-04:00
weight: 4
---

The REST API is a JSON web service that facilitates communication between Mattermost clients, as well as integrations, and the server.

The server is currently on API version 4.

## Reference

Looking for the API reference? That can be found here: https://api.mattermost.com.

## Adding an Endpoint

To add an endpoint to API version 4, each item on the following checklist must be completed:

- [Document the endpoint](./#documenting-the-endpoint)
- [Implement the API handler on the server](./#implementing-the-api-handler)
- [Add a function to the Go driver](./#updating-the-go-driver)
- [Write a unit test](./#writing-a-unit-test)
- [Submit your implementation!](./#submitting-your-pull-request)

A full example can be found through these two pull requests:

- Documenting the `POST /teams` endpoint: [mattermost-api-reference#72](https://github.com/mattermost/mattermost-api-reference/pull/72)
- Implementing the `POST /teams` endpoint: [mattermost-server#5220](https://github.com/mattermost/mattermost-server/pull/5220)

### Documenting the Endpoint

At Mattermost we use the [OpenAPI specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) for API documentation. That documentation lives in the [mattermost-api-reference](https://github.com/mattermost/mattermost-api-reference) repository. To document an endpoint, follow these steps:

1. Fork [mattermost-api-reference](https://github.com/mattermost/mattermost-api-reference)
and create a branch for your changes.
2. Find the `.yaml` file in the [/source/v4](https://github.com/mattermost/mattermost-api-reference/tree/master/v4/source) directory that fits your endpoint.
    - For example, if you were adding the `GET /users/{user_id}` endpoint you would be looking for [users.yaml](https://github.com/mattermost/mattermost-api-reference/blob/master/v4/source/users.yaml)
    - If the file doesn't exist yet, you might need to create it and update the [Makefile](https://github.com/mattermost/mattermost-api-reference/tree/master/Makefile) to include it

3. Copy an existing endpoint from the same or a different file.
4. Update the documention you copied with the correct information for your endpoint, including:
    - Tag - The resource type
    - Summary - A few word summary
    - Description - A brief 1-2 sentence description
    - Permissions - The permission required
    - Parameters - The URL and body parameters
    - Responses - The success and error responses
5.  Confirm you don't have any syntax errors by running `make build-v4` and copying `/html/static/mattermost-openapi-v4.yaml` into the [Swagger editor](http://editor.swagger.io).
6.  Commit your changes and submit a pull request to [mattermost-api-reference](https://github.com/mattermost/mattermost-api-reference).

If you're looking for examples, see [users.yaml](https://github.com/mattermost/mattermost-api-reference/blob/master/v4/source/users.yaml).

### Implementing the API Handler

To implement the API handler you'll first need to [setup your developer environment](https://developers.mattermost.com/contribute/server/developer-setup/), then follow these steps:

1.  Add the declaration for your endpoint.
    - For an example, see [/api4/user.go](https://github.com/mattermost/mattermost-server/tree/master/api4/user.go)

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

    - For examples, see the [updateUser()](https://github.com/mattermost/mattermost-server/tree/master/api4/user.go#L86) and the [getUser()](https://github.com/mattermost/mattermost-server/tree/master/api4/user.go#L58) handlers.

3.  Run the server using `make run-server` to check for syntax errors.
4.  (Optional) Use `curl` or [Postman](https://www.getpostman.com/) to test the basics of your endpoint. The endpoint will also be tested [through a unit test](https://developers.mattermost.com/contribute/server/rest-api/#writing-a-unit-test/), so this step is optional.

### Updating the Go Driver

The Go driver for APIv4 is in [/model/client4.go](https://github.com/mattermost/mattermost-server/tree/master/model/client4.go).

To add a function to support your new endpoint:

1.  Copy an existing driver function, such as [CreateUser](https://github.com/mattermost/mattermost-server/tree/master/model/client4.go#L186).
2.  Paste the function into the section for your endpoint.
    - For example, `POST /teams` would go in the Teams section

3.  Modify the function to correctly hit your endpoint.
    - Make sure to update the request method to match your endpoint's HTTP method

That's it, you'll be able to test your function in the next section.

### Writing a Unit Test

The most important part of this process is to make sure your endpoint works correctly. Follow these steps to write a test:

1.  Open the test Go file related to your endpoint.
    - For example, if you put your handler in [/api4/user.go](https://github.com/mattermost/mattermost-server/tree/master/api4/user.go) your test will go in [/api4/user\_test.go](https://github.com/mattermost/mattermost-server/tree/master/api4/user_test.go)

2.  Write your test based on the other tests in your file
    - There are several helper functions in [/api4/apitestlib.go](https://github.com/mattermost/mattermost-server/tree/master/api4/apitestlib.go) that you may use

3.  Make sure your test covers the following:
    - All combinations of correct inputs to your endpoint
    - Etags for your endpoint, if applicable
    - Incorrect URL or body parameters return a **400 Bad Request** status code
    - Requests without a token return a **401 Unauthorized** status code (for endpoints requiring a session)
    - Requests with insufficient permissions return a **403 Forbidden** status code (for endpoints requiring a permission)
    - Requests to non-existent resources or URLs return a **404 Not Found** status code

Returning the correct error code might require investigation in the [app](https://github.com/mattermost/mattermost-server/tree/master/app) or [store](https://github.com/mattermost/mattermost-server/tree/master/store) packages to find the source of errors. Status codes on errors should be set at the creation of the error.

When completing this step, please make sure to use the new `model.NewAppError()` function ([see example](https://github.com/mattermost/mattermost-server/blob/master/store/sqlstore/user_store.go)).

### Submitting your Pull Request

Please submit a pull request against the [mattermost/mattermost-server](https://github.com/mattermost/mattermost-server) repository by [following these instructions](/contribute/server/developer-workflow/).
