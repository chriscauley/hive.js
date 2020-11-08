const u = (piece) => piece.replace('_', ' ')

const _trapdoor_spider = (p) => `The ${u(p)} must stop moving if ever next to a trapdoor spider.`
const _scorpion = (p) => `The ${u(p)} cannot stack on top of a scorpion.`
const _orbweaver = (p) => `The ${u(p)} cannot pass over an orbweaver.`

const special = (l) => l

const _along = (s, e = '') => `The ${u(s)} can move one space along the hive${e}.`
const _spider = (s, e = '') => `The ${u(s)} must crawl exactly 3 spaces along the hive${e}.`
const queen = [_along('queen')]

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
  'The cicada over the hive in a straight as many times as you want',
  _orbweaver('grasshopper'),
  _trapdoor_spider('cicada'),
]

const spiderLike = (piece, extra = []) => [
  `The ${u(piece)} must crawl exactly 3 spaces along the hive.`,
  `The ${u(piece)} can jump over exactly 1 tile except for an orbweaver.`,
  _trapdoor_spider(piece),
  ...extra,
]

const spider = spiderLike('spider')
const scorpion = spiderLike('scorpion', ['No piece can stack on top of a scorpion'])
const orbweaver = spiderLike('orbweaver', ['Pieces cannot fly over an orbweaver.'])
const trapdoor_spider = spiderLike('trapdoor_spider', [
  'The trapdoor spider will stop any piece that tries to crawl past it.',
  'The trapdoor spider cannot not stop a piece which started next to it.',
])

const ant = [
  'The ant can move an unlimited amount of spaces around the hive.',
  _trapdoor_spider('ant'),
]

const lady_bug = [
  'The lady bug must take two steps on the hive and then step off the hive.',
  _trapdoor_spider('lady_bug'),
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

const mantis = [
  _along('mantis', ' if on the ground level'),
  'If on the ground level, the mantis can grab an ajacent piece and move it underneath the mantis.',
  'Once on the hive the mantis can move one space on the hive or step off the hive.',
]

const fly = [
  'If on the ground, the fly can step on the hive.',
  'Once on the hive, the fly take any number of steps on the hive, and then step off the hive.',
]

const lanternfly = [
  _along('lanternfly'),
  'If surounded on 3 or more sides, the lanternfly can move over the hive to any unoccupied tile on the board.',
]

const wasp = [
  'The wasp takes unlimited steps on top of the hive and then steps off to any space not touching friendly tiles (opposite of placement).',
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

const earthworm = [
  _along('earthworm'),
  'The centipede can burrow under the hive and swap with the bottom piece of any stack 3 tiles away as long as removing both pieces would not break the one-hive rule.',
]

const blank = ['An inert tile that cannot move']

export default {
  queen,
  beetle,
  grasshopper,
  cicada,
  spider,
  ant,
  lady_bug,
  mosquito,
  pill_bug,
  mantis,
  fly,
  lanternfly,
  wasp,
  cockroach,
  dragonfly,
  centipede,
  earthworm,
  blank,

  scorpion,
  trapdoor_spider,
  orbweaver,
}
