### Write specs

1. See [which-query-to-use]({{< ref "/contribute/more-info/webapp/e2e/which-query-to-use" >}}) when selecting an element base on order of priority.
   - Use `camelCase` when assigning `data-testid` or element ID. Watch out for potential breaking changes in the snapshot of the unit testing.  Run `make test` to see if all are passing, and run `npm run updatesnapshot` or `npm run test -- -u` if necessary to update snapshot testing.
2. Add custom commands to `/e2e/cypress/tests/support`. See Cypress documentation for more details about custom commands: {{< newtabref href="https://docs.cypress.io/api/cypress-api/custom-commands.html" title="Cypress custom commands" >}}.
   - For ease of use, in-code documentation and discoverability, custom commands should have type definition added. See {{< newtabref href="https://github.com/mattermost/mattermost-webapp/blob/master/e2e/cypress/tests/support/api/user.d.ts" title="declaration file" >}} for reference on how to include.


