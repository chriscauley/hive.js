<template>
  <div :class="css.modal.outer()" style="position: relative; z-index: 1">
    <div :class="css.modal.content()">
      <h2>{{ mode.title }}</h2>
      <schema-form :form_name="mode.form_name" :success="success" />
      <!-- <social-links :verb="verb" /> -->
    </div>
  </div>
</template>

<script>
import css from '@unrest/css'

const modes = [
  {
    slug: 'login',
    form_name: 'schema/LoginForm',
    title: 'Login',
  },
  {
    slug: 'sign-up',
    form_name: 'schema/SignUpForm',
    title: 'Sign Up',
  },
  {
    slug: 'reset-password',
    form_name: 'schema/ResetPassword',
    title: 'Reset Password',
  },
]

export default {
  data() {
    return { css }
  },
  computed: {
    slug() {
      return this.$route.path.match(/(login|sign-up|forgot-password)/)[1]
    },
    mode() {
      return modes.find((m) => m.slug === this.slug)
    },
  },
  methods: {
    success() {
      const { next = '/' } = this.$route.query
      // reload route to cause router to redirect to next or /
      this.$store.auth.refetch().then(() => this.$router.replace(next))
    },
  },
}
</script>
