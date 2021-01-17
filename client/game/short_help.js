const _along = 'Move one square along the hive.'
const _stack = 'Cannot step on scorpion.'
const _fly = 'Cannot move over orbweaver.'
const _crawl = 'Will stop moving if it touches the trapdoor spider.'
const _spiderlike = (e) => ['Move three steps along hive.', 'Jump over one tile.', ...e]
const _beetle = 'Moves like a beetle if it starts a turn on the hive.'

const queen = [_along, 'If surrounded, you lose.', 'You can only have one queen.']
const beetle = [_along, 'Can move onto hive.', _stack]
const grasshopper = ['Hops over hive.', _fly]
const cicada = ['Can make unlimited jumps over the hive.', _fly, _crawl]
const spider = _spiderlike([])
const ant = ['Can move unlimited spaces along the hive.', _crawl]
const ladybug = ['Takes two steps on hive then one step off.', _fly]
const mosquito = [
  'Copies the movement and restrictions of any piece it is touching.',
  _beetle,
  'Cannot copy special abilities.',
]
const pill_bug = [_along, 'Can move any piece it is touching to another empty square.']
const orchid_mantis = [_along, 'Can pull a piece under itself.', _beetle, _stack]
const kung_fu_mantis = ['Can pull a piece two spaces away under itself.', _beetle, _stack]

const praying_mantis = [
  'Can jump over the hive and land on the furthest piece in any direction',
  'Will carry a stacked piece with it when it jumps.',
  'If on the hive, can only step on the ground.',
  _fly,
  _stack,
]
const fly = [
  'If on ground, can step on the hive.',
  'If on the hive, can fly to any open square.',
  _fly,
  _stack,
]
const lanternfly = [_along, 'If touching pieces on 3 sides, can fly anywhere.', _fly]
const lanternfly_nymph = [_along, 'Can fly to any space surrounded on 3 or more sides.']
const wasp = ['Can fly over hive and land in any space not touching a friendly piece.', _fly]
const cockroach = ['Can move over friendly pieces to any empty space.', _fly]
const dragonfly = [
  'Can move one space forward than one space left or right.',
  'If it moves from a stack to an empty space, it will carry one piece with it.',
]
const damselfly = ['If on the ground, can move along the hive.', ...dragonfly]
const dragonfly_nymph = [
  'If on the ground can pull any piece under it from one diagonal away (one space forward and one to the right or left).',
  'If on the hive it moves one diagonal in any direction.',
  'If it moves to an empty space it will carry the piece under along with it.',
]
const centipede = [_along, 'Can swap with an adjacent piece.']
const earthworm = [_along, 'Can swap with the bottom piece of any stack 3  (on hive) moves away.']
const orbweaver = _spiderlike([
  'No piece can move over.',
  'Defends against grasshopper, cicada, ladybug, fly, wasp, and cockroach.',
])
const trapdoor_spider = _spiderlike([
  'Traps any piece that moves next to it.',
  'Defends against ant and cicada.',
])
const scorpion = _spiderlike([
  'No piece can stack on top of the scorpion.',
  'Defends against beetle, fly, dragonfly, and orchid mantis, kung fu mantis, and praying mantis.',
])

const emerald_wasp = [
  'If on the ground, can take two steps onto the hive.',
  'If on the hive, can only step on the ground.',
  _fly,
  _stack,
]

export default {
  queen,
  beetle,
  grasshopper,
  cicada,
  spider,
  ant,
  ladybug,
  mosquito,
  pill_bug,
  orchid_mantis,
  kung_fu_mantis,
  praying_mantis,
  fly,
  lanternfly,
  lanternfly_nymph,
  wasp,
  cockroach,
  dragonfly,
  dragonfly_nymph,
  damselfly,
  centipede,
  earthworm,
  orbweaver,
  trapdoor_spider,
  scorpion,
  emerald_wasp,
}
