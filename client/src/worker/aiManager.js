let worker = null
let request_id = 0

const requestAIMove = (board_json, difficulty) =>
  new Promise((resolve) => {
    if (!worker) {
      worker = new Worker(new URL('./ai.worker.js', import.meta.url), { type: 'module' })
    }
    const id = ++request_id
    const handler = (e) => {
      if (e.data.request_id === id) {
        worker.removeEventListener('message', handler)
        resolve(e.data.action)
      }
    }
    worker.addEventListener('message', handler)
    worker.postMessage({ board_json, difficulty, request_id: id })
  })

const cancelAIMove = () => {
  if (worker) {
    worker.terminate()
    worker = null
  }
}

export { requestAIMove, cancelAIMove }
