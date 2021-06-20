export default {
  mounted(el) {
    el.scrollTo(0, el.scrollHeight)
    el.dataset.urAutoscrollEnabled = true

    // need a 0px target element at the bottom of the node
    const div = document.createElement('div')
    div.dataset.urAutoscrollTarget = ''
    el.appendChild(div)

    // disable/enable auto scroll when user scrolls away from or to the end of element
    el.addEventListener('scroll', () => {
      const { scrollHeight, scrollTop, clientHeight } = el
      if (scrollHeight === scrollTop + clientHeight) {
        el.dataset.urAutoscrollEnabled = true
      } else {
        delete el.dataset.urAutoscrollEnabled
      }
    })
  },
  updated(el) {
    if (el.dataset.urAutoscrollEnabled) {
      el.lastElementChild?.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      })
    }
  },
}
