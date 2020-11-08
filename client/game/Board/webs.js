// Webs are passives can block the movement of other pieces

// which pieces can be affected by which webs
const web_targets = {
  fly: ['fly', 'wasp', 'lady_bug', 'cockroach', 'grasshopper', 'cicada', 'lanterfly'],
  crawl: ['ant', 'spider', 'orbweaver', 'scorpion', 'trapdoor_spider', 'cicada'],
  stack: ['beetle', 'mantis', 'fly'],
}

const piece_shows_webs = {}

Object.entries(web_targets).forEach(([web, pieces]) => {
  pieces.forEach((piece) => {
    piece_shows_webs[piece] = piece_shows_webs[piece] || []
    piece_shows_webs[piece].push(web)
  })
})

export default {
  scorpion: (b, i) => {
    // no piece can step on top of a scorpion
    b.layers.stack[i] = true
  },
  orbweaver: (b, i) => {
    // no piece can fly over an orbweaver
    b.layers.fly[i] = true
  },
  trapdoor_spider: (b, i) => {
    // crawling pieces can get trapped in webs, but cannot get re-trapped in a web they start in
    b.geo.touching[i].forEach((i2) => {
      b.layers.crawl[i2] = b.layers.crawl[i2] || []
      b.layers.crawl[i2].push(parseInt(i))
    })
  },

  // filters
  no: {
    fly: (b, i) => !b.layers.fly[i],
    crawl: (b, i) => !b.layers.crawl[i],
    stack: (b, i) => !b.layers.stack[i],
  },

  getVisible(b, i) {
    const type = b.layers.type[i]
    if (type === 'fly') {
      // fly show different webs if starting on ground or stack
      return [b.stacks[i].length === 1 ? 'stack' : 'fly']
    }
    // everyone else obeys piece_shows_webs
    return piece_shows_webs[type] || []
  },

  title: {
    crawl: (type) => `The ${type} get stuck in the trapdoor_spiders web.`,
    'crawl-gray': (type) =>
      `Since the ${type} started in this web, it cannot be stuck on it again.`,
    stack: (type) => `The ${type} cannot step on top of the scorpion.`,
    fly: (type) => `The ${type} cannot move over the orbweaver.`,
  },
}
