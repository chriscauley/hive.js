import React from 'react'

const ifRule = (rule, text) => (board) => {
  const className = board.rules[rule] ? '' : 'line-through'
  return (
    <>
      <span className={className}>{text}</span>
      {' (this rule only applies if '}
      <b>{rule}</b>
      {' is enabled)'}
    </>
  )
}

const spiderwebs = ifRule(
  'spiderwebs',
  'If an ant touches a spider while moving around the board It must stop. This does not apply to spiders that ants are touching at the start of the turn.',
)

const special = (l) => l

const _along = (s) => `The ${s} can move one space along the hive.`
const _spider = (s) => `The ${s} must move exactly 3 spaces along the hive.`
const queen = [_along('queen')]

const beetle = [
  _along('beetle'),
  'The beetle can step on the hive.',
  'If starting on the hive, it can move in any direction on or off the hive.',
]

const grasshopper = [
  'The grasshopper cannot move around the hive.',
  'It jumps over the hive in a straight line to the next unoccupied space.',
]

const spider = [
  _spider('spider'),
  'The spider can jump over a single occupied space into an empty one.',
  spiderwebs,
]

const ant = [
  'The ant can move an unlimited amount of spaces around the hive.',
  spiderwebs,
]

const lady_bug = [
  'The lady bug must take two steps on the hive and then step off the hive.',
]

const mosquito = [
  'The mosquito copies the movement of any (top most) adjacent bug at the start of its turn.',
  'If the mosquito starts on top of the hive, it moves like a beetle for that turn.',
]

const pill_bug = [
  _along('pill bug'),
  special(
    'The pill bug can move an adjacent piece to an empty adjacent space as long as the one-hive rule is not broken by removing the piece.',
  ),
]

const mantis = [
  'If on the ground level, the mantis can grab an ajacent piece and move it underneath the mantis.',
  'Once on the hive the mantis can move one space on the hive or step off the hive.',
]

const fly = [
  _along('fly'),
  'If there fly has no available moves, it can move to any empty space,',
]

const scorpion = [
  _spider('scorpion'),
  'No piece can move on top of the scorpion, even temporarily.',
]

const wasp = [
  'The was can move to any unoccupied space provided the space only opponent pieces (the opposite of placement rules).',
]

const cockroach = [
  'The cockroach must step on the hive, move any number of spaces on the hive, then step on the ground.',
  'However, it cannot step onto enemy tiles.',
]

const dragonfly = [
  'The dragon fly must take one step in any direction, and then take another step in any other direction (without backtracking).',
  'This can also be thought of like taking a step in the "corner" direction of a hex.',
  special(
    'If the dragon fly starts on top of a stack and would end on the ground, it moves the tile underneath it on the starting stack to the end (as long as it does not break the one-hive rule).',
  ),
]

const centipede = [
  _along('centipede'),
  special(
    'The centipede can swap spaces with an adjacent piece as long as removing both pieces would not break the one-hive rule.',
  ),
]

export default {
  queen,
  beetle,
  grasshopper,
  spider,
  ant,
  lady_bug,
  mosquito,
  pill_bug,
  mantis,
  fly,
  scorpion,
  wasp,
  cockroach,
  dragonfly,
  centipede,
}
