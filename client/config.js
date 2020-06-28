import ConfigHook from '@unrest/react-config-hook'

const schema = {
  type: 'object',
  required: ['theme'],
  properties: {
    theme: {
      type: 'string',
      enum: ['classic', 'carbon'],
    },
  },
}

const initial = {
  theme: 'classic',
}

const actions = {}

export default ConfigHook('game-config', { schema, initial, actions })
