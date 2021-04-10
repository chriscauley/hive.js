import { ReactiveLocalStorage } from '@unrest/vue-reactive-storage'

const initial = {
  show_help: true,
  theme: 'classic',
  darkmode: true,
  hex_angle: 'flat',
  zoom: '0', // TODO integer zero isn't working here
}

const schema = {
  type: 'object',
  required: ['theme'],
  properties: {
    darkmode: {
      title: 'Dark Mode',
      type: 'boolean',
    },
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
      default: true,
    },
    hex_angle: {
      type: 'string',
      title: 'Hex Angle',
      enum: ['flat', 'pointy'],
    },
    zoom: {
      type: 'integer',
      title: 'Zoom',
      // enum: ZoomInput.enum,
    },
  },
}

export default () => {
  const config = ReactiveLocalStorage({ LS_KEY: 'config', initial })
  config.schema = schema
  const { state, save } = config
  const onChange = (data) => {
    save(data)
    const { darkmode } = state
    document.body.classList[darkmode ? 'add' : 'remove']('theme-dark_mode')
  }
  config.form = { schema, state, onChange }
  document.body.classList[state.darkmode ? 'add' : 'remove']('theme-dark_mode')
  return config
}
