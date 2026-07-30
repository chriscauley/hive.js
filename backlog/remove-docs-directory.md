# Fold `docs/` into `backlog/` and delete it

**Size: small.** Pure file moves plus one triage pass.

## Why

`docs/` was the GitHub Pages demo site — a committed
`vue-cli-service build --dest ../docs` output, published from
`chriscauley/hive.js`, last built **2021-07-07** (`6e2ea9b "docs build"`). The
build itself is already gone: `7ff5045 "…clean up docs/"` deleted it, and the
Vite client that replaced vue-cli has no `build:docs` script, so nothing writes
there any more.

What's left is two tracked files that are really backlog notes:

- `docs/todos.md` — three loose items.
- `docs/todos/ai.md` — a detailed AI improvement plan (evaluation weights,
  search-efficiency priorities, references). This is the valuable one; it must
  not be lost in the move.

Two places for the same thing is one too many, and `docs/` still reads as "the
published site" to anyone who remembers the Pages era.

## Steps

- [ ] Move `docs/todos/ai.md` → `backlog/ai-improvements.md` verbatim (it is
      already written like a backlog item). Add it to the index table in
      [README.md](README.md).
- [ ] Triage the three items in `docs/todos.md`:
      - *"arrows over the pieces showing moves instead of chalk… hover a
        destination shows the pieces the tile moved across"* — **largely done**
        by `e533857`; `client/src/components/Board.vue` renders an SVG arrow
        overlay and `game/Board/paths.js` traces per-piece routes, with the
        green hover preview wired in `Game.vue`. Check what's left of the
        "chalk" rendering and either close it or write down the remainder.
      - *"add a replay system to go forward and backwards in the game"* — this
        is [replays.md](replays.md). Drop the duplicate.
      - *"persist new game settings (AI enabled, difficulty, color, preset) in
        local storage… save/load code is in NewGame.vue using LS_AI_KEY but it's
        not working"* — a live bug with no home yet. Give it its own file,
        `backlog/newgame-settings-persistence.md`.
- [ ] `git rm -r docs/` once nothing unique is left in it.
- [ ] Confirm GitHub Pages is actually off for `chriscauley/hive.js` (Settings →
      Pages → Source: None). Deleting the directory doesn't disable a Pages
      site that was configured to serve from it, and the 2021 build is still
      reachable in history.

## Check before deleting

- [ ] `git grep -rn "docs/" -- ':!docs' ':!node_modules'` — make sure no README,
      script, or nginx config points at it.
- [ ] The tracked list is exactly two files (`git ls-files docs`). If that has
      grown since this was written, triage the additions too rather than
      deleting blind.

## Done when

- `git ls-files docs` is empty and `docs/` is gone from the working tree.
- Every note that was in it is either in `backlog/`, closed as already-done, or
  deliberately dropped.
- GitHub Pages is disabled for the repo.
