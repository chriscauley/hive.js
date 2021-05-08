export default {
  __route: {
    path: '/new/:location/',
    meta: { authRequired: true },
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
