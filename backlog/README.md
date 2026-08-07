# hive.js backlog

One file per task. Each is written to be picked up cold — what the code looks
like today, what it should look like after, and how to tell it worked.

The `backlog/*.md` files here are the curated end of the pipeline. The other end
is `backlog/notes/` — see [Incoming notes](#incoming-notes) below.

| Task | Size | Depends on |
| --- | --- | --- |
| [Fold `docs/` into `backlog/` and delete it](remove-docs-directory.md) | small | — |
| [Finish the unrest-server migration](unrest-migration.md) | medium (server rename done; SPA catch-all + pruning left) | — |
| [Login = email code + play as guest](email-login.md) | medium | unrest-migration |
| [Save and view replays](replays.md) | medium | — |
| [Animate piece movement](animate-piece-movement.md) | medium | — |
| [Autoplaying game behind the login screen](login-attract-mode.md) | small | replays (for the game list), email-login (for the screen) |

Done: [restore-csrf](restore-csrf.md) (2026-07-30) — kept for its notes on the
token flow and for the unfixed `join_room`-mutates-on-GET issue.

Suggested order: **remove-docs-directory** first (it's five minutes and it
un-duplicates the notes this folder now competes with), then
**unrest-migration → email-login**. **replays** and
**animate-piece-movement** are independent and can go at any time.
**login-attract-mode** is last — it wants a replay list to draw from, the new
login screen to sit behind, and the movement animation to not look broken.

## Deploy reminders for anything here

hive runs **daphne**, not uwsgi, so there is no `touch-reload`. Backend changes
need `systemctl restart hive`, **which drops every open websocket** — restart
when nobody is mid-game. Frontend changes need `cd client && npm run build`
(Vite, output to `dist/`, served by nginx directly). Never `npm run dev` on this
box.

## Incoming notes

`backlog/notes/` is the inbox, written by `unrest_api.backlog` from the admin
`notes` view: `YYYY-MM-DD-slug.md` plus images in `backlog/notes/img/`. Nobody
hand-authors those — the library owns the layout and makes the directories on
first write. It arrives with [unrest-migration](unrest-migration.md); until then
the folder won't exist.

A note is raw input, not a task. Either it gets fixed immediately and deleted in
the same commit as the fix, or it gets promoted into a `backlog/<slug>.md` task
file here, added to the table above, and deleted. Notes shouldn't accumulate.

## Why this lives at `backlog/` and not `docs/backlog/`

`docs/` was the GitHub Pages build output and is now two stray notes files;
[remove-docs-directory](remove-docs-directory.md) retires it. The repo root is
also where `unrest_api.backlog` writes admin notes by default
(`BASE_DIR.parent / 'backlog'`), so the two line up once
[unrest-migration](unrest-migration.md) lands.
