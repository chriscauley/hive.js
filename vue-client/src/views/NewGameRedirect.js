export default {
  __route: {
    path: '/new/:location/',
    meta: { authRequired: true },
  },
  render: () => '',
  mounted() {
    if (this.$route.params.location !== 'online') {
      throw 'Not Implemented'
    }
    this.$store.room.save({}).then(({ id }) => this.$router.replace(`/play/${id}/`))
  },
}
