# AI Improvement Plan

Current AI uses minimax with alpha-beta pruning, iterative deepening, and a
heuristic evaluation function. It works but plays poorly -- the main bottleneck
is shallow search depth (~3-4 ply) due to Hive's high branching factor (~60).

## Current evaluation weights

| Heuristic            | Weight | Notes                                        |
|----------------------|--------|----------------------------------------------|
| Queen surround       | 200    | Per neighbor, flat scaling                   |
| Queen mobility       | 30     | Per legal queen move                         |
| Piece mobility       | 5      | Per movable piece (binary: can it move?)     |
| Pieces in play       | 10     | Raw piece count differential                 |
| Stack pin            | 50     | Your piece on top of opponent's. 3x for queen|
| Structural pin       | 15     | Opponent piece trapped by cantmove/onehive   |

## Priority 1: Search efficiency (biggest impact)

### Better move ordering

The current ordering is crude: queen-adjacent > specials > moves > placements.
If we score each move with a quick evaluation delta before the full search, the
first move alpha-beta tries is likely the best, and it prunes almost everything
else. Good ordering can effectively double search depth for the same time.

### Move pruning

Many positions have 60+ legal moves but only 10-15 are plausible. Prune at
non-root nodes:
- Placements far from either queen
- Moves that walk away from the action (increasing distance to opponent queen)
- Duplicate-effect moves (two ant destinations that reach the same neighbor set)

This shrinks effective branching factor from ~60 to ~15-20.

### Killer move heuristic

Remember which moves caused beta cutoffs at each depth. Try them first in
sibling nodes. Very cheap to implement, significant pruning gains.

## Priority 2: Evaluation improvements

### Exponential queen surround

Going from 4 to 5 neighbors is far more dangerous than 1 to 2. Replace flat
`surround * 200` with something like `2^surround * 50`. A queen at 5/6 scores
1600 instead of the current 1000.

### Count actual legal moves, not movable pieces

An ant with 30 destinations is worth more than a beetle with 2. Sum
`getMoves().length` per piece instead of just checking if it's nonzero.

### Queen danger zone

Penalize opponent pieces within 2 hexes of your queen, not just adjacent.
Pieces one hop away are one move from contributing to a surround.

### Drop or rethink pieces-in-play

The current +10 per piece encourages spamming placements. Replace with an
early-game placement incentive that decays after turn ~8.

## Priority 3: Alternative approaches

### Opening book

The first 4-6 moves of Hive are well-studied. Hardcoding strong openings
eliminates search cost entirely for the early game. Only practical for vanilla
Hive though -- with 40+ custom piece types and configurable piece sets, the
opening theory doesn't transfer.

### ~~MCTS (Monte Carlo Tree Search)~~ — won't implement

Research (Mzinga, academic papers) suggests minimax outperforms MCTS for Hive
because the branching factor is too high for random playouts to converge.

### Performance: avoid full B.update() in search

`B.doAction` and `B.undo` each call `B.update()`, which recomputes all derived
state (reverse lookups, onehive, cantmove, empty, webs, winner check). At depth
4 with branching ~60, that's millions of update calls. An incremental update or
a lightweight search-only board representation would dramatically increase
depth, but requires significant engine work.

## References

- Mzinga (C#, minimax): https://github.com/jonthysell/Mzinga
- HiveMind (Java, MCTS): https://github.com/cmelchior/hivemind
- Hive game complexity: branching factor ~60, between chess (~35) and Go (~250)
