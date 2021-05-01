<template>
  <div v-if="providers">
    <div className="my-4 text-center">-- Or Connect With --</div>
    <div className="flex justify-center mb-4">
      <a
        v-for="provider in providers"
        :href="provider.href"
        :class="provider.class"
        :key="provider.slug"
      >
        {{ provider.title }}
      </a>
    </div>
  </div>
</template>

<script>
import config from './config'
import querystring from 'querystring'

export default {
  computed: {
    providers() {
      return config.oauth_providers?.map(this.processProvider)
    },
  },
  methods: {
    processProvider(provider) {
      const qs = querystring.stringify({ next: this.$route.next })
      if (typeof provider === 'string') {
        provider = { slug: provider }
      }
      const { slug } = provider
      return {
        title: slug[0].toUpperCase() + slug.slice(1),
        href: `/login/${slug}/?${qs}`,
        class: `btn btn-${slug} mx-4`,
        ...provider,
      }
    },
  },
}
</script>
