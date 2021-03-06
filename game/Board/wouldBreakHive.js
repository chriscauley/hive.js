export default (board, indexes, max_stack = 1) => {
  if (typeof indexes === 'number') {
    indexes = [indexes]
  }

  // if a stack is 2+ pieces high, moving top piece will not break hive
  // for dragonfly's move, max_stack = 2 because the lower piece isn't moved if it breaks hive
  indexes = indexes.filter((i) => board.stacks[i] && board.stacks[i].length <= max_stack)

  let hive_count = 0
  const hive_map = {}
  Object.keys(board.stacks).forEach((index) => {
    index = parseInt(index)
    if (indexes.includes(index)) {
      return
    }
    let hive_no
    board.geo.touching[index].forEach((touched_index) => {
      if (indexes.includes(touched_index)) {
        return
      }
      const touched_no = hive_map[touched_index]
      if (touched_no && touched_no !== hive_no) {
        if (hive_no) {
          // set everything in hive equal to this hive_no
          Object.entries(hive_map).forEach(([index, _no]) => {
            if (_no === touched_no) {
              hive_map[index] = hive_no
            }
          })
        } else {
          hive_no = touched_no
        }
      }
    })
    if (!hive_no) {
      hive_count++
      hive_no = hive_count
    }
    hive_map[index] = hive_no
  })
  return new Set(Object.values(hive_map)).size > 1
}
