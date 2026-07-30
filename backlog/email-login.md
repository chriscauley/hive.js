# Reduce login to "email code" + "play as guest"

**Depends on [unrest-migration](unrest-migration.md)** — `unrest_api.email_auth`
can't be imported until the server is off `django-unrest 0.1.11`.

## Why

`client/src/views/Home.vue` offers three ways in — Play as Guest, Create An
Account, Log In — and **two of them are already broken**. The account links
point at `/auth/sign-up/` and `/auth/login/`, but `client/src/router/index.js`
starts from `const routes = []` and only adds what `loadViews()` finds in
`@/views` and `@/sprite`; the old `@unrest/vue-auth` route pack that used to
supply those paths went away with the client migration. So both buttons
currently lead nowhere. Only guest play (`fetchJson('/api/auth/guest')`) works.

After: **two** choices, both real. Enter an email → get a 6-digit code → you're
in (account created on first sign-in, no registration step). Or play as guest.

## What unrest-server gives you

From `unrest_api.email_auth` (full contract in
`~/projects/unrest-server/CHANGELOG.md`):

- `POST auth/email/` `{email}` → emails a 6-digit code **and** a click-through
  link (a signed `{email, code}` token that auto-submits the same code).
- `POST auth/email/confirm/` `{email, code}` → logs in, returns the user dict.
  No separate registration; confirming creates the account, username derived
  from the email, password unusable.
- Codes are hashed, one active per email, single-use, expire after
  `UNREST_LOGIN_CODE_EXPIRY` (default 15 min).
- Throttling built in: `UNREST_LOGIN_ATTEMPT_LIMIT` (10) per
  `UNREST_LOGIN_ATTEMPT_WINDOW` (30 min) → 429, DB-backed and self-pruning.
- Bad/expired links bounce to `UNREST_LOGIN_PATH` (default `/login`) with
  `?expired=link` or `?expired=throttle`.
- The include **re-exports** `logout` / `guest` / `me` / `settings` / `csrf/`,
  so it replaces `unrest_api.urls` entirely and guest play keeps working.

On the client, `@unrest/ui` ships `UnrestLoginPanel.vue` — this exact flow,
already built: email form → code form → resend / use-a-different-email, renders
the `?expired=` banner, store-agnostic, emits `success` with the user dict.

## Steps

### Server

- [ ] `INSTALLED_APPS`: add `'unrest_api.email_auth'`; `manage.py migrate`
      (ships `LoginCode` and `LoginAttempt`).
- [ ] `server/urls.py`: `path('api/auth/', include('unrest_api.email_auth.urls'))`.
- [ ] `APP_ORIGIN = 'https://hive.unrest.io'` — emailed links and post-click
      redirects are built from it, not from the `Host` header. Cross-check
      against `ALLOWED_HOSTS` / `CSRF_TRUSTED_ORIGINS` in
      `server/settings/00-base.py`, which also list `hive.localhost` and
      `localhost:8283` (the Vite dev port).
- [ ] Set `UNREST_LOGIN_PATH` to hive's login route.
- [ ] **Verify mail actually leaves the box.** `mailer` is in `INSTALLED_APPS`
      and `django-mailer` in `requirements.txt`; if hive keeps queueing through
      it, something has to run `manage.py send_mail` on a schedule, or every
      code sits in the queue forever. Test with a real send to a real inbox, not
      the console backend — nothing else in this task matters if mail doesn't
      arrive.
- [ ] Optionally shadow `email_auth/login_subject.txt` / `login_body.txt`
      (context: `code`, `link`, `expiry_minutes`) so the mail says Hive.

### Client

- [ ] Rewrite the `v-else` branch of `client/src/views/Home.vue`: drop the two
      dead router-links, keep Play as Guest, render `UnrestLoginPanel` beside
      it.
- [ ] Wire the panel's `success` emit to the same path the guest button uses —
      `this.$store.room.setUser(user)` then `replace($route.query.next)` — so a
      code sign-in from a room invite lands back in the room.
- [ ] Add a `/login` route (or whatever `UNREST_LOGIN_PATH` is set to) that the
      emailed-link bounce can land on, and pass `?expired=link|throttle`
      through to the panel. `createAuthGuard()` in `client/src/router/index.js`
      is already in place to redirect protected routes there.
- [ ] Offline mode (`VITE_OFFLINE`) short-circuits the user to `{id: 'local'}`
      in `Home.vue`. Keep that branch working — the login panel must not render
      in an offline build.

### Guest accounts

Guests are why hive can't simply require email. Two things to settle:

- [ ] A guest who later signs in with an email becomes a *different* user and
      loses their rooms (`Room.users` is an M2M). Either attach the email to the
      existing guest user or say so plainly in the UI. Decide explicitly —
      silently orphaning a guest's in-progress game is the bad outcome.
- [ ] `server/consumers.py` closes the socket for `not is_authenticated`, so
      guests need a real session. Confirm it survives a daphne restart (a normal
      Django session should).

## Done when

- The logged-out home screen shows exactly two options and no dead links.
- A never-before-used email plus the code from the mail logs you into a working
  account.
- The emailed link logs you in too, and a second click fails cleanly rather than
  500ing.
- Eleven attempts in half an hour get a 429 and the UI says so.
