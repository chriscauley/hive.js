import config from './config'

export default {
  props: {
    items: Array,
  },
  render({ items = [] }) {
    const { AUTH_START } = config
    const user = this.$store.auth.get()
    if (user) {
      const click = () => this.$auth.logout().then(() => this.$router.push(AUTH_START))
      items = [...items, { text: 'Logout', click }]
      return <ur-dropdown items={items} title={user.username} />
    }
    return (
      <div>
        <router-link to="/auth/login/" class="btn -link">
          Log In
        </router-link>
        <router-link to="/auth/sign-up/" class="btn -link">
          Sign Up
        </router-link>
      </div>
    )
  },
}
