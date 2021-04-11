import { RestStorage } from '@unrest/vue-reactive-storage'

export default ({ _store }) => {
  const room_store = RestStorage('room')
  return room_store
}
