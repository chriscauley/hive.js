const u = (piece) => piece.replace('_', ' ')

const _trapdoor_spider = (p) =>
  `The ${u(p)} must stop moving if it moves next to an enemy trapdoor spider.`
const _scorpion = (p) => `The ${u(p)} cannot stack on top of an enemy scorpion.`
const _orbweaver = (p) => `The ${u(p)} cannot pass over an orbweaver.`

const special = (l) => l

const _along = (s, e = '') => `The ${u(s)} can move one space along the hive${e}.`
const _spider = (s, e = '') => `The ${u(s)} must crawl exactly 3 spaces along the hive${e}.`
const queen = [_along('queen')]

const emerald_wasp = [
  'If starting on the hive, the emerald wasp can take two steps on top of the hive',
  'If starting on the ground, the emrald wasp can step off the hive',
  _orbweaver('emerald_wasp'),
  _scorpion('emerald_wasp'),
]

const beetle = [
  _along('beetle', ' or step on the hive'),
  'If starting on the hive, it can move in any direction on or off the hive.',
  _scorpion('beetle'),
]

const grasshopper = [
  'Grassshopers fly over the hive in a straight line.',
  _orbweaver('grasshopper'),
]

const cicada = [
  'The cicada jumps over the hive in a straight line as many times as you want.',
  _orbweaver('cicada'),
  _trapdoor_spider('cicada'),
]

const spiderLike = (piece, extra = []) => [
  `The ${u(piece)} must crawl exactly 3 spaces along the hive.`,
  `The ${u(piece)} can jump over exactly 1 tile except for an orbweaver.`,
  // _trapdoor_spider(piece),
  ...extra,
]

const spider = spiderLike('spider')
const scorpion = spiderLike('scorpion', ['No piece can stack on top of an enemy scorpion.'])
const orbweaver = spiderLike('orbweaver', ['Pieces cannot fly over an orbweaver.'])
const trapdoor_spider = spiderLike('trapdoor_spider', [
  'The trapdoor spider will stop any piece that tries to crawl past it.',
  'The trapdoor spider cannot not stop a piece which started next to it.',
])

const ant = [
  'The ant can move an unlimited amount of spaces around the hive.',
  _trapdoor_spider('ant'),
]

const ladybug = [
  'The ladybug must take two steps on the hive and then step off the hive.',
  _trapdoor_spider('ladybug'),
]

const mosquito = [
  'The mosquito copies the movement of any (top most) adjacent bug at the start of its turn.',
  'If the mosquito starts on top of the hive, it moves like a beetle for that turn.',
]

const pill_bug = [
  _along('pill_bug'),
  special(
    'The pill bug can move an adjacent piece or stack to an empty adjacent space as long as the one-hive rule is not broken by removing the piece.',
  ),
]

const orchid_mantis = [
  _along('orchid mantis', ' if on the ground level'),
  'If on the ground level, the orchid mantis can grab an ajacent piece and move it underneath the orchid mantis.',
  'Once on the hive the orchid mantis can move one space on the hive or step off the hive.',
  'The orchid mantis cannot stack on or grab an enemy scorpion.',
]

const kung_fu_mantis = [
  'If on the ground level, the kung fu mantis can grab a piece two spaces away and move it underneath the kung fu mantis.',
  'Once on the hive the kung fu mantis can move one space on the hive or step off the hive.',
  'The kung fu mantis cannot stack on or grab an enemy scorpion.',
]

const praying_mantis = [
  'If starting on the ground, the praying mantis leaps in any direction and lands on the furthest piece.',
  'It cannot leap over any breaks in the hive',
  'If the mantis encounters any stacks while leaping, it will carry the top most piece with it.',
  'If starting on top of a stack, the mantis can only step off the stack onto the ground.',
  _orbweaver('praying_mantis'),
  _scorpion('praying_mantis'),
]

const fly = [
  'If on the ground, the fly can step on the hive.',
  'Once on the hive, the fly take any number of steps on the hive, and then step off the hive.',
  _orbweaver('fly'),
  _scorpion('fly'),
]

const lanternfly = [
  _along('lanternfly'),
  'If surounded on 3 or more sides, the lanternfly can move over the hive to any unoccupied tile on the board.',
]

const wasp = [
  'The wasp takes unlimited steps on top of the hive and then steps off to any space not touching friendly tiles (opposite of placement).',
  _orbweaver('wasp'),
]

const cockroach = [
  'The cockroach must step on the hive, move any number of spaces on the hive, then step on the ground.',
  'However, it cannot step over enemy tiles or friendly orbweavers.',
  _orbweaver('cockroach'),
]

const _dragonfly = (p) => [
  `The ${p} moves along diagonals (one step forward then one step left or right).`,
  special(
    `If the ${p} moves to an empty space, it will carry the piece under it to the new space (as long as it does not break the one-hive rule).`,
  ),
]

const damselfly = [
  _along('damselfly', ' if on the ground level'),
  ..._dragonfly('damselfly'),
  '(this piece is identical to the dragonfly, but it can move on the ground)',
]

const centipede = [
  _along('centipede'),
  special(
    'The centipede can swap spaces with an adjacent piece as long as removing both pieces would not break the one-hive rule.',
  ),
]

const earthworm = [
  _along('earthworm'),
  'The earthworm can swap with the bottom piece of any stack 3 tiles away.',
  'Removing the bottom piece of a 2+ piece stack will not break the one hive rule.',
]

const blank = ['An inert tile that cannot move']

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
  wasp,
  cockroach,
  dragonfly: _dragonfly('dragonfly'),
  damselfly,
  centipede,
  earthworm,
  blank,
  emerald_wasp,
  scorpion,
  trapdoor_spider,
  orbweaver,
}
