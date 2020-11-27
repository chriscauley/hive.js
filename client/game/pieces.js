import help from './help'
import captions from '../tutorial/captions'

const VANILLA = {
  beetle: 2,
  grasshopper: 3,
  ant: 3,
  spider: 2,
}

const piece_counts = {
  ...VANILLA,
  // expansion
  ladybug: 1,
  mosquito: 1,
  pill_bug: 1,

  // boardgamegeeks
  orchid_mantis: 2,
  fly: 3,
  wasp: 3,
  dragonfly: 1,
  cockroach: 1,
  centipede: 1,
  scorpion: 2,

  // hive.js
  trapdoor_spider: 2,
  orbweaver: 2,
  cicada: 3,
  lanternfly: 3,
  earthworm: 1,
  damselfly: 1,
  praying_mantis: 1,
}

// currently not used, colors are stored on svg
const colors = {
  ant: '#0088e6',
  beetle: '#b95cb9',
  centipede: '#b98900',
  cicada: '#4b9400', //  copies grasshopper
  cockroach: '#b95c2b',
  dragonfly: '#e62b00',
  earthworm: '#dc5797',
  fly: '#2a5c00',
  grasshopper: '#4b9400',
  ladybug: '#b90000',
  lanternfly: '#ac3a3a',
  orchid_mantis: '#008b5c',
  praying_mantis: '#008b5c',
  mosquito: '#8a8a8a',
  pillbug: '#005cb9',
  scorpion: '#5c008b',
  spider: '#5c2900',
  trapdoor_spider: '#5c2900', // copies spider for now
  queen: '#e6b900',
  wasp: '#e62b8b',
}

const tags = {
  hive: ['beetle', 'grasshopper', 'ant', 'spider', 'ladybug', 'mosquito', 'pill_bug'],
  crawl: ['trapdoor_spider', 'spider', 'cicada', 'ant'],
  fly: [
    'orbweaver',
    'lanternfly',
    'fly',
    'wasp',
    'cockroach',
    'grasshopper',
    'cicada',
    'ladybug',
    'praying_mantis',
  ],
  stack: ['scorpion', 'beetle', 'orchid_mantis', 'praying_mantis', 'dragonfly', 'damselfly'],
  special: ['mosquito', 'centipede', 'pillbug', 'earthworm'],
  all: ['queen', ...Object.keys(piece_counts)],
}

const getAvailable = (board) => {
  const { unlimited } = board.rules
  const used = {
    1: {},
    2: {},
  }
  board.piece_types.forEach((type, index) => {
    const player_id = board.piece_owners[index]
    used[player_id][type] = (used[player_id][type] || 0) + 1
  })

  const available = []
  const piece_set = { blank: 0, queen: 1, ...board.rules.pieces }

  Object.entries(used).forEach(([player_id, used_pieces]) => {
    Object.entries(piece_set).forEach(([type, total]) => {
      used_pieces[type] = used_pieces[type] || 0
      const count = unlimited ? 1 : total - used_pieces[type]
      if (count > 0) {
        available.push({ type, player_id, count })
      }
    })
  })
  return available
}

export default {
  VANILLA,
  getAvailable,
  piece_counts,
  tags,
  list: Object.keys(piece_counts),
  colors,
}

tags.all.forEach((type) => {
  const toCheck = { captions, help, colors }
  Object.entries(toCheck).forEach(([name, map]) => {
    if (!map[type]) {
      console.log('missing', name, type) // eslint-disable-line
    }
  })
})
