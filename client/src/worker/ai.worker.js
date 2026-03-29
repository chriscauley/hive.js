import B from 'hive.js/Board'
import AI from 'hive.js/AI'

self.onmessage = (e) => {
  const { board_json, difficulty, request_id } = e.data
  const board = B.fromJson(board_json)
  const result = AI.findBestMove(board, difficulty)
  self.postMessage({ action: result.action, analysis: result.analysis, request_id })
}
