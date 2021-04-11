<template>
  <div v-if="$auth.ready" :class="css.modal.outer('-relative')">
    <div :class="css.modal.content('-auto')">
      <div class="text-center pb-2">
        <h2>Welcome!</h2>
        <template v-if="$auth.user">
          <router-link to="/new/" :class="css.button('block mb-4')">
            Start Online Game
          </router-link>
          <div class="font-bold font-xl mb-4">-- OR --</div>
          <router-link to="/new/local/" :class="css.button('block')">
            Start Local Game
          </router-link>
        </template>
        <template v-else>
          <div @click="makeGuest" :class="css.button('block mb-4')">
            Play as Guest
          </div>
          <router-link to="/auth/sign-up/" :class="css.button('block mb-4')">
            Create An Account
          </router-link>
          <router-link to="/auth/login/" :class="css.button('block')">
            Log In
          </router-link>
        </template>
      </div>
      <!-- TODO <RoomList /> -->
    </div>
  </div>
</template>

<script>
import css from '@unrest/css'

export default {
  __route: {
    path: '/',
  },
  data() {
    return { css }
  },
  methods: {
    makeGuest() {
      this.$auth.api.post('/api/auth/guest/').then(this.$auth.api.refetch)
    },
  },
}
</script>
