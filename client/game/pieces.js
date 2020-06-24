const piece_sets = {
  standard: {
    queen: 1,
    beetle: 2,
    grasshopper: 3,
    ant: 3,
    spider: 2,
  },
}

const custom = [
  'assasin_bug',
  'dragonfly',
  'earthworm',
  'earwig',
  'firefly',
  'mantis',
  'shield_bug',
  'tick',
  'wasp',
]

const original = [
  'ant',
  'beetle',
  'centipede',
  'grasshopper',
  'lady_bug',
  'mosquito',
  'pill_bug',
  'queen',
  'spider',
]

const all = original.concat(custom)

const getAvailable = (board) => {
  const used = {
    1: {},
    2: {},
  }
  board.piece_types.forEach((type, index) => {
    const player_id = board.piece_owners[index]
    used[player_id][type] = (used[player_id][type] || 0) + 1
  })
  const available = []
  const piece_set = piece_sets[board.rules.piece_set]
  Object.entries(used).forEach(([player_id, used_pieces]) => {
    Object.entries(piece_set).forEach(([type, total]) => {
      used_pieces[type] = used_pieces[type] || 0
      if (total - used_pieces[type] > 0) {
        available.push({ type, player_id, count: total - used_pieces[type] })
      }
    })
  })
  return available
}

export default {
  getAvailable,
  original,
  custom,
  all,
}
