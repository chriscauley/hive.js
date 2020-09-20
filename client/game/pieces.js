const piece_sets = {
  standard: {
    pieces: {
      beetle: 2,
      grasshopper: 3,
      ant: 3,
      spider: 2,
    },
  },
  custom: {
    pieces: {
      mantis: 2,
      fly: 3,
      wasp: 3,
      scorpion: 2,
    },
  },
  expanded_standard: {
    pieces: {
      lady_bug: 1,
      mosquito: 1,
      pill_bug: 1,
    },
  },
  expanded_custom: {
    pieces: {
      dragonfly: 1,
      cockroach: 1,
      centipede: 1,
    },
  },
}

const _defaultMode = (name) => () => piece_sets[name].pieces

const modes = {
  ants: (_board, used) => {
    const ants = Math.max(used[1].ant || 0, Math.max(used[2].ant || 0))
    return { ant: ants + 3 }
  },
}
Object.keys(piece_sets).forEach((name) => (modes[name] = _defaultMode(name)))

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
  const piece_set = { blank: 0, queen: 1 }
  board.rules.piece_sets.forEach((name) => {
    Object.assign(piece_set, modes[name](board, used))
  })
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

const getNames = () => {
  const names = ['queen']
  Object.values(piece_sets).forEach((piece_set) => {
    Object.keys(piece_set.pieces).forEach((name) => names.push(name))
  })
  return names
}

export default {
  getNames,
  getAvailable,
  piece_sets,
  modes,
}
