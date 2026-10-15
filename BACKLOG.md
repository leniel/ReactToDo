# Backlog

Ideas for future improvements to this small app and learning project. Priorities are provisional; choose the next item based on what you want to learn.

## Planned

### P1 — In-app user and role management

Let an authorized administrator search users and assign or remove the existing `Reader`, `Creator`, `Editor`, and `Deleter` roles without opening the Auth0 Dashboard.

- Keep Auth0 as the source of truth for users and roles.
- Add protected .NET endpoints and a React **Users & Permissions** page.
- Call the Auth0 Management API only from the backend using a dedicated machine-to-machine application and least-privilege scopes.
- Store the Management API credential in Azure App Service settings or Key Vault; never expose it to React or commit it.
- Bootstrap the first `SuperAdmin` manually in Auth0. Require that role on every admin endpoint, and don't allow the page to grant `SuperAdmin`.
- Record who changed which user's roles and when.
- Add tests for authorization, role assignment, and failure cases.

### P2 — Restore soft-deleted todos

Add a way to review and restore todos marked with `DeletedOn`, while keeping normal todo lists limited to active items.

- Add an owner-protected restore endpoint.
- Decide whether restored todos appear immediately or are listed in a separate deleted-items view.
- Test that restore clears `DeletedOn` and makes the todo visible again.

### P3 — Show todo creation time

Expose `CreatedOn` in the UI so users can see when a todo was originally created. Existing rows without a known timestamp should display a clear blank or “Unknown” value.

### P4 — Make authorization errors clearer

Show a useful message for expired sign-in (401) and insufficient permissions (403), rather than the same generic request failure message. Keep server details and tokens out of user-facing messages.

## Backlog notes

- The deployed footer already displays the Azure DevOps build number and source commit hash.
- This is a public MIT-licensed learning project. Do not add secrets, passwords, or private deployment configuration here.
