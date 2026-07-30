# Turn CSRF protection back on

**DONE (2026-07-30).** `django.middleware.csrf.CsrfViewMiddleware` is back in
`MIDDLEWARE` in `server/settings/00-base.py`, restored to its original slot
between `CommonMiddleware` and `AuthenticationMiddleware`.

It was a one-line settings change — no client change and no rebuild. Kept here
for the reasoning and for the `join_room` issue at the bottom, which is **not**
fixed.

## How it got this way

Removed in e0ca106 ("Migrate from django-unrest to unrest-server"), in the same
pass that swapped the auth app. Nothing in the commit message explains it; the
most likely reason is that the SPA wasn't sending a token yet and the quickest
way to keep login working was to drop the middleware.

It went unnoticed because nothing fails when CSRF is off — the site behaves
normally, it just accepts cross-origin writes. Found on 2026-07-30 while fixing
the 502 (bd14671), which was a separate fallout of the same commit.

## Why it was a small job

The client half was already built. `@unrest/ui`'s `fetchJson`
(`~/projects/unrest-ui/src/api.js`) already reads the `csrftoken` cookie and
sets the `X-CSRFToken` header on every mutation, and **every** API call in
`client/src/` goes through `fetchJson` — four call sites (`store/room.js` ×2,
`views/Home.vue`, `components/AppNav.vue`), no raw `fetch`.

The token also already reached the browser, and the ordering is guaranteed
rather than lucky:

    router.beforeEach(createAuthGuard())   // router/index.js:33
      -> await ensureUser()                // unrest-ui/src/auth.js:105
      -> fetchJson('/api/auth/me')         // unrest-ui/src/auth.js:15
      -> me_view is @ensure_csrf_cookie    -> csrftoken cookie set
    ...navigation resolves, THEN...
    NewGameRedirect.mounted()              // views/NewGameRedirect.jsx:7
      -> $store.room.save({})              -> POST /api/room/ with X-CSRFToken

The guard is awaited *before* navigation completes and `mounted()` only runs
after, so the cookie is always present by the time the one protected mutation
fires. That is why no `configureApi({ csrfUrl })` call was needed and the
client did not have to be rebuilt.

## What was done

- [x] Added `'django.middleware.csrf.CsrfViewMiddleware'` back to `MIDDLEWARE`
      in `server/settings/00-base.py`, in its original slot after
      `CommonMiddleware` and before `AuthenticationMiddleware`.
- [ ] *Not done, and not needed:* calling `configureApi({ router, csrfUrl:
      '/api/auth/csrf/', loginPath: '/login' })` in `client/src/main.js`
      (currently never called). The trace above makes it redundant. Worth
      revisiting only if a route is ever added that can fire a mutation without
      passing through the auth guard first.
- [x] `systemctl restart hive`.

## What to actually exercise

Only one endpoint in this repo is both a mutation and not exempt:
**`POST /api/room/`** (`new_room` in `server/views.py`). That is the one that
403s if the token plumbing is wrong.

The `unrest_api` auth views are all `@csrf_exempt` (`register`, `login`,
`logout`, `guest`), so Play as Guest and logout will keep working *even if the
token is broken* — they prove nothing. Do not treat "I can still log in" as a
passing test.

Websockets are unaffected; Django's CSRF middleware doesn't apply to them.

Verified against the live site after the restart, driving it the way the
browser does (`/api/auth/me` first to seed the cookie, then the POST):

| check | result |
| --- | --- |
| `/api/auth/me` sets `csrftoken` cookie | yes |
| `POST /api/room/` **without** token | **403** — protection is active |
| `POST /api/room/` **with** token | 200 |
| `GET /` | 200 |
| `POST /api/auth/guest` | 201 (still `@csrf_exempt`, as intended) |

- [ ] Still worth a human doing it in a real browser: log in → create an online
      room → play a move. The above is protocol-level.

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
