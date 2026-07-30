# Move hive.js onto unrest-server + unrest-ui

**Status: the client half is done. The server half is now mostly done too —
the package rename landed in bd14671 (2026-07-30), forced by a production
outage. What's left is the SPA catch-all and some pruning; see below.**

## Where this stands

**Client — done.** `client/` builds with Vite (`client/vite.config.js`, aliasing
`@unrest/ui` to `../../unrest-ui/dist/` and `hive.js` to `../game`), and
`client/src/main.js` bootstraps `@unrest/ui` + FormKit. `package.json` has no
`@unrest/vue*`, no `@unrest/css`, no vue-cli. Views are `.jsx`, the router uses
`createAuthGuard()` from `@unrest/ui`, and `Home.vue` talks to the API through
`fetchJson`. Nothing below applies to `client/`.

**Server — the import gap is closed.** This section used to describe
`requirements.txt` listing `-e ../unrest-server` while the code still imported
the old `django-unrest`. That gap is what took the site down: once hive started
running under daphne, the stale `unrest` import crash-looped the service and
hive.unrest.io served 502s until bd14671.

Done in that commit:

- `django-unrest` + `django-unrest-schema` uninstalled, `-e ../unrest-server`
  installed. `import unrest_api` succeeds and `import unrest` now raises
  `ModuleNotFoundError`, as this note wanted.
- `'unrest'` → `'unrest_api'` in `INSTALLED_APPS`, `MIDDLEWARE`, and
  `server/urls.py`.
- `DATABASES` pointed back at postgres. e0ca106 had switched it to an empty
  sqlite file — a local-dev change that landed in `00-base.py` with no
  `local.py` override, so it would have served a site with no data once the
  import error was fixed. sqlite for local dev belongs in the gitignored
  `server/settings/local.py`.

**Correction to what this note previously warned:** it said not to assume
`JsonBodyMiddleware` was a straight rename, because `unrest_api` "ships
`Json404Middleware`, which is not what `JsonBodyMiddleware` did." That was
wrong — `~/projects/unrest-server/unrest_api/middleware.py` defines *both*
`JsonBodyMiddleware` (line 7) and `Json404Middleware` (line 20). The rename was
safe and no porting was needed.

## Steps

- [x] `.venv/bin/pip install -e ../unrest-server` from the repo root (the
      relative path is resolved against the requirements file's directory).
- [x] `server/settings/00-base.py`: `'unrest'` → `'unrest_api'` in
      `INSTALLED_APPS` and `MIDDLEWARE`. Both `JsonBodyMiddleware` and
      `Json404Middleware` exist in `unrest_api.middleware`; it was a straight
      rename.
- [x] `server/urls.py`: `include('unrest.urls')` → `include('unrest_api.urls')`,
      or straight to `unrest_api.email_auth.urls` if
      [email-login](email-login.md) lands in the same pass — it re-exports
      `logout`/`guest`/`me`/`settings`/`csrf/`, so it's the only auth include
      needed. `/api/auth/guest` must keep working either way;
      `client/src/views/Home.vue` posts to it for Play as Guest.
- [ ] Replace the SPA catch-all, currently an inline
      `lambda request: HttpResponse(open('dist/index.html').read())`. It reads a
      **relative** path — it works only when the process cwd is the repo root —
      and re-reads the file on every request. Use `unrest_api`'s index view or
      at minimum a `BASE_DIR`-anchored path.
- [ ] Set `APP_ORIGIN = 'https://hive.unrest.io'` (email-login needs it, and it
      is harmless before then).
- [x] `manage.py migrate` and `manage.py check`. Check is clean; `showmigrations`
      reports nothing unapplied against postgres.
- [ ] Prune leftovers: `django-registration` is still in `requirements.txt` with
      nothing importing it; `mailer` is in `INSTALLED_APPS` and only matters if
      mail actually sends (see [email-login](email-login.md)). Also
      `social_django` is gone from `INSTALLED_APPS` but its five
      `social_auth_*` tables remain in the postgres database, orphaned.
- [x] `.venv/bin/pip uninstall django-unrest django-unrest-schema`, and update
      the `deploy/hive.service` comment about that editable install. Note the
      unit's `ReadWritePaths` is still repo-only while `unrest_api` now lives
      outside the tree at `~/projects/unrest-server` — that works, because
      `ProtectHome=read-only` still permits imports.
- [ ] Delete the leftover `.venv/src/django-unrest` checkout. Not urgent: the
      uninstall removed its `.pth` finder, so `import unrest` already fails.
      This is just disk tidying.

## Verification

`systemctl restart hive` (daphne — **this drops every open websocket**, so pick a
quiet moment), then: home screen loads → Play as Guest → local game → place a
piece → undo (`$mod+KeyZ`) → create an online room → second browser joins →
both see moves and chat. `server/consumers.py` closes the socket for
unauthenticated users, so an auth regression breaks online play first.

## Risks

- **Shared-library blast radius.** `unrest-server` is an editable install shared
  with weather and tempo; a change made there for hive ships to both instantly.
  Read `~/projects/unrest-server/CHANGELOG.md`, and don't fix hive by editing
  the library unless the fix is genuinely general.
- Swapping the auth app can invalidate existing sessions. Acceptable — just not
  mid-game.
- `game/` (rules engine plus `game/AI/`) has no unrest dependency and should
  come through untouched. A diff there means something went wrong.

## Done when

- [x] `git grep -n "'unrest'\|import unrest\b\|unrest\.urls\|unrest\.middleware"`
  returns nothing outside `backlog/`.
- [x] `.venv/bin/python -c "import unrest_api"` succeeds; `import unrest` fails.
- [x] `manage.py check` is clean.
- [ ] **An online game works end to end — still unverified by a human.** The
  bd14671 fix was checked at the protocol level only: HTTP 200 on `/` and an
  authenticated `/api/auth/me` through nginx, room create/join against postgres,
  and a websocket upgrade to `/ws/chat/<id>/` returning 101. Nobody has actually
  played a two-browser game since. Do that before calling this task done.
