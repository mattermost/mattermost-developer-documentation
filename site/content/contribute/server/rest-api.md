---
draft: true
title: "REST API"
date: 2017-08-20T11:35:32-04:00
weight: 4
subsection: Server
---

# REST API

<div class="section" id="apiv4-development-process">
<p>This page documents the process for implementing endpoints for version 4 of the Mattermost REST API. If you
have questions please ask in the <a class="reference external" href="https://pre-release.mattermost.com/core/channels/apiv4">APIv4
channel</a>. The
project leads are Joram Wilander (&#64;joram) on development and Jason Blais
(&#64;jason) on product management.</p>
<p>Looking for the API reference? That can be found here: <a class="reference external" href="https://api.mattermost.com">https://api.mattermost.com</a>.</p>
<div class="section" id="adding-an-endpoint">
<h2>Adding an Endpoint</h2>
<p>To add an endpoint to API version 4, each item on the following checklist must be completed:</p>
<ul class="simple">
<li><a class="reference external" href="https://docs.mattermost.com/developer/api4.html#documenting-the-endpoint">Document the
endpoint</a></li>
<li><a class="reference external" href="https://docs.mattermost.com/developer/api4.html#implementing-the-api-handler">Implement the API handler on the
server</a></li>
<li><a class="reference external" href="https://docs.mattermost.com/developer/api4.html#updating-the-go-driver">Add a function to the Go
driver</a></li>
<li><a class="reference external" href="https://docs.mattermost.com/developer/api4.html#writing-a-unit-test">Write a unit
test</a></li>
<li><a class="reference external" href="https://docs.mattermost.com/developer/api4.html#submitting-your-pull-request">Submit your
implementation!</a></li>
</ul>
<p>A full example can be found through these two pull requests:</p>
<ul class="simple">
<li>Documenting the <code class="docutils literal"><span class="pre">POST</span> <span class="pre">/teams</span></code> endpoint: <a class="reference external" href="https://github.com/mattermost/mattermost-api-reference/pull/72">/mattermost-api-reference #72</a></li>
<li>Implementing the <code class="docutils literal"><span class="pre">POST</span> <span class="pre">/teams</span></code> endpoint: <a class="reference external" href="https://github.com/mattermost/platform/pull/5220">/platform #5220</a></li>
</ul>
<div class="section" id="documenting-the-endpoint">
<h3>Documenting the Endpoint</h3>
<p>At Mattermost we use the <a class="reference external" href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md">OpenAPI
specification</a>
for API documentation. That documentation lives in the
<a class="reference external" href="https://github.com/mattermost/mattermost-api-reference">mattermost-api-reference</a>
repository. To document an endpoint, follow these steps:</p>
<ol class="arabic simple">
<li>Fork
<a class="reference external" href="https://github.com/mattermost/mattermost-api-reference">mattermost-api-reference</a>
and create a branch for your changes.</li>
<li>Find the <code class="docutils literal"><span class="pre">.yaml</span></code> file in the
<a class="reference external" href="https://github.com/mattermost/mattermost-api-reference/tree/master/v4/source">/source/v4</a>
directory that fits your endpoint.<ul>
<li>For example, if you were adding the <code class="docutils literal"><span class="pre">GET</span> <span class="pre">/users/{user_id}</span></code> endpoint you would be looking for <a class="reference external" href="https://github.com/mattermost/mattermost-api-reference/blob/master/v4/source/users.yaml">users.yaml</a></li>
<li>If the file doesn’t exist yet, you might need to create it and update the <a class="reference external" href="https://github.com/mattermost/mattermost-api-reference/tree/master/Makefile">Makefile</a> to include it</li>
</ul>
</li>
<li>Copy an existing endpoint from the same or a different file.</li>
<li>Update the documention you copied with the correct information for
your endpoint, including:<ul>
<li>Tag - The resource type</li>
<li>Summary - A few word summary</li>
<li>Description - A brief 1-2 sentence description</li>
<li>Permissions - The permission required</li>
<li>Parameters - The URL and body parameters</li>
<li>Responses - The success and error responses</li>
</ul>
</li>
<li>Confirm you don’t have any syntax errors by running <code class="docutils literal"><span class="pre">make</span> <span class="pre">build-v4</span></code>
and copying <code class="docutils literal"><span class="pre">/html/static/mattermost-openapi-v4.yaml</span></code> into the
<a class="reference external" href="http://editor.swagger.io">Swagger editor</a>.</li>
<li>Commit your changes and submit a pull request to
<a class="reference external" href="https://github.com/mattermost/mattermost-api-reference">mattermost-api-reference</a>.</li>
</ol>
<p>If you’re looking for examples, see
<a class="reference external" href="https://github.com/mattermost/mattermost-api-reference/blob/master/v4/source/users.yaml">users.yaml</a>.</p>
</div>
<div class="section" id="implementing-the-api-handler">
<h3>Implementing the API Handler</h3>
<p>To implement the API handler you’ll first need to <a class="reference external" href="https://docs.mattermost.com/developer/developer-setup.html">setup your developer
environment</a>, then follow these steps:</p>
<ol class="arabic">
<li><p class="first">Add the declaration for your endpoint.</p>
<ul class="simple">
<li>For an example, see <a class="reference external" href="https://github.com/mattermost/platform/tree/master/api4/user.go">/api4/user.go</a></li>
</ul>
</li>
<li><p class="first">Implement the handler for your endpoint.</p>
<ul class="simple">
<li>The general pattern for handlers is</li>
</ul>
<ul class="simple">
<li>For examples, see the <a class="reference external" href="https://github.com/mattermost/platform/tree/master/api4/user.go#L86">updateUser()</a> and the <a class="reference external" href="https://github.com/mattermost/platform/tree/master/api4/user.go#L58">getUser()</a> handlers.</li>
</ul>
</li>
<li><p class="first">Run the server using <code class="docutils literal"><span class="pre">make</span> <span class="pre">run-server</span></code> to check for syntax errors.</p>
</li>
<li><p class="first">(Optional) Use <code class="docutils literal"><span class="pre">curl</span></code> or <a class="reference external" href="https://www.getpostman.com/">Postman</a> to test the basics of your endpoint. The endpoint will also be tested <a class="reference external" href="https://docs.mattermost.com/developer/api4.html#writing-a-unit-test">through a unit test</a>, so this step is optional.</p>
</li>
</ol>
</div>
<div class="section" id="updating-the-go-driver">
<h3>Updating the Go Driver</h3>
<p>The Go driver for APIv4 is in <a class="reference external" href="https://github.com/mattermost/platform/tree/master/model/client4.go">/model/client4.go</a>.</p>
<p>To add a function to support your new endpoint:</p>
<ol class="arabic simple">
<li>Copy an existing driver function, such as <a class="reference external" href="https://github.com/mattermost/platform/tree/master/model/client4.go#L186">CreateUser</a>.</li>
<li>Paste the function into the section for your endpoint.<ul>
<li>For example, <code class="docutils literal"><span class="pre">POST</span> <span class="pre">/teams</span></code> would go in the Teams section</li>
</ul>
</li>
<li>Modify the function to correctly hit your endpoint.<ul>
<li>Make sure to update the request method to match your endpoint’s HTTP method</li>
</ul>
</li>
</ol>
<p>That’s it, you’ll be able to test your function in the next section.</p>
</div>
<div class="section" id="writing-a-unit-test">
<h3>Writing a Unit Test</h3>
<p>The most important part of this process is to make sure your endpoint
works correctly. Follow these steps to write a test:</p>
<ol class="arabic simple">
<li>Open the test Go file related to your endpoint.<ul>
<li>For example, if you put your handler in <a class="reference external" href="https://github.com/mattermost/platform/tree/master/api4/user.go">/api4/user.go</a> your test will go in <a class="reference external" href="https://github.com/mattermost/platform/tree/master/api4/user_test.go">/api4/user_test.go</a></li>
</ul>
</li>
<li>Write your test based on the other tests in your file<ul>
<li>There are several helper functions in <a class="reference external" href="https://github.com/mattermost/platform/tree/master/api4/apitestlib.go">/api4/apitestlib.go</a> that you may use</li>
</ul>
</li>
<li>Make sure your test covers the following:<ul>
<li>All combinations of correct inputs to your endpoint</li>
<li>Etags for your endpoint, if applicable</li>
<li>Incorrect URL or body parameters return a <strong>400 Bad Request</strong> status code</li>
<li>Requests without a token return a <strong>401 Unauthorized</strong> status code (for endpoints requiring a session)</li>
<li>Requests with insufficent permissions return a <strong>403 Forbidden</strong> status code (for endpoints requiring a permission)</li>
<li>Requests to non-existent resources or URLs return a <strong>404 Not Found</strong> status code</li>
</ul>
</li>
</ol>
<p>Returning the correct error code might require investigation in the
<a class="reference external" href="https://github.com/mattermost/platform/tree/master/app">app</a> or
<a class="reference external" href="https://github.com/mattermost/platform/tree/master/store">store</a>
packages to find the source of errors. Status codes on errors should be
set at the creation of the error.</p>
<p>When completing this step, please make sure to
use the new <code class="docutils literal"><span class="pre">model.NewAppError()</span></code> function (<a class="reference external" href="https://github.com/mattermost/platform/tree/master/store/sql_user_store.go#L112">see example</a>).</p>
</div>
<div class="section" id="submitting-your-pull-request">
<h3>Submitting your Pull Request</h3>
<p>Please submit a pull request against the
<a class="reference external" href="https://github.com/mattermost/platform">mattermost/platform</a>
repository by <a class="reference external" href="https://docs.mattermost.com/developer/contribution-guide.html#preparing-a-pull-request">following these instructions</a>.</p>
</div>
</div>
</div>

<div style="margin-top: 15px;">
<span class="pull-left"><a href="/contribute/server/developer-workflow/">< Back to Workflow</a></span>
</div>
<br/>
