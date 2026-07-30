import { useAuth } from '@unrest/ui'

export default {
  __route: {
    path: '/new/:location/',
    // Same split as OnlineRoom: /new/local/ is offline play and must stay open,
    // /new/online/ POSTs to /api/room/ and needs an account.
    beforeEnter: (to) => {
      if (to.params.location === 'online' && !useAuth().isAuthenticated) {
        return { path: '/', query: { next: to.fullPath } }
      }
    },
  },
  render: () => <div />,
  mounted() {
    if (this.$route.params.location !== 'online') {
      this.$router.replace('/play/local/')
    } else {
      this.$store.room.save({}).then(({ id }) => this.$router.replace(`/play/${id}/`))
    }
  },
}
