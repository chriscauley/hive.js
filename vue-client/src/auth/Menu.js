export default {
  props: {
    items: Array,
  },
  render({ items = [] }) {
    const user = this.$store.auth.get()
    if (user) {
      items = [...items, { children: 'Logout', onClick: this.$store.auth.logout }]
      return <ur-dropdown items={items} title={user.username} />
    }
    return (
      <div>
        <router-link to="/auth/login/" class="btn -link">
          Log In
        </router-link>
        <router-link to="/auth/signup/" class="btn -link">
          Sign Up
        </router-link>
      </div>
    )
  },
}
