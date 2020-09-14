import { last } from 'lodash'
export default (b, index) => {
  const piece_id = last(b.stacks[index])
  return b.piece_types[piece_id] !== 'scorpion'
}