# Turn CSRF protection back on

**CSRF protection is currently disabled site-wide on hive.unrest.io.**
`django.middleware.csrf.CsrfViewMiddleware` is absent from `MIDDLEWARE` in
`server/settings/00-base.py`.

## How it got this way

Removed in e0ca106 ("Migrate from django-unrest to unrest-server"), in the same
pass that swapped the auth app. Nothing in the commit message explains it; the
most likely reason is that the SPA wasn't sending a token yet and the quickest
way to keep login working was to drop the middleware.

It went unnoticed because nothing fails when CSRF is off — the site behaves
normally, it just accepts cross-origin writes. Found on 2026-07-30 while fixing
the 502 (bd14671), which was a separate fallout of the same commit.

## Why this is likely a small job now

The client half is already built, which is the part that would normally make
this annoying. `@unrest/ui`'s `fetchJson` (`~/projects/unrest-ui/src/api.js`)
already reads the `csrftoken` cookie and sets the `X-CSRFToken` header on every
mutation, and **every** API call in `client/src/` goes through `fetchJson` —
there are only four call sites (`store/room.js` ×2, `views/Home.vue`,
`components/AppNav.vue`), no raw `fetch`.

The token also already reaches the browser: `unrest_api`'s `me_view` is
decorated `@ensure_csrf_cookie`, and `client/src/store/room.js:190` calls
`fetchJson('/api/auth/me')` on load — so the cookie is set before any mutation
fires.

So the minimum change may be one line of settings. Verify rather than assume.

## Steps

- [ ] Add `'django.middleware.csrf.CsrfViewMiddleware'` back to `MIDDLEWARE` in
      `server/settings/00-base.py`. Order matters: after `SessionMiddleware`,
      before `AuthenticationMiddleware` — i.e. restore it to the slot it was
      removed from.
- [ ] Consider also calling `configureApi({ router, csrfUrl: '/api/auth/csrf/',
      loginPath: '/login' })` in `client/src/main.js` (imported from
      `@unrest/ui`, which currently isn't called at all). Not strictly required
      given `@ensure_csrf_cookie` on `me`, but it makes `fetchJson` fetch a
      token on demand instead of depending on `/api/auth/me` having run first —
      worth having if a mutation can ever be the session's first request.
      Requires `cd client && npm run build`.
- [ ] `systemctl restart hive` (daphne — **drops every open websocket**).

## What to actually exercise

Only one endpoint in this repo is both a mutation and not exempt:
**`POST /api/room/`** (`new_room` in `server/views.py`). That is the one that
403s if the token plumbing is wrong.

The `unrest_api` auth views are all `@csrf_exempt` (`register`, `login`,
`logout`, `guest`), so Play as Guest and logout will keep working *even if the
token is broken* — they prove nothing. Do not treat "I can still log in" as a
passing test.

Websockets are unaffected; Django's CSRF middleware doesn't apply to them.

- [ ] Log in → create an online room → confirm 200, not 403.
- [ ] Confirm a POST to `/api/room/` with no `X-CSRFToken` now gets 403 — the
      point is that it *starts* failing. If it still succeeds, the middleware
      isn't active.

## While you're here: `join_room` mutates on GET

`server/views.py:10` — `join_room` is reached by `GET /api/room/<id>/` but calls
`room.users.add(request.user)` and `room.save()`. CSRF middleware does not
protect GET, so restoring the middleware does **not** cover this; any page can
still trigger a room join with an `<img src>`. Low severity (joining a room is
not destructive), but it means this task doesn't fully close the hole implied by
its title. Making it POST is a client change too (`store/room.js`), so it may
belong in its own pass.

## Relationship to unrest-migration

Not blocked by [unrest-migration](unrest-migration.md) — the server-side rename
it describes already landed in bd14671, and `unrest_api.urls` already exposes
the `csrf/` endpoint referenced above.

If [email-login](email-login.md) lands first and switches the include to
`unrest_api.email_auth.urls`, note that it re-exports `csrf/` too, so the
endpoint path doesn't move.
