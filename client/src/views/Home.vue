<template>
  <div class="modal -relative">
    <div class="modal__content -auto">
      <div class="view-home">
        <h2>Welcome!</h2>
        <LoadingSkeleton v-if="isLoading" :lines="3" />
        <template v-else-if="user">
          <template v-if="online">
            <router-link to="/new/online/" class="btn -primary block mb-4">
              Start Online Game
            </router-link>
            <div class="font-bold font-xl mb-4">-- OR --</div>
          </template>
          <router-link to="/new/local/" class="btn -primary block">
            Start Local Game
          </router-link>
        </template>
        <template v-else>
          <div @click="makeGuest" class="btn -primary block mb-4">Play as Guest</div>
          <router-link :to="signup" class="btn -primary block mb-4">
            Create An Account
          </router-link>
          <router-link :to="login" class="btn -primary block">Log In</router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchJson, LoadingSkeleton } from '@unrest/ui'

const online = !import.meta.env.VITE_OFFLINE

export default {
  __route: {
    path: '/',
  },
  data() {
    const { query } = this.$route
    const signup = { path: '/auth/sign-up/', query }
    const login = { path: '/auth/login/', query }
    return { signup, login, online }
  },
  components: { LoadingSkeleton },
  computed: {
    isLoading() {
      return this.$store.room.isAuthLoading()
    },
    user() {
      return online ? this.$store.room.getUser() : { id: 'local' }
    },
  },
  methods: {
    makeGuest() {
      fetchJson('/api/auth/guest', { method: 'POST' }).then((user) => {
        this.$store.room.setUser(user)
        if (this.$route.query.next) {
          this.$router.replace(this.$route.query.next)
        }
      })
    },
  },
}
</script>
