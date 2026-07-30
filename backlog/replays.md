# Save and view replays

Also item 2 of `docs/todos.md` ("add a replay system to go forward and backwards
in the game") — that note is superseded by this file; see
[remove-docs-directory](remove-docs-directory.md).

## Why

Every finished game already contains its own replay and hive throws it away.
`Game.state` (`server/models.py`) is `{'actions': [...]}`, and `B.doAction(b,
args)` in `game/Board/index.js` is a pure reducer over that list — place / move /
special / delete / toggleCheat, each a small array. Replaying is `B.new(...)`
plus a fold over the actions. There is no replay UI, no "my games" list, and a
finished game (`Game.done = True`) is invisible afterwards.

Undo/redo exist (`$mod+KeyZ` / `$mod+KeyY` in `client/src/components/Game.vue`)
but are gated to **local games only** in `client/src/store/room.js` — stepping
back through a finished online game is exactly what's missing.

The manual workaround is `components/ExportGame.vue` → a JSON blob pasted into
`components/ImportGame.vue`. That proves the data round-trips; this makes it a
feature.

## Scope

1. Persist finished games so they can be listed and re-opened.
2. A replay viewer route that steps through the action list.
3. Save-and-share for local and AI games too — they currently live only in
   `localStorage` under `local_storage_game` (`client/src/store/room.js`).

## Server

- [ ] `Game` needs enough metadata to list a replay without deserializing it:
      `winner`, the player user ids, a `finished` timestamp, the rule set, and
      whether it was an AI game. Some of this is already inside `state`
      (`B.json_fields` includes `winner`, `players`, `rules`) — promote what the
      list view needs to real columns, leave the rest in the JSONField.
- [ ] Make saving **explicit** (a `saved` boolean alongside `done`) rather than
      keeping every abandoned room. Rooms get abandoned constantly.
- [ ] Endpoints: `GET /api/replay/` (mine + public) and `GET /api/replay/<id>/`
      (actions + rules + player names). After
      [unrest-migration](unrest-migration.md) these are
      `unrest_api.schema.schema_form` registrations with `user_can_GET`; before
      it, plain views next to `new_room` / `join_room` in `server/views.py`.
- [ ] Decide the sharing model. `Room` already has a `public` boolean — mirror
      its semantics instead of inventing a second scheme.
- [ ] Mark the game done + saved in `server/consumers.py` where the win is
      detected, so the replay exists the moment the game ends.

## Client

- [ ] `views/Replay.vue` at `/replay/:game_id/`, using the `__route` convention
      the other views in `client/src/views/` follow.
- [ ] Rebuild state by folding actions, not by storing board snapshots — one
      source of truth, and it stays correct as the engine changes. **Careful:**
      `B.doAction` mutates `last_move_at` via `nextTurn` and appends to
      `b.actions`, so hand it a fresh `B.new()` and let it rebuild.
- [ ] Transport controls: first / prev / next / last / play-pause, plus a scrub
      bar over turn index. Prefer "rebuild from turn 0 to N" (cheap — games are
      tens of moves) over driving `B.undo` backwards, which is where the engine
      is hairiest around specials (`game/Board/specials.js`).
- [ ] Reuse `components/Board.vue` read-only: pass `rows`, ignore `clickPiece`,
      and pass `arrows` from `board.last.path` so the replay gets the existing
      move arrows for free.
- [ ] "Save replay" from the end-of-game UI — `components/Winner.vue` already
      renders an alert with an action list (`Keep Playing`, …); add a button
      there — plus a replay list view using `components/MiniBoard.vue` for
      thumbnails.
- [ ] Local and AI games: offer the same save, POSTing the `localStorage`
      board's actions to the same endpoint. It's the only way those games ever
      reach the server.

## Notes and gotchas

- Store **the action list**, not the derived board. `stacks`, `piece_types`,
  `piece_owners` and `hash` are all recomputable and would go stale against
  engine changes.
- `game/Board/resize.js` has `board.actions = []` with a `TODO issue #1` — a
  resize throws the history away, so a resized board cannot be replayed. Fix it
  or refuse to save those games; don't emit a replay that silently starts from
  the wrong position.
- Commit `16aed3f` ("hack around recursion bug for pieces that move other
  pieces") means specials replay is where an off-by-one will hide. Add a jest
  test in `game/__tests__` asserting that folding a recorded action list
  reproduces the final board `hash` — that one test covers most of this feature.
- Store the engine/rules version with the actions so an old replay that no
  longer reproduces can be *detected* rather than rendered wrong.

## Done when

- Finishing an online game offers "save replay", and the saved replay opens from
  a list.
- Stepping to the last turn of a replay produces the same board `hash` the live
  game ended on.
- A local or AI game can be saved and replayed.
