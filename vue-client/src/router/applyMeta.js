// adapted from https://www.digitalocean.com/community/tutorials/vuejs-vue-router-modify-head

const q = 'data-vue-router-controlled'

export default (to, from, next) => {
  if (process.env.NODE_ENV === 'test') {
    // mocked document is missing some features and this is not mission critical
    next()
    return
  }

  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta?.title)
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  }

  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta?.metaTags)

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll(`[${q}]`)).forEach(el => el.parentNode.removeChild(el))

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta?.meta.tags.forEach(tagDef => {
    const tag = document.createElement('meta')

    Object.keys(tagDef).forEach(key => tag.setAttribute(key, tagDef[key]))

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute(q, '')

    document.head.appendChild(tag)
  })

  next()
}
