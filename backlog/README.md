# hive.js backlog

One file per task. Each is written to be picked up cold — what the code looks
like today, what it should look like after, and how to tell it worked.

| Task | Size | Depends on |
| --- | --- | --- |
| [Turn CSRF protection back on](restore-csrf.md) | small | — |
| [Fold `docs/` into `backlog/` and delete it](remove-docs-directory.md) | small | — |
| [Finish the unrest-server migration](unrest-migration.md) | medium (server rename done; SPA catch-all + pruning left) | — |
| [Login = email code + play as guest](email-login.md) | medium | unrest-migration |
| [Save and view replays](replays.md) | medium | — |
| [Animate piece movement](animate-piece-movement.md) | medium | — |
| [Autoplaying game behind the login screen](login-attract-mode.md) | small | replays (for the game list), email-login (for the screen) |

Suggested order: **restore-csrf** first — it is a live security hole on a
deployed site and is now believed to be roughly a one-line fix (see the note).
Then **remove-docs-directory** (it's five minutes and it
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

## Why this lives at `backlog/` and not `docs/backlog/`

`docs/` was the GitHub Pages build output and is now two stray notes files;
[remove-docs-directory](remove-docs-directory.md) retires it. The repo root is
also where `unrest_api.backlog` writes admin notes by default
(`BASE_DIR.parent / 'backlog'`), so the two line up once
[unrest-migration](unrest-migration.md) lands.
