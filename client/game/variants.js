import React from 'react'

import { unslugify } from '../utils'

const _help = (s) => <i className="fa fa-question-circle-o" data-tip={s} />

const variants = {
  no_rules: {
    requires: [],
    help: 'UI will still display legal moves, but any piece can be moved to any space.',
  },
  unlimited: {
    requires: [],
    help: 'You can place as many pieces as you want.',
  },
}

const list = []

Object.entries(variants).forEach(([slug, variant]) => {
  variant.slug = slug
  variant.name = unslugify(slug)
  list.push(variant)
})

export default {
  ...variants,
  list,
}
