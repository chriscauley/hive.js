import ConfigHook from '@unrest/react-config-hook'

const schema = {
  type: 'object',
  required: ['theme'],
  properties: {
    theme: {
      type: 'string',
      enum: ['classic', 'carbon'],
    },
    debug: {
      type: 'boolean',
    },
  },
}

const initial = {
  theme: 'classic',
  debug: false,
}

const actions = {}

export default ConfigHook('game-config', { schema, initial, actions })
