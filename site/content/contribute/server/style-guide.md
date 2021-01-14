---
title: "Style guide"
date: 2021-01-12T16:00:00+0530
weight: 3
subsection: Server
---

The overarching guideline is to just follow [Effective Go](https://golang.org/doc/effective_go.html) along with [CodeReviewComments](https://github.com/golang/go/wiki/CodeReviewComments). But currently, implementing those rules can lead to a clash between maintaining consistency and enforcing correctness. This document aims to codify some of the rules in the hope that any confusion is alleviated.

### Model package

The `model` package is our public API which is consumed by multiple plugins. Having a non-idiomatic public API should not prevent us from improving the rest of the codebase. More code keeps getting added, and it becomes practically impossible to fix all of the issues at once. Instead, we choose to have consistency in that package only if changing it makes it inconsistent from an API perspective. This includes both breaking changes and any inconsistencies that might appear in godocs.

There are some rules which don’t need an API change and can be used everywhere. In all other packages, we should enforce correctness. Once we move to v6 of the `mattermost-server`, we can change the remaining places to match with the rest of the codebase.

This does not, however, mean that a developer has to fix any surrounding code to fix the style issues too. It’s encouraged to keep fixing things as we go, but it's not compulsory to do so. There's also no need for a reviewer to ask for that change if it's not something that's added/edited in that PR.

The following goes into some of the specific anti-patterns that have crept in our codebase and we should aim to correct. The rules which are exempt from being applied in the model package are specifically indicated.

## Guidelines

### Default to sync instead of async

Always prefer synchronous functions by default. Async calls are hard to get right. They have no control over goroutine lifetimes and introduce data races. If you think something needs to be asynchronous, measure it and prove it. Ask these questions:
- Does it improve performance? If so, by how much?
- What’s the tradeoff of the happy path vs. slow path?
- How do I propagate errors?
- What about back-pressure?
- What should be my concurrency model?

Avoid creating one-off goroutines without knowing when/how they exit. They cause problems that are hard to debug, and can often cause performance degradation rather than an improvement. Have a look at:
- https://github.com/golang/go/wiki/CodeReviewComments#goroutine-lifetimes
- https://github.com/golang/go/wiki/CodeReviewComments#synchronous-functions

### Pointers to slices (exempt from model)

Avoid using pointers to slices. Slices are already reference types which point to an underlying array. If you want a function to modify a slice, then return that slice from the function, rather than passing a pointer.

### [CamelCase variables/constants](https://github.com/golang/go/wiki/CodeReviewComments#mixed-caps) (exempt from model)

We prefer to use names like WebsocketEventPostEdited, not WEBSOCKET_EVENT_POST_EDITED.

### Empty string check

Use == "" to check empty strings, not len(s) == 0. This will be enforced with a linter soon.

### [Reduce indentation](https://github.com/golang/go/wiki/CodeReviewComments#indent-error-flow)

If there are multiple return statements in an if-else statement, remove the else block and outdent it.

This is a sample code from `mlog/human/parser.go`:

```go
// Look for an initial "{"
if token, err := dec.Token(); err != nil {
	return result, err
} else {
	d, ok := token.(json.Delim)
	if !ok || d != '{' {
		return result, fmt.Errorf("input is not a JSON object, found: %v", token)
	}
}
```

This can be simplified to:

```go
// Look for an initial "{"
if token, err := dec.Token(); err != nil {
	return result, err
}
d, ok := token.(json.Delim)
if !ok || d != '{' {
	return result, fmt.Errorf("input is not a JSON object, found: %v", token)
}
```

### Avoid creating more ToJSON methods

We should avoid creating ToJSON methods for model structs. And just use `json.Marshal` at the call site. This has two main benefits:
- We’ve had to fix multiple bugs due to suppressing the JSON error which happens with ToJSON methods.
- A lot of times, we pass the output to something (like a network call) which accepts a byte slice, leading to a double conversion from byte-slice to string to a byte-slice again.

### [Initialisms](https://github.com/golang/go/wiki/CodeReviewComments#initialisms) (exempt from model)

We prefer to use userID rather than userId. Same for abbreviations; HTTP is preferred over Http or http. This will be enforced with the linter soon.

### [Interfaces](https://github.com/golang/go/wiki/CodeReviewComments#interfaces)

- Return structs, accept interfaces.
- Interface names should end with “-er”. This is not a strict rule. Just a guideline which indicates the fact that interface functionalities are designed around the concept of “doing” something.
- Try not to define interfaces on the implementer side of an API "for mocking"; instead, design the API so that it can be tested using the public API of the real implementation.

### [Receiver Names](https://github.com/golang/go/wiki/CodeReviewComments#receiver-names)

The name of a method's receiver should be a reflection of its identity; often a one or two letter abbreviation of its type suffices (such as "c" or "cl" for "Client"). Don't use generic names such as "me", "this" or "self", identifiers typical of object-oriented languages that give the method a special meaning.

The above was just a short list of existing issues in the repo which should be rectified. In general, the broad list of rules are already available at [Effective Go](https://golang.org/doc/effective_go.html) and [CodeReviewComments](https://github.com/golang/go/wiki/CodeReviewComments.). They should be referred to whenever doing a code review.
