import React from 'react'

import { unslugify } from '../tutorial/Component'

const _help = (s) => <i className="fa fa-question-circle-o" data-tip={s} />

const variants = {
  spiderwebs: {
    requires: ['spider'],
    help: 'Ants stop moving if they collide with an enemy spider.',
  },
  super_grasshopper: {
    requires: ['grasshopper'],
    help: 'The grasshopper can make unlimited jumps per turn.',
  },
  venom_centipede: {
    requires: ['centipede'],
    help: 'The centipede swaps with a piece 3 on-hive tiles away (Hive Venom variant).',
  },
  no_rules: {
    requires: [],
    help: 'UI will still display legal moves, but any piece can be moved to any space.',
  },
  unlimited: {
    requires: [],
    help: 'You can place as many pieces as you want.',
  },
  // queen_lock: {
  //   requires: [],
  //   help:  'Pieces touching the enemy queen cannot move.',
  // },
}

const schema = {
  type: 'object',
  title: 'variants',
  properties: {},
}
const uiSchema = {}
const list = []

const getBoardClass = ({ rules }) => {
  return list
    .filter((v) => rules[v.slug])
    .map((v) => `rule-${v.slug}`)
    .join(' ')
}

Object.entries(variants).forEach(([slug, variant]) => {
  variant.slug = slug
  variant.name = unslugify(slug)
  list.push(variant)
  uiSchema[slug] = {
    classNames: 'has-help',
    'ui:help': _help(variant.help),
  }
  schema.properties[slug] = {
    title: variant.name,
    type: 'boolean',
  }
})

export default {
  ...variants,
  list,
  schema,
  uiSchema,
  getBoardClass,
}
