# Animate piece movement

## Why

Pieces teleport. A move re-renders the grid and the piece is simply somewhere
else — in an online game, where the opponent's move arrives over the websocket
while you're looking elsewhere, it's easy to miss what changed.

There is already a partial answer in the tree: `e533857` added an SVG arrow
overlay, so a completed move draws a blue arrow along its path and hovering a
destination previews a green one. Arrows say *where* a piece went; the piece
still jumps. This task adds the transit.

## What you already have

Read these first — most of the geometry work is done:

- **`game/Board/paths.js`** traces the real route per piece type (BFS for ant,
  3-step for spider, directional hops for grasshopper, on-on-off for ladybug),
  and `game/Board/index.js` stashes it on the move: `b.last.path` is the list of
  indices the piece travelled through (`[from, to]` for a place or simple step).
  That is the animation path, already computed.
- **`client/src/components/Board.vue`** has `indexToPosition`, a map from board
  index → `{x, y}` in `em` within the overlay's viewBox
  (`x = ix * 4.75 + 2.375`, `y = iy * 5.446 + 2.723`, offset `-2.71` on odd
  columns). Tween along the same coordinates the arrows use and the motion lines
  up with them exactly.
- Tiles carry `data-index`, `data-xy` and `data-piece_id`, so a piece is
  locatable in the DOM before and after.

## The hard part: pieces have no stable DOM identity

`game/Board/toRows.js` + `Board.vue` render like this:

1. `sliceBoard(board)` recomputes the occupied bounding box **every render** and
   emits rows from `min_y..max_y` × `min_x..max_x`.
2. `Board.vue` renders `v-for="(row, ir) in rows"` / `v-for="(cell, ic) in row"`
   keyed by **array position**, and each cell's stack as `v-for="(tile, iz)"`
   where `tile` is a **CSS class string**.

So a piece isn't a component or a keyed node — it's a class string on a div
whose DOM position *is* its grid position. `<transition-group>` has nothing to
work with. Worse: when a move extends the hive, `min_x`/`min_y` shift and every
cell's coordinates change even though nothing else moved. Naive FLIP over the
tiles animates the whole board sideways on those turns. That is the failure mode
to design against.

## Suggested approach: overlay tween, reusing the arrow geometry

Leave the grid alone; animate one floating piece above it, in the same overlay
layer the arrows already occupy.

- [ ] On a change to `board.last`, map `board.last.path` through
      `indexToPosition` and tween a clone of the piece (same class string
      `makeStack` produces) along those points.
- [ ] Hide the real destination tile for the duration — a class on the board
      root plus a `[data-index="…"]` selector — so it doesn't appear twice.
- [ ] Measure after layout: the re-slice means positions must be read from the
      **new** grid. `nextTick` + one `requestAnimationFrame`.
- [ ] Follow the path's waypoints rather than lerping start→end. The path is
      already the right shape for a grasshopper hop or a spider's three steps.
- [ ] Keep it to 200–300 ms. This is feedback, not a cutscene, and
      [login-attract-mode](login-attract-mode.md) will play a move a second on
      top of it.

Alternative if the overlay gets ugly: key each occupied cell to a piece
component by `piece_id` and let a FLIP helper do it. That's a real `toRows`
refactor (it would emit piece identity instead of class strings) but stacking
and specials fall out naturally. Prototype the overlay first.

## Cases that must not break

- [ ] **Specials** — `game/Board/specials.js` has moves that relocate *other*
      pieces, and `16aed3f` ("hack around recursion bug for pieces that move
      other pieces") means that path is already fragile. `b.last` from a special
      carries `special` / `stacks` rather than a plain `from`/`to`. Animate what
      you can identify and fall back to no animation for the rest — an
      un-animated special is fine, a wrong one is not.
- [ ] **Stacking** (beetle climbing) — `makeStack` re-derives `-stacked-N`
      classes and collapses stacks deeper than 4. Land on top, not underneath.
- [ ] **Undo / redo** — bound to `$mod+KeyZ` / `$mod+KeyY` in
      `client/src/components/Game.vue`, and local-games-only in
      `client/src/store/room.js`, where an **AI game undoes two moves at once**
      (yours and the AI's). Cancel any in-flight tween on board change, don't
      animate backwards through a half-finished one, and don't fire two
      animations for the double undo.
- [ ] **AI turns** — the AI moves on its own schedule while `room.ai_thinking`
      is set. Its move should animate like any other, but a slow tween must not
      gate the next move.
- [ ] **Replay playback** — if [replays](replays.md) lands, its stepper drives
      `doAction` repeatedly; each step must finish or be cancelled before the
      next starts.
- [ ] **Reconnect** — `client/src/store/room.js` replaces the whole room object
      on every websocket message, including full state after a reconnect.
      Arriving several moves ahead must not animate a move from minutes ago:
      gate on "action count went up by exactly one".
- [ ] **`prefers-reduced-motion`** → no tween; keep the arrow and the existing
      last-move highlight.

## Done when

- A local move, an opponent's move over the websocket, an AI move, a beetle
  climb, and a grasshopper jump all animate correctly.
- A move that grows the hive animates only the moving piece — the rest of the
  board does not slide.
- Undo, reconnect, and reduced-motion produce no stray animation.
