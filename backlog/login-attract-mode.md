# Autoplaying game behind the login screen

An attract mode: the logged-out screen (`client/src/views/Home.vue`) renders a
board behind the login panel, replaying a random saved game move by move,
dimmed and non-interactive. Fresh visitors see the game being played instead of
an empty modal.

**Depends on:** [replays](replays.md) for the pool of games to draw from, and
sits on top of whatever [email-login](email-login.md) leaves the home screen
looking like. It also wants [animate-piece-movement](animate-piece-movement.md)
to look good — a background board that teleports pieces reads as broken.

## How

- [ ] Ship a **bundled** list of a handful of good games — an array of action
      lists imported at build time, not fetched. The logged-out screen must not
      wait on an API call or fail with an empty background when the request 404s
      or the user is offline. Curate 5–10 short, visually busy games from saved
      replays; store them in `client/src/` (e.g. `attract/games.js`) as plain
      `{rules, actions}` objects.
- [ ] Pick one at random per page load, build a board with `B.new(...)`, and
      step it with `B.doAction` on an interval (~1–1.5s per move feels right;
      tune against the move animation duration).
- [ ] When the game ends, pause briefly, then start another one at random.
- [ ] Render with `components/Board.vue` behind the login card:
      `position: fixed`, full-bleed, `pointer-events: none`, low opacity, and a
      z-index from `client/src/css/z-index.css` (use the existing scale — don't
      hand-write a magic number). No click handlers wired. `Board.vue` also
      takes an `arrows` prop; feeding it `board.last.path` gives the background
      the same move arrows the real game draws.
- [ ] Sizing: boards are `W: 50, H: 50` (`game/Board/index.js`), but
      `sliceBoard` in `game/Board/toRows.js` already crops the render to the
      occupied bounding box, so you get a tight grid for free — it just starts
      tiny and grows. Scale it with the existing `zoom-*` classes
      (`client/src/css/hex.css`) so an early-game board with three pieces still
      fills the screen. `components/MiniBoard.vue` is the closest existing
      precedent — read it first.

## Constraints

- [ ] `prefers-reduced-motion` → render a static final position, no stepping.
- [ ] Mobile: the login card is the whole screen on a phone. Either skip the
      background below a breakpoint or crop hard — there is a run of deliberate
      mobile styling work in the history (`282bcdf`, `99ae7f0`, `28f3f58`,
      `2d58438`); don't undo it.
- [ ] Stop the interval in `unmounted`. A timer left running after navigating
      into a game is a leak that will show up as a mystery re-render.
- [ ] Keep it off the critical path: the login form must be interactive before
      the background starts, and a thrown error in the attract loop must not
      take the page down (wrap the step in a try/catch that just stops the
      loop).

## Done when

- Logged out, the background shows a game playing itself; reloading shows a
  different game.
- Clicking anywhere hits the login UI, never the board.
- With reduced-motion on, nothing moves.
- Navigating away and back doesn't accumulate timers (check with the devtools
  performance panel or a counter in the step function).
