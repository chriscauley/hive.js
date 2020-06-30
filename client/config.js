import ConfigHook from '@unrest/react-config-hook'

const schema = {
  type: 'object',
  required: ['theme'],
  properties: {
    theme: {
      title: 'Theme',
      type: 'string',
      enum: ['classic', 'carbon'],
    },
    debug: {
      title: 'Show space numbers',
      type: 'boolean',
    },
    show_help: {
      type: 'boolean',
      title: 'Show Help',
    },
    hex_angle: {
      type: 'string',
      title: 'Hex Angle',
      enum: ['flat', 'pointy'],
    },
  },
}

const initial = {
  hex_angle: 'flat',
  theme: 'classic',
  debug: false,
  show_help: true,
}

const actions = {
  toggleHelp: (store) => {
    const { formData } = store.state
    formData.show_help = !formData.show_help
    store.actions.save({ formData })
  },
}

export default ConfigHook('game-config', { schema, initial, actions })
