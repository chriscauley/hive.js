import ConfigHook from '@unrest/react-config-hook'
import ZoomInput from './components/ZoomInput'

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
    zoom: {
      type: 'string',
      title: 'Zoom',
      enum: ZoomInput.enum,
    },
  },
}

const initial = {
  formData: {
    hex_angle: 'flat',
    theme: 'classic',
    debug: false,
    show_help: true,
    zoom: 'medium',
  },
}

const actions = {
  toggleHelp: (store) => {
    const { formData } = store.state
    formData.show_help = !formData.show_help
    store.actions.save({ formData })
  },
}

const uiSchema = {
  zoom: { 'ui:widget': ZoomInput }
}

export default ConfigHook('game-config', { schema, initial, actions, uiSchema })
