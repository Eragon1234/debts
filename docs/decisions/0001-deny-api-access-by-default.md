# Deny API access by default

Date: 2026-10-07

## Status

Accepted.

## Context

Authentication was left to each endpoint leading to data leaks in case of a forgotten auth check.
This also leads to a lot of duplicate code.

We actually ran into this issue, the /api/users/search endpoint was left unprotected for an extended period of time
because the authentication check was left out by mistake.

## Decision

To prevent such mistakes from happening again, every API endpoint will be protected by default.
Only endpoints under /api/public will be accessible without authentication.
This prevents routes from being left exposed accidentally
and switches the error surface from a data leak to a bad user experience.

Authorization is still left to the individual endpoint.

This default deny mechanism will be implemented by middleware protecting any path starting with /api.
Since the middleware runs before the Nuxt router, the middleware receives the raw path which we cannot trust.
Instead of trying to match the Nuxt router's normalization,
which would open up security holes in case of a mismatch,
we'll reject any non-normalized path.
This includes paths that contain encoded characters as well as paths changing when parsed by the URL constructor.
Paths will be treated as case-insensitive.

The parsed user session will be set on the event context.

After this implementation, the per-endpoint auth checks will be removed.

### Alternatives considered

#### A wrapper for `defineEventHandler` providing authentication

This approach reduces code duplication and makes authentication reusable,
but since authentication is still opt-in, this does not prevent data leaks.

#### An allowlist for public paths

Like the chosen approach, this approach would prevent routes from being exposed by accident.
The allowlist would allow us to keep the old URLs.
But the allowlist could drift out of sync when API paths change.
This would fail without leaking data.
But the chosen approach prevents drift by having the pathname be the single source of truth.

## Consequences

Any new API endpoint will be protected by default.
To escape this, any public endpoint has to start with /api/public.

`event.context.session` contains the parsed user session on every request.

All public routes have to be moved under /api/public.
This may break internal as well as external services that rely on the old URLs.
Especially the OIDC callback URL has to be updated at the OIDC provider.

Encoded paths will be rejected by the middleware.
This affects every route including client routes.
Encoded characters in query strings will continue working.

The middleware does NOT protect server routes in /server/routes.
