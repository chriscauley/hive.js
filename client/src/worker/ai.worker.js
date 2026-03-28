import B from 'hive.js/Board'
import AI from 'hive.js/AI'

self.onmessage = (e) => {
  const { board_json, difficulty, request_id } = e.data
  const board = B.fromJson(board_json)
  const action = AI.findBestMove(board, difficulty)
  self.postMessage({ action, request_id })
}
