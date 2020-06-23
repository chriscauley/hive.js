import { getGeo } from './Geo'

export default (board, remove_index) => {
  let hive_count = 0
  const hive_map = {}
  const geo = getGeo(board)
  Object.keys(board.stacks).forEach((index) => {
    if (remove_index === index) {
      return
    }
    let hive_no
    geo.touching[index].forEach((touched_index) => {
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
}
